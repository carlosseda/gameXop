class Logo extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    this.loadData().then(() => this.render())
  }

  async loadData () {
    this.data = {
      title: 'GameXop',
      image: {
        url: 'http://localhost:5173/public/logo.svg',
        alt: 'Logo de GameXop'
      }
    }
  }

  render () {
    this.shadow.innerHTML =
    /* html */`
    <style>
      a{
        text-decoration: none;
      }
      
      .logo{
        align-items: center;
        display: flex;
        gap: 1rem;
      }

      .logo img{
        height: 3rem;
        width: 3rem;
      }

      .logo h1{
        color: hsl(0, 0%, 100%);
        font-family: 'Lato', sans-serif;
        font-size: 1.2rem;
        font-weight: 700;
        margin: 0;
        text-shadow: 2px 0 0 hsl(284deg 100% 50%), -2px 0 0 hsl(284deg 100% 50%), 0 2px 0 hsl(284deg 100% 50%), 0 -2px 0 hsl(284deg 100% 50%), 1px 1px hsl(284deg 100% 50%), -1px -1px 0 hsl(284deg 100% 50%), 1px -1px 0 hsl(284deg 100% 50%), -1px 1px 0 hsl(284deg 100% 50%);
      }
    </style>

    <a href="/">
      <div class="logo">
        <img src="${this.data.image.url}" alt="${this.data.image.alt}" />
        <h1>${this.data.title}</h1>
      </div>
    </a>
    `

    this.shadow.querySelector('a').addEventListener('click', (event) => {
      event.preventDefault()
      window.history.pushState({}, '', '/')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
  }
}

customElements.define('logo-component', Logo)
