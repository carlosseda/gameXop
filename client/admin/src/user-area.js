class UserArea extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.data = []
  }

  connectedCallback () {
    this.loadData().then(() => this.render())
  }

  async loadData () {
    const url = `${import.meta.env.VITE_API_URL}/api/admin/users/user-area`

    try {
      const response = await fetch(url)
      this.data = await response.json()
      console.log(this.data)
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
            border-radius: 50%;
            height: 3rem;
            overflow: hidden;
            width: 3rem;
          }

          .user-avatar img {
            object-fit: cover;
            width: 100%;
          }
        </style>

        <div class="user-area">
          <div class="user-avatar">
            <img src="${import.meta.env.VITE_API_URL}/api/admin/image-gallery/image/${this.data.images.avatar.filename}" alt="${this.data.images.avatar.alt}" title="${this.data.images.avatar.title}">
          </div>
        </div>
      `
  }
}

customElements.define('user-area-component', UserArea)
