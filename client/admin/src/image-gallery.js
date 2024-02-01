class ImageGallery extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.image = {}
  }

  connectedCallback () {
    document.addEventListener('openGallery', this.handleOpenGallery.bind(this))
    document.addEventListener('showElementGallery', this.handleShowElementGallery.bind(this))
    this.render()
  }

  handleOpenGallery (event) {
    this.openGallery(event.detail.image)
  }

  handleShowElementGallery (event) {
    this.showElementGallery(event.detail.image)
  }

  async render () {
    this.shadow.innerHTML =
      /* html */`
        <style>
          .overlayer {
            align-items: center;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            flex-direction: column;
            height: 100vh;
            justify-content: center;
            left: 0;
            opacity: 0;
            position: fixed;
            top: 0;
            transition: opacity 0.3s;
            visibility: hidden;
            width: 100%;
            z-index: -1;
          }

          .overlayer.active {
            opacity: 1;
            visibility: visible;
            z-index: 5000;
          }

          .modal {
            height: 80%;
            position: absolute;
            width: 80%;
          }

          .modal-content {
            background-color: white;
            border: 1px solid #888;
            border-radius: 5px;
            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
            position: relative;
            width: 100%;
          }

          .modal-header {
            align-items: center;
            display: flex;
            height: 5%;
            justify-content: space-between;
            padding: 1%;
            width: 98%;
          }

          .modal-header h2 {
            font-family: 'Roboto', sans-serif;
            margin: 0;
          }

          .modal-header .close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
          }

          .modal-header .close:hover,
          .modal-header .close:focus {
            color: black;
            text-decoration: none;
            cursor: pointer;
          }

          .modal-body {
            display: flex;
            flex-direction: column;
            height: 85%;
          }

          .tabs-container-menu {
            display: flex;
            flex-direction: column;
          }

          .tabs-container-menu .tabs-container-items {
            align-items: center;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            padding: 0 1%;
          }

          .tabs-container-menu .tabs-container-items ul {
            display: flex;
            flex-direction: row;
            list-style-type: none;
            margin: 0;
            padding: 0;
          }

          .tabs-container-menu .tabs-container-items ul li {
            cursor: pointer;
            font-family: 'Roboto', sans-serif;
            padding: 0.5rem 1rem;
          }

          .tabs-container-menu .tabs-container-items ul li:hover {
            color: #555;
          }

          .tabs-container-menu .tabs-container-items ul li.active {
            background-color: hsl(207, 85%, 69%);
            color: white;
          }

          .tabs-container-content {
            display: flex;
            flex-direction: column;
            height: 95%;
          }

          .tabs-container-content .tab {
            display: none;
            height: 100%;
          }

          .tabs-container-content .tab.active {
            display: block;
          }

          .tabs-container-content .tab.active#gallery-content {
            border-bottom: 1px solid #dcdcde;
            border-top: 1px solid #dcdcde;
            display: flex;
          }

          .image-gallery {
            align-content: flex-start;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            height: 96%;
            overflow: scroll;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 1%;
            width: 80%;
          }

          .image-gallery-loader {
            background-color: #f1f1f1;
            height: 100%;
            overflow: scroll;
            overflow-y: auto;
            overflow-x: hidden;
            width: 20%;
          }

          .image-gallery .image {
            border: 1px solid #ccc;
            border-radius: 5px;
            box-sizing: border-box;
            cursor: pointer;
            height: 135px;
            margin: 5px;
            overflow: hidden;
            padding: 5px;
            position: relative;
            width: 135px;
          }

          .image-gallery .image:hover {
            border: 1px solid #aaa;
          }

          .image-gallery .image img {
            background-color: hsl(0, 0%, 0%);
            height: 100%;
            width: 100%;
          }

          .image-gallery .image.selected {
            border: 0.2rem solid #4CAF50;
          }

          .image-gallery-loader-form{
            margin: 1rem;
          }

          .image-gallery-loader-form label {
            font-family: 'Roboto', sans-serif;
            margin: 0.5rem 5%;
            width: 90%;
          }   

          .image-gallery-loader-form input {
            border: 1px solid #ccc;
            box-sizing: border-box;
            margin: 5%;
            padding: 0.2rem;
            position: relative;
            width: 90%;
          }

          .tabs-container-content .tab.active#upload-content {
            border-bottom: 1px solid #dcdcde;
            border-top: 1px solid #dcdcde;
          }

          .upload-image {
            display: flex;
            flex-direction: column;
            height: 100%;
            justify-content: center;
            align-items: center;
          }

          .upload-image input[type="file"] {
            display: none;
          }

          .upload-image label {
            background-color: hsl(207, 85%, 69%);
            border: none;
            border-radius: 5px;
            color: white;
            cursor: pointer;
            font-family: 'Roboto', sans-serif;
            font-size: 16px;
            padding: 12px 24px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            margin: 4px 2px;
            transition-duration: 0.4s;
          }

          .upload-image label:hover {
            background-color: #45a049;
          }

          .modal-footer {
            display: flex;
            justify-content: flex-end;
            padding: 1rem;
          }

          .modal-footer button {
            background-color: #ccc;
            border: none;
            border-radius: 5px;
            color: white;
            font-size: 16px;
            padding: 12px 24px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            margin: 4px 2px;
            transition-duration: 0.4s;
          }

          .modal-footer button.active {
            background-color: hsl(207, 85%, 69%);
            cursor: pointer;
          }
        </style>

        <div class="overlayer">
          <div class="modal">
            <div class="modal-content">
              <div class="modal-header">
                <h2>Imagen destacada</h2>
                <span class="close">&times;</span>
              </div>
              <div class="modal-body">
                  <div class="tabs-container-menu">
                      <div class="tabs-container-items">
                          <ul>
                              <li id="gallery-content" class="active">Galería</li>
                              <li id="upload-content">Subir imagen</li>
                          </ul>
                      </div>
                  </div>
                  <div class="tabs-container-content">
                    <div class="tab active" id="gallery-content">
                      <div class="image-gallery"></div>
                      <div class="image-gallery-loader">
                        <div class="image-gallery-information">
                          <div class="image-gallery-loader-form">
                            <label for="title">Título</label>
                            <input type="text" name="title" />
                          </div>
                          <div class="image-gallery-loader-form">
                            <label for="description">Texto alternativo</label>
                            <input type="text" name="alt" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="tab" id="upload-content">
                      <div class="upload-image">
                        <label for="file">Subir imagen</label>
                        <input type="file" id="file" name="file" accept="image/*" />
                      </div>
                    </div>
                </div>
              </div>
              <div class="modal-footer">
                <button class="btn btn-primary">Elegir imagen</button>
              </div>
            </div>
          </div>
        </div>
        `

    await this.getThumbnails()

    this.shadow.querySelector('.overlayer').addEventListener('click', (event) => {
      if (event.target.closest('.close')) {
        this.closeGallery()
      }

      if (event.target.closest('.tabs-container-menu li')) {
        this.changeTab(event.target.closest('.tabs-container-menu li'))
      }

      if (event.target.closest('.image')) {
        this.selectImage(event.target.closest('.image'))
      }

      if (event.target.closest('.modal-footer button')) {
        if (event.target.classList.contains('active')) {
          this.createThumbnail()
        }
      }
    })

    this.shadow.querySelector('input[type="file"]').addEventListener('change', async event => {
      this.uploadImage(event.target.files[0])
    })
  }

  async openGallery (image) {
    this.shadow.querySelector('.overlayer').classList.add('active')
    this.image = image
  }

  async showElementGallery (image) {
    this.shadow.querySelector('.overlayer').classList.add('active')
    this.shadow.querySelector('input[name="title"]').value = image.title
    this.shadow.querySelector('input[name="alt"]').value = image.alt

    this.image = image
    const imageElement = this.shadow.querySelector(`.image[data-filename="${image.filename}"]`)

    if (imageElement) {
      imageElement.classList.add('selected')
      this.shadow.querySelector('.modal-footer button').classList.add('active')
      this.previousImage = image.filename
    }
  }

  async changeTab (tab) {
    this.shadow.querySelectorAll('.tabs-container-menu li').forEach(item => {
      item.classList.remove('active')
    })

    tab.classList.add('active')

    this.shadow.querySelectorAll('.tabs-container-content .tab').forEach((item) => {
      item.classList.remove('active')
    })

    this.shadow.querySelector(`.tabs-container-content .tab#${tab.id}`).classList.add('active')
  }

  async getThumbnails () {
    try {
      const result = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/image-gallery`)
      const data = await result.json()
      let html = ''

      data.filenames.forEach(filename => {
        html += `
                  <div class="image" data-filename="${filename}">
                      <img src="${import.meta.env.VITE_API_URL}/api/admin/image-gallery/${filename}" />
                  </div>
                `
      })

      this.shadow.querySelector('.image-gallery').innerHTML = html
    } catch (e) {
      console.log(e)
    }
  }

  async uploadImage (file) {
    const formData = new FormData()
    formData.append('file', file)

    const result = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/image-gallery`, {
      method: 'POST',
      body: formData
    })

    const filenames = await result.json()

    this.shadow.querySelectorAll('.image').forEach((item) => {
      item.classList.remove('selected')
    })

    filenames.forEach(filename => {
      const imageContainer = document.createElement('div')
      const image = document.createElement('img')

      imageContainer.classList.add('image', 'selected')
      imageContainer.setAttribute('data-filename', filename)
      image.src = `${import.meta.env.VITE_API_URL}/api/admin/image-gallery/${filename}`

      imageContainer.addEventListener('click', () => {
        this.shadow.querySelectorAll('.image').forEach(item => {
          item.classList.remove('selected')
        })

        imageContainer.classList.add('selected')
      })

      imageContainer.appendChild(image)

      this.shadow.querySelector('.image-gallery').prepend(imageContainer)
    })

    this.shadow.querySelectorAll('.tabs-container-menu li').forEach((item) => {
      item.classList.remove('active')
    })

    this.shadow.querySelector('li#gallery-content').classList.add('active')

    this.shadow.querySelectorAll('.tab').forEach((item) => {
      item.classList.remove('active')
    })

    this.shadow.querySelector('.tab#gallery-content').classList.add('active')
    this.shadow.querySelector('.modal-footer button').classList.add('active')

    this.shadow.querySelector('input[name="alt"]').value = ''
    this.shadow.querySelector('input[name="title"]').value = ''
  }

  async selectImage (image) {
    this.shadow.querySelectorAll('.image').forEach(item => {
      item.classList.remove('selected')
    })

    image.classList.add('selected')

    this.shadow.querySelector('.modal-footer button').classList.add('active')
  }

  async createThumbnail () {
    this.image.alt = this.shadow.querySelector('input[name="alt"]').value
    this.image.title = this.shadow.querySelector('input[name="title"]').value
    this.image.filename = this.shadow.querySelector('.image.selected').getAttribute('data-filename')

    if (this.previousImage) {
      this.image.previousImage = this.previousImage
    }

    document.dispatchEvent(new CustomEvent('createThumbnail', {
      detail: {
        image: this.image
      }
    }))

    this.closeGallery()
  }

  async closeGallery () {
    this.shadow.querySelector('.modal-footer button').classList.remove('active')

    this.shadow.querySelectorAll('.image').forEach(item => {
      item.classList.remove('selected')
    })

    this.shadow.querySelector('.overlayer').classList.remove('active')
  }
}

customElements.define('image-gallery-component', ImageGallery)
