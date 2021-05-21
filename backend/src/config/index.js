module.exports = {
    app: {
      port: process.env.PORT || 4000,
  },
    token: {
      secret: process.env.TOKEN,
      expired: "1d"
    },
    smtp: {
      host: "host_smtp",
      port: 587,
      secure: false,
      auth: {
        user: "seu_usuario",
        password: "sua_senha"
      }
    }
  };