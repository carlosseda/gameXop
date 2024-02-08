const fs = require('fs/promises')
const path = require('path')
const sharp = require('sharp')

module.exports = class ImageService {
  uploadImage = async images => {
    const result = []

    for (const key in images) {
      for (const image of images[key]) {
        try {
          let filename = image.originalname

          if (filename.includes(' ')) {
            filename = image.originalname.replace(/ |_|/g, '-')
          }

          const tmpPath = path.join(__dirname, `../storage/tmp/${image.originalname}`)

          const newFilename = await fs.access(path.join(__dirname, `../storage/images/gallery/original/${path.parse(filename).name}.webp`)).then(async () => {
            // TODO Dar al usuario la opción de sobreescribir la imagen
            return `${path.parse(filename).name}-${new Date().getTime()}.webp`
          }).catch(async () => {
            return `${path.parse(filename).name}.webp`
          })

          await sharp(tmpPath)
            .webp({ lossless: true })
            .toFile(path.join(__dirname, `../storage/images/gallery/original/${newFilename}`))

          await sharp(tmpPath)
            .resize(135, 135)
            .webp({ lossless: true })
            .toFile(path.join(__dirname, `../storage/images/gallery/thumbnail/${newFilename}`))

          await fs.unlink(tmpPath)

          result.push(newFilename)
        } catch (error) {
          console.log(error)
        }
      }
    }

    console.log(result)

    return result
  }

  resizeImages = async (images) => {
    try {
      const resizedImages = {}
      const uploadPromises = []

      for (const image in images) {
        if (!resizedImages.adminImages) {
          resizedImages.adminImages = []
        }

        resizedImages.adminImages.push({
          name: images[image].name,
          filename: images[image].filename,
          title: images[image].title,
          alt: images[image].alt,
          languageAlias: images[image].languageAlias,
          widthPx: 135,
          heightPx: 135
        })

        const imageUploadPromise = new Promise(async (resolve) => {
          const imageConfigurationPromises = []

          for (const [mediaQuery, imageConfiguration] of Object.entries(images[image].imageConfigurations)) {
            const resizedFilename = `${path.parse(images[image].filename).name}-${imageConfiguration.widthPx}x${imageConfiguration.heightPx}.webp`

            const imageResize = {
              originalFilename: images[image].filename,
              resizedFilename,
              title: images[image].title,
              alt: images[image].alt,
              widthPx: imageConfiguration.widthPx,
              heightPx: imageConfiguration.heightPx
            }

            const resizePromise = fs.access(path.join(__dirname, `../storage/images/resized/${resizedFilename}`))
              .then(async () => {
                const start = new Date().getTime()
                const stats = await fs.stat(path.join(__dirname, `../storage/images/resized/${resizedFilename}`))
                imageResize.sizeBytes = stats.size
                const end = new Date().getTime()
                imageResize.latencyMs = end - start
              })
              .catch(async () => {
                const start = new Date().getTime()
                await sharp(path.join(__dirname, `../storage/images/gallery/original/${images[image].filename}`))
                  .resize(parseInt(imageConfiguration.widthPx), parseInt(imageConfiguration.heightPx))
                  .webp({ nearLossless: true })
                  .toFile(path.join(__dirname, `../storage/images/resized/${resizedFilename}`))

                const end = new Date().getTime()
                imageResize.sizeBytes = (await fs.stat(path.join(__dirname, `../storage/images/resized/${resizedFilename}`))).size
                imageResize.latencyMs = end - start
              })

            if (!resizedImages[mediaQuery]) {
              resizedImages[mediaQuery] = {}
            }

            if (!resizedImages[mediaQuery][images[image].languageAlias]) {
              resizedImages[mediaQuery][images[image].languageAlias] = {}
            }

            if (!resizedImages[mediaQuery][images[image].languageAlias][images[image].name]) {
              resizedImages[mediaQuery][images[image].languageAlias][images[image].name] = {}
            }

            resizedImages[mediaQuery][images[image].languageAlias][images[image].name] = imageResize
            imageConfigurationPromises.push(resizePromise)
          }

          await Promise.all(imageConfigurationPromises)
          resolve()
        })

        uploadPromises.push(imageUploadPromise)
      }

      await Promise.all(uploadPromises)

      return resizedImages
    } catch (error) {
      return null
    }
  }

  deleteImages = async filename => {
    // TODO: Comprobar si algún elemento de la base de datos está usando la imagen
    try {
      await fs.unlink(path.join(__dirname, `../storage/images/gallery/original/${filename}`))
      await fs.unlink(path.join(__dirname, `../storage/images/gallery/thumbnail/${filename}`))

      return 1
    } catch {
      return 0
    }
  }

  getThumbnails = async (limit, offset) => {
    const images = {}
    let files = await fs.readdir(path.join(__dirname, '../storage/images/gallery/thumbnail'))
    files = files.filter(file => file !== '.gitignore')

    images.filenames = await fs.readdir(path.join(__dirname, '../storage/images/gallery/thumbnail'), { limit, offset })
    images.filenames = images.filenames.filter(file => file !== '.gitignore')
    images.count = files.length

    return images
  }
}
