class Header extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    this.render()
  }

  render () {
    this.shadow.innerHTML =
      /* html */`
      <style>
        header{
          align-items: center;
          background-color: hsla(0, 0%, 0%);
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          min-height: 5vh;
          padding: 0.5rem 2rem;
        }
      </style>
      <header>
        <slot></slot>
      </header>
    `
  }
}

customElements.define('header-component', Header)
