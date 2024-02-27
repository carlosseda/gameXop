class socialNetworks extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.socialNetworks = []
  }

  connectedCallback () {
    this.data = this.getAttribute('data') ? JSON.parse(this.getAttribute('data').replaceAll("'", '"')) : null
    this.render()
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

    this.data.forEach(socialNetwork => {
      const socialNetworkContainer = document.createElement('div')
      socialNetworkContainer.classList.add('social-network')

      const socialNetworkLink = document.createElement('a')
      socialNetworkLink.href = socialNetwork.url
      socialNetworkLink.target = '_blank'

      const socialNetworkImage = document.createElement('img')
      socialNetworkImage.src = `${process.env.API_URL}/api/front/image-gallery/image/${socialNetwork.filename}`
      socialNetworkImage.alt = socialNetwork.alt
      socialNetworkImage.title = socialNetwork.title

      socialNetworkLink.appendChild(socialNetworkImage)
      socialNetworkContainer.appendChild(socialNetworkLink)
      socialNetworksContainer.appendChild(socialNetworkContainer)
    })
  }
}

customElements.define('social-networks-component', socialNetworks)
