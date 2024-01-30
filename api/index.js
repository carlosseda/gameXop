require('dotenv').config()
const process = require('process')
const express = require('express')
const session = require('express-session')
const IORedis = require('ioredis')
const RedisStore = require('connect-redis').default
const cors = require('cors')
const fs = require('fs')
const app = express()
const userAgentMiddleware = require('./src/middlewares/user-agent')
const exposeServiceMiddleware = require('./src/middlewares/expose-services')
// const apiTrackingMiddleware = require('./src/middlewares/api-tracking.js')

const redisClient = new IORedis(process.env.REDIS_URL)

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, domain: 'dev-gamexop.com', path: '/', sameSite: 'Lax', maxAge: 1000 * 60 * 3600 }
}))

app.use(cors({ origin: ['http://dev-gamexop.com'], credentials: true }))

app.use(express.json({ limit: '10mb', extended: true }))
app.use(express.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }))

app.use(userAgentMiddleware)
app.use(...Object.values(exposeServiceMiddleware))
// app.use(apiTrackingMiddleware)

const routePath = './src/routes/'

fs.readdirSync(routePath).forEach(function (file) {
  require(routePath + file)(app)
})

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`El servidor está corriendo en el puerto ${PORT}.`)
})
