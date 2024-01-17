class socialNetworks extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    this.loadData().then(() => this.render())
  }

  async loadData () {
    this.socialNetworks = [
      {
        socialNetwork: 'Facebook',
        url: 'https://www.facebook.com/game_xop',
        image: {
          url: 'http://localhost:5173/public/facebook.svg',
          alt: 'Logo de Facebook'
        }
      },
      {
        socialNetwork: 'Instagram',
        url: 'https://www.instagram.com/game_xop',
        image: {
          url: 'http://localhost:5173/public/instagram.svg',
          alt: 'Logo de Instagram'
        }
      },
      {
        socialNetwork: 'Twitter',
        url: 'https://twitter.com/game_xop',
        image: {
          url: 'http://localhost:5173/public/twitter.svg',
          alt: 'Logo de Twitter'
        }
      },
      {
        socialNetwork: 'TikTok',
        url: 'https://www.tiktok.com/game_xop',
        image: {
          url: 'http://localhost:5173/public/tiktok.svg',
          alt: 'Logo de TikTok'
        }
      }
    ]
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
      socialNetworkImage.src = socialNetwork.image.url
      socialNetworkImage.alt = socialNetwork.image.alt

      socialNetworkLink.appendChild(socialNetworkImage)
      socialNetworkContainer.appendChild(socialNetworkLink)
      socialNetworksContainer.appendChild(socialNetworkContainer)
    })
  }
}

customElements.define('social-networks-component', socialNetworks)
