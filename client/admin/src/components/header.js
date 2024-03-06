class Header extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.defaultOptions = {
      backgroundColor: 'transparent',
      height: '5vh',
      paddingTop: '0',
      paddingBottom: '0',
      paddingLeft: '0',
      paddingRight: '0'
    }
    this.options = {}
  }

  static get observedAttributes () {
    return ['options']
  }

  attributeChangedCallback (name, oldValue, newValue) {
    this.options = JSON.parse(newValue)
    this.render()
  }

  connectedCallback () {
    this.render()
  }

  render () {
    this.options = Object.assign({}, this.defaultOptions, this.options)

    this.shadow.innerHTML =
      /* html */`
      <style>
        header{
          background-color: ${this.options.backgroundColor};
          box-sizing: border-box;
          height: ${this.options.height};
          min-height: ${this.options.height};
          padding-top: ${this.options.paddingTop};
          padding-bottom: ${this.options.paddingBottom};
          padding-left: ${this.options.paddingLeft};
          padding-right: ${this.options.paddingRight};
          width: 100%;
        }
      </style>
      <header>
        <slot></slot>
      </header>
    `
  }
}

customElements.define('header-component', Header)
