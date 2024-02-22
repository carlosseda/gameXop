class socialNetworks extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.socialNetworks = []
  }

  connectedCallback () {
    this.loadData().then(() => this.render())
  }

  async loadData () {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/front/social-networks`)

    if (response.ok) {
      this.socialNetworks = await response.json()
    } else {
      console.log(response)
    }
  }

  render () {
    this.shadow.innerHTML =
    /* html */`
    <style>
      img {
        filter: hue-rotate(90deg);
        width: 100%;
      }
      .social-networks-container{
        display: grid;
        grid-template-columns: repeat(4, 100px);
        justify-content: center;
        align-items: center;
        margin: 2rem 0;
      }

      .social-network {
        margin: 0 1rem;
      }
    </style>

    <div class="social-networks-container"></div>
    `

    const socialNetworksContainer = this.shadow.querySelector('.social-networks-container')

    this.socialNetworks.forEach(socialNetwork => {
      const socialNetworkContainer = document.createElement('div')
      socialNetworkContainer.classList.add('social-network')

      const socialNetworkLink = document.createElement('a')
      socialNetworkLink.href = socialNetwork.url
      socialNetworkLink.target = '_blank'

      const socialNetworkImage = document.createElement('img')
      socialNetworkImage.src = `${import.meta.env.VITE_API_URL}/api/admin/image-gallery/image/${socialNetwork.filename}`
      socialNetworkImage.alt = socialNetwork.alt
      socialNetworkImage.title = socialNetwork.title

      socialNetworkLink.appendChild(socialNetworkImage)
      socialNetworkContainer.appendChild(socialNetworkLink)
      socialNetworksContainer.appendChild(socialNetworkContainer)
    })
  }
}

customElements.define('social-networks-component', socialNetworks)
