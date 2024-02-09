import { createSlice } from '@reduxjs/toolkit'

export const imagesSlice = createSlice({
  name: 'images',
  initialState: {
    imageGallery: null,
    showedImage: null,
    showedImages: [],
    selectedImages: []
  },
  reducers: {
    setImageGallery: (state, action) => {
      state.imageGallery = action.payload
    },
    showImages: (state, action) => {
      state.showedImages = action.payload
    },
    addImage: (state, action) => {
      state.selectedImages.push(action.payload)
    },
    removeImage: (state, action) => {
      const index = state.selectedImages.findIndex(image =>
        image.filename === action.payload.filename &&
        image.languageAlias === action.payload.languageAlias &&
        image.name === action.payload.name
      )

      if (index !== -1) {
        state.selectedImages.splice(index, 1)
      }
    },
    removeImages: (state, action) => {
      state.selectedImages = []
      state.showedImages = []
    }
  }
})

export const { setImageGallery, showImages, addImage, removeImage, removeImages } = imagesSlice.actions

export default imagesSlice.reducer
