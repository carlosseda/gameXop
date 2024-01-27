class UploadImageButton extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    this.name = this.getAttribute('name')
    this.languageAlias = this.getAttribute('language-alias')
    this.quantity = this.getAttribute('quantity')

    document.addEventListener('showThumbnails', this.handleShowThumbnails.bind(this))
    document.addEventListener('createThumbnail', this.handleCreateThumbnail.bind(this))
    document.addEventListener('updateThumbnail', this.handleUpdateThumbnail.bind(this))
    document.addEventListener('deleteThumbnails', this.handleDeleteThumbnails.bind(this))

    this.render()
  }

  handleShowThumbnails = event => {
    this.showThumbnails(event.detail.images)
  }

  handleCreateThumbnail = event => {
    if (event.detail.image.name === this.name && event.detail.image.languageAlias === this.languageAlias) {
      this.createThumbnail(event.detail.image)
    }
  }

  handleUpdateThumbnail = event => {
    if (event.detail.image.name === this.name && event.detail.image.languageAlias === this.languageAlias) {
      this.updateThumbnail(event.detail.image, event.detail.previousImage)
    }
  }

  handleDeleteThumbnails = event => {
    this.deleteThumbnails()
  }

  render () {
    this.shadow.innerHTML =
      /* html */`
      <style>
        .square-button {
          width: 135px;
          height: 135px;
          border: none;
          background-color: hsl(207, 85%, 69%);
          color: white;
          text-align: center;
          display: inline-block;
          font-size: 16px;
          cursor: pointer;
          position: absolute;
          z-index: 2000;
        }

        .square-button:hover {
          filter: brightness(1.2);
          cursor: pointer;
        }
      
        .icon {
          fill: white;
          width: 24px;
          height: 24px;
        }

        .upload-image-container {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: left;
          position: relative;
        }

        .upload-image{
          background-color: hsl(100, 100%, 100%);
          cursor: pointer;
          height: 135px;
          width: 135px;
        }

        .upload-image.single {
          position: absolute;
          z-index: 2001;
        }

        .upload-image-overlay {
          background-color: hsla(0, 0%, 0%, 0.5);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 2000;
        }

        .upload-image:hover .upload-image-overlay {
          opacity: 1;
        }

        .delete-button {
          position: absolute;
          top: 0.2rem;
          right: 0.2rem;
          background-color: hsl(0, 100%, 50%);
          color: white;
          border: none;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: 12px;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 2001;
        }

        .upload-image:hover .delete-button {
          opacity: 1;
        }

        .delete-button:hover {
          background-color: hsl(0, 100%, 30%);
        }
      </style>

      <div class="upload-image-container">
        <button class="square-button">
          <svg class="icon" viewBox="0 0 24 24">
            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
          </svg>
        </button>
      </div>
      `

    const uploadImageContainer = this.shadow.querySelector('.upload-image-container')

    uploadImageContainer.addEventListener('click', event => {
      if (event.target.closest('.square-button')) {
        const image = {
          name: this.getAttribute('name'),
          languageAlias: this.languageAlias
        }

        document.dispatchEvent(new CustomEvent('openGallery', {
          detail: {
            image
          }
        }))
      }
    })
  }

  async showThumbnails (images) {
    this.shadow.querySelectorAll('.upload-image').forEach(image => {
      image.remove()
    })

    images.forEach(image => {
      image.show = true

      document.dispatchEvent(new CustomEvent('createThumbnail', {
        detail: {
          image
        }
      }))
    })
  }

  async createThumbnail (image) {
    const uploadImageContainer = this.shadow.querySelector('.upload-image-container')

    if (this.shadow.querySelector(`.upload-image[data-filename="${image.filename}"]`)) {
      return
    }

    const imageContainer = document.createElement('div')
    imageContainer.classList.add('upload-image')
    imageContainer.dataset.filename = image.filename

    if (this.quantity === 'single') {
      imageContainer.classList.add('single')
    }

    const file = document.createElement('img')
    file.src = `${import.meta.env.VITE_API_URL}/api/admin/image-gallery/${image.filename}`

    const deleteButton = document.createElement('button')
    deleteButton.classList.add('delete-button')
    deleteButton.innerHTML = 'X'

    imageContainer.appendChild(deleteButton)
    imageContainer.appendChild(file)
    uploadImageContainer.appendChild(imageContainer)

    if (!image.show) {
      image.create = true
    }

    document.dispatchEvent(new CustomEvent('attachImageToForm', {
      detail: {
        image
      }
    }))

    file.addEventListener('click', (event) => {
      image.filename = imageContainer.dataset.filename

      document.dispatchEvent(new CustomEvent('showElementGallery', {
        detail: {
          image
        }
      }))
    })

    deleteButton.addEventListener('click', (event) => {
      deleteButton.parentElement.remove()

      image.previousImage = imageContainer.dataset.filename
      image.delete = true

      document.dispatchEvent(new CustomEvent('attachImageToForm', {
        detail: {
          image
        }
      }))

      if (this.getAttribute('quantity') === 'single') {
        this.shadow.querySelector('.upload-image-container').innerHTML = `
                      <button class="square-button">
                          <svg class="icon" viewBox="0 0 24 24">
                              <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                          </svg>
                      </button>
                  `
      }
    })
  }

  async updateThumbnail (image, previousImage) {
    if (this.shadow.querySelector(`.upload-image[data-filename="${image.filename}"]`)) {
      return
    }

    if (this.shadow.querySelector(`.upload-image[data-filename="${previousImage}"]`)) {
      const thumbnail = this.shadow.querySelector(`.upload-image[data-filename="${previousImage}"]`)

      thumbnail.querySelector('img').src = `${import.meta.env.VITE_API_URL}/api/admin/image-gallery/${image.filename}`
      thumbnail.dataset.filename = image.filename

      image.previousImage = previousImage
      image.update = true

      document.dispatchEvent(new CustomEvent('attachImageToForm', {
        detail: {
          image
        }
      }))
    }
  }

  async deleteThumbnails () {
    this.shadow.querySelectorAll('.upload-image').forEach(image => {
      image.remove()
    })
  }
}

customElements.define('upload-image-button-component', UploadImageButton)
