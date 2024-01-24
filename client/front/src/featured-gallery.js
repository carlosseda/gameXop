class FeaturedGallery extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    this.loadData().then(() => this.render())
  }

  async loadData () {
    this.featured = [
      {
        id: 1,
        path: '/juegos/call-of-duty',
        price: 100,
        priceBeforeDiscount: 120,
        percentage: 40,
        endOfDiscount: '31 de diciembre',
        platforms: ['windows', 'apple'],
        locale: {
          title: 'Minecraft'
        },
        image: {
          url: 'http://localhost:5175/public/minecraft.webp',
          alt: 'Minecraft'
        }
      },
      {
        id: 2,
        path: '/juegos/call-of-duty',
        price: 100,
        priceBeforeDiscount: 120,
        percentage: 60,
        endOfDiscount: '31 de diciembre',
        platforms: ['windows', 'apple'],
        locale: {
          title: 'League of Legends'
        },
        image: {
          url: 'http://localhost:5175/public/league-of-legends.jpg',
          alt: 'League of Legends'
        }
      },
      {
        id: 3,
        path: '/juegos/call-of-duty',
        price: 100,
        priceBeforeDiscount: 120,
        percentage: 30,
        endOfDiscount: '31 de diciembre',
        platforms: ['windows', 'apple'],
        locale: {
          title: 'Clash Royale'
        },
        image: {
          url: 'http://localhost:5175/public/clash-royale.webp',
          alt: 'Clash Royale'
        }
      }
    ]
  }

  render () {
    this.shadow.innerHTML =
    /* html */`
    <style>
      :host {
        height: 40vh;
      }

      .featured-gallery {
        display: flex;
        gap: 1rem;
        height: 100%;
        overflow-x: hidden;
        padding: 0 1%;
        width: 98%;
      }

      .featured-element{
        cursor: pointer;
        height: 40vh;
        overflow: hidden;
        position: relative;
      }

      .featured-element:hover {
        filter: brightness(1.2);
      }
      
      .featured-element:nth-child(1),
      .featured-element:nth-child(3) {
        border-radius: 0.5rem;
        flex: 1;
      }

      .featured-element:nth-child(2) {
        border-radius: 0.5rem;
        flex: 2;
      }

      .featured-image {
        height: 100%;
        overflow: hidden;
        position: absolute;
        width: 100%;
      }

      .featured-image img{
        height: 100%;
        object-fit: cover;
        width: 100%;
      }

      .featured-details {
        background-color: hsl(0, 0%, 0%, 0.7);
        bottom: 5%;
        color: #ffffff;
        display: flex;
        flex-direction: column;
        height: max-content;
        left: 2rem;
        padding: 1rem;
        position: absolute;
      }

      .featured-details h2 {
        font-family: 'Lato', sans-serif;
        font-size: 2rem;
        margin: 0;
        text-align: right;
      }

      .featured-info{
        align-items: center;
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
      }

      .featured-info span{
        color: hsl(0, 0%, 100%);
        font-family: 'Lato', sans-serif;
        font-size: 0.9rem;
      }

      .featured-info .featured-discount-percentage{
        font-size: 2rem;
      }

      .featured-specifications{
        align-items: center;
        display: flex;
        gap: 0.5rem;
        justify-content: space-between;
        width: 100%;
      }

      .featured-price{
        align-items: center;
        background-color: hsl(272 40% 35%);
        display: flex;
        gap: 0.5rem;
        padding: 0.2rem 0.5rem;
        width: max-content;
      }

      .featured-price span{
        color: hsl(0, 0%, 100%);
        font-family: sans-serif;
        font-size: 1.3rem;
      }

      .featured-price span.featured-price-before-discount{
        position: relative;
      }

      .featured-price span.featured-price-before-discount::after{
        box-shadow: 0 0 2px black;
        border-bottom: 2px solid hsl(0, 0%, 100%);
        content: '';
        left: 0px;
        right: 0px;
        position: absolute;
        top: 43%;
        transform: skewY(-8deg);
      }
    </style>

    <div class="featured-gallery"></div>
    `

    const featuredGallery = this.shadow.querySelector('.featured-gallery')

    this.featured.forEach(featured => {
      const featuredElement = document.createElement('a')
      featuredElement.href = featured.path
      featuredElement.className = 'featured-element'
      featuredGallery.appendChild(featuredElement)

      const featuredImageContainer = document.createElement('div')
      featuredImageContainer.classList.add('featured-image')
      const featuredImage = document.createElement('img')
      featuredImage.src = featured.image.url
      featuredImage.alt = featured.image.alt
      featuredImageContainer.appendChild(featuredImage)
      featuredElement.appendChild(featuredImageContainer)

      const featuredDetails = document.createElement('div')
      featuredDetails.classList.add('featured-details')
      featuredElement.appendChild(featuredDetails)

      const featuredInfoContainer = document.createElement('div')
      featuredInfoContainer.classList.add('featured-info')
      const featuredDiscountPercentage = document.createElement('span')
      featuredDiscountPercentage.classList.add('featured-discount-percentage')
      featuredDiscountPercentage.innerText = `- ${featured.percentage}%`
      featuredInfoContainer.appendChild(featuredDiscountPercentage)
      const featuredDiscountEnd = document.createElement('span')
      featuredDiscountEnd.innerText = `hasta el ${featured.endOfDiscount}`
      featuredInfoContainer.appendChild(featuredDiscountEnd)

      const featuredPriceContainer = document.createElement('div')
      featuredPriceContainer.classList.add('featured-price')

      const featuredPriceDiscountContainer = document.createElement('div')
      featuredPriceDiscountContainer.classList.add('featured-price-discount')

      const featuredPriceBeforeDiscount = document.createElement('span')
      featuredPriceBeforeDiscount.classList.add('featured-price-before-discount')
      featuredPriceBeforeDiscount.innerText = `${featured.priceBeforeDiscount} €`
      featuredPriceContainer.appendChild(featuredPriceBeforeDiscount)

      const featuredPrice = document.createElement('span')
      featuredPrice.classList.add('featured-price-after-discount')
      featuredPrice.innerText = `${featured.price} €`
      featuredPriceContainer.appendChild(featuredPrice)

      featuredInfoContainer.appendChild(featuredPriceContainer)

      featuredDetails.appendChild(featuredInfoContainer)

      const featuredTitleContainer = document.createElement('div')
      featuredTitleContainer.classList.add('featured-title')
      const featuredTitle = document.createElement('h2')
      featuredTitle.textContent = featured.locale.title
      featuredTitleContainer.appendChild(featuredTitle)
      featuredDetails.appendChild(featuredTitleContainer)
    })
  }
}

customElements.define('featured-gallery-component', FeaturedGallery)
