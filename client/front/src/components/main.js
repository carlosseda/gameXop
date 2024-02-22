class Main extends HTMLElement {
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
          main{
            animation:bganimation 30s infinite;
            background-attachment: fixed;
            background: 
              radial-gradient(ellipse at center, hsla(240, 86%, 57%, 0.3) 0%, rgba(0,0,0,0) 70%),
              radial-gradient(ellipse at center, hsla(260, 81%, 18%, 0.3) 0%, rgba(0,0,0,0) 70%), 
              radial-gradient(ellipse at center, hsla(316, 94%, 14%, 0.3) 0%, rgba(0,0,0,0) 70%) 
              #170150;
            background-repeat: 
              no-repeat, 
              no-repeat, 
              no-repeat;
            background-size: 
              900px 900px,
              900px 900px,
              900px 900px;
            display: flex;
            flex-direction: column;
            gap: 2rem;
            min-height: 100%;
            padding: 2rem 0;
          }

          @keyframes bganimation{
            0%{
              background-position: 
                -100% -100%,
                200% 200%,
                -100% 200%,
                200% -100%;
            }
            50% {
              background-position: 
                150% 100%,
                -200% 100%,
                100% 0%,
                0% 100%;
            }
            100% {
              background-position: 
                -100% -100%,
                200% 200%,
                -100% 200%,
                200% -100%;
            }
          }
        </style>
        <main>
          <slot></slot>
        </main>
      `
  }
}

customElements.define('main-component', Main)
