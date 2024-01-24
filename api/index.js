require('dotenv').config()
const process = require('process')
const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const cors = require('cors')
const fs = require('fs')
const app = express()
const multer = require('multer')

app.use(cookieParser())
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, httpOnly: true, domain: 'dev-gamexop.com', path: '/', sameSite: 'Lax' }
}))

const corsOptions = {
  origin: ['http://dev-gamexop.com'],
  credentials: true
}
app.use(cors(corsOptions))
app.use(express.json({ limit: '10mb', extended: true }))
app.use(express.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }))

app.use(function (req, res, next) {
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization, Origin, Content-Type, Accept'
  )
  next()
})

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
