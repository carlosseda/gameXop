class TextComponent extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
  }

  static get observedAttributes () {
    return ['text', 'tag', 'class']
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'text' || name === 'tag' || name === 'class') {
      this.render()
    }
  }

  render () {
    const text = this.getAttribute('text')
    const tag = this.getAttribute('tag') || 'p'
    const className = this.getAttribute('class') || ''

    this.shadowRoot.innerHTML = /* html */`
      <style>
        :host {
          display: block;
        }
      </style>
      <${tag} class="${className}">${text}</${tag}>
    `
  }
}

customElements.define('text-component', TextComponent)
