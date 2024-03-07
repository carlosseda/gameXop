import Sortable from 'sortablejs'

class PageGenerator extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.structure = {
      xs: new Map(),
      sm: new Map(),
      md: new Map(),
      lg: new Map()
    }
    this.rowOptions = [
      {
        columns: '1fr'
      },
      {
        columns: '1fr 1fr'
      },
      {
        columns: '1fr 1fr 1fr'
      },
      {
        columns: '1fr 1fr 1fr 1fr'
      },
      {
        columns: '1fr 1fr 1fr 1fr 1fr'
      },
      {
        columns: '1fr 1fr 1fr 1fr 1fr 1fr'
      },
      {
        columns: '3fr 7fr'
      },
      {
        columns: '7fr 3fr'
      },
      {
        columns: '2fr 8fr'
      },
      {
        columns: '8fr 2fr'
      },
      {
        columns: '1fr 9fr'
      },
      {
        columns: '9fr 1fr'
      },
      {
        columns: '2fr 6fr 2fr'
      },
      {
        columns: '1fr 8fr 1fr'
      },
      {
        columns: '2fr 2fr 6fr'
      },
      {
        columns: '6fr 2fr 2fr'
      },
      {
        columns: '1fr 1fr 8fr'
      },
      {
        columns: '8fr 1fr 1fr'
      },
      {
        columns: '1fr 1fr 1fr 7fr'
      },
      {
        columns: '7fr 1fr 1fr 1fr'
      }
    ]
    this.components = [
      {
        label: 'Header',
        name: 'header-component',
        slot: true,
        screenSizes: ['xs', 'sm', 'md', 'lg'],
        options: {
          structure: {
            tabs: [
              { name: 'styles', label: 'Estilos' }
            ],
            inputs: {
              styles: [
                { name: 'backgroundColor', element: 'input', type: 'color', label: 'Background Color', width: 'full-width', value: 'transparent' },
                { name: 'height', element: 'input', type: 'text', label: 'Height', value: '5vh', width: 'full-width' },
                { name: 'paddingTop', element: 'input', type: 'text', label: 'Padding Top', width: 'one-quarter-width', value: '0' },
                { name: 'paddingBottom', element: 'input', type: 'text', label: 'Padding Bottom', width: 'one-quarter-width', value: '0' },
                { name: 'paddingLeft', element: 'input', type: 'text', label: 'Padding Left', width: 'one-quarter-width', value: '0' },
                { name: 'paddingRight', element: 'input', type: 'text', label: 'Padding Right', width: 'one-quarter-width', value: '0' }
              ]
            }
          }
        }
      },
      {
        label: 'Main',
        name: 'main-component',
        slot: true,
        screenSizes: ['xs', 'sm', 'md', 'lg']
      },
      {
        label: 'Footer',
        name: 'footer-component',
        slot: true,
        screenSizes: ['xs', 'sm', 'md', 'lg']
      },
      {
        label: 'Fila',
        name: 'row-component',
        slot: true,
        screenSizes: ['xs', 'sm', 'md', 'lg'],
        options: {
          structure: {
            tabs: [
              { name: 'styles', label: 'Estilos' }
            ],
            inputs: {
              styles: [
                { name: 'height', element: 'input', type: 'text', label: 'Height', value: '50px', width: 'full-width' },
                { name: 'columnGap', element: 'input', type: 'text', label: 'Column Gap', value: '1rem', width: 'full-width' },
                { name: 'rowGap', element: 'input', type: 'text', label: 'Row Gap', value: '1rem', width: 'full-width' }
              ]
            }
          }
        }
      }
    ]

    this.component = {}
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
          gap: 1rem;
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
          box-sizing: border-box;
          padding: 1rem;
          width: 100%;
        }

        .page .component{
          background-color: hsl(236 55% 25%);
          border: 1px solid hsl(0 0% 50%);
          box-sizing: border-box;
          margin-bottom: 0.5rem;
          width: 100%;
        }

        .page .component .slot{
          display: flex;
          justify-content: center;
          width: 100%;
        }

        .page .component .component-details{
          align-items: center;
          background-color: hsl(0 0% 0% / 50%);
          box-sizing: border-box;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1rem;
          padding: 0.5rem;
          width: 100%;
        }

        .component-details span{
          color: hsl(0 0% 100%);
          font-family: 'Lato', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          margin: 0;
          text-align: center;
        }

        .component-details .component-details-buttons{
          display: flex;
          gap: 0.5rem;
        }

        .component-details button{
          background-color: transparent;
          border: none;
          cursor: pointer;
          justify-self: right;
          padding: 0;
        }

        .component-details button svg{
          height: 1.2rem;
          width: 1.2rem;
        }

        .component-details button svg path{
          fill: hsl(0 0% 100%);
        }

        .component-body{
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          padding: 1rem;
        }

        .add-component{
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px dashed hsl(0 0% 50%);
          height: 5rem;
          position: relative;
          margin-top: 1rem; 
          width: 100%;
        }

        .add-button{
          background-color: hsl(135 45% 30%);
          border: none;
          cursor: pointer;
        }

        .add-button:hover{
          background-color: hsl(135 45% 40%);
        }

        .add-button svg{
          height: 2rem;
          fill: white;
          width: 2rem;
        }

        .row {
          display: grid;
          gap: 1rem;
          width: 100%;
        }

        .row .column{
          border: 1px dashed hsl(0deg 0% 100%);
          display: flex;
          justify-content: center;
          padding: 2rem;
        }

        .modal{
          align-items: center;
          background-color: hsl(0 0% 0% / 50%);
          display: flex;
          height: 100vh;
          justify-content: center;
          left: 0;
          opacity: 0;
          position: fixed;
          top: 0;
          transition: opacity 0.3s ease, visibility 0.3s ease;
          visibility: hidden;
          width: 100%;
          z-index: 5000;
        }

        .modal.active{
          opacity: 1;
          visibility: visible;
        }

        .modal-container{
          background-color: white;
          box-sizing: border-box;
          height: 80%;
          width: 80%;
        }

        .modal-container .modal-container-header{
          background-color: hsl(236 55% 25%);
          box-sizing: border-box;
          display: flex;
          justify-content: flex-end;
          padding: 0.5rem;
          width: 100%;
        }

        .modal-container-header .close-button{
          background-color: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .modal-container-header .close-button svg{
          fill: hsl(0 0% 100%);
          height: 2rem;
          width: 2rem;
        }

        .modal-container-body{
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          grid-template-rows: repeat(auto-fill, minmax(50px, 1fr));
          padding: 1rem;
        }

        .modal-container-body .component{
          align-items: center;
          background-color: hsl(272 40% 35%);
          border: 1px solid hsl(0 0% 50%);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .modal-container-body .component:hover{
          background-color: hsl(272 40% 45%);
        }

        .modal-container-body .component h3{
          color: hsl(0 0% 100%);
          font-family: 'Lato', sans-serif;
          font-size: 1rem;
          margin: 0;
        }

        .modal-container:has(.row-option) .modal-container-body{
          gap: 5rem;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          grid-template-rows: repeat(auto-fill, minmax(80px, 1fr));
        }

        .modal-container-body .row-option{
          cursor: pointer;
          display: grid;
          gap: 1rem;
          height: 100px;
          width: 100%;
        }

        .modal-container-body .row-option .column{
          background-color: hsl(236 55% 25%);
        }

        .modal-container-body .row-option:hover .column{
          background-color: hsl(135 45% 40%);
        }

        .modal-container:has(pre){
          display: flex;
          flex-direction: column;
          width: 40%;
        }

        .modal-container:has(pre) .modal-container-body{
          display: flex;
          flex-direction: column;
        }

        .modal-container-body pre{
          background-color:hsl(226deg 64% 66%);
          box-sizing: border-box;
          color: hsl(0, 0%, 100%);
          height: 2.2rem;
          font-family: 'Lato' , sans-serif;
          font-size: 1rem;
          font-weight: 600;
          height: 100%;
          overflow: auto;
          padding: 1rem;
          width: 100%;
        }

        .modal-container:has(.preview.xs){
          width: 390px;
        }

        .modal-container:has(.preview.sm){
          width: 768px;
        }

        .modal-container:has(.preview.md){
          height: 100%;
          width: 1024px;
        }

        .modal-container:has(.preview.lg){
          height: 100%;
          width: 1920px;
        }

        .modal-container:has(.preview) .modal-container-body{
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 0;
          width: 100%;
        }

        .modal-container:has(form){
          width: 30%;
        }

        .modal-container:has(form) .modal-container-body{
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .modal-container-body .tabs-container-menu{
          background-color: hsl(236 55% 25%);
          margin-top: 1rem;
        }

        .modal-container-body .tabs-container-menu li{
          color: hsl(0 0% 100%);
        }

        .modal-container-body .tab-panel.active{
          display: flex;
          flex-wrap: wrap;
          gap: 1%;
          padding: 1rem 0;
          width: 100%;
        }

        .modal-container-body .form-element{
          margin-bottom: 1em;
          width: 100%;
        }

        .modal-container-body .form-element.hidden{
          display: none;
        }

        .modal-container-body .form-element.full-width {
          flex: 0 0 100%;
        }

        .modal-container-body .form-element.half-width {
          flex: 0 0 49.5%;
        }

        .modal-container-body .form-element.one-third-width {
          flex: 0 0 32.65%;
        }

        .modal-container-body .form-element.one-quarter-width {
          flex: 0 0 24.25%;
        }

        .modal-container-body .form-element-label{
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
          width: 100%;
        }
        
        .modal-container-body .form-element-label label,
        .modal-container-body .form-element-label span{
          color: hsl(0, 0%, 0%);
          font-family: 'Lato' , sans-serif;
          font-weight: 600;
          font-size: 0.9rem;
          transition: color 0.5s;
        }

        .modal-container-body .form-element-label label.invalid::after{
          content: '*';
          color: hsl(0, 100%, 50%);
          font-size: 1.5rem;
          margin-left: 0.2rem;
        }

        .modal-container-body .form-element-label,
        .modal-container-body .form-element-input{
          width: 100%;
        }

        .modal-container-body input[type="submit"]{
          background-color: hsl(135 45% 40%);
          border: none;
          color: hsl(0 0% 100%);
          cursor: pointer;
          font-family: 'Lato' , sans-serif;
          font-size: 1rem;
          font-weight: 600;
          outline: inherit;
          padding: 0.5rem 0;
        }
        
        .modal-container-body .form-element-input input, 
        .modal-container-body .form-element-input textarea,
        .modal-container-body .form-element-input select {
          background-color:hsl(226deg 64% 66%);
          border: none;
          border-bottom: 0.1em solid hsl(0, 0%, 100%);
          border-radius: 0;
          box-sizing: border-box;
          color: hsl(0, 0%, 100%);
          height: 2.2rem;
          font-family: 'Lato' , sans-serif;
          font-size: 1rem;
          font-weight: 600;
          padding: 0 0.5rem;
          width: 100%;
        }

        .modal-container-body .form-element-input input:focus,
        .modal-container-body .form-element-input textarea:focus,
        .modal-container-body .form-element-input select:focus{
          outline: none;
          border-bottom: 0.1rem solid hsl(207, 85%, 69%);
        }

        .modal-container-body .form-element-input input.invalid,
        .modal-container-body .form-element-input textarea.invalid{
          border-bottom: 0.2rem solid hsl(0, 100%, 50%);
        }

        .modal-container-body .form-element-input textarea{
          height: 50vh;
          padding: 0.5rem;
        }
      </style>
    `

    const pageGenerator = this.createPage()
    const modalContainer = this.createModal()
    this.createTabsContent(pageGenerator)
    this.renderTabs(pageGenerator)
    this.renderButtons(pageGenerator)
    this.renderComponentModal(modalContainer)
  }

  createPage = () => {
    const pageGenerator = document.createElement('div')
    pageGenerator.classList.add('page-generator')
    this.shadow.append(pageGenerator)
    return pageGenerator
  }

  createModal = () => {
    const modal = document.createElement('div')
    modal.classList.add('modal')
    this.shadow.append(modal)

    const modalContainer = document.createElement('div')
    modalContainer.classList.add('modal-container')
    modal.append(modalContainer)

    const modalContainerHeader = document.createElement('div')
    modalContainerHeader.classList.add('modal-container-header')
    modalContainer.append(modalContainerHeader)

    const closeButton = document.createElement('button')
    closeButton.classList.add('close-button')
    closeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg>'
    modalContainerHeader.append(closeButton)

    const modalContainerBody = document.createElement('div')
    modalContainerBody.classList.add('modal-container-body')
    modalContainer.append(modalContainerBody)

    return modalContainer
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

    Object.keys(this.structure).forEach(screenSize => {
      const tabsContainerItemsLi = document.createElement('li')
      tabsContainerItemsLi.classList.add('tab-item')
      tabsContainerItemsLi.dataset.tab = screenSize
      tabsContainerItemsLi.textContent = screenSize
      tabsContainerItemsUl.append(tabsContainerItemsLi)
    })

    const tabsContainerButtons = document.createElement('div')
    tabsContainerButtons.classList.add('tabs-container-buttons')
    tabsCointainerMenu.append(tabsContainerButtons)

    const jsonButton = document.createElement('div')
    jsonButton.classList.add('json-button')
    jsonButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>code-json</title><path d="M5,3H7V5H5V10A2,2 0 0,1 3,12A2,2 0 0,1 5,14V19H7V21H5C3.93,20.73 3,20.1 3,19V15A2,2 0 0,0 1,13H0V11H1A2,2 0 0,0 3,9V5A2,2 0 0,1 5,3M19,3A2,2 0 0,1 21,5V9A2,2 0 0,0 23,11H24V13H23A2,2 0 0,0 21,15V19A2,2 0 0,1 19,21H17V19H19V14A2,2 0 0,1 21,12A2,2 0 0,1 19,10V5H17V3H19M12,15A1,1 0 0,1 13,16A1,1 0 0,1 12,17A1,1 0 0,1 11,16A1,1 0 0,1 12,15M8,15A1,1 0 0,1 9,16A1,1 0 0,1 8,17A1,1 0 0,1 7,16A1,1 0 0,1 8,15M16,15A1,1 0 0,1 17,16A1,1 0 0,1 16,17A1,1 0 0,1 15,16A1,1 0 0,1 16,15Z" /></svg>'
    tabsContainerButtons.append(jsonButton)

    const previewButton = document.createElement('div')
    previewButton.classList.add('preview-button')
    previewButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>monitor-eye</title><path d="M3 4V16H21V4H3M3 2H21C22.1 2 23 2.89 23 4V16C23 16.53 22.79 17.04 22.41 17.41C22.04 17.79 21.53 18 21 18H14V20H16V22H8V20H10V18H3C2.47 18 1.96 17.79 1.59 17.41C1.21 17.04 1 16.53 1 16V4C1 2.89 1.89 2 3 2M10.84 8.93C11.15 8.63 11.57 8.45 12 8.45C12.43 8.46 12.85 8.63 13.16 8.94C13.46 9.24 13.64 9.66 13.64 10.09C13.64 10.53 13.46 10.94 13.16 11.25C12.85 11.56 12.43 11.73 12 11.73C11.57 11.73 11.15 11.55 10.84 11.25C10.54 10.94 10.36 10.53 10.36 10.09C10.36 9.66 10.54 9.24 10.84 8.93M10.07 12C10.58 12.53 11.28 12.82 12 12.82C12.72 12.82 13.42 12.53 13.93 12C14.44 11.5 14.73 10.81 14.73 10.09C14.73 9.37 14.44 8.67 13.93 8.16C13.42 7.65 12.72 7.36 12 7.36C11.28 7.36 10.58 7.65 10.07 8.16C9.56 8.67 9.27 9.37 9.27 10.09C9.27 10.81 9.56 11.5 10.07 12M6 10.09C6.94 7.7 9.27 6 12 6C14.73 6 17.06 7.7 18 10.09C17.06 12.5 14.73 14.18 12 14.18C9.27 14.18 6.94 12.5 6 10.09Z" /></svg>'
    tabsContainerButtons.append(previewButton)

    const tabsContainerContent = document.createElement('div')
    tabsContainerContent.classList.add('tabs-container-content')
    pageGenerator.append(tabsContainerContent)

    Object.keys(this.structure).forEach(screenSize => {
      const tabPanel = document.createElement('div')
      tabPanel.classList.add('tab-panel')
      tabPanel.dataset.tab = screenSize
      tabsContainerContent.append(tabPanel)
      const page = document.createElement('div')
      page.classList.add('page')
      tabPanel.append(page)

      const addComponent = document.createElement('div')
      addComponent.classList.add('add-component')

      const addButton = document.createElement('button')
      addButton.classList.add('add-button')
      addButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" /></svg>'
      addComponent.append(addButton)

      page.append(addComponent)
    })
  }

  renderTabs = (container) => {
    container.querySelector('.tab-item').classList.add('active')
    container.querySelector('.tab-panel').classList.add('active')

    container.addEventListener('click', (event) => {
      if (event.target.closest('.tab-item')) {
        if (event.target.closest('.tab-item').classList.contains('active')) {
          return
        }

        const tabClicked = event.target.closest('.tab-item')
        const tabActive = tabClicked.parentElement.querySelector('.active')

        tabClicked.classList.add('active')
        tabActive.classList.remove('active')

        tabClicked.closest(`.${container.classList.value}`).querySelector(`.tab-panel.active[data-tab="${tabActive.dataset.tab}"]`).classList.remove('active')
        tabClicked.closest(`.${container.classList.value}`).querySelector(`.tab-panel[data-tab="${tabClicked.dataset.tab}"]`).classList.add('active')
      }
    })
  }

  renderButtons = (pageGenerator) => {
    pageGenerator.addEventListener('mouseover', event => {
      if (!event.target.closest('.component')) {
        this.shadow.querySelectorAll('.component .component-details').forEach(componentDetails => {
          componentDetails.classList.remove('active')
        })
      }
    })

    pageGenerator.addEventListener('click', (event) => {
      if (event.target.closest('.add-button')) {
        const size = this.shadow.querySelector('.tab-panel.active').dataset.tab
        const addButton = event.target.closest('.add-button')
        const components = this.components.filter(component => component.screenSizes.includes(size))

        if (addButton.parentElement.dataset.uuid) {
          this.component = {
            parentUuid: addButton.parentElement.dataset.uuid
          }
        }

        const modal = this.shadow.querySelector('.modal')
        modal.classList.add('active')
        const modalContainerBody = this.shadow.querySelector('.modal-container-body')
        modalContainerBody.innerHTML = ''

        this.showComponents(modalContainerBody, components)
      }

      if (event.target.closest('.edit-button')) {
        const size = this.shadow.querySelector('.tab-panel.active').dataset.tab
        const editButton = event.target.closest('.edit-button')
        const component = this.components.find(component => component.name === editButton.dataset.component)
        this.component = {
          uuid: editButton.dataset.uuid,
          size
        }

        const modal = this.shadow.querySelector('.modal')
        modal.classList.add('active')
        const modalContainerBody = this.shadow.querySelector('.modal-container-body')
        modalContainerBody.innerHTML = ''

        this.showComponentOptions(modalContainerBody, component)
      }

      if (event.target.closest('.remove-button')) {
        event.target.closest('.component').remove()

        const size = this.shadow.querySelector('.tab-panel.active').dataset.tab
        const uuid = event.target.closest('.remove-button').dataset.uuid

        this.removeComponentInStructure(this.structure[size], uuid)
      }

      if (event.target.closest('.row-button')) {
        const size = this.shadow.querySelector('.tab-panel.active').dataset.tab
        const rowButton = event.target.closest('.row-button')
        this.component = {
          uuid: rowButton.dataset.uuid,
          size
        }

        const modal = this.shadow.querySelector('.modal')
        modal.classList.add('active')
        const modalContainerBody = this.shadow.querySelector('.modal-container-body')
        modalContainerBody.innerHTML = ''

        this.showRowOptions(modalContainerBody)
      }

      if (event.target.closest('.json-button')) {
        const size = this.shadow.querySelector('.tab-panel.active').dataset.tab

        const modal = this.shadow.querySelector('.modal')
        modal.classList.add('active')
        const modalContainerBody = this.shadow.querySelector('.modal-container-body')
        modalContainerBody.innerHTML = ''

        this.showJson(modalContainerBody, size)
      }

      if (event.target.closest('.preview-button')) {
        const size = this.shadow.querySelector('.tab-panel.active').dataset.tab
        const structure = this.mapToObject(this.structure[size])

        const modal = this.shadow.querySelector('.modal')
        modal.classList.add('active')
        const modalContainerBody = this.shadow.querySelector('.modal-container-body')
        modalContainerBody.innerHTML = ''

        this.showPreview(modalContainerBody, structure, size)
      }
    })
  }

  showComponents = (modalContainer, components) => {
    components.forEach(component => {
      const componentContainer = document.createElement('div')
      componentContainer.classList.add('component')
      componentContainer.dataset.component = component.name
      modalContainer.append(componentContainer)

      const componentTitle = document.createElement('h3')
      componentTitle.textContent = component.label
      componentContainer.append(componentTitle)
    })
  }

  showComponentOptions = (modalContainer, component) => {
    const form = document.createElement('form')
    form.classList.add('component-options-form')
    modalContainer.append(form)

    const tabsCointainerMenu = document.createElement('div')
    tabsCointainerMenu.classList.add('tabs-container-menu')
    form.append(tabsCointainerMenu)

    const tabsContainerItems = document.createElement('div')
    tabsContainerItems.classList.add('tabs-container-items')
    tabsCointainerMenu.append(tabsContainerItems)

    const tabsContainerItemsUl = document.createElement('ul')
    tabsContainerItems.append(tabsContainerItemsUl)

    component.options.structure.tabs.forEach(tab => {
      const tabsContainerItemsLi = document.createElement('li')
      tabsContainerItemsLi.classList.add('tab-item')
      tabsContainerItemsLi.dataset.tab = tab.name
      tabsContainerItemsLi.textContent = tab.label
      tabsContainerItemsUl.append(tabsContainerItemsLi)

      const tabContainer = document.createElement('div')
      tabContainer.classList.add('tab-panel')
      tabContainer.dataset.tab = tab.name
      form.append(tabContainer)

      component.options.structure.inputs[tab.name].forEach(input => {
        const formElementContainer = document.createElement('div')
        formElementContainer.classList.add('form-element', input.width)
        tabContainer.append(formElementContainer)

        const labelContainer = document.createElement('div')
        labelContainer.classList.add('form-element-label')
        formElementContainer.append(labelContainer)

        const label = document.createElement('label')
        label.textContent = input.label
        labelContainer.append(label)

        const inputContainer = document.createElement('div')
        inputContainer.classList.add('form-element-input')
        formElementContainer.append(inputContainer)

        const inputElement = document.createElement(input.element)
        inputElement.type = input.type
        inputElement.name = input.name
        inputElement.value = input.value
        inputContainer.append(inputElement)
      })
    })

    const applyButton = document.createElement('input')
    applyButton.type = 'submit'
    applyButton.classList.add('apply-options-button')
    applyButton.textContent = 'Aplicar cambios'
    modalContainer.append(applyButton)

    modalContainer.querySelector('.tab-item').classList.add('active')
    modalContainer.querySelector('.tab-panel').classList.add('active')
    this.renderTabs(modalContainer)

    const optionsValue = this.getOptionsInStructure(this.structure[this.component.size], this.component.uuid)

    if (optionsValue) {
      for (const [key, value] of Object.entries(optionsValue)) {
        const input = form.querySelector(`[name="${key}"]`)
        input.value = value
      }
    }
  }

  showJson = (modalContainer, size) => {
    const json = JSON.stringify(this.mapToObject(this.structure[size]), null, 2)

    const jsonContainer = document.createElement('pre')
    jsonContainer.textContent = json
    modalContainer.append(jsonContainer)
  }

  showPreview = (modalContainer, structure, size) => {
    const preview = document.createElement('div')
    preview.classList.add('preview', size)
    modalContainer.append(preview)

    this.renderStructure(preview, structure)
  }

  showRowOptions = (modalContainer) => {
    this.rowOptions.forEach(option => {
      const rowOption = document.createElement('div')
      rowOption.classList.add('row-option')
      rowOption.dataset.columns = option.columns
      rowOption.style.gridTemplateColumns = option.columns

      const numberColumns = option.columns.split(' ').length

      for (let i = 0; i < numberColumns; i++) {
        const column = document.createElement('div')
        column.classList.add('column')
        rowOption.append(column)
      }

      modalContainer.append(rowOption)
    })
  }

  updateRowComponent = (columns) => {
    const options = {}
    options.columns = columns
    this.updateOptionsInStructure(this.structure[this.component.size], this.component.uuid, options)

    const row = this.shadow.querySelector(`[data-uuid="${this.component.uuid}"]:not(button)`)
    row.classList.add('row')
    row.style.gridTemplateColumns = columns
    row.innerHTML = ''

    const countColumns = columns.split(' ').length

    for (let i = 0; i < countColumns; i++) {
      const column = document.createElement('div')
      column.classList.add('column')
      row.append(column)

      const uuid = Math.random().toString(36).substring(7)
      column.dataset.uuid = `${this.component.uuid}-${uuid}`

      const addButton = document.createElement('button')
      addButton.classList.add('add-button')
      addButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" /></svg>'
      column.append(addButton)
    }

    this.component = {}
  }

  renderStructure = (container, structure) => {
    for (const [key, outerValue] of Object.entries(structure)) {
      if (key === 'slot') {
        for (const [innerKey, innerValue] of Object.entries(outerValue)) {
          const component = document.createElement(innerKey)
          container.append(component)

          if (outerValue.options) {
            component.setAttribute('options', JSON.stringify(outerValue.options))
          }

          this.renderStructure(component, innerValue)
        }
      }

      if (outerValue instanceof Object) {
        const component = document.createElement(key)
        container.append(component)

        if (outerValue.options) {
          component.setAttribute('options', JSON.stringify(outerValue.options))
        }

        this.renderStructure(component, outerValue)
      }
    }
  }

  renderComponentModal = (modalContainer) => {
    modalContainer.addEventListener('click', (event) => {
      if (event.target.closest('.close-button')) {
        this.shadow.querySelector('.modal').classList.remove('active')
      }

      if (event.target.closest('.component')) {
        const component = this.components.find(component => component.name === event.target.closest('.component').dataset.component)
        this.addComponent(component)

        this.shadow.querySelector('.modal').classList.remove('active')
      }

      if (event.target.closest('.apply-options-button')) {
        const form = this.shadow.querySelector('.component-options-form')
        const formData = new FormData(form)
        const options = {}

        formData.forEach((value, key) => {
          options[key] = value
        })

        this.updateOptionsInStructure(this.structure[this.component.size], this.component.uuid, options)

        this.component = {}
        this.shadow.querySelector('.modal').classList.remove('active')
      }

      if (event.target.closest('.row-option')) {
        const rowOption = event.target.closest('.row-option')
        const columns = rowOption.dataset.columns

        this.updateRowComponent(columns)

        this.shadow.querySelector('.modal').classList.remove('active')
      }
    })
  }

  addComponent = (component) => {
    const tabActive = this.shadow.querySelector('.tab-panel.active')
    const addComponent = tabActive.querySelector('.add-component')

    const componentContainer = document.createElement('div')
    componentContainer.classList.add('component')

    const componentDetailsContainer = document.createElement('div')
    componentDetailsContainer.classList.add('component-details')
    componentContainer.append(componentDetailsContainer)

    const componentDetailsButtons = document.createElement('div')
    componentDetailsButtons.classList.add('component-details-buttons')
    componentDetailsContainer.append(componentDetailsButtons)

    const uuid = Math.random().toString(36).substring(7)

    if (component.name === 'row-component') {
      const rowButton = document.createElement('button')
      rowButton.classList.add('row-button')
      rowButton.dataset.uuid = uuid
      rowButton.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M4 5V18H21V5H4M14 7V16H11V7H14M6 7H9V16H6V7M19 16H16V7H19V16Z' /></svg>"
      componentDetailsButtons.append(rowButton)
    }

    const editButton = document.createElement('button')
    editButton.classList.add('edit-button')
    editButton.dataset.component = component.name
    editButton.dataset.uuid = uuid
    editButton.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z' /></svg>"
    componentDetailsButtons.append(editButton)

    const removeButton = document.createElement('button')
    removeButton.classList.add('remove-button')
    removeButton.dataset.uuid = uuid
    removeButton.innerHTML = "<svg viewBox='0 0 24 24'><path d='M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z'></path></svg>"
    componentDetailsButtons.append(removeButton)

    const componentTitle = document.createElement('span')
    componentTitle.textContent = component.label
    componentDetailsContainer.append(componentTitle)

    const collapseButton = document.createElement('button')
    collapseButton.classList.add('collapse-button')
    collapseButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.78,11.78L18.36,13.19L12,6.83L5.64,13.19L4.22,11.78L12,4L19.78,11.78Z" /></svg>'
    componentDetailsContainer.append(collapseButton)

    const newComponent = document.createElement('div')
    newComponent.classList.add('component-body')
    newComponent.dataset.uuid = uuid
    componentContainer.append(newComponent)

    if (component.slot) {
      const addButton = document.createElement('button')
      addButton.classList.add('add-button')
      addButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" /></svg>'
      newComponent.append(addButton)
    }

    // componentContainer.addEventListener('mouseover', event => {
    //   this.shadow.querySelectorAll('.component .component-details').forEach(componentDetails => {
    //     componentDetails.classList.remove('active')
    //   })

    //   componentContainer.querySelector('.component-details').classList.add('active')

    //   event.stopPropagation()
    // })

    const size = tabActive.dataset.tab

    if (this.component.parentUuid) {
      const slot = tabActive.querySelector(`[data-uuid="${this.component.parentUuid}"]:not(button)`)
      slot.before(componentContainer)

      if (this.component.parentUuid.includes('-')) {
        this.component.parentUuid = this.component.parentUuid.split('-')[0]
      }

      this.createSlotInStructure(this.structure[size], this.component.parentUuid, newComponent.dataset.uuid, component)
    } else {
      addComponent.before(componentContainer)
      this.createComponentInStructure(this.structure[size], newComponent.dataset.uuid, component)
    }

    this.component = {}
  }

  removeComponentInStructure (structure, uuid) {
    structure.forEach((value, key) => {
      if (value.uuid && value.uuid === uuid) {
        structure.delete(key)
      }

      if (value.slot) {
        this.removeComponentInStructure(value.slot, uuid)
      }
    })
  }

  createComponentInStructure = (structure, uuid, component) => {
    structure.set(component.name, {
      uuid
    })

    if (component.slot) {
      structure.get(component.name).slot = new Map()
    }
  }

  createSlotInStructure = (structure, parentUuid, uuid, component) => {
    structure.forEach((value, key) => {
      if (value.uuid && value.uuid === parentUuid) {
        value.slot.set(component.name, {
          uuid
        })

        if (component.slot) {
          value.slot.get(component.name).slot = new Map()
        }
      }

      if (value.slot) {
        this.createSlotInStructure(value.slot, parentUuid, uuid, component)
      }
    })
  }

  getOptionsInStructure = (structure, uuid) => {
    // eslint-disable-next-line no-unused-vars
    for (const [key, value] of structure) {
      if (value.uuid && value.uuid === uuid) {
        return value.options
      }

      if (value.slot) {
        const result = this.updateOptionsInStructure(value.slot, uuid)
        if (result) {
          return result
        }
      }
    }
  }

  updateOptionsInStructure = (structure, uuid, options) => {
    structure.forEach((value, key) => {
      if (value.uuid && value.uuid === uuid) {
        value.options = { ...value.options, ...options }
      }

      if (value.slot) {
        this.updateOptionsInStructure(value.slot, uuid, options)
      }
    })
  }

  mapToObject (map) {
    const object = {}
    for (const [key, value] of map.entries()) {
      if (value instanceof Map) {
        object[key] = this.mapToObject(value)
      } else if (value instanceof Object) {
        object[key] = this.mapToObject(new Map(Object.entries(value)))
      } else {
        object[key] = value
      }
    }
    return object
  }
}

customElements.define('page-generator-component', PageGenerator)
