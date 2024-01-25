class PageComponent extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.basePath = this.getAttribute('base-path') || ''
  }

  connectedCallback () {
    this.render()
    window.onpopstate = () => this.handleRouteChange()
  }

  handleRouteChange () {
    this.render()
  }

  render () {
    const path = window.location.pathname
    this.getTemplate(path)
  }

  async getTemplate (path) {
    // TODO: fetch('/api/admin/locales')
    // const response = await fetch('/api/admin/users')

    // if (!response.ok) {
    //   window.location.href = '/login'
    // }

    const routes = {
      '/admin': 'dashboard.html',
      '/admin/usuarios': 'users.html',
      '/admin/faqs': 'faqs.html'
    }

    const filename = routes[path] || '/pages/404.html'

    await this.loadPage(filename)
  }

  async loadPage (filename) {
    const response = await fetch(`${this.basePath}/pages/${filename}`)
    const html = await response.text()

    document.startViewTransition(() => {
      this.shadowRoot.innerHTML = html
      document.documentElement.scrollTop = 0
    })
  }
}

customElements.define('page-component', PageComponent)
