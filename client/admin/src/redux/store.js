import { configureStore } from '@reduxjs/toolkit'
import imagesReducer from './images-slice'

export const store = configureStore({
  reducer: {
    images: imagesReducer
  }
})

export default store
