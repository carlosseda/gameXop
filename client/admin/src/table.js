class Table extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.eventsAdded = new Set()
    this.data = []
    this.structure = JSON.parse(this.getAttribute('structure').replaceAll("'", '"'))
  }

  async connectedCallback () {
    document.addEventListener('refreshTable', this.handleRefreshTable.bind(this))
    document.addEventListener('newFilter', this.handleNewFilter.bind(this))
    document.addEventListener('showSubtable', this.handleShowSubtable.bind(this))

    this.loadData().then(() => this.render())
  }

  async handleRefreshTable (event) {
    if (event.detail.endpoint === this.getAttribute('endpoint')) {
      this.loadData(event.detail.data).then(() => this.render())
    }
  }

  async handleNewFilter (event) {
    if (event.detail.endpoint === this.getAttribute('endpoint')) {
      this.data = event.detail.rows
      this.total = event.detail.total
      this.currentPage = event.detail.currentPage
      this.lastPage = event.detail.lastPage
      this.queryString = event.detail.queryString

      this.render()
    }
  }

  async handleShowSubtable (event) {
    if (event.detail.subtable === this.getAttribute('subtable')) {
      this.tableStructure = await this.setTableStructure()
      this.loadData(event.detail.data).then(() => this.render())
    }
  }

  async loadData (data = null) {
    if (data) {
      this.data = data
      return
    }

    const endpoint = `${import.meta.env.VITE_API_URL}${this.getAttribute('endpoint')}`

    try {
      const response = await fetch(endpoint)

      if (response.status === 200) {
        const data = await response.json()
        this.data = data.rows
        this.total = data.meta.total
        this.currentPage = data.meta.currentPage
        this.lastPage = data.meta.pages
      } else if (response.status === 500) {
        throw response
      }
    } catch (error) {
      console.log(error)
    }
  }

  async render () {
    this.shadow.innerHTML =
      /* html */`
      <style>

        button {
          background-color: transparent;
          border: none;
          cursor: pointer;
        }

        .table {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 1.5rem;
        }

        .table-buttons {
          background-color: hsl(0, 0%, 100%);
          box-shadow: 5px 10px 19px -7px rgba(0,0,0,0.75);
          display: flex;
          padding: 0 0.5rem;
        }

        .table-button{
          align-items: center;
          display: flex;
          padding: 0.2rem;
        }

        .table-button svg {
          width: 2rem;
        }

        .table-button svg path {
          fill: hsl(236 55% 25%);
        }

        .table-button:hover svg path {
          fill: hsl(272 40% 35%);
        }

        .table-records{
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 1rem;
          min-height: 70vh;
          max-height: 70vh;
          padding: 1rem 10%;
          overflow-x: hidden;
          overflow-y: auto;
        }

        .table-records::-webkit-scrollbar{
          width: 0.7rem; 
        }

        .table-records::-webkit-scrollbar-thumb{
          background-color: $secondary-color;
        }

        .table-records::-webkit-scrollbar-thumb:hover{
          background-color: $hover-color;
        }

        .table-record-buttons {
          background-color: hsl(0, 0%, 100%);
          display: flex;
          justify-content: flex-end;
        }

        .table-record-buttons button svg{
          width: 2rem;
        }

        .table-record-buttons svg path{
          fill: hsl(236 55% 25%);
        }

        .table-record-buttons button:hover svg path{
          fill: hsl(272 40% 35%);
        }

        .table-no-records {
          background-color: hsl(272 40% 35%);
          padding: 0.5rem;
        }

        .table-no-records p {
          color: hsl(0, 0%, 100%);
          font-family: 'Lato', sans-serif;
          font-weight: 400;
          margin: 0;
          text-align: center;
        }

        .table-data{
          background-color: hsl(0, 0%, 0%);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          list-style: none;
          margin: 0;
          padding: 0.5rem;
        }

        .table-data li{
          color: hsl(0, 0%, 100%);
          font-family: 'Lato', sans-serif;
          font-weight: 400;
        }

        .table-data li span {   
          color: hsl(0, 0%, 100%);
          font-family: 'Lato', sans-serif;  
          font-weight: 400;
        }

        .table-data li span::after {
          content: ":";
          margin-right: 0.5rem;
        }

        .table-pagination{
          background-color: hsl(0, 0%, 100%);
          box-shadow: 5px 10px 19px -7px rgba(0, 0, 0, 0.75);
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1rem;
        }

        .table-pagination-info{
          display: flex;
          justify-content: space-between;
        }

        .table-pagination-info span{
          color: hsl(0, 0%, 0%);
          font-family: 'Lato', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          margin: 0;
        }

        .table-pagination-pages{
          display: flex;
          gap: 0.5rem;
        }

        .table-pagination-page button{
          color: $secondary-color;
          font-family: sans-serif;
          font-weight: 700;
        }

        .table-pagination-page.active button{
          color: $hover-color;
        }

        .table-pagination-page:hover button{
          color: $hover-color;
        }

        .table-pagination-page.inactive button{
          color: hsl(0, 0%, 69%);
          cursor: not-allowed;
        }


      </style>

      <section class="table-buttons"></section>
      <div class="table"></div>
    `

    if (this.structure.tableButtons) {
      const tableButtons = this.shadow.querySelector('.table-buttons')

      Object.keys(this.structure.tableButtons).forEach(tableButton => {
        const tableButtonElement = document.createElement('button')
        tableButtonElement.classList.add('table-button')

        if (this.structure.tableButtons[tableButton] === 'filterButton') {
          tableButtonElement.classList.add('table-filter-button')
          tableButtonElement.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11 11L16.76 3.62A1 1 0 0 0 16.59 2.22A1 1 0 0 0 16 2H2A1 1 0 0 0 1.38 2.22A1 1 0 0 0 1.21 3.62L7 11V16.87A1 1 0 0 0 7.29 17.7L9.29 19.7A1 1 0 0 0 10.7 19.7A1 1 0 0 0 11 18.87V11M13 16L18 21L23 16Z" /></svg>
          `
        }

        tableButtons.appendChild(tableButtonElement)
      })
    }

    if (!this.getAttribute('subtable')) {
      this.shadow.innerHTML +=
      `
        <div class="table-pagination">
          <div class="table-pagination-info">
            <div class="table-pagination-total">      
              <span>${this.total} registro en total</span>
            </div>
            <div class="table-pagination-pages">
              <div class="table-pagination-page" data-pagination="">
                <button><<</button>
              </div>

              <div class="table-pagination-page active" data-pagination="">
                <button>1</button>
              </div>

              <div class="table-pagination-ellipsis">
                <span>...</span>
              </div>

              <div class="table-pagination-page active">
                <button>3</button>
              </div>

              <div class="table-pagination-ellipsis">
                <span>...</span>
              </div>

              <div class="table-pagination-page">
                <button>5</button>
              </div>

              <div class="table-pagination-page" data-pagination="">
                <button>>></button>
              </div>
            </div>
          </div>
        </div>
      `
    }

    await this.getTableData()
    await this.renderTableButtons()
    await this.renderPaginationButtons()
  }

  async getTableData () {
    const table = this.shadow.querySelector('.table')
    const tableRecords = document.createElement('div')
    tableRecords.classList.add('table-records')
    table.appendChild(tableRecords)

    if (this.data.length === 0) {
      const tableNoRecords = document.createElement('div')
      tableNoRecords.classList.add('table-no-records')
      const message = document.createElement('p')
      message.innerHTML = 'No hay registros'
      tableNoRecords.appendChild(message)
      tableRecords.appendChild(tableNoRecords)
      return
    }

    this.data.forEach(element => {
      const tableRow = document.createElement('div')
      tableRow.classList.add('table-row')

      const tableButtons = document.createElement('div')
      tableButtons.classList.add('table-record-buttons')
      tableRow.appendChild(tableButtons)

      const tableRowData = document.createElement('ul')
      tableRowData.classList.add('table-data')
      tableRow.appendChild(tableRowData)

      const headers = this.structure.headers
      const recordButtons = this.structure.recordButtons

      Object.keys(headers).forEach(key => {
        const tableElementData = document.createElement('li')
        const tableDataHeader = document.createElement('span')

        tableDataHeader.classList.add('table-data-header')
        tableDataHeader.innerHTML = headers[key].label
        tableElementData.appendChild(tableDataHeader)

        if (element[headers[key].field]) {
          tableElementData.innerHTML += element[headers[key].field]
        }

        tableRowData.appendChild(tableElementData)
      })

      Object.keys(recordButtons).forEach((recordButton) => {
        const tableButton = document.createElement('button')
        tableButton.classList.add('table-button')

        if (recordButtons[recordButton] === 'edit') {
          tableButton.classList.add('edit-button')
          tableButton.dataset.id = element.id
          tableButton.innerHTML = `
                        <svg viewBox="0 0 24 24">
                            <path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                        </svg>`
        }

        if (recordButtons[recordButton] === 'remove') {
          tableButton.classList.add('remove-button')
          tableButton.dataset.id = element.id
          tableButton.innerHTML = `
                        <svg viewBox="0 0 24 24">
                            <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                        </svg>`
        }

        tableButtons.appendChild(tableButton)
      })

      tableRecords.appendChild(tableRow)
    })
  }

  async renderTableButtons () {
    const editButtons = this.shadow.querySelectorAll('.edit-button')
    const removeButtons = this.shadow.querySelectorAll('.remove-button')

    editButtons.forEach(editButton => {
      editButton.addEventListener('click', async () => {
        const endpoint = import.meta.env.VITE_API_URL + this.getAttribute('endpoint') + '/' + editButton.dataset.id

        try {
          const response = await fetch(endpoint)

          if (response.status === 500 || response.status === 404) {
            throw response
          }

          if (response.status === 200) {
            const data = await response.json()
            document.dispatchEvent(new CustomEvent('showElement', {
              detail: {
                endpoint: this.getAttribute('endpoint'),
                element: data
              }
            }))
          }
        } catch (error) {
          const data = await error.json()

          document.dispatchEvent(new CustomEvent('message', {
            detail: {
              message: data.message || 'Fallo al cargar el elemento',
              type: 'error'
            }
          }))
        }
      })
    })

    removeButtons.forEach(removeButton => {
      removeButton.addEventListener('click', () => {
        const endPoint = import.meta.env.VITE_API_URL + this.getAttribute('endpoint') + '/' + removeButton.dataset.id

        document.dispatchEvent(new CustomEvent('showDeleteModal', {
          detail: {
            endPoint,
            endpoint: this.getAttribute('endpoint'),
            subtable: this.getAttribute('subtable') ? this.getAttribute('subtable') : null
          }
        }))
      })
    })
  }

  async renderPaginationButtons () {
    const tablePaginationButtons = this.shadow.querySelectorAll('.table-pagination-button')

    tablePaginationButtons.forEach(tablePaginationButton => {
      tablePaginationButton.addEventListener('click', async () => {
        let page

        switch (tablePaginationButton.id) {
          case 'firstPageUrl':
            page = 1
            break

          case 'previousPageUrl':
            if (this.currentPage === 1) return
            page = parseInt(this.currentPage) - 1
            break

          case 'nextPageUrl':
            if (this.currentPage === this.lastPage) return
            page = parseInt(this.currentPage) + 1
            break

          case 'lastPageUrl':
            page = this.lastPage
            break
        }

        const endpoint = this.queryString ? `${import.meta.env.VITE_API_URL}${this.getAttribute('endpoint')}?page=${page}&${this.queryString}` : `${import.meta.env.VITE_API_URL}${this.getAttribute('endpoint')}?page=${page}`

        try {
          const response = await fetch(endpoint)

          if (response.status === 500) {
            throw response
          }

          if (response.status === 200) {
            const data = await response.json()
            this.data = data.rows
            this.total = data.meta.total
            this.currentPage = data.meta.currentPage
            this.lastPage = data.meta.pages

            this.render()
          }
        } catch (error) {
          const data = await error.json()

          document.dispatchEvent(new CustomEvent('message', {
            detail: {
              message: data.message || 'Fallo al cargar los datos',
              type: 'error'
            }
          }))
        }
      })
    })
  }
}

customElements.define('table-component', Table)
