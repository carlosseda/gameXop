class Cart extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.uuid = null
    this.fingerprint = null
  }

  async connectedCallback () {
    if (!document.setFingerprint) {
      document.addEventListener('setFingerprint', this.handleSetFingerprint.bind(this))
      document.setFingerprint = true
    }

    if (!document.addToCart) {
      document.addEventListener('addToCart', this.handleAddToCart.bind(this))
      document.addToCart = true
    }

    if (!localStorage.getItem('cartUuid')) {
      const json = {
        fingerprint: this.fingerprint
      }

      const response = {
        uuid: '051e7702-1366-4fe9-8661-fac78acf3480'
      }

      this.uuid = response.uuid
      localStorage.setItem('cartUuid', this.uuid)
    } else {
      this.uuid = localStorage.getItem('cartUuid')
    }
  }

  async handleSetFingerprint (event) {
    this.fingerprint = event.detail.fingerprint
    this.loadData().then(() => this.render())
  }

  async handleAddToCart (event) {
    this.shadow.querySelector('.overlay').classList.toggle('active')
    this.shadow.querySelector('.cart').classList.toggle('active')
    document.body.classList.toggle('block-scroll')
    this.shadow.querySelector('.waiting').classList.add('active')

    const json = {
      productId: event.detail.productId,
      cartUuid: JSON.parse(localStorage.getItem('cartUuid'))
    }

    setTimeout(() => {
      const response = {
        id: 7,
        productId: 1,
        path: '/juegos/call-of-duty',
        title: 'Producto 7',
        price: 100,
        priceBeforeDiscount: 120,
        image: {
          url: 'https://picsum.photos/50/50',
          alt: 'Producto 1'
        }
      }

      if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]))
      }

      const cart = JSON.parse(localStorage.getItem('cart'))
      cart.push(response.productId)
      localStorage.setItem('cart', JSON.stringify(cart))

      this.products.push(response)
      this.shadow.querySelector('.waiting').classList.remove('active')
      this.render('active')
    }, 1000)
  }

  async loadData () {
    this.products = [
      {
        id: 1,
        path: '/juegos/call-of-duty',
        title: 'Producto 1',
        price: 30,
        priceBeforeDiscount: 40,
        image: {
          url: 'https://picsum.photos/50/50',
          alt: 'Producto 1'
        }
      },
      {
        id: 2,
        path: '/juegos/call-of-duty',
        title: 'Producto 2',
        price: 30,
        image: {
          url: 'https://picsum.photos/50/50',
          alt: 'Producto 2'
        }
      },
      {
        id: 3,
        path: '/juegos/call-of-duty',
        title: 'Producto 3',
        price: 30,
        image: {
          url: 'https://picsum.photos/50/50',
          alt: 'Producto 3'
        }
      },
      {
        id: 4,
        path: '/juegos/call-of-duty',
        title: 'Producto 4',
        price: 30,
        priceBeforeDiscount: 40,
        image: {
          url: 'https://picsum.photos/50/50',
          alt: 'Producto 4'
        }
      },
      {
        id: 5,
        path: '/juegos/call-of-duty',
        title: 'Producto 5',
        price: 30,
        image: {
          url: 'https://picsum.photos/50/50',
          alt: 'Producto 5'
        }
      },
      {
        id: 6,
        path: '/juegos/call-of-duty',
        title: 'Producto 6',
        price: 30,
        image: {
          url: 'https://picsum.photos/50/50',
          alt: 'Producto 6'
        }
      }
    ]
  }

  render (open = null) {
    this.shadow.innerHTML =
    /* html */`
    <style>
      :host{
        justify-self: flex-end;
      }

      .cart-button{
        background: transparent;
        border: none;
        cursor: pointer;
      }

      .cart-button svg{
        fill: hsl(0, 0%, 100%);
        height: 2rem;
        width: 2rem;
      }

      .cart-button.active svg{
        fill: hsl(120 91% 40%)
      }

      .overlay{
        background-color: rgba(0, 0, 0, 0.4);
        bottom: 0;
        cursor: pointer;
        left: 0;
        position: fixed;
        right: 0;
        top: 0;
        visibility: hidden;
        z-index: -1;
      }

      .overlay.active{
        visibility: visible;
        z-index: 1000;
      }

      .cart{
        background-color: hsl(0, 0%, 100%);
        min-height: 100vh;
        max-height: 100vh;
        opacity: 0;
        position: fixed;
        right: -300px;
        transition: right 0.2s ease-in-out, opacity 0.2s ease-in-out;
        top: 0;
        width: 300px;
        z-index: 1001;
      }

      .cart.active{
        right: 0;
        opacity: 1;
      }

      .cart-header{
        align-items: center;
        background-color: hsl(236 55% 25%);
        display: flex;
        justify-content: space-between;
        padding: 0.5rem;
      }

      .cart-header h4{
        color: hsl(0, 0%, 100%);
        font-family: 'Lato', sans-serif;
        font-size: 1rem;
        font-weight: 400;
        margin: 0;
      }

      .close-button{
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0;
      }

      .close-button svg{
        height: 1.5rem;
        width: 1.5rem;
      }

      .close-button svg path{
        fill: hsl(0, 0%, 100%);
      }

      .cart-no-products{
        display: none;
      }

      .cart-no-products.active{
        display: block;
      }

      .cart-no-products p{
        font-family: 'Lato', sans-serif;
        font-size: 1rem;
        font-weight: 700;
        margin: 0;
        text-align: center;
      }

      .cart-products{
        display: flex;
        flex-direction: column;
        max-height: 75vh;
        overflow-y: auto;
        padding: 1rem 0.5rem;
      }

      .cart-product{
        align-items: self-start;
        border-bottom: 1px solid hsl(0 1.5% 80%);
        display: grid;
        grid-template-columns: 1fr 2fr 1fr;
        gap: 0.2rem;
        opacity: 1;
        padding: 1rem 0;
        transition: opacity 0.2s ease-in-out;
      }

      .cart-product.removing{
        opacity: 0;
      }

      .cart-product:last-child{
        border-bottom: none;
      }

      .cart-product img{
        border-radius: 0.5rem;
      }

      .cart-product a{
        color: hsl(0, 0%, 0%);
        text-decoration: none;
      }

      .cart-product a:hover{
        color: hsl(314 88% 55%)
      }

      .cart-product h5{
        font-family: 'Lato', sans-serif;
        margin: 0;
      }

      .cart-product span{
        font-family: sans-serif;
        font-size: 0.8rem;
        margin: 0;
        margin-right: 0.5rem;
      }

      .cart-product span.product-price-before-discount{
        color: hsl(0, 0%, 40%);
        text-decoration: line-through;
      }

      .cart-product .remove-button{
        background: transparent;
        border: none;
        cursor: pointer;
        margin-left: auto;
        padding: 0;
        width: max-content;
      }

      .remove-button svg{
        fill: hsl(0, 0%, 0%);
        height: 1rem;
        width: 1rem;
      }

      .cart-footer{
        border-top: 1px dotted hsl(0 1.5% 80%);
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        visibility: hidden;
      }

      .cart-footer.active{
        visibility: visible;
      }

      .cart-footer-group{
        align-items: center;
        display: flex;
        justify-content: space-between;
      }

      .cart-footer-group p{
        color: hsl(0 1.5% 40%);
        font-family: 'Lato', sans-serif;
        font-size: 0.8rem;
        font-weight: 600;
        margin: 0;
      }

      .cart-footer-group span{
        font-family: sans-serif;
        font-weight: 700;
        margin-left: 0.5rem;
      }

      .cart-footer-group span.total{
        font-size: 1.3rem;
      }

      .checkout-button{
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

      .checkout-button:hover {
        filter: brightness(1.2);
      }

      .waiting{
        align-items: center;
        background-color: hsl(0, 0%, 100%, 0.5);
        bottom: 0;
        display: flex;
        justify-content: center;
        left: 0;
        opacity: 0;
        position: absolute;
        right: 0;
        top: 0;
        transition: opacity 0.2s ease-in-out;
        visibility: hidden;
        z-index: -1;
      }

      .waiting.active{
        opacity: 1;
        visibility: visible;
        z-index: 1001;
      }

      .loading-outer {
        align-items: center;
        animation: rotate-outer 1.5s linear infinite forwards;
        border: 5px solid hsl(284deg 100% 50%);
        border-left-color: transparent;
        border-right-color: transparent;
        border-radius: 50%;
        display: flex;
        height: 70px;
        justify-content: center;
        position: relative;
        width: 70px;
      }

      .loading-outer .loading-inner {
        animation: rotate-inner 1.5s linear infinite forwards;
        border: 5px solid hsl(284deg 100% 50%);
        border-top-color: transparent;
        border-bottom-color: transparent;
        border-radius: inherit;
        height: 0px;
        position: absolute;
        width: 40px;
      }

      @keyframes rotate-outer {
        50%{
          transform: rotate(200deg);
        }
      }

      @keyframes rotate-inner {
        50%{
          transform: rotate(-400deg);
        }
      }
    </style>

    <div class="cart-container">
      <button class="cart-button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17,18A2,2 0 0,1 19,20A2,2 0 0,1 17,22C15.89,22 15,21.1 15,20C15,18.89 15.89,18 17,18M1,2H4.27L5.21,4H20A1,1 0 0,1 21,5C21,5.17 20.95,5.34 20.88,5.5L17.3,11.97C16.96,12.58 16.3,13 15.55,13H8.1L7.2,14.63L7.17,14.75A0.25,0.25 0 0,0 7.42,15H19V17H7C5.89,17 5,16.1 5,15C5,14.65 5.09,14.32 5.24,14.04L6.6,11.59L3,4H1V2M7,18A2,2 0 0,1 9,20A2,2 0 0,1 7,22C5.89,22 5,21.1 5,20C5,18.89 5.89,18 7,18M16,11L18.78,6H6.14L8.5,11H16Z" /></svg>
      </button>

      <div class="overlay ${open}">
      </div>

      <div class="cart ${open}">
        <div class="cart-header">
          <h4>Carrito</h4>
          <button class="close-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg>
          </button>
        </div>
        <div class="cart-products"></div>
        <div class="cart-no-products  ${this.products.length == 0 ? 'active' : ''}">
          <p>No hay productos en el carrito</p>
        </div>
        <div class="cart-footer ${this.products.length > 0 ? 'active' : ''}">
          <div class="cart-footer-group">
            <p>Juegos adquiridos</p>
            <span>${this.products.length}</span>
          </div>
          <div class="cart-footer-group">
            <p>Total (IVA incluido)</p>
            <span class="total">${this.products.reduce((total, product) => total + product.price, 0)}€</span>
          </div>

          <button class="checkout-button">
            Finalizar compra
          </button>
        </div>
        <div class="waiting">
          <div class="loading-outer">
            <div class="loading-inner"></div>
          </div>
        </div>
      </div>
    </div>
    `

    if (this.products.length > 0) {
      this.shadow.querySelector('.cart-button').classList.add('active')
    }

    this.products.forEach(product => {
      const productElement = document.createElement('div')
      productElement.classList.add('cart-product')

      const productImage = document.createElement('img')
      productImage.setAttribute('src', product.image.url)
      productImage.setAttribute('alt', product.image.alt)

      const productInfo = document.createElement('div')
      productInfo.classList.add('product-info')

      const productLink = document.createElement('a')
      productLink.setAttribute('href', product.path)
      productLink.target = '_blank'

      const productTitle = document.createElement('h5')
      productTitle.textContent = product.title
      productLink.appendChild(productTitle)

      const productPrice = document.createElement('span')
      productPrice.classList.add('product-price')
      const productPriceBeforeDiscount = document.createElement('span')
      productPriceBeforeDiscount.classList.add('product-price-before-discount')

      productPrice.textContent = `${product.price}€`

      if (product.priceBeforeDiscount) {
        productPriceBeforeDiscount.textContent = `${product.priceBeforeDiscount}€`
      }

      const productButton = document.createElement('button')
      productButton.classList.add('remove-button')
      productButton.dataset.id = product.id
      productButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg>'

      productElement.appendChild(productImage)
      productInfo.appendChild(productLink)

      if (product.priceBeforeDiscount) {
        productInfo.appendChild(productPriceBeforeDiscount)
      }

      productInfo.appendChild(productPrice)
      productElement.appendChild(productInfo)
      productElement.appendChild(productButton)

      this.shadow.querySelector('.cart-products').appendChild(productElement)
    })

    this.shadow.querySelector('.cart-container').addEventListener('click', event => {
      if (event.target.closest('.cart-button') || event.target.closest('.close-button') || event.target.closest('.overlay')) {
        this.shadow.querySelector('.overlay').classList.toggle('active')
        this.shadow.querySelector('.cart').classList.toggle('active')
        document.body.classList.toggle('block-scroll')
      }

      if (event.target.closest('.remove-button')) {
        const id = parseInt(event.target.closest('.remove-button').dataset.id)
        this.shadow.querySelector('.waiting').classList.add('active')

        setTimeout(() => {
          this.products = this.products.filter(product => product.id !== id)
          this.shadow.querySelector('.waiting').classList.remove('active')
          this.render('active')
        }, 1000)
      }

      if (event.target.closest('.checkout-button')) {
        this.shadow.querySelector('.overlay').classList.toggle('active')
        this.shadow.querySelector('.cart').classList.toggle('active')

        document.dispatchEvent(new CustomEvent('openCheckout', {
          detail: {
            products: this.products
          }
        }))
      }
    })
  }
}

customElements.define('cart-component', Cart)
