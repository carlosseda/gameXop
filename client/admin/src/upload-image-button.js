class UploadImageButton extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    this.name = this.getAttribute('name')
    this.languageAlias = this.getAttribute('language-alias')
    this.quantity = this.getAttribute('quantity')
    this.imageConfigurations = JSON.parse(this.getAttribute('image-configurations'))

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
          border: none;
          background-color: hsl(207, 85%, 69%);
          color: hsl(0, 0%, 100%);
          cursor: pointer;
          display: inline-block;
          font-size: 16px;
          height: 135px;
          text-align: center;
          width: 135px;
          z-index: 2000;
        }

        .square-button:hover {
          cursor: pointer;
          filter: brightness(1.2);
        }
      
        .square-button svg {
          fill: white;
          height: 4em;
          width: 4rem;
        }

        .upload-image-container {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: left;
          position: relative;
        }

        .upload-image{
          background-color: hsl(100, 100%, 100%);
          cursor: pointer;
          height: 135px;
          position: relative;
          width: 135px;
        }

        .upload-image.single {
          position: absolute;
          z-index: 2001;
        }

        .upload-image img {
          background-color: hsl(0, 0%, 0%);
        }

        .upload-image-overlay {
          align-items: center;
          background-color: hsla(0, 0%, 0%, 0.5);
          height: 100%;
          display: flex;
          justify-content: center;
          left: 0;
          opacity: 0;
          position: absolute;
          top: 0;
          transition: opacity 0.3s ease;
          width: 100%;
          z-index: 2000;
        }

        .upload-image:hover .upload-image-overlay {
          opacity: 1;
        }

        .delete-button {
          background-color: hsl(0, 100%, 50%);
          border: none;
          border-radius: 50%;
          color: white;
          cursor: pointer;
          font-size: 12px;
          height: 20px;
          opacity: 0;
          position: absolute;
          right: 0.2rem;
          top: 0.2rem;
          transition: opacity 0.3s ease;
          width: 20px;
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
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M20,5A2,2 0 0,1 22,7V17A2,2 0 0,1 20,19H4C2.89,19 2,18.1 2,17V7C2,5.89 2.89,5 4,5H20M5,16H19L14.5,10L11,14.5L8.5,11.5L5,16Z" />
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

    image.imageConfigurations = this.imageConfigurations

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

      document.dispatchEvent(new CustomEvent('removeImageFromForm', {
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

  async showThumbnails (images) {
    this.shadow.querySelectorAll('.upload-image').forEach(image => {
      image.remove()
    })

    images.forEach(image => {
      if (image.name === this.name && image.languageAlias === this.languageAlias) {
        this.createThumbnail(image)
      }
    })
  }

  async deleteThumbnails () {
    this.shadow.querySelectorAll('.upload-image').forEach(image => {
      image.remove()
    })
  }
}

customElements.define('upload-image-button-component', UploadImageButton)
