require('dotenv').config()
const process = require('process')
const express = require('express')
const session = require('express-session')
const IORedis = require('ioredis')
const RedisStore = require('connect-redis').default
const cors = require('cors')
const fs = require('fs')
const multer = require('multer')
const app = express()

const redisClient = new IORedis(process.env.REDIS_URL || 'redis://127.0.0.1:6379')

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, domain: 'dev-gamexop.com', path: '/', sameSite: 'Lax', maxAge: 1000 * 60 * 3600 }
}))

const corsOptions = {
  origin: ['http://dev-gamexop.com'],
  credentials: true
}
app.use(cors(corsOptions))
app.use(express.json({ limit: '10mb', extended: true }))
app.use(express.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }))

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/storage/tmp/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage })

const routePath = './src/routes/'

fs.readdirSync(routePath).forEach(function (file) {
  require(routePath + file)(app, upload)
})

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`El servidor está corriendo en el puerto ${PORT}.`)
})
