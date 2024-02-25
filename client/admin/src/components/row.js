class Row extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.columns = this.getAttribute('template-columns') || '1fr'
    this.rowGap = this.getAttribute('row-gap') || '1rem'
    this.elementDistribution = this.getAttribute('element-distribution') || null
    this.columnGap = this.getAttribute('column-gap') || '1rem'
    this.justifyContents = this.getAttribute('justify-contents') || null
  }

  connectedCallback () {
    this.render()
    this.applyLayout()
  }

  render () {
    this.shadow.innerHTML =
      /* html */`
        <style>
          :host{
            display: block;
            width: 100%;
          }

          .row{
            display: grid;
            gap: ${this.rowGap};
            grid-template-columns: ${this.columns};
            width: 100%;
          }

          .column{
            display: flex;
            gap: ${this.columnGap};
          }
        </style>
        <div class="row">
          <slot></slot>
        </div>
      `
  }

  applyLayout () {
    if (this.elementDistribution) {
      const elementDistribution = this.elementDistribution.split(',').map(Number)
      const justifyContents = this.justifyContents ? this.justifyContents.split(',') : []
      const slotElements = this.shadowRoot.querySelector('slot').assignedNodes({ flatten: true }).filter(el => el.nodeType === Node.ELEMENT_NODE)

      const slot = this.shadowRoot.querySelector('slot')
      const divs = elementDistribution.map((_, index) => {
        const div = document.createElement('div')
        div.classList.add('column')
        div.style.justifyContent = justifyContents[index] ? justifyContents[index].trim() : 'flex-start'
        slot.parentElement.insertBefore(div, slot)
        return div
      })

      let columnIndex = 0

      elementDistribution.forEach((count, index) => {
        for (let i = 0; i < count; i++) {
          if (slotElements[columnIndex]) {
            divs[index].appendChild(slotElements[columnIndex])
            columnIndex++
          }
        }
      })

      slot.remove()
    }
  }
}

customElements.define('row-component', Row)
