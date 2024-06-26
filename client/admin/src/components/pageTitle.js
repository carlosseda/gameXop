class PageTitle extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  static get observedAttributes () { return ['title'] }

  connectedCallback () {}

  attributeChangedCallback (name, oldValue, newValue) {
    this.render()
  }

  render () {
    this.shadow.innerHTML =
        `
        <style>
            h2 {   
              color: hsl(0, 0%, 100%);
              font-family: 'Roboto', sans-serif;
              font-size: 2em;
              font-weight: 600;
              margin: 0;
              text-decoration: none;
              text-align:center;
            }
        </style>

        <h2>${this.getAttribute('title')}</h2>
        `
  }
}

customElements.define('page-title-component', PageTitle)
