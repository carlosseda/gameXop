class Product extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    this.loadData().then(() => this.render())
  }

  async loadData () {
    this.product = {
      id: 1,
      title: 'Call of Duty Modern Warfare 3',
      description: `
        Consigue puntos Call of Duty®* y contenido de juego en Call of Duty®: Modern Warfare® III y Call of Duty®: Warzone™.<br>
        <br>
        La oferta incluye:<br>
        <br>
        - Pase de batalla de la Temporada 1<br>
        - 20 omisiones de nivel de ficha de batalla<br>
        <br>
        Exclusivo sector de BlackCell en el mapa de batalla:<br>
        <br>
        - 1100 puntos Call of Duty®<br>
        - Operador de BlackCell<br>
        - Proyecto de arma<br>
        - Remate<br>
        - Aspecto de vehículo BlackCell<br>
        <br>
        - Bonus de BlackCell de regalo con 10 aspectos de operador alternativos adicionales y 6 proyectos de arma con trazadoras.<br>
        <br>
        Activision puede actualizar, sustituir o eliminar este contenido del juego en cualquier momento.`,
      price: 100,
      priceBeforeDiscount: 120,
      category: 'Shooter',
      platforms: ['windows', 'apple'],
      releaseDate: '8 de noviembre de 2011',
      developer: 'Infinity Ward',
      thumbnails: [
        {
          url: 'http://localhost:5173/public/call-of-duty-gameplay.jpg',
          alt: 'Call of Duty',
          cover: 'http://localhost:5173/public/call-of-duty-gameplay.jpg'
        },
        {
          url: 'http://localhost:5173/public/call-of-duty-gameplay-2.jpg',
          alt: 'Call of Duty',
          cover: 'http://localhost:5173/public/call-of-duty-gameplay-2.jpg'
        }
      ],
      video: {
        url: 'http://localhost:5173/public/call-of-duty.webm',
        alt: 'Call of Duty',
        cover: 'http://localhost:5173/public/call-of-duty-modern-warfare-3-xl.jpg'
      }
    }
  }

  render () {
    this.shadow.innerHTML =
    /* html */`
    <style>
      .product {
        display: flex;
        justify-content: center;
        gap: 3rem;
        min-height: 80vh;
        margin: 0 auto;
        max-width: 1400px;
        padding: 2% 5%;
      }

      .product-media{
        display: flex;
        flex-direction: column;
        gap: 1rem;
        min-width: 50%;
        max-width: 50%;
      }

      .product-media-cover{
        align-items: center;
        border-radius: 1rem;
        display: flex;
        height: 70vh;
        overflow: hidden;
      }

      .product-media-cover img{
        object-fit: cover;
        height: 100%;
        width: 100%;
      }

      .product-media-cover video{
        object-fit: cover;
        height: 100%;
        width: 100%;
      }

      .product-media-thumbnails{
        display: flex;
        gap: 1rem;
      }

      .product-media-thumbnails-item{
        align-items: center;
        border-radius: 1rem;
        cursor: pointer;
        display: flex;
        height: 10vh;
        justify-content: center;
        overflow: hidden;
        position: relative;
        width: 10vh;
      }

      .product-media-thumbnails-item img{
        object-fit: cover;
        height: 100%;
        position: absolute;
        width: 100%;
        z-index: 1000;
      }

      .product-media-thumbnails-item .play-icon{
        border-bottom: 1rem solid transparent;
        border-top: 1rem solid transparent;
        border-left: 1.5rem solid hsl(0, 0%, 100%);
        height: 0;
        position: absolute;
        width: 0;
        z-index: 1001;
      }

      .product-info{
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 2rem;
        min-width: 50%;
      }

      .platforms{
        display: flex;
        gap: 0.5rem;
      }

      .platforms img{
        height: 1.5rem;
        width: 1.5rem;
      }

      .product-header{
        align-items: center;
        display: flex;
        height: 10%;
        justify-content: space-between;
      }

      .product-header h2{
        color: hsl(0, 0%, 100%);
        font-family: 'Lato', sans-serif;
        font-size: 2rem;
        font-weight: 700;
        margin: 0;
      }

      .product-box{
        align-items: end;
        background-color: hsl(236 55% 25%);
        display: flex;
        height: 20%;
        justify-content: space-between;
        padding: 2rem 1rem;
      }

      .product-specifications{
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 1rem;
      }

      .product-specifications-item{
        display: flex;
        justify-content: space-between;
      }

      .product-specifications-item span{
        color: hsl(0, 0%, 100%);
        font-family: 'Lato', sans-serif;
        font-size: 1rem;
        font-weight: 400;
        margin: 0;
      }

      .product-buy{
        align-items: end;
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: flex-end;
      }

      .product-price{
        align-items: center;
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
      }

      .product-price span{
        color: hsl(0, 0%, 100%);
        font-family: sans-serif;
        font-size: 1.5rem;
        font-weight: 400;
        margin: 0;
      }

      .product-price-before-discount{
        position: relative;
      }

      .product-price-before-discount::after{
        box-shadow: 0 0 2px black;
        border-bottom: 2px solid hsl(0, 0%, 100%);
        content: '';
        left: 0px;
        right: 0px;
        position: absolute;
        top: 43%;
        transform: skewY(-8deg);
      }

      .product-buy button{
        background-color: hsl(272 40% 35%);
        border: none;
        border-radius: 0.5rem;
        color: hsl(0, 0%, 100%);
        cursor: pointer;
        font-family: 'Lato', sans-serif;
        font-size: 1rem;
        margin-top: 1rem;
        padding: 0.5rem 1rem;
      }

      .product-buy button.disabled{
        background-color: hsl(0, 0%, 50%);
        cursor: not-allowed;
      }

      .product-buy button:hover {
        filter: brightness(1.2);
      }

      .product-body{
        height: 70%;
        padding: 1rem 0;
      }

      .product-body p {
        color: hsl(0, 0%, 100%);
        font-family: 'Lato', sans-serif;
        font-size: 1rem;
        font-weight: 400;
        margin: 0;
      }
    </style>

    <div class="product">
      <div class="product-media">
        <div class="product-media-cover"></div>
        <div class="product-media-thumbnails"></div>
      </div>
      <div class="product-info">
        <div class="product-header">
          <h2>${this.product.title}</h2>
        </div>
        <div class="product-box">
          <div class="product-specifications">
            <div class="product-specifications-item">
              <span>Categoría:</span>
              <span>${this.product.category}</span>
            </div>
            <div class="product-specifications-item">
              <span>Lanzamiento:</span>
              <span>${this.product.releaseDate}</span>
            </div>
            <div class="product-specifications-item">
              <span>Desarrollador:</span>
              <span>${this.product.developer}</span>
            </div>
            <div class="product-specifications-item">
              <span>Plataforma:</span>
              <div class="platforms"></div>
            </div>
          </div>
          <div class="product-buy">
            <div class="product-price">
              ${this.product.priceBeforeDiscount ? `<span class="product-price-before-discount">${this.product.priceBeforeDiscount} €</span>` : ''}
              <span>${this.product.price} €</span>
            </div>
            <button class="add-to-cart" data-product="${this.product.id}">Añadir al carrito</button>
          </div>
        </div>
        <div class="product-body">
          <p>${this.product.description}</p>
        </div>
      </div>
    </div>
    `

    const cart = JSON.parse(localStorage.getItem('cart'))

    if (cart && cart.includes(this.product.id)) {
      this.shadow.querySelector('.add-to-cart').classList.add('disabled')
      this.shadow.querySelector('.add-to-cart').disabled = true
    }

    if (this.product.video) {
      const videoElement = document.createElement('video')
      videoElement.autoplay = true
      videoElement.muted = true
      videoElement.controls = true
      videoElement.poster = this.product.video.cover

      const sourceElement = document.createElement('source')
      sourceElement.src = this.product.video.url
      sourceElement.type = 'video/webm'
      videoElement.appendChild(sourceElement)

      this.shadow.querySelector('.product-media-cover').appendChild(videoElement)

      const thumbnailElement = document.createElement('div')
      thumbnailElement.classList.add('product-media-thumbnails-item')

      const playIcon = document.createElement('div')
      playIcon.classList.add('play-icon')
      thumbnailElement.appendChild(playIcon)

      const imageElement = document.createElement('img')
      imageElement.dataset.cover = this.product.video.cover
      imageElement.src = this.product.video.cover
      imageElement.alt = this.product.video.alt
      thumbnailElement.appendChild(imageElement)

      this.shadow.querySelector('.product-media-thumbnails').appendChild(thumbnailElement)
    } else {
      const coverImage = document.createElement('img')
      coverImage.src = this.product.thumbnails[0].cover
      coverImage.alt = this.product.thumbnails[0].alt
      this.shadow.querySelector('.product-media-cover').appendChild(coverImage)
    }

    this.product.thumbnails.forEach(thumbnail => {
      const thumbnailElement = document.createElement('div')
      thumbnailElement.classList.add('product-media-thumbnails-item')
      const imageElement = document.createElement('img')
      imageElement.dataset.cover = thumbnail.cover
      imageElement.src = thumbnail.url
      imageElement.alt = thumbnail.alt
      thumbnailElement.appendChild(imageElement)
      this.shadow.querySelector('.product-media-thumbnails').appendChild(thumbnailElement)
    })

    this.product.platforms.forEach(platform => {
      const platformElement = document.createElement('img')
      platformElement.src = `http://localhost:5173/public/${platform}.svg`
      platformElement.alt = platform
      this.shadow.querySelector('.platforms').appendChild(platformElement)
    })

    this.shadow.querySelector('.product').addEventListener('click', event => {
      if (event.target.closest('.add-to-cart')) {
        event.target.closest('.add-to-cart').classList.add('disabled')
        event.target.closest('.add-to-cart').disabled = true
        const productId = event.target.dataset.product

        document.dispatchEvent(new CustomEvent('addToCart', {
          detail: {
            productId
          }
        }))
      }

      if (event.target.closest('.product-media-thumbnails-item')) {
        if (event.target.closest('.product-media-thumbnails-item').querySelector('.play-icon')) {
          const videoElement = document.createElement('video')
          videoElement.autoplay = true
          videoElement.muted = true
          videoElement.controls = true
          videoElement.poster = this.product.video.cover

          const sourceElement = document.createElement('source')
          sourceElement.src = this.product.video.url
          sourceElement.type = 'video/webm'
          videoElement.appendChild(sourceElement)

          this.shadow.querySelector('.product-media-cover').innerHTML = ''
          this.shadow.querySelector('.product-media-cover').appendChild(videoElement)
        } else {
          const coverImage = document.createElement('img')
          coverImage.src = event.target.dataset.cover
          coverImage.alt = event.target.alt
          this.shadow.querySelector('.product-media-cover').innerHTML = ''
          this.shadow.querySelector('.product-media-cover').appendChild(coverImage)
        }
      }
    })
  }
}

customElements.define('product-component', Product)
