const multer = require('multer')

const storage = multer.memoryStorage()

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'src/storage/tmp/')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname)
//   }
// })

const upload = multer({ storage })

const uploadFiles = upload.fields([
  { name: 'file', maxCount: 1 }
])

module.exports = uploadFiles
