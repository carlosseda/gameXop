class PageComponent extends HTMLElement {
  
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    window.onpopstate = () => this.handleRouteChange();
  }

  handleRouteChange() {
    this.render();
  }

  render() {
    const path = window.location.pathname;
    this.getTemplate(path);
  }

  async getTemplate(path) {

    let filename;

    switch (true) {
      case path === "/":
        filename = '/pages/home.html';
        break;
        
      case path.startsWith("/usuarios"):
        filename = '/pages/users.html';
        break;

      case path.startsWith("/faqs"):
        filename = '/pages/faqs.html';
        break;

      default:
        filename = '/pages/404.html';
    }

    await this.loadPage(filename);
  }

  async loadPage(filename) {
    const response = await fetch(filename);
    const html = await response.text();

    document.startViewTransition(() => {
      this.shadowRoot.innerHTML = html;
      document.documentElement.scrollTop = 0
    })
  }
}

customElements.define('page-component', PageComponent);