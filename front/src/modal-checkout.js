class ModalCheckout extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    this.loadData()

    if (!document.openCheckoutEvent) {
      document.addEventListener('openCheckout', this.handleOpenCheckout.bind(this))
      document.openCheckoutEvent = true
    }
  }

  async handleOpenCheckout (event) {
    this.products = event.detail.products
    await this.render()
    this.shadow.querySelector('.overlay').classList.add('active')
  }

  loadData () {
    this.paymentMethods = [
      {
        name: 'stripe',
        configuration: {
          publicKey: 'pk_test_5'
        }
      },
      {
        name: 'tarjeta',
        configuration: {
          publicKey: 'pk_test_5'
        }
      }
    ]
  }

  render () {
    this.shadow.innerHTML =
    /* html */`
    <style>
      .overlay {
        background-color: rgba(0, 0, 0, .5);
        bottom: 0;
        left: 0;
        opacity: 0;
        position: fixed;
        right: 0;
        top: 0;
        visibility: hidden;
        z-index: -1;
      }

      .overlay.active{
        opacity: 1;
        visibility: visible;
        z-index: 1000;
      }

      .modal {
        background-color: #fff;
        border-radius: 1rem;
        box-shadow: 0 0 10px rgba(0, 0, 0, .3);
        display: flex;
        flex-direction: column;
        height: 80%;
        left: 50%;
        overflow: hidden;
        position: relative;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 40%;
        z-index: 1001;
      }

      .modal-header {
        align-items: center;
        background-color: hsl(236 55% 25%);
        display: flex;
        justify-content: space-between;
        padding: 1rem 2rem;
      }

      .modal-header h4 {
        color: hsl(0, 0%, 100%);
        font-family: 'Lato', sans-serif;
        font-size: 1.2rem;
        font-weight: 400;
        margin: 0;
      }

      .modal-header .close-button {
        background-color: transparent;
        border: 0;
        cursor: pointer;
        padding: 0;
      }

      .modal-header .close-button svg {
        height: 1.5rem;
        width: 1.5rem;
      }

      .modal-header .close-button svg path {
        fill: hsl(0, 0%, 100%);
      }

      .modal-header .back-step {
        background-color: transparent;
        border: 0;
        cursor: pointer;
        display: none;
        padding: 0;
        position: absolute;
        left: 1rem;
        top: 1rem;
      }

      .modal-header .back-step.active {
        display: block;
      }

      .modal-header .back-step svg {
        fill: hsl(0, 0%, 0%);
        height: 1.5rem;
        width: 1.5rem;
      }

      .modal-body {
        height: 100%;
        max-width: 100%;
        width: 100%;
      }

      .steps {
        display: flex;
        height: 100%;
        max-width: 100%;
        width: 100%;
        overflow-x: scroll;
        scroll-behavior: smooth;
        -ms-overflow-style: none;  
        scrollbar-width: none;  
      }

      .steps::-webkit-scrollbar {
        display: none;  
      }

      .step {
        min-width: 100%;
        display: flex;
        flex-direction: column;
        gap: 2rem;
        padding: 2rem 0;
        position: relative;
        width: 100%;
      }

      .step-group {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 0 5%;
        width: 90%;
      }

      .step-row {
        border-top: 1px dotted #ccc;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        padding: 1rem 5%;
        width: 90%;
      }

      .step-title {
        background-color: hsl(236 55% 25%);
        padding: 0.5rem 1%;
        width: 98%;
      }

      .step-title h4 {
        color: hsl(0, 0%, 100%);
        font-family: 'Lato', sans-serif;
        font-size: 1.2rem;
        font-weight: 400;
        margin: 0;
      }

      form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
      }

      form .row {
        display: flex;
        gap: 1rem;
        width: 100%;
      }

      .form-element {
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: 0.4rem;
        width: 100%;
      }

      .form-element label {
        font-family: 'Lato', sans-serif;
        font-size: 0.8rem;
      }

      .form-element input, .form-element select {
        border: 1px solid hsl(0, 0%, 80%);
        border-radius: 0.5rem;
        font-family: 'Lato', sans-serif;
        font-size: 0.8rem;
        padding: 0.5rem;
      }

      .step button {
        align-self: flex-end;
        background-color: hsl(272 40% 35%);
        border: none;
        border-radius: 0.5rem;
        color: hsl(0, 0%, 100%);
        cursor: pointer;
        font-family: 'Lato', sans-serif;
        font-size: 1rem;
        padding: 0.5rem 1rem;
        width: max-content;
      }

      .step button:hover {
        filter: brightness(1.2);
      }

      .info-message{
        background-color: hsl(146.77deg 22.43% 43.86%);
        color: hsl(0, 0%, 100%);
        padding: 0.5rem 1%;
        width: 98%;
      }

      .info-message p {
        font-family: 'Lato', sans-serif;
        font-size: 1rem;
        margin: 0;
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

      .products{
        display: flex;
        flex-direction: column;
        gap: 1rem;
        height: 35vh;
        max-height: 35vh;
        overflow-y: auto;
        scroll-behavior: smooth;
        padding: 0 2%;
        width: 96%;
      }

      .products::-webkit-scrollbar {
        width: 0.5rem;
      }

      .products::-webkit-scrollbar-track {
        background: #1e1e24;
      }

      .products::-webkit-scrollbar-thumb {
        background: #6649b8;
      }

      .product{
        align-items: center;
        display: flex;
        justify-content: space-between;
        gap: 1rem;
      }

      .product h5{
        font-family: 'Lato', sans-serif;
        font-size: 0.9rem;
        font-weight: 700;
        margin: 0;
      }

      .product span{
        font-family: sans-serif;
        font-size: 1rem;
        font-weight: 700;
        margin: 0;
      }

      .product-info-container, .product-price-container{
        align-items: center;
        display: flex;
        gap: 1rem;
      }

      .product-price-before-discount{
        color: hsl(0, 0%, 50%);
        text-decoration: line-through;
      }

      .checkout-resume-item{
        align-items: center;
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 1%;
      }

      .checkout-resume-item span{
        font-family: 'Lato', sans-serif;
        font-size: 1rem;
        font-weight: 700;
        margin: 0;
      }

      .checkout-resume-item input{
        border: 1px solid hsl(0, 0%, 80%);
        border-radius: 0.5rem;
        font-family: 'Lato', sans-serif;
        font-size: 0.8rem;
        padding: 0.5rem;
      }

      .checkout-resume-item .apply-coupon.disabled{
        background-color: hsl(0, 0%, 50%);
        cursor: not-allowed;
      }

      .checkout-payment{
        display: flex;
        flex-direction: column;
      }

      .checkout-payment-item{
        align-items: center;
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        padding: 0.5rem 1%;
      }

      .checkout-payment-item label{
        font-family: 'Lato', sans-serif;
        font-size: 0.8rem;
      }

      .checkout-payment-item input[type="checkbox"]{
        margin-right: 0.5rem;
      }

      .checkout-payment-item .pay-button.disabled{
        background-color: hsl(0, 0%, 50%);
        cursor: not-allowed;
      }

      .finish-info p{
        font-family: 'Lato', sans-serif;
        font-size: 1rem;
        margin: 0;
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

    <div class="modal-checkout overlay">
      <div class="modal">
        <div class="modal-header">
          <h4>Finalizar compra</h4>

          <button class="close-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="waiting">
            <div class="loading-outer">
              <div class="loading-inner"></div>
            </div>
          </div>
          <div class="steps">
            <div class="step customer">
              <div class="step-group">
                <div class="step-title">
                  <h4>¿Ya tienes una cuenta?</h4>
                </div>
                <form class="customer-login">
                  <div class="row">
                    <div class="form-element">
                      <label for="email">Correo electrónico</label>
                      <input type="email" name="email" />
                    </div>
                    <div class="form-element">
                      <label for="password">Contraseña</label>
                      <input type="password" name="password" />
                    </div>
                  </div>
                </form>
                <button class="login-button">Iniciar sesión</button>
              </div>
              <div class="step-group">
                <div class="step-title">
                  <h4>¿No tienes una cuenta?</h4>
                </div>
                <form class="customer-register">
                  <div class="row">
                    <div class="form-element">
                      <label for="name">Nombre</label>
                      <input type="text" name="name" />
                    </div>
                    <div class="form-element">
                      <label for="surname">Apellidos</label>
                      <input type="text" name="surname" />
                    </div>
                    <div class="form-element">
                      <label for="email">Correo electrónico</label>
                      <input type="email" name="email" />
                    </div>
                  </div>
                  <div class="row">
                    <div class="form-element">
                      <label for="countryId">País</label>
                      <select name="countryId">
                        <option value=""></option>
                        <option value="es">España</option>
                      </select>
                    </div>
                    <div class="form-element">
                      <label for="cityId">Ciudad</label>
                      <select name="cityId">
                        <option value=""></option>
                        <option value="madrid">Madrid</option>
                      </select>
                    </div>
                    <div class="form-element">
                      <label for="postalCode">Código Postal</label>
                      <input type="text" name="postalCode" />
                    </div>
                  </div>
                  <div class="row">
                    <div class="form-element">
                      <label for="address">Dirección</label>
                      <input type="text" name="address" />
                    </div>
                    <div class="form-element">
                      <label for="dialCodeId">Prefijo telefónico</label>
                      <select name="dialCodeId">
                        <option value=""></option>
                        <option value="es">+34</option>
                      </select>
                    </div>
                    <div class="form-element">
                      <label for="telephone">Teléfono</label>
                      <input type="text" name="telephone" />
                    </div>
                  </div>
                  <div class="row">
                    <div class="form-element">
                      <label for="password">Contraseña</label>
                      <input type="password" name="password" />
                    </div>
                    <div class="form-element">
                      <label for="password">Confirmación de la contraseña</label>
                      <input type="password" name="password-confirmation" />
                    </div>
                  </div>
                </form>
                <button class="register-button">Registrarse</button>
              </div>
            </div>
            <div class="step payment">
              <div class="step-group">
                <div class="info-message">
                  <p>¡Bienvenido <span class="costumer-name"></span>! Ahora vamos a finalizar tu compra.</p>
                </div>
              </div>
              <div class="step-group">
                <div class="step-title">
                  <h4>Resumen de la compra</h4>
                </div>
                <div class="products"></div>
              </div>
              <div class="step-row">
                <div class="checkout-resume">
                  <div class="checkout-resume-item">
                    <span>Total</span>
                    <span class="total-price">${this.products.reduce((total, product) => total + product.price, 0)}€</span>
                  </div>   
                  <div class="checkout-resume-item">
                    <input type="text" name="code" placeholder="Cupón de descuento" />
                    <button class="apply-coupon" data-endpoint="">Aplicar</button>
                  </div>  
                </div>
                <div class="checkout-payment">
                  <div class="checkout-payment-item">
                    <input type="checkbox" name="terms" />
                    <label for="terms">Acepto los <a href="#">términos y condiciones</a></label>
                  </div>
                  <div class="checkout-payment-item payment-methods"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `

    this.products.forEach(product => {
      const productElement = document.createElement('div')
      productElement.classList.add('product')

      const productInfoContainer = document.createElement('div')
      productInfoContainer.classList.add('product-info-container')

      const productPriceContainer = document.createElement('div')
      productPriceContainer.classList.add('product-price-container')

      const productImage = document.createElement('img')
      productImage.setAttribute('src', product.image.url)
      productImage.setAttribute('alt', product.image.alt)

      const productTitle = document.createElement('h5')
      productTitle.textContent = product.title

      productInfoContainer.appendChild(productImage)
      productInfoContainer.appendChild(productTitle)

      const productPrice = document.createElement('span')
      productPrice.classList.add('product-price')
      const productPriceBeforeDiscount = document.createElement('span')
      productPriceBeforeDiscount.classList.add('product-price-before-discount')
      productPrice.textContent = `${product.price}€`

      if (product.priceBeforeDiscount) {
        productPriceBeforeDiscount.textContent = `${product.priceBeforeDiscount}€`
        productPriceContainer.appendChild(productPriceBeforeDiscount)
      }

      productPriceContainer.appendChild(productPrice)

      productElement.appendChild(productInfoContainer)
      productElement.appendChild(productPriceContainer)

      this.shadow.querySelector('.products').appendChild(productElement)
    })

    this.paymentMethods.forEach(paymentMethod => {
      const paymentMethodElement = document.createElement('button')

      paymentMethodElement.classList.add('pay-button', 'disabled')
      paymentMethodElement.dataset.paymentMethod = paymentMethod.name
      paymentMethodElement.textContent = `Pagar con ${paymentMethod.name.charAt(0).toUpperCase() + paymentMethod.name.slice(1)}`

      this.shadow.querySelector('.payment-methods').appendChild(paymentMethodElement)
    })

    this.shadow.querySelector('.modal-checkout').addEventListener('click', event => {
      if (event.target.closest('.close-button')) {
        this.shadow.querySelector('.overlay').classList.remove('active')
        document.body.classList.remove('block-scroll')
      }

      if (event.target.closest('.login-button')) {
        this.shadow.querySelector('.waiting').classList.add('active')

        setTimeout(() => {
          this.customerId = 1
          this.shadow.querySelector('.waiting').classList.remove('active')
          // this.shadow.querySelector('.costumer-name').textContent = this.shadow.querySelector('[name="name"]').value
          this.showNextStep()
        }, 1000)
      }

      if (event.target.closest('.register-button')) {
        this.shadow.querySelector('.waiting').classList.add('active')

        setTimeout(() => {
          this.customerId = 1
          this.shadow.querySelector('.waiting').classList.remove('active')
          this.shadow.querySelector('.costumer-name').textContent = this.shadow.querySelector('[name="name"]').value
          this.showNextStep()
        }, 1000)
      }

      if (event.target.closest('.apply-coupon')) {
        const applyCoupon = event.target.closest('.apply-coupon')
        const endpoint = applyCoupon.dataset.endpoint
        const code = this.shadow.querySelector('[name="code"]').value

        const json = {
          code
        }

        this.shadow.querySelector('.waiting').classList.add('active')

        setTimeout(() => {
          this.couponId = 1
          const multiplier = 1.15
          const totalPrice = this.shadow.querySelector('.total-price')
          totalPrice.textContent = `${(parseInt(totalPrice.textContent) / multiplier).toFixed(2)}€`
          this.shadow.querySelector('.waiting').classList.remove('active')
          applyCoupon.classList.add('disabled')
          this.shadow.querySelector('[name="code"]').disabled = true
        }, 1000)
      }

      if (event.target.closest('input[name="terms"]')) {
        this.shadow.querySelectorAll('.pay-button').forEach(payButton => {
          payButton.classList.toggle('disabled', !event.target.checked)
        })
      }

      if (event.target.closest('.pay-button')) {
        const payButton = event.target.closest('.pay-button')

        if (!payButton.classList.contains('disabled')) {
          this.shadow.querySelector('.waiting').classList.add('active')

          setTimeout(() => {
            localStorage.setItem('cart', JSON.stringify([]))
            this.shadow.querySelector('.waiting').classList.remove('active')
            this.shadow.querySelector('.payment').innerHTML = `
              <div class="step-group">
                <div class="info-message">
                  <p>¡Gracias por tu compra!</p>
                </div>
                <div class="finish-info">
                  <p>Recibirás un correo electrónico con los detalles de tu compra.</p>
                </div>
              </div>
            `
          }, 1000)
        }
      }
    })
  }

  showNextStep () {
    const steps = this.shadow.querySelector('.steps')
    steps.scrollBy({ left: steps.offsetWidth, behavior: 'smooth' })
  }
}

customElements.define('modal-checkout-component', ModalCheckout)
