require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const socket = require("socket.io");
const { getCanvas, updateMatrix } = require("./controllers/canvasController");
const { MercadoPagoConfig, Preference } = require("mercadopago");
const {
  authUser,
  getUser,
  updateCoin,
} = require("./controllers/authController");
const {
  getUserCoin,
  updateUserCoin,
} = require("./controllers/moneyController");
// const authRoutes = require("./routes/auth");
// const CanvasMatrix = require('./models/canvasModel')
// const messageRoutes = require("./routes/messages");
// const cloudRoutes = require("./routes/cloudinary");

const app = express();
app.use(cors());
app.use(express.json());

//-> DB Connection:
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_PUBLIC_KEY,
});

//-> Routes:
app.get("/", (req, res) => {
  const htmlResponse = `
      <html>
        <head>
          <title>Make me a millionaire today!</title>
        </head>
        <body>
          <h1>Make me a millionaire today! welcome to the backend.</h1>
        </body>
      </html>
    `;
  res.send(htmlResponse);
});
// app.use("/api/auth", authRoutes);
app.post("/auth", authUser);
app.get("/auth/:username", getUser);
app.put("/auth/:username/coin", updateCoin);
// MERCADO PAGO:
app.post("/create_preference", async (req, res) => {
  try {
    const body = {
      items: [
        {
          title: req.body.title,
          quantity: Number(req.body.quantity),
          unit_price: Number(req.body.price),
          currency_id: "ARS",
        },
      ],
      back_urls: {
        success: "https://makemeamillionaire.today/bank/success",
        failure: "https://makemeamillionaire.today/error",
        pending: "https://makemeamillionaire.today/error",
      },
      auto_return: "approved",
      notification_url: "https://makemeamillionaire.today/bank/success",
    };
    const preference = new Preference(client);
    const result = await preference.create({ body });
    res.json({
      id: result.id,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: "error al crear la preferencia :c",
    });
  }
});
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});

//-> Socket-IO connection:
const io = socket(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

const userCoins = {}; //-> Memory storage
io.on("connection", async (socket) => {
  // -> CANVAS LOGIC:
  socket.emit("/canvas", await getCanvas());
  socket.on("/canvas/update", async (data) => {
    await updateMatrix(data);
    const newMatrix = await getCanvas();
    socket.emit("/canvas", newMatrix);
    socket.broadcast.emit("/canvas", newMatrix);
  });
  // -> CHAT LOGIC:
  socket.broadcast.emit("chat_message", {
    usuario: "INFO",
    mensaje: "A new user has connected.",
  });
  socket.on("chat_message", (data) => {
    io.emit("chat_message", data);
  });
  // -> MONEY LOGIC:
  socket.on("auth_coin", async (data) => {
    try {
      const getCoin = await getUserCoin(data.username);
      socket.emit("auth_coin", { coin: getCoin });
    } catch (error) {
      console.error("Error handling auth_coin event:", error);
    }
  });
  socket.on("auth_coin_update", async ({ username, amount }) => {
    try {
      const newCoinValue = await updateUserCoin(username, amount);
      userCoins[username] = newCoinValue; // Actualiza el almacenamiento en memoria
      io.emit("auth_coin_update", { username, coin: newCoinValue }); // Emitir a todos los sockets conectados
    } catch (error) {
      console.error("Error handling auth_coin_update event:", error);
    }
  });
});
