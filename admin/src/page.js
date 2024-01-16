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

    if (path === "/") {
      filename = '/pages/faqs.html';
    } else if (path.startsWith("/usuarios")) {
      filename = '/pages/users.html';
    } else {
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