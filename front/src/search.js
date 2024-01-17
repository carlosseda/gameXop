class Search extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.flexDirection = this.getAttribute('flex-direction')
  }

  connectedCallback () {
    this.render()
  }

  render () {
    this.shadow.innerHTML =
    /* html */`
    <style>
      :host {
        max-width: 300px;
      }

      a{
        text-decoration: none;
      }

      .search-bar {
        align-items: center;
        display: flex;
        gap: 0.5rem;
      }

      form {
        align-items: center;
        display: flex;
      }

      input {
        background-color: hsl(0, 0%, 100%);
        border: 1px solid hsl(0, 0%, 100%);
        border-radius: 0.5rem;
        color: hsl(0, 0%, 0%);
        font-family: 'Lato', sans-serif;
        font-size: 1rem;
        font-weight: 400;
        height: 2rem;
        outline: none;
        padding: 0 1rem;
        width: 100%;
      }

      .search-button {
        background: transparent;
        border: none;
        cursor: pointer;
      }

      .search-button svg {
        fill: hsl(0, 0%, 100%);
        height: 2rem;
        width: 2rem;
      }

      .search-results {
        background-color: hsl(0, 0%, 100%);
        border-radius: 0.5rem;
        display: flex;
        flex-direction: column;
        margin-top: 0.5rem;
        opacity: 0;
        overflow: hidden;
        position: absolute;
        visibility: hidden;
        transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
        width: 300px;
        z-index: -1;
      }

      .search-results.active{
        opacity: 1;
        visibility: visible;
        z-index: 1;
      }

      .search-result {
        align-items: center;
        display: flex;
        gap: 0.5rem;
        padding: 0.5rem;
      }

      .search-result:hover {
        background-color: hsl(272 40% 35%);
      }

      .search-result-image {
        border-radius: 0.5rem;
        flex: 0 0 3rem;
        height: 3rem;
        overflow: hidden;
      }

      .search-result-image img {
        height: 100%;
        object-fit: cover;
        width: 100%;
      }

      .search-result-info {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
      }

      .search-result-info h4 {
        color: hsl(0, 0%, 0%);
        font-family: 'Lato', sans-serif;
        font-size: 1rem;
        font-weight: 700;
        margin: 0;
      }

      .search-result:hover .search-result-info h4{
        color: hsl(0, 0%, 100%);
      }

      .search-result-info span {
        color: hsl(0, 0%, 0%);
        font-family: sans-serif;
        font-size: 0.9rem;
        font-weight: 700;
      }

      .search-result:hover .search-result-info span{
        color: hsl(0, 0%, 100%);
      }
    </style>

    <div class="search">
      <div class="search-bar">
        <form>
          <input type="text" placeholder="busca tu juego" />
        </form>
        <button class="search-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>magnify</title><path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" /></svg>
        </button>
      </div>
      <div class="search-results">dad</div>
    </div>
    `

    this.shadow.querySelector('.search-button').addEventListener('click', event => this.submitForm(event))
    this.shadow.querySelector('input').addEventListener('keyup', event => this.handleKeyUp(event))

    document.addEventListener('click', event => {
      if (!this.shadow.contains(event.target)) {
        this.shadow.querySelector('.search-results').classList.remove('active')
        this.open = false
      }
    })
  }

  submitForm () {
    console.log('submit')
  }

  handleKeyUp (event) {
    const search = event.target.value
    const searchResults = this.shadow.querySelector('.search-results')

    if (search.length == 0) {
      searchResults.classList.remove('active')
      this.open = false
      return
    }

    if (search.length > 1 && !this.open) {
      this.open = true

      const response = [
        {
          path: '/juegos/call-of-duty',
          price: 100,
          locale: {
            title: 'Call of Duty Modern Warfare 3'
          },
          image: {
            url: 'http://localhost:5173/public/call-of-duty.jpg',
            alt: 'Call of Duty'
          }
        },
        {
          path: '/juegos/call-of-duty',
          price: 100,
          locale: {
            title: 'Call of Duty Modern Warfare 3'
          },
          image: {
            url: 'http://localhost:5173/public/call-of-duty.jpg',
            alt: 'Call of Duty'
          }
        },
        {
          path: '/juegos/call-of-duty',
          price: 100,
          locale: {
            title: 'Call of Duty Modern Warfare 3'
          },
          image: {
            url: 'http://localhost:5173/public/call-of-duty.jpg',
            alt: 'Call of Duty'
          }
        },
        {
          path: '/juegos/call-of-duty',
          price: 100,
          locale: {
            title: 'Call of Duty Modern Warfare 3'
          },
          image: {
            url: 'http://localhost:5173/public/call-of-duty.jpg',
            alt: 'Call of Duty'
          }
        },
        {
          path: '/juegos/call-of-duty',
          price: 100,
          locale: {
            title: 'Call of Duty Modern Warfare 3'
          },
          image: {
            url: 'http://localhost:5173/public/call-of-duty.jpg',
            alt: 'Call of Duty'
          }
        }
      ]

      searchResults.innerHTML = ''

      response.forEach(item => {
        searchResults.innerHTML +=
        /* html */`
        <a href="${item.path}">
          <div class="search-result">
            <div class="search-result-image">
              <img src="${item.image.url}" alt="${item.image.alt}" />
            </div>
            <div class="search-result-info">
              <h4>${item.locale.title}</h4>
              <span>${item.price} €</span>
            </div>
          </div>
        </a>
        `
      })

      searchResults.classList.add('active')
    }
  }
}

customElements.define('search-component', Search)
