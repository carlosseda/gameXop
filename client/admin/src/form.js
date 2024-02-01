class Form extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.languages = []
    this.images = []
    this.structure = JSON.parse(this.getAttribute('structure').replaceAll("'", '"'))
  }

  async connectedCallback () {
    document.addEventListener('showElement', this.handleShowElement.bind(this))
    document.addEventListener('refreshForm', this.handleRefreshForm.bind(this))
    document.addEventListener('showDependants', this.handleShowDependants.bind(this))
    document.addEventListener('hideDependants', this.handleHideDependants.bind(this))
    document.addEventListener('attachImageToForm', this.handleAttachImageToForm.bind(this))

    await this.getLanguages()
    this.render()
  }

  handleShowElement = event => {
    if (event.detail.endpoint === this.getAttribute('endpoint')) {
      this.showElement(event.detail.element)
    }
  }

  handleRefreshForm = event => {
    if (event.detail.subtable === this.getAttribute('subtable')) {
      this.render()
    }
  }

  handleShowDependants = event => {
    if (this.getAttribute('')) {
      this.parentFormId = event.detail.parentFormId
      this.classList.remove('dependant')
    }
  }

  handleHideDependants = event => {
    if (this.getAttribute('dependant')) {
      this.parentFormId = null
      this.classList.add('dependant')
    }
  }

  handleAttachImageToForm = event => {
    this.attachImageToForm(event.detail.image)
  }

  getLanguages = async () => {
    if (!window.sessionStorage.getItem('languages')) {
      const endpoint = `${import.meta.env.VITE_API_URL}/api/admin/languages/get-languages`

      try {
        const response = await fetch(endpoint)

        if (response.ok) {
          const data = await response.json()
          this.languages = data
          window.sessionStorage.setItem('languages', JSON.stringify(data))
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      this.languages = JSON.parse(window.sessionStorage.getItem('languages'))
    }
  }

  render = async () => {
    this.shadow.innerHTML =
      /* html */`
        <style>
          :host(.dependant) {
            display: none;
          }

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
            height: 2.5em;
            display: flex;
            margin: 0;
            padding: 0;
          }
          
          .tabs-container-menu li{
            color: hsl(236 55% 25%);
            cursor: pointer;
            font-family: 'Lato' , sans-serif;
            list-style: none;
            font-weight: 600;
            padding: 0.5em;
            text-align: center;
          }
          
          .tabs-container-menu li.active,
          .tabs-container-menu li.active:hover{
            background-color: hsl(272 40% 35%);
            color: white;
          }

          .childrens-container.dependant{
            display: none;
          }
          
          .tabs-container-buttons{
            display: flex;
            gap: 0.5rem;
            padding: 0 0.5em;
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

          .errors-container{
            background-color: hsl(0, 0%, 100%);
            display: none;
            flex-direction: column;
            gap: 1em;
            margin-top: 1em;
            padding: 1em;
          }

          .errors-container.active{
            display: flex;
          }

          .errors-container .error-container{
            width: 100%;
          }

          .errors-container .error-container span{
            color: hsl(0, 0%, 50%);
            font-family: 'Lato' , sans-serif;
            font-size: 1em;
            font-weight: 600;
          }
          
          .tab-panel{
            display: none;
          }
          
          .tab-panel.active{
            display: flex;
            flex-wrap: wrap;
            gap: 1%;
            padding: 1em 0;
            width: 100%;
          }

          .form-element{
            margin-bottom: 1em;
            width: 100%;
          }

          .form-element.full-width {
            flex: 0 0 100%;
          }

          .form-element.half-width {
            flex: 0 0 49.5%;
          }

          .form-element.one-third-width {
            flex: 0 0 32%;
          }

          .form-element.one-quarter-width {
            flex: 0 0 23.5%;
          }

          .form-element-label{
            display: flex;
            justify-content: space-between;
            margin-bottom: 1em;
            width: 100%;
          }
          
          .form-element-label label,
          .form-element-label span{
            color: hsl(0, 0%, 100%);
            font-family: 'Lato' , sans-serif;
            font-weight: 600;
            font-size: 1em;
            transition: color 0.5s;
          }

          .form-element-label label.invalid::after{
            content: '*';
            color: hsl(0, 100%, 50%);
            font-size: 1.5em;
            margin-left: 0.2em;
          }

          .form-element-label,
          .form-element-input{
            width: 100%;
          }

          input[type="submit"]{
            background: none;
            color: inherit;
            border: none;
            padding: 0;
            font: inherit;
            cursor: pointer;
            outline: inherit;
          }
          
          .form-element-input input, 
          .form-element-input textarea,
          .form-element-input select {
            background-color:hsl(226deg 64% 66%);
            border: none;
            border-bottom: 0.1em solid hsl(0, 0%, 100%);
            border-radius: 0;
            box-sizing: border-box;
            color: hsl(0, 0%, 100%);
            font-family: 'Lato' , sans-serif;
            font-size: 1rem;
            font-weight: 600;
            padding: 0.5em;
            width: 100%;
          }

          .form-element-input input:focus,
          .form-element-input textarea:focus,
          .form-element-input select:focus{
            outline: none;
            border-bottom: 0.1em solid hsl(207, 85%, 69%);
          }

          .form-element-input input.invalid,
          .form-element-input textarea.invalid{
            border-bottom: 0.2em solid hsl(0, 100%, 50%);
          }

          .form-element-input textarea{
            height: 10em;
          }

          .form-element-input .checkbox-container,
          .form-element-input .radio-container{
            display: flex;
            align-items: center;
            gap: 0.5em;
          }

          .form-element-input .checkbox-container input,
          .form-element-input .radio-container input{
            width: 1em;
            height: 1em;
          }

          .form-element-input .checkbox-container label,
          .form-element-input .radio-container label{
            color: hsl(0, 0%, 100%);
            font-family: 'Lato' , sans-serif;
            font-weight: 600;
            font-size: 1em;
          }

          .form-element-input .range-container{
            display: flex;
            align-items: center;
            gap: 0.5em;
          }

          .form-element-input .range-container input{
            width: 100%;
          }

          .form-element-input .range-container label{
            color: hsl(0, 0%, 100%);
            font-family: 'Lato' , sans-serif;
            font-weight: 600;
            font-size: 1em;
          }

          .form-element-input .range-container .range-value{
            color: hsl(0, 0%, 100%);
            font-family: 'Lato' , sans-serif;
            font-weight: 600;
            font-size: 1em;
          }

          .form-element-input .range-container input[type="range"]{
            -webkit-appearance: none;
            width: 100%;
            height: 0.5em;
            border-radius: 0.5em;
            background: hsl(0, 0%, 100%);
            outline: none;
            opacity: 0.7;
            -webkit-transition: .2s;
            transition: opacity .2s;
          }

          .form-element-input input[type="time"]::-webkit-calendar-picker-indicator,
          .form-element-input input[type="date"]::-webkit-calendar-picker-indicator{
            filter: invert(1);
          }

          .childrens-container{
            display: flex;
            justify-content: space-between;
            width: 100%;
          }

          .childrens-container div{
            width: 48%;
          }
        </style>
        
        <form autocomplete="off">
                                
            <input autocomplete="false" name="hidden" type="text" style="display:none;">

            <div class="tabs-container-menu">
                <div class="tabs-container-items">
                   <ul>
                   </ul>
                </div>

                <div class="tabs-container-buttons">
                    <div id="create-button"> 
                        <svg viewBox="0 0 24 24">
                            <path d="M19.36,2.72L20.78,4.14L15.06,9.85C16.13,11.39 16.28,13.24 15.38,14.44L9.06,8.12C10.26,7.22 12.11,7.37 13.65,8.44L19.36,2.72M5.93,17.57C3.92,15.56 2.69,13.16 2.35,10.92L7.23,8.83L14.67,16.27L12.58,21.15C10.34,20.81 7.94,19.58 5.93,17.57Z" />
                        </svg>
                    </div>
                    <div id="store-button"> 
                        <label>
                            <input type="submit" value="">
                            <svg viewBox="0 0 24 24">
                                <path d="M0 0h24v24H0z" fill="none"/>
                                <path class="crud__create-button-icon" d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                            </svg>
                        </label> 
                    </div>
                </div>
            </div>

            <div class="errors-container">

            </div>

            <div class="tabs-container-content"></div>
        </form>
        <div class="childrens-container dependant"></div>
      `

    const form = this.shadow.querySelector('form')
    const tabsContainerItems = this.shadow.querySelector('.tabs-container-items ul')
    const tabsContainerContent = this.shadow.querySelector('.tabs-container-content')

    for (const tab in this.structure.tabs) {
      const tabName = this.structure.tabs[tab].name

      const tabElement = document.createElement('li')
      tabElement.classList.add('tab-item')
      tabElement.dataset.tab = tabName
      tabElement.innerHTML = this.structure.tabs[tab].label
      tabsContainerItems.append(tabElement)

      const tabPanel = document.createElement('div')
      tabPanel.dataset.tab = tabName
      tabPanel.classList.add('tab-panel')
      tabsContainerContent.append(tabPanel)

      if (this.structure.inputs[tabName].noLocale) {
        this.createFormElements(form, tabPanel, this.structure.inputs[tabName].noLocale)
      }

      if (this.structure.inputs[tabName].locale) {
        const localeTabsContainer = document.createElement('div')
        localeTabsContainer.classList.add('tabs-container-menu')
        tabPanel.append(localeTabsContainer)

        const localeTabsContainerItems = document.createElement('div')
        localeTabsContainerItems.classList.add('tabs-container-items')
        localeTabsContainer.append(localeTabsContainerItems)

        const localeTabsContainerItemsUl = document.createElement('ul')
        localeTabsContainerItems.append(localeTabsContainerItemsUl)

        this.languages.forEach((language, index) => {
          const localeTabElement = document.createElement('li')
          localeTabElement.classList.add('tab-item')
          localeTabElement.dataset.tab = `${tabName}-${language.alias}`
          localeTabElement.innerHTML = language.name
          localeTabsContainerItemsUl.append(localeTabElement)

          const localeTabPanel = document.createElement('div')
          localeTabPanel.dataset.tab = `${tabName}-${language.alias}`
          localeTabPanel.classList.add('tab-panel')
          tabPanel.append(localeTabPanel)

          if (index === 0) {
            localeTabElement.classList.add('active')
            localeTabPanel.classList.add('active')
          }

          this.createFormElements(form, localeTabPanel, this.structure.inputs[tabName].locale, language.alias)
        })
      }
    }

    this.renderTabs()
    this.renderSubmitForm()
    this.renderCreateForm()
  }

  createFormElements = async (form, tabPanel, elements, languageAlias = null) => {
    for (const field in elements) {
      const formElement = elements[field]
      const formElementContainer = document.createElement('div')
      formElementContainer.classList.add('form-element', formElement.width || 'full-width')

      if (formElement.label) {
        const formElementLabel = document.createElement('div')
        formElementContainer.append(formElementLabel)
        formElementLabel.classList.add('form-element-label')

        const label = document.createElement('label')
        label.innerText = formElement.label
        languageAlias ? label.setAttribute('for', `${formElement.name}-${languageAlias}`) : label.setAttribute('for', formElement.name)
        formElementLabel.append(label)
      }

      const formElementInput = document.createElement('div')
      formElementContainer.append(formElementInput)
      formElementInput.classList.add('form-element-input')

      if (formElement.element === 'input') {
        switch (formElement.type) {
          case 'hidden': {
            const input = document.createElement('input')
            input.type = formElement.type
            input.name = languageAlias ? `locales.${languageAlias}.${formElement.name}` : formElement.name
            input.value = formElement.value || ''

            form.append(input)

            continue
          }

          case 'checkbox':
          case 'radio': {
            const inputContainer = document.createElement('div')
            inputContainer.classList.add(`${formElement.type}-container`)

            if (formElement.endpoint) {
              const response = await fetch(`${import.meta.env.VITE_API_URL}${formElement.endpoint}`)
              formElement.options = await response.json()
            }

            formElement.options.forEach(option => {
              const input = document.createElement('input')
              const inputLabel = document.createElement('label')
              inputLabel.innerText = option.label
              input.id = languageAlias ? `${formElement.name}-${languageAlias}` : formElement.name
              input.type = formElement.type
              input.name = languageAlias ? `locales.${languageAlias}.${formElement.name}` : formElement.name
              input.name = formElement.prefix ? `${formElement.prefix}.${input.name}` : input.name
              input.value = option.value || ''
              input.checked = option.checked || false
              input.disabled = option.disabled || false

              inputContainer.append(inputLabel)
              inputContainer.append(input)
            })

            formElementInput.append(inputContainer)

            break
          }

          case 'range': {
            const rangeContainer = document.createElement('div')
            rangeContainer.classList.add('range-container')

            const input = document.createElement('input')
            input.id = languageAlias ? `${formElement.name}-${languageAlias}` : formElement.name
            input.type = formElement.type
            input.name = languageAlias ? `locales.${languageAlias}.${formElement.name}` : formElement.name
            input.name = formElement.prefix ? `${formElement.prefix}.${input.name}` : input.name
            input.min = formElement.min || ''
            input.max = formElement.max || ''
            input.step = formElement.step || ''
            input.value = formElement.value || ''
            rangeContainer.append(input)

            const rangeValue = document.createElement('span')
            rangeValue.classList.add('range-value')
            rangeValue.innerText = formElement.value
            rangeContainer.append(rangeValue)

            input.addEventListener('input', () => {
              rangeValue.innerText = input.value
            })

            formElementInput.append(rangeContainer)

            break
          }

          case 'number':
          case 'date':
          case 'time':
          case 'datetime-local':
          case 'month':
          case 'week': {
            const input = document.createElement('input')
            input.id = languageAlias ? `${formElement.name}-${languageAlias}` : formElement.name
            input.type = formElement.type
            input.name = languageAlias ? `locales.${languageAlias}.${formElement.name}` : formElement.name
            input.name = formElement.prefix ? `${formElement.prefix}.${input.name}` : input.name
            input.min = formElement.min || ''
            input.max = formElement.max || ''
            input.step = formElement.step || ''
            input.placeholder = formElement.placeholder || ''
            input.value = formElement.value || ''
            input.readOnly = formElement.readOnly || false
            input.dataset.validate = formElement.validate || ''

            formElementInput.append(input)

            break
          }

          case 'image': {
            const input = document.createElement('upload-image-button-component')
            input.id = languageAlias ? `${formElement.name}-${languageAlias}` : formElement.name
            input.setAttribute('name', formElement.name)
            languageAlias ? input.setAttribute('language-alias', languageAlias) : input.setAttribute('language-alias', import.meta.env.VITE_DEFAULT_LANGUAGE)
            input.setAttribute('quantity', formElement.quantity)

            // input.accept = formElement.accept || '';
            // input.multiple = formElement.multiple || false;
            // input.required = formElement.required || false;
            // input.dataset.validate = formElement.validate || '';

            formElementInput.append(input)

            break
          }

          default: {
            const input = document.createElement('input')
            input.id = languageAlias ? `${formElement.name}-${languageAlias}` : formElement.name
            input.type = formElement.type
            input.name = languageAlias ? `locales.${languageAlias}.${formElement.name}` : formElement.name
            input.name = formElement.prefix ? `${formElement.prefix}.${input.name}` : input.name
            input.value = formElement.value || ''
            input.placeholder = formElement.placeholder || ''
            input.dataset.validate = formElement.validate || ''

            if (formElement.maxLength) {
              input.maxLength = formElement.maxLength || ''
              const counter = document.createElement('span')
              formElementLabel.append(counter)

              input.addEventListener('input', () => {
                if (input.value.length > 0) {
                  counter.textContent = input.value.length + ' / ' + input.maxLength
                } else {
                  counter.textContent = ''
                }
              })
            }

            formElementInput.append(input)

            break
          }
        }
      }

      if (formElement.element === 'textarea') {
        const textarea = document.createElement('textarea')
        textarea.id = languageAlias ? `${formElement.name}-${languageAlias}` : formElement.name
        textarea.name = languageAlias ? `locales.${languageAlias}.${formElement.name}` : formElement.name
        textarea.disabled = formElement.disabled || false
        textarea.readOnly = formElement.readOnly || false
        textarea.value = formElement.value || ''
        textarea.cols = formElement.cols || ''
        textarea.rows = formElement.rows || ''
        textarea.wrap = formElement.wrap || ''
        textarea.placeholder = formElement.placeholder || ''
        textarea.dataset.validate = formElement.validate || ''

        if (formElement.maxLength) {
          textarea.maxLength = formElement.maxLength || ''
          const counter = document.createElement('span')
          formElementLabel.append(counter)

          textarea.addEventListener('input', () => {
            if (textarea.value.length > 0) {
              counter.textContent = textarea.value.length + ' / ' + textarea.maxLength
            } else {
              counter.textContent = ''
            }
          })
        }

        formElementInput.append(textarea)
      }

      if (formElement.element === 'select') {
        const select = document.createElement('select')
        select.id = languageAlias ? `${formElement.name}-${languageAlias}` : formElement.name
        select.name = languageAlias ? `locales.${languageAlias}.${formElement.name}` : formElement.name
        select.disabled = formElement.disabled || false
        select.required = formElement.required || false
        select.multiple = formElement.multiple || false

        formElement.options.forEach(option => {
          const optionElement = document.createElement('option')
          optionElement.value = option.value
          optionElement.innerText = option.label
          select.append(optionElement)
        })

        formElementInput.append(select)
      }

      if (formElement.element === 'subform') {
        const formContainer = document.createElement('div')
        formContainer.classList.add('subform-container')

        const formComponent = document.createElement('form-component')
        formComponent.setAttribute('subform', formElement.name)
        formComponent.setAttribute('endpoint', formElement.endpoint)
        formContainer.append(formComponent)

        const childrens = this.shadow.querySelector('.childrens-container')
        childrens.append(formContainer)
      }

      if (formElement.element === 'subtable') {
        const tableContainer = document.createElement('div')
        tableContainer.classList.add('subtable-container')

        const tableComponent = document.createElement('table-component')
        tableComponent.setAttribute('subtable', formElement.name)
        tableComponent.setAttribute('endpoint', formElement.endpoint)
        tableContainer.append(tableComponent)

        const childrens = this.shadow.querySelector('.childrens-container')
        childrens.append(tableContainer)
      }

      tabPanel.append(formElementContainer)
    };
  }

  renderTabs = () => {
    this.shadow.querySelector('.tab-item').classList.add('active')
    this.shadow.querySelector('.tab-panel').classList.add('active')
    const form = this.shadow.querySelector('form')

    form.addEventListener('click', (event) => {
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

  renderSubmitForm = () => {
    this.shadow.querySelector('#store-button').addEventListener('click', async (event) => {
      event.preventDefault()

      const form = this.shadow.querySelector('form')

      if (!this.validateForm(form.elements)) {
        return
      }

      const formData = new FormData(form)

      if (this.parentFormId) {
        formData.append('parentFormId', this.parentFormId)
      }

      const formDataJson = {}

      for (const [key, value] of formData.entries()) {
        if (key.includes('locales')) {
          const [prefix, locales, field] = key.split('.')

          if (!(prefix in formDataJson)) {
            formDataJson[prefix] = {}
          }

          if (!(locales in formDataJson[prefix])) {
            formDataJson[prefix][locales] = {}
          }

          formDataJson[prefix][locales][field] = value ?? null
        } else if (key.includes('.')) {
          const [prefix, field] = key.split('.')

          if (!(prefix in formDataJson)) {
            formDataJson[prefix] = {}
          }

          formDataJson[prefix][field] = value ?? null
        } else {
          formDataJson[key] = value ?? null
        }
      }

      if (this.shadow.querySelectorAll('input[type="checkbox"]').length > 0) {
        const checkboxesByName = {}

        this.shadow.querySelectorAll('input[type="checkbox"]:checked').forEach(checkedCheckbox => {
          if (!checkboxesByName[checkedCheckbox.name]) {
            checkboxesByName[checkedCheckbox.name] = []
          }

          checkboxesByName[checkedCheckbox.name].push(checkedCheckbox.value)
        })

        Object.keys(checkboxesByName).forEach(name => {
          if (name.includes('.')) {
            const [prefix, field] = name.split('.')
            formDataJson[prefix][field] = checkboxesByName[name]
          } else {
            formDataJson[name] = checkboxesByName[name]
          }
        })
      }

      if (this.images) {
        formDataJson.images = this.images
      }

      const endpoint = formDataJson.id ? `${import.meta.env.VITE_API_URL}${this.getAttribute('endpoint')}/${formDataJson.id}` : `${import.meta.env.VITE_API_URL}${this.getAttribute('endpoint')}`
      const method = formDataJson.id ? 'PUT' : 'POST'
      delete formDataJson.id

      try {
        const response = await fetch(endpoint, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formDataJson)
        })

        if (response.status === 500) {
          throw response
        }

        if (response.status === 200) {
          const data = await response.json()

          document.dispatchEvent(new CustomEvent('message', {
            detail: {
              message: 'Datos guardados correctamente',
              type: 'success'
            }
          }))

          this.images = []
          this.render()

          document.dispatchEvent(new CustomEvent('refreshTable', {
            detail: {
              subtable: this.getAttribute('subtable') ? this.getAttribute('subtable') : null,
              endpoint: this.getAttribute('endpoint'),
              data: data.rows ? data.rows : null
            }
          }))
        }
      } catch (error) {
        const data = await error.json()

        if (data.errors) {
          data.errors.forEach(error => {
            const errorContainer = document.createElement('div')
            const errorMessage = document.createElement('span')
            errorContainer.classList.add('error-container')
            errorMessage.textContent = error.message
            errorContainer.append(errorMessage)

            this.shadow.querySelector('.errors-container').append(errorContainer)
            this.shadow.querySelector('.errors-container').classList.add('active')
          })

          document.dispatchEvent(new CustomEvent('message', {
            composed: true,
            detail: {
              message: 'Fallo al guardar los datos',
              type: 'error'
            }
          }))
        }

        if (data.message) {
          document.dispatchEvent(new CustomEvent('message', {
            detail: {
              message: data.message || 'Fallo al guardar los datos',
              type: 'error'
            }
          }))
        }
      }
    })
  }

  renderCreateForm = () => {
    this.shadow.querySelector('#create-button').addEventListener('click', () => {
      this.images = []
      this.render()
    })
  }

  validateForm = formInputs => {
    let validForm = true

    const validators = {
      required: {
        regex: /\S/g,
        message: 'El campo es obligatorio'
      },
      onlyLetters: {
        regex: /^[a-zA-Z\s]+$/g,
        message: 'El campo sólo puede contener letras'
      },
      onlyNumbers: {
        regex: /\d/g,
        message: 'El campo sólo puede contener números'
      },
      telephone: {
        regex: /^\d{9}$/g,
        message: 'El campo debe contener 9 números'
      },
      email: {
        regex: /\w+@\w+\.\w+/g,
        message: 'El campo debe contener un email válido'
      },
      password: {
        regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/g,
        message: 'El campo debe contener al menos 8 caracteres, una mayúscula, una minúscula y un número'
      },
      date: {
        regex: /^\d{4}-\d{2}-\d{2}$/g,
        message: 'El campo debe contener una fecha válida'
      },
      time: {
        regex: /^\d{2}:\d{2}$/g,
        message: 'El campo debe contener una hora válida'
      },
      datetime: {
        regex: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/g,
        message: 'El campo debe contener una fecha y hora válida'
      },
      dni: {
        regex: /^\d{8}[a-zA-Z]$/g,
        message: 'El campo debe contener un DNI válido'
      },
      nif: {
        regex: /^[a-zA-Z]\d{7}[a-zA-Z]$/g,
        message: 'El campo debe contener un NIF válido'
      },
      cif: {
        regex: /^[a-zA-Z]\d{7}[a-zA-Z0-9]$/g,
        message: 'El campo debe contener un CIF válido'
      },
      postalCode: {
        regex: /^\d{5}$/g,
        message: 'El campo debe contener un código postal válido'
      },
      creditCard: {
        regex: /^\d{16}$/g,
        message: 'El campo debe contener una tarjeta de crédito válida'
      },
      iban: {
        regex: /^[a-zA-Z]{2}\d{22}$/g,
        message: 'El campo debe contener un IBAN válido'
      },
      url: {
        regex: /^(http|https):\/\/\w+\.\w+/g,
        message: 'El campo debe contener una URL válida'
      },
      ip: {
        regex: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/g,
        message: 'El campo debe contener una IP válida'
      },
      mac: {
        regex: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/g,
        message: 'El campo debe contener una MAC válida'
      },
      image: {
        regex: /\.(gif|jpg|jpeg|tiff|png)$/g,
        message: 'El campo debe contener una imagen válida'
      },
      video: {
        regex: /\.(avi|mp4|mov|wmv|flv|mkv)$/g,
        message: 'El campo debe contener un vídeo válido'
      },
      audio: {
        regex: /\.(mp3|wav|ogg|flac|aac)$/g,
        message: 'El campo debe contener un audio válido'
      },
      pdf: {
        regex: /\.(pdf)$/g,
        message: 'El campo debe contener un PDF válido'
      },
      doc: {
        regex: /\.(doc|docx)$/g,
        message: 'El campo debe contener un documento válido'
      },
      xls: {
        regex: /\.(xls|xlsx)$/g,
        message: 'El campo debe contener una hoja de cálculo válida'
      },
      ppt: {
        regex: /\.(ppt|pptx)$/g,
        message: 'El campo debe contener una presentación válida'
      },
      zip: {
        regex: /\.(zip|rar|7z|tar|gz)$/g,
        message: 'El campo debe contener un archivo comprimido válido'
      }
    }

    for (let i = 0; i < formInputs.length; i++) {
      if (formInputs[i].dataset.validate) {
        formInputs[i].dataset.validate.split(',').forEach((option) => {
          if (formInputs[i].value.match(validators[option].regex) == null) {
            if (!formInputs[i].classList.contains('invalid')) {
              formInputs[i].classList.add('invalid')
              formInputs[i].closest('.form-element').querySelector('label').classList.add('invalid')

              const errorContainer = document.createElement('div')
              const errorMessage = document.createElement('span')
              errorContainer.classList.add('error-container')
              errorMessage.textContent = `${formInputs[i].closest('.form-element').querySelector('label').textContent}: ${validators[option].message}`
              errorContainer.append(errorMessage)

              this.shadow.querySelector('.errors-container').append(errorContainer)
            }

            validForm = false
          } else {
            formInputs[i].classList.remove('invalid')
            formInputs[i].closest('.form-element').querySelector('label').classList.remove('invalid')
          }
        })
      }
    }

    if (!validForm) {
      this.shadow.querySelector('.errors-container').classList.add('active')

      document.dispatchEvent(new CustomEvent('message', {
        detail: {
          message: 'Los datos del formulario no son válidos',
          type: 'error'
        }
      }))
    }

    return validForm
  }

  showElement = element => {
    this.shadow.querySelector('form').reset()
    this.images = []

    Object.entries(element).forEach(([key, value]) => {
      if (this.shadow.querySelector(`[name="${key}"]`)) {
        if (typeof value === 'object') {
          value = JSON.stringify(value, null, 2)
        }

        this.shadow.querySelector(`[name="${key}"]`).value = value !== 'null' ? value : ''

        if (this.shadow.querySelector(`[name="${key}"]`).tagName === 'SELECT') {
          const options = this.shadow.querySelector(`[name="${key}"]`).querySelectorAll('option')

          options.forEach(option => {
            if (option.value === value) {
              option.setAttribute('selected', true)
            }
          })
        }

        if (this.shadow.querySelector(`[name="${key}"]`).type === 'radio') {
          const radios = this.shadow.querySelector(`[name="${key}"]`).closest('.form-element').querySelectorAll('input[type="radio"]')

          radios.forEach(radio => {
            if (radio.value === value) {
              radio.setAttribute('checked', true)
            }
          })
        }

        if (this.shadow.querySelector(`[name="${key}"]`).type === 'checkbox') {
          const checkbox = this.shadow.querySelectorAll(`[name="${key}"]`)

          checkbox.forEach(check => {
            if (value.includes(check.value)) {
              check.setAttribute('checked', true)
            }
          })
        }
      }

      if (typeof value === 'object') {
        if (key === 'images') {
          document.dispatchEvent(new CustomEvent('showThumbnails', {
            detail: {
              images: value
            }
          }))
        } else if (key === 'locales') {
          Object.entries(value).forEach(([languageAlias, localeValue]) => {
            Object.entries(localeValue).forEach(([name, fieldValue]) => {
              if (this.shadow.querySelector(`[name="locales\\.${languageAlias}\\.${name}"]`)) {
                this.shadow.querySelector(`[name="locales\\.${languageAlias}\\.${name}"]`).value = fieldValue !== 'null' ? fieldValue : ''
              }
            })
          })
        } else {
          Object.entries(value).forEach(([name, fieldValue]) => {
            this.shadow.querySelector(`[name="${key}.${name}"]`).value = fieldValue !== 'null' ? fieldValue : ''
          })
          // document.dispatchEvent(new CustomEvent('showDependants', {
          //   detail: {
          //     subtable: key,
          //     data: value,
          //     parentFormId: element.id
          //   }
          // }))
        }
      }
    })
  }

  attachImageToForm = async attachedImage => {
    const index = this.images.findIndex(image =>
      image.filename === attachedImage.previousImage &&
      image.languageAlias === attachedImage.languageAlias &&
      image.name === attachedImage.name
    )

    if (index === -1) {
      this.images.push(attachedImage)
    } else {
      if (attachedImage.delete && attachedImage.create) {
        this.images.splice(index, 1)
      }

      if (attachedImage.update && attachedImage.create) {
        this.images.splice(index, 1)
        this.images[index] = attachedImage
        delete attachedImage.update
      } else {
        this.images.splice(index, 1)
        this.images[index] = attachedImage
      }
    }
  }
}

customElements.define('form-component', Form)
