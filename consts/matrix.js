const MAX_SIZE = process.env.ENV_NAME === 'staging' ? 100 : 200;

module.exports = { MAX_SIZE }