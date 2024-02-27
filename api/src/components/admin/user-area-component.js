class UserArea extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    this.loadData().then(() => this.render())
  }

  async loadData () {
    const url = `${process.env.API_URL}${this.getAttribute('endpoint')}`

    try {
      const response = await fetch(url)
      this.data = await response.json()
    } catch (error) {
      console.log(error)
    }
  }

  render () {
    this.shadow.innerHTML =
      /* html */`
        <style>
          h4 {   
            color: hsl(0, 0%, 100%);
            font-family: 'Lato', sans-serif;
            font-size: 1rem;
            font-weight: 600;
            margin: 0;
            text-decoration: none;
            text-align:center;
          }

          .user-area {
            align-items: center;
            display: flex;
            gap: 1rem;
            justify-content: center;
          }

          .user-avatar {
            align-items: center;
            background-color: hsl(272 40% 35%);
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            justify-content: center;
            height: 2.7rem;
            overflow: hidden;
            width: 2.7rem;
          }

          .user-avatar svg {
            fill: hsl(0, 0%, 100%);
            height: 30px;
            width: 30px;
          }

          .user-avatar img {
            object-fit: cover;
            width: 100%;
          }
        </style>

        <div class="user-area">
          <div class="user-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" /></svg>
          </div>
        </div>
      `

    if (this.data.images.avatar?.resizedFilename) {
      const image = document.createElement('img')
      image.src = `${process.env.API_URL}/api/admin/image-gallery/image/${this.data.images.avatar.resizedFilename}`
      image.alt = this.data.images.avatar.alt
      image.title = this.data.images.avatar.title
      this.shadow.querySelector('.user-avatar').innerHTML = ''
      this.shadow.querySelector('.user-avatar').appendChild(image)
    }
  }
}

customElements.define('user-area-component', UserArea)
