class Faqs extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  async connectedCallback () {
    this.loadData().then(() => this.render())
  }

  async loadData () {
    this.faqs = [
      {
        title: '¿Qué es GameXop?',
        description: `
          GameXop es una tienda de videojuegos online. En ella podrás encontrar los últimos lanzamientos, preventas y juegos en oferta.
        `
      },
      {
        title: '¿Puedo hacer devoluciones de juegos?',
        description: `
          Sí, puedes hacer devoluciones de juegos siempre y cuando no hayan pasado más de 7 días desde la compra.
        `
      },
      {
        title: '¿Cuánto tarda en llegar mi pedido?',
        description: `
          El tiempo de entrega de los pedidos es instantáneo. Una vez realizada la compra, podrás descargar el juego en tu consola o PC.
        `
      },
      {
        title: '¿Cómo puedo pagar mi pedido?',
        description: `
          Puedes pagar tu pedido con tarjeta de crédito o débito, PayPal o MercadoPago.
        `
      }
    ]
  }

  render () {
    this.shadow.innerHTML =
    /* html */`
    <style>

      .faqs-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      details {
        color: hsl(0, 0%, 100%);
        font-family: 'Lato', sans-serif;
        font-size: 1.2rem;
      }

      summary {
        border-bottom: 1px solid hsl(0, 0%, 100%);
        color: hsl(0, 0%, 100%);
        cursor: pointer;
        font-family: 'Lato', sans-serif;
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 1rem;
        padding: 0.5rem;
      }
    </style>

    <div class="faqs-container"></div>
    `

    const faqsContainer = this.shadow.querySelector('.faqs-container')

    this.faqs.forEach(faq => {
      const faqElement = document.createElement('details')
      const faqElementSummary = document.createElement('summary')
      faqElement.name = 'faq'
      faqElementSummary.textContent = faq.title
      faqElement.appendChild(faqElementSummary)
      faqElement.innerHTML += faq.description
      faqsContainer.appendChild(faqElement)
    })
  }
}

customElements.define('faqs-component', Faqs)
