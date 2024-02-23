import { createSlice } from '@reduxjs/toolkit'

export const crudSlice = createSlice({
  name: 'crud',
  initialState: {
    parentElement: {
      endPoint: null,
      data: null
    },
    formElement: {
      endPoint: null,
      data: null
    },
    tableEndpoint: null
  },
  reducers: {
    setParentElement: (state, action) => {
      state.parentElement = action.payload
    },
    showFormElement: (state, action) => {
      state.formElement = action.payload
    },
    refreshTable: (state, action) => {
      state.tableEndpoint = action.payload
    }
  }
})

export const { showFormElement, refreshTable, setParentElement } = crudSlice.actions

export default crudSlice.reducer
