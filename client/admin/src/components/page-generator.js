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
        form: {
          structure: {
            tabs: [
              { name: 'general', label: 'General' }
            ],
            inputs: {
              general: [
                { name: 'backgroundColor', element: 'input', type: 'color', label: 'Background Color', value: 'transparent' },
                { name: 'height', element: 'input', type: 'text', label: 'Height', value: '5vh' },
                { name: 'paddingTop', element: 'input', type: 'text', label: 'Padding Top', value: '0' },
                { name: 'paddingBottom', element: 'input', type: 'text', label: 'Padding Bottom', value: '0' },
                { name: 'paddingLeft', element: 'input', type: 'text', label: 'Padding Left', value: '0' },
                { name: 'paddingRight', element: 'input', type: 'text', label: 'Padding Right', value: '0' }
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
        screenSizes: ['xs', 'sm', 'md', 'lg']
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

        .component-modal{
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

        .component-modal.active{
          opacity: 1;
          visibility: visible;
        }

        .component-modal-container{
          background-color: white;
          box-sizing: border-box;
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          grid-template-rows: repeat(auto-fill, minmax(50px, 1fr));
          height: 80%;
          padding: 1rem;
          width: 80%;
        }

        .component-modal-container:has(form){
          display: flex;
          flex-direction: column;
          width: 40%;
        }

        .component-modal-container .component{
          align-items: center;
          background-color: hsl(272 40% 35%);
          border: 1px solid hsl(0 0% 50%);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .component-modal-container .component:hover{
          background-color: hsl(272 40% 45%);
        }

        .component-modal-container .component h3{
          color: hsl(0 0% 100%);
          font-family: 'Lato', sans-serif;
          font-size: 1rem;
          margin: 0;
        }
      </style>
    `

    const componentModal = document.createElement('div')
    componentModal.classList.add('component-modal')
    this.shadow.append(componentModal)

    const componentModalContainer = document.createElement('div')
    componentModalContainer.classList.add('component-modal-container')
    componentModal.append(componentModalContainer)

    const pageGenerator = document.createElement('div')
    pageGenerator.classList.add('page-generator')
    this.shadow.append(pageGenerator)

    this.createTabsContent(pageGenerator)
    this.renderTabs(pageGenerator)
    this.renderButtons(pageGenerator)
    this.renderComponentModal(componentModalContainer)
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

    const tabsContainerContent = document.createElement('div')
    tabsContainerContent.classList.add('tabs-container-content')
    pageGenerator.append(tabsContainerContent)

    Object.keys(this.structure).forEach(screenSize => {
      const tabPanel = document.createElement('div')
      tabPanel.classList.add('tab-panel')
      tabPanel.setAttribute('data-tab', screenSize)
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

        console.log(tabClicked.closest('.page-generator'))

        tabClicked.closest('.page-generator').querySelector(`.tab-panel.active[data-tab="${tabActive.dataset.tab}"]`).classList.remove('active')
        tabClicked.closest('.page-generator').querySelector(`.tab-panel[data-tab="${tabClicked.dataset.tab}"]`).classList.add('active')
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
        const addButton = event.target.closest('.add-button')

        if (addButton.parentElement.dataset.uuid) {
          this.uuidSlot = addButton.parentElement.dataset.uuid
        }

        const addComponentModal = this.shadow.querySelector('.component-modal')
        addComponentModal.classList.add('active')
        const size = this.shadow.querySelector('.tab-panel.active').dataset.tab
        const components = this.components.filter(component => component.screenSizes.includes(size))
        const componentModalContainer = this.shadow.querySelector('.component-modal-container')
        componentModalContainer.innerHTML = ''
        this.showComponents(componentModalContainer, components)
      }

      if (event.target.closest('.edit-button')) {
        const editButton = event.target.closest('.edit-button')
        this.uuidOptions = editButton.dataset.uuid

        const component = this.components.find(component => component.name === editButton.dataset.component)
        const optionsComponentModal = this.shadow.querySelector('.component-modal')
        optionsComponentModal.classList.add('active')
        const optionsComponentModalContainer = this.shadow.querySelector('.component-modal-container')

        optionsComponentModalContainer.innerHTML = ''
        this.showComponentOptions(optionsComponentModalContainer, component, this.uuidOptions)
      }

      if (event.target.closest('.remove-button')) {
        event.target.closest('.component').remove()

        const size = this.shadow.querySelector('.tab-panel.active').dataset.tab
        const uuid = event.target.closest('.remove-button').dataset.uuid

        this.removeComponent(this.structure[size], uuid)
        console.log(this.mapToObject(this.structure.xs))
      }
    })
  }

  showComponents = (componentModalContainer, components) => {
    components.forEach(component => {
      const componentContainer = document.createElement('div')
      componentContainer.classList.add('component')
      componentContainer.dataset.component = component.name
      componentModalContainer.append(componentContainer)

      const componentTitle = document.createElement('h3')
      componentTitle.textContent = component.label
      componentContainer.append(componentTitle)
    })
  }

  showComponentOptions = (componentModalContainer, component, uuid) => {
    const form = document.createElement('form')
    form.classList.add('component-options-form')
    componentModalContainer.append(form)

    component.form.structure.tabs.forEach(tab => {
      const tabContainer = document.createElement('div')
      tabContainer.classList.add('tab-container')
      tabContainer.dataset.tab = tab.name
      form.append(tabContainer)

      if (tab.name === 'general') {
        tabContainer.classList.add('active')
      }

      component.form.structure.inputs[tab.name].forEach(input => {
        const inputContainer = document.createElement('div')
        inputContainer.classList.add('input-container')
        tabContainer.append(inputContainer)

        const label = document.createElement('label')
        label.textContent = input.label
        inputContainer.append(label)

        const inputElement = document.createElement(input.element)
        inputElement.type = input.type
        inputElement.name = input.name
        inputElement.value = input.value
        inputContainer.append(inputElement)
      })
    })

    const submitButton = document.createElement('button')
    submitButton.classList.add('apply-options-button')
    submitButton.textContent = 'Aplicar'
    componentModalContainer.append(submitButton)
  }

  renderComponentModal = (componentModalContainer) => {
    componentModalContainer.addEventListener('click', (event) => {
      if (event.target.closest('.component')) {
        const component = this.components.find(component => component.name === event.target.closest('.component').dataset.component)
        this.addComponent(component)

        const addComponentModal = this.shadow.querySelector('.component-modal')
        addComponentModal.classList.remove('active')
      }

      if (event.target.closest('.apply-options-button')) {
        const optionsComponentModal = this.shadow.querySelector('.component-modal')
        optionsComponentModal.classList.remove('active')

        const form = this.shadow.querySelector('.component-options-form')
        const formData = new FormData(form)
        let options = {}

        formData.forEach((value, key) => {
          options[key] = value
        })

        options = JSON.stringify(options)
        this.shadow.querySelector(`[data-uuid="${this.uuidOptions}"]:not(button)`).setAttribute('options', options)
        this.uuidOptions = ''
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

    const newComponent = document.createElement(component.name)
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

    if (this.uuidSlot) {
      const slot = tabActive.querySelector(`[data-uuid="${this.uuidSlot}"]:not(button)`)
      slot.before(componentContainer)
    } else {
      addComponent.before(componentContainer)
    }

    const size = tabActive.dataset.tab

    if (this.uuidSlot) {
      this.findUUIDInStructure(this.structure[size], this.uuidSlot, component, newComponent)
    } else {
      this.structure[size].set(component.name, {
        uuid: newComponent.dataset.uuid
      })

      if (component.slot) {
        this.structure[size].get(component.name).slot = new Map()
      }
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

  findUUIDInStructure (structure, uuid, component, newComponent) {
    structure.forEach((value, key) => {
      if (value.uuid && value.uuid === uuid) {
        value.slot.set(component.name, {
          uuid: newComponent.dataset.uuid
        })

        if (component.slot) {
          value.slot.get(component.name).slot = new Map()
        }
      }

      if (value.slot) {
        this.findUUIDInStructure(value.slot, uuid, component, newComponent)
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
