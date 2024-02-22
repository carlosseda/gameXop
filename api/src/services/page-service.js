module.exports = class PageService {
  createPage = async (structure, environment) => {
    if (!structure) return

    if (structure instanceof Map) {
      for (const [component, attributes] of structure) {
        Object.entries(attributes).forEach(([key, value]) => {
          if (key === 'slot') {
            this.createPage(value, environment)
          }

          console.log(key, value)

          if (Array.isArray(value)) {
            value.forEach((item) => {
              console.log(item)
            })
          }
        })
      }
    }

    if (typeof structure === 'object' && structure !== null) {
      for (const [component, attributes] of Object.entries(structure)) {
        Object.entries(attributes).forEach(([key, value]) => {
          if (key === 'slot') {
            this.createPage(value, environment)
          }

          if (Array.isArray(value)) {
            value.forEach((item) => {
              console.log(item)
            })
          }
        })
      }
    }
  }
}
