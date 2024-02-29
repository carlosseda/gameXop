import Sortable from 'sortablejs'

class PageGenerator extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.screenSizes = ['xs', 'sm', 'md', 'lg']
    this.components = [
      {
        name: 'row-component',
        slot: true
      }
    ]
  }

  connectedCallback () {
    this.render()
  }

  render () {
    this.shadow.innerHTML =
      /* html */`
      <style>
        .tabs-container-menu{
          background-color: hsl(100, 100%, 100%);
          display: flex;
          height: 2.5em;
          justify-content: space-between;
          width: 100%;
        }

        .tabs-container-content .tabs-container-menu{
          margin-top: 1rem;
        }
        
        .tabs-container-menu ul{
          height: 2.5rem;
          display: flex;
          margin: 0;
          padding: 0;
        }
        
        .tabs-container-menu li{
          background: hsl(272deg 40% 35% / 50%);
          border-right: 1px solid hsl(0 0% 50%);
          color: hsl(236 55% 25%);
          cursor: pointer;
          font-family: 'Lato' , sans-serif;
          list-style: none;
          font-weight: 600;
          padding: 0.5rem;
          text-align: center;
        }
        
        .tabs-container-menu li.active,
        .tabs-container-menu li.active:hover{
          background-color: hsl(272 40% 35%);
          color: white;
        }

        .tabs-container-buttons{
          display: flex;
          gap: 0.5rem;
          padding: 0 0.5rem;
        }

        .tabs-container-buttons svg{
          cursor: pointer;
          height: 2.5rem;
          width: 2.5rem;
          fill: hsl(236 55% 25%);
        }

        .tabs-container-buttons svg:hover{
          fill: hsl(272 40% 35%);
        }

        .tab-panel{
          display: none;
        }
        
        .tab-panel.active{
          display: flex;
          flex-wrap: wrap;
          gap: 1%;
          padding: 1rem 0;
          width: 100%;
        }

        .page{
          background-color: hsl(0 0% 95%);
          border: 1px solid hsl(0 0% 50%);
          padding: 1rem;
        }
      </style>
    `

    const pageGenerator = document.createElement('div')
    pageGenerator.classList.add('page-generator')
    this.shadow.append(pageGenerator)

    this.createTabsContent(pageGenerator)
    this.renderTabs(pageGenerator)
  }

  createTabsContent = (pageGenerator) => {
    const tabsCointainerMenu = document.createElement('div')
    tabsCointainerMenu.classList.add('tabs-container-menu')
    pageGenerator.append(tabsCointainerMenu)

    const tabsContainerItems = document.createElement('div')
    tabsContainerItems.classList.add('tabs-container-items')
    tabsCointainerMenu.append(tabsContainerItems)

    const tabsContainerItemsUl = document.createElement('ul')
    tabsContainerItems.append(tabsContainerItemsUl)

    this.screenSizes.forEach(screenSize => {
      const tabsContainerItemsLi = document.createElement('li')
      tabsContainerItemsLi.classList.add('tab-item')
      tabsContainerItemsLi.textContent = screenSize
      tabsContainerItemsUl.append(tabsContainerItemsLi)
    })

    const tabsContainerContent = document.createElement('div')
    tabsContainerContent.classList.add('tabs-container-content')
    pageGenerator.append(tabsContainerContent)

    this.screenSizes.forEach(screenSize => {
      const tabPanel = document.createElement('div')
      tabPanel.classList.add('tab-panel')
      tabPanel.setAttribute('data-tab', screenSize)
      tabsContainerContent.append(tabPanel)
    })
  }

  renderTabs = (pageGenerator) => {
    pageGenerator.querySelector('.tab-item').classList.add('active')
    pageGenerator.querySelector('.tab-panel').classList.add('active')

    pageGenerator.addEventListener('click', (event) => {
      if (event.target.closest('.tab-item')) {
        if (event.target.closest('.tab-item').classList.contains('active')) {
          return
        }

        const tabClicked = event.target.closest('.tab-item')
        const tabActive = tabClicked.parentElement.querySelector('.active')

        tabClicked.classList.add('active')
        tabActive.classList.remove('active')

        tabClicked.closest('form').querySelector(`.tab-panel.active[data-tab="${tabActive.dataset.tab}"]`).classList.remove('active')
        tabClicked.closest('form').querySelector(`.tab-panel[data-tab="${tabClicked.dataset.tab}"]`).classList.add('active')
      }
    })
  }
}

customElements.define('page-generator-component', PageGenerator)
