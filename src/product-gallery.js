class ProductGallery extends HTMLElement {

  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  async connectedCallback () {
    document.addEventListener('filterByCategory', this.handleFilterByCategory.bind(this))
    this.loadData().then(() => this.render())
  }

  handleFilterByCategory (event) {
    const categoryId = event.detail.categoryId;
    const products = categoryId === "null" ? this.products : this.products.filter(product => product.categoryId === Number(categoryId));
    this.render(products);
  }

  async loadData () {
    
    this.products = [
      {
        id: 1,
        path: "/juegos/call-of-duty",
        title: "Call of Duty Modern Warfare 3",
        categoryId: 1,
        price: 100,
        priceBeforeDiscount: 120,
        percentage: 20,
        endOfDiscount: "31 de diciembre",
        image: {
          url: "http://localhost:5173/public/call-of-duty.jpg",
          alt: "Call of Duty"
        }
      },
      {
        id: 2,
        path: "/juegos/payday-3",
        title: "Payday 3",
        categoryId: 1,
        price: 100,
        image: {
          url: "http://localhost:5173/public/payday-3.jpg",
          alt: "Payday 3"
        }
      },
      {
        id: 3,
        path: "/juegos/persona-5",
        title: "Persona 5",
        categoryId: 2,
        price: 100,
        image: {
          url: "http://localhost:5173/public/persona-5.jpg",
          alt: "Persona 5"
        }
      },
      {
        id: 4,
        path: "/juegos/red-dead-redemption-2",
        title: "Red Dead Redemption 2",
        categoryId: 2,
        price: 100,
        image: {
          url: "http://localhost:5173/public/red-dead.jpg",
          alt: "Red Dead Redemption 2"
        }
      },
      {
        id: 5,
        path: "/juegos/starfield",
        title: "Starfield",
        categoryId: 3,
        price: 100,
        image: {
          url: "http://localhost:5173/public/starfield.jpg",
          alt: "Starfield"
        }
      },
      {
        id: 6,
        path: "/juegos/street-fighter-6",
        title: "Street Fighter 6",
        categoryId: 3,
        price: 100,
        image: {
          url: "http://localhost:5173/public/street-fighter.jpg",
          alt: "Street Fighter 6"
        }
      }
    ];
  }

  render (products = this.products) {
    this.shadow.innerHTML =
    /*html*/`
    <style>
      a{
        text-decoration: none;
      }

      .product-gallery {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 1rem;
        overflow-x: auto;
        scroll-behavior: smooth;
        -ms-overflow-style: none;  
        padding: 0 1rem;
        scrollbar-width: none;  
      }

      .product {
        align-items: center;
        border-radius: 0.5rem;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: center;
        overflow: hidden;
      }

      .product:hover {
        filter: brightness(1.2);
      }

      .product-title {
        align-items: center;
        background-color: hsl(0, 0%, 0%);
        display: flex;
        gap: 0.5rem;
        height: 5vh;
        justify-content: center;
        padding: 0.5rem 10%;
        width: 80%;
      }

      .product-title h2 {
        color: hsl(0, 0%, 100%);
        font-family: 'Ubuntu', sans-serif;
        font-size: 1.2rem;
        font-weight: 700;
        margin: 0;
        text-align: center;
      }

      .product .product-media-cover{
        height: 40vh;
        position: relative;
        width: 100%;
      }

      .product .product-media-cover .image,
      .product .product-media-cover .video {
        displaY: flex;
        height: 100%;
        position: absolute;
        width: 100%;
      }

      .product .product-media-cover .image img,
      .product .product-media-cover .video video {
        height: 100%;
        object-fit: cover;
        width: 100%;
      }

      .product-details {
        align-items: flex-end;
        background-color: hsl(0, 0%, 0%);
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        justify-content: flex-end;
        height: 5vh;
        padding: 1rem 5%;
        width: 90%;
      }

      .product-info span{
        color: hsl(0, 0%, 100%);
        font-family: 'Ubuntu', sans-serif;
        font-size: 0.9rem;
      }

      .product-price{
        align-items: center;
        background-color: hsl(272 40% 35%);
        display: flex;
        gap: 0.5rem;
        padding: 0 0.5rem;
        width: max-content;
      }

      .product-price span{
        color: hsl(0, 0%, 100%);
        font-family: 'Ubuntu', sans-serif;
        font-size: 1rem;
      }

      .product-price span.product-discount-percentage{
        font-size: 1.5rem;
      }

      .product-price span.product-price-before-discount{
        text-decoration: line-through;
      }

      .product-price span.product-price{
        font-size: 1.5rem;
      }
    </style>

    <div class="product-gallery"></div>
    `

    products.forEach(product => {
      const productElementLink = document.createElement('a')
      productElementLink.href = product.path

      const productElement = document.createElement('div')
      productElementLink.appendChild(productElement)
     
      productElement.classList.add('product')
      productElement.dataset.endpoint = product.id
      productElement.dataset.categoryId = product.categoryId

      const productTitleContainer = document.createElement('div')
      productTitleContainer.classList.add('product-title')

      const productTitle = document.createElement('h2')
      productTitle.innerHTML = product.title

      productTitleContainer.appendChild(productTitle)
      productElement.appendChild(productTitleContainer)

      const productMediaCover = document.createElement('div')
      productMediaCover.classList.add('product-media-cover')

      const imageContainer = document.createElement('div')
      imageContainer.classList.add('image')

      const productImageElement = document.createElement('img')
      productImageElement.src = product.image.url
      productImageElement.alt = product.image.alt
      imageContainer.appendChild(productImageElement)
      productMediaCover.appendChild(imageContainer)
      productElement.appendChild(productMediaCover)

      const productDetails = document.createElement('div')
      productDetails.classList.add('product-details')

      if(product.priceBeforeDiscount){

        const productInfoContainer = document.createElement('div')
        productInfoContainer.classList.add('product-info')

        const productDiscountEnd = document.createElement('span')
        productDiscountEnd.innerText = `Oferta hasta el ${product.endOfDiscount}`;
        productInfoContainer.appendChild(productDiscountEnd)

        productDetails.appendChild(productInfoContainer)

        const productPriceContainer = document.createElement('div')
        productPriceContainer.classList.add('product-price')

        const productDiscountPercentage = document.createElement('span')
        productDiscountPercentage.classList.add('product-discount-percentage')
        productDiscountPercentage.innerText = `- ${product.percentage}%`

        productPriceContainer.appendChild(productDiscountPercentage)

        const productPriceDiscountContainer = document.createElement('div')
        productPriceDiscountContainer.classList.add('product-price-discount')

        const productPriceBeforeDiscount = document.createElement('span')
        productPriceBeforeDiscount.classList.add('product-price-before-discount')
        productPriceBeforeDiscount.innerText = `${product.priceBeforeDiscount} €`
        productPriceContainer.appendChild(productPriceBeforeDiscount)

        const productPrice = document.createElement('span')
        productPrice.classList.add('product-price-after-discount')
        productPrice.innerText = `${product.price} €`
        productPriceContainer.appendChild(productPrice)

        productDetails.appendChild(productPriceContainer)

      }else{

        const productPriceContainer = document.createElement('div')
        productPriceContainer.classList.add('product-price')
        
        const productPrice = document.createElement('span')
        productPrice.classList.add('product-price')
        productPrice.innerText = `${product.price} €`
        productPriceContainer.appendChild(productPrice)

        productDetails.appendChild(productPriceContainer)
      }

      productElement.appendChild(productDetails)
      this.shadow.querySelector('.product-gallery').appendChild(productElementLink)

      productElementLink.addEventListener('click', event => {
        event.preventDefault()
        window.history.pushState({}, '', product.path)
        window.dispatchEvent(new Event('popstate'))
      })

      productElementLink.addEventListener('mouseenter', event => {
        this.loadPreview(event.target)
      })

      productElementLink.addEventListener('mouseleave', event => {
        this.shadow.querySelector('.product-media-cover .video').remove()
      })
    })
  }

  async loadPreview (element) {  

    this.video = {
      url: "http://localhost:5173/public/call-of-duty.webm",
      alt: "Call of Duty",
      cover: "http://localhost:5173/public/call-of-duty-modern-warfare-3-xl.jpg"
    }

    const videoElement = document.createElement('video')
    videoElement.autoplay = true
    videoElement.muted = true

    const sourceElement = document.createElement('source')
    sourceElement.src = this.video.url
    sourceElement.type = 'video/webm'
    videoElement.appendChild(sourceElement)

    const videoContainer = document.createElement('div')
    videoContainer.classList.add('video')
    videoContainer.appendChild(videoElement)
    element.querySelector('.product-media-cover').appendChild(videoContainer)
  }
}

customElements.define('product-gallery-component', ProductGallery)