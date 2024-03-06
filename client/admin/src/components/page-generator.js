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
                { name: 'columns', element: 'input', type: 'text', label: 'Columns', value: '8fr 2fr', width: 'full-width' },
                { name: 'columnGap', element: 'input', type: 'text', label: 'Column Gap', value: '1rem', width: 'full-width' },
                { name: 'rowGap', element: 'input', type: 'text', label: 'Row Gap', value: '1rem', width: 'full-width' }
              ]
            }
          }
        }
      }
    ]
    this.uuidSlot = ''
    this.uuidOptions = ''
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
          padding: 1rem;
          position: relative;
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
          display: flex;
          gap: 1rem;
          opacity: 0;
          padding: 0.5rem;
          position: absolute;
          right: 0;
          top: 0;
          transition: opacity 0.3s ease;
          z-index: 1000;
        }

        .page .component .component-details.active{
          opacity: 1;
        }

        .component-details span{
          color: hsl(0 0% 100%);
          font-family: 'Lato', sans-serif;
          font-size: 0.8rem;
          margin: 0;
        }

        .component-details button{
          background-color: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .component-details button svg{
          height: 1.2rem;
          width: 1.2rem;
        }

        .component-details button svg path{
          fill: hsl(0 0% 100%);
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

        .component .add-button{
          width: 100%;
        }

        .add-button:hover{
          background-color: hsl(135 45% 40%);
        }

        .add-button svg{
          height: 2rem;
          fill: white;
          width: 2rem;
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
          padding: 1rem;
          width: 80%;
        }

        .modal-container .modal-container-header{
          display: flex;
          justify-content: flex-end;
          width: 100%;
        }

        .modal-container-header .close-button{
          background-color: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .modal-container-header .close-button svg{
          fill: hsl(236 55% 25%);
          height: 2rem;
          width: 2rem;
        }

        .modal-container-header .close-button svg:hover{
          fill: hsl(272 40% 35%);
        }

        .modal-container-body{
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          grid-template-rows: repeat(auto-fill, minmax(50px, 1fr));
          height: 90%;
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
          this.uuidSlot = addButton.parentElement.dataset.uuid
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
        this.uuidOptions = {
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

        this.removeComponent(this.structure[size], uuid)
        console.log(this.mapToObject(this.structure.xs))
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

    const optionsValue = this.getOptionsInStructure(this.structure[this.uuidOptions.size], this.uuidOptions.uuid)

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

        this.updateOptionsInStructure(this.structure[this.uuidOptions.size], this.uuidOptions.uuid, options)

        this.uuidOptions = {}
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

    const componentTitle = document.createElement('span')
    componentTitle.textContent = component.label
    componentDetailsContainer.append(componentTitle)

    const uuid = Math.random().toString(36).substring(7)

    const editButton = document.createElement('button')
    editButton.classList.add('edit-button')
    editButton.dataset.component = component.name
    editButton.dataset.uuid = uuid
    editButton.innerHTML = "<svg viewBox='0 0 24 24'><path fill='currentColor' d='M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z'></path></svg>"
    componentDetailsContainer.append(editButton)

    const removeButton = document.createElement('button')
    removeButton.classList.add('remove-button')
    removeButton.dataset.uuid = uuid
    removeButton.innerHTML = "<svg viewBox='0 0 24 24'><path d='M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z'></path></svg>"
    componentDetailsContainer.append(removeButton)

    const newComponent = document.createElement('div')
    newComponent.dataset.uuid = uuid
    componentContainer.append(newComponent)

    if (component.slot) {
      const addButton = document.createElement('button')
      addButton.classList.add('add-button')
      addButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" /></svg>'
      newComponent.append(addButton)
    }

    componentContainer.addEventListener('mouseover', event => {
      this.shadow.querySelectorAll('.component .component-details').forEach(componentDetails => {
        componentDetails.classList.remove('active')
      })

      componentContainer.querySelector('.component-details').classList.add('active')

      event.stopPropagation()
    })

    const size = tabActive.dataset.tab

    if (this.uuidSlot) {
      const slot = tabActive.querySelector(`[data-uuid="${this.uuidSlot}"]:not(button)`)
      slot.before(componentContainer)
      this.createSlotInStructure(this.structure[size], this.uuidSlot, newComponent.dataset.uuid, component)
    } else {
      addComponent.before(componentContainer)
      this.createComponentInStructure(this.structure[size], newComponent.dataset.uuid, component)
    }

    this.uuidSlot = ''
  }

  removeComponent (structure, uuid) {
    structure.forEach((value, key) => {
      if (value.uuid && value.uuid === uuid) {
        structure.delete(key)
      }

      if (value.slot) {
        this.removeComponent(value.slot, uuid)
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
        value.options = options
      }

      if (value.slot) {
        this.updateOptionsInStructure(value.slot, uuid, options)
      }
    })
  }

  mapToObject (map) {
    const obj = {}
    for (const [key, value] of map.entries()) {
      if (value instanceof Map) {
        obj[key] = this.mapToObject(value)
      } else if (value instanceof Object) {
        obj[key] = this.mapToObject(new Map(Object.entries(value)))
      } else {
        obj[key] = value
      }
    }
    return obj
  }
}

customElements.define('page-generator-component', PageGenerator)
