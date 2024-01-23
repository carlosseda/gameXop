const fs = require('fs/promises')
const path = require('path')
const sharp = require('sharp')
const db = require('../models')
const ImageConfiguration = db.ImageConfiguration
const Image = db.Image

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

    return result
  }

  resizeImages = async (entity, entityId, images) => {
    try {
      for (const image in images) {
        const imageConfigurations = await ImageConfiguration.findAll({
          where: {
            entity,
            name: images[image].name
          }
        })

        for (const imageConfiguration of imageConfigurations) {
          if (images[image].delete) {
            const resizedFilename = `${path.parse(images[image].filename).name}-${imageConfiguration.widthPx}x${imageConfiguration.heightPx}.webp`

            Image.destroy({
              where: {
                entity,
                entityId,
                name: images[image].name,
                languageAlias: images[image].languageAlias,
                resizedFilename
              }
            })
          }

          if (images[image].update) {
            const resizedFilename = `${path.parse(images[image].filename).name}-${imageConfiguration.widthPx}x${imageConfiguration.heightPx}.webp`
            const previousResizedFilename = `${path.parse(images[image].previousImage).name}-${imageConfiguration.widthPx}x${imageConfiguration.heightPx}.webp`

            if (images[image].filename !== images[image].previousImage) {
              let imageResize = {}

              await fs.access(path.join(__dirname, `../storage/images/resized/${resizedFilename}`)).then(async () => {
                const start = new Date().getTime()

                const stats = await fs.stat(path.join(__dirname, `../storage/images/resized/${resizedFilename}`))
                imageResize = await sharp(path.join(__dirname, `../storage/images/resized/${resizedFilename}`)).metadata()
                imageResize.size = stats.size

                const end = new Date().getTime()

                imageResize.latency = end - start
              }).catch(async () => {
                const start = new Date().getTime()

                imageResize = await sharp(path.join(__dirname, `../storage/images/gallery/original/${images[image].filename}`))
                  .resize(imageConfiguration.widthPx, imageConfiguration.heightPx)
                  .webp({ nearLossless: true })
                  .toFile(path.join(__dirname, `../storage/images/resized/${resizedFilename}`))

                const end = new Date().getTime()

                imageResize.latency = end - start
              })

              Image.update({
                imageConfigurationId: imageConfiguration.id,
                mediaQuery: imageConfiguration.mediaQuery,
                sizeBytes: imageResize.size,
                latencyMs: imageResize.latency,
                title: images[image].title,
                alt: images[image].alt,
                resizedFilename,
                originalFilename: images[image].filename
              }, {
                where: {
                  entity,
                  entityId,
                  name: images[image].name,
                  languageAlias: images[image].languageAlias,
                  resizedFilename: previousResizedFilename
                }
              })
            } else {
              Image.update({
                title: images[image].title,
                alt: images[image].alt
              }, {
                where: {
                  entity,
                  entityId,
                  name: images[image].name,
                  languageAlias: images[image].languageAlias,
                  resizedFilename
                }
              })
            }
          }

          if (images[image].create) {
            let imageResize = {}
            const resizedFilename = `${path.parse(images[image].filename).name}-${imageConfiguration.widthPx}x${imageConfiguration.heightPx}.webp`

            await fs.access(path.join(__dirname, `../storage/images/resized/${resizedFilename}`)).then(async () => {
              const start = new Date().getTime()

              const stats = await fs.stat(path.join(__dirname, `../storage/images/resized/${resizedFilename}`))
              imageResize = await sharp(path.join(__dirname, `../storage/images/resized/${resizedFilename}`)).metadata()
              imageResize.size = stats.size

              const end = new Date().getTime()

              imageResize.latency = end - start
            }).catch(async () => {
              const start = new Date().getTime()

              imageResize = await sharp(path.join(__dirname, `../storage/images/gallery/original/${images[image].filename}`))
                .resize(imageConfiguration.widthPx, imageConfiguration.heightPx)
                .webp({ nearLossless: true })
                .toFile(path.join(__dirname, `../storage/images/resized/${resizedFilename}`))

              const end = new Date().getTime()

              imageResize.latency = end - start
            })

            await Image.create({
              imageConfigurationId: imageConfiguration.id,
              entityId,
              entity,
              name: images[image].name,
              originalFilename: images[image].filename,
              resizedFilename,
              title: images[image].title,
              alt: images[image].alt,
              languageAlias: images[image].languageAlias,
              mediaQuery: imageConfiguration.mediaQuery,
              sizeBytes: imageResize.size,
              latencyMs: imageResize.latency
            })
          }
        }
      }

      return true
    } catch (error) {
      console.log(error)

      return false
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

  getAdminImages = async (entity, entityId) => {
    const images = await Image.findAll({
      attributes: [['originalFilename', 'filename'], 'name', 'languageAlias', 'alt', 'title'],
      where: {
        entity,
        entityId
      },
      group: [['originalFilename', 'filename'], 'name', 'languageAlias', 'alt', 'title']
    })

    return images
  }
}
