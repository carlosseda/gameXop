const data = [
  {
    name: 'Carlos',
    email: 'carlossedagambin@gmail.com',
    password: '$2a$10$OnvTYuwyyYtRTWZAlpTdrew/KupyyrWD4aJsFyzOab7xj8mqbJn16'
  }
]

module.exports = async function (mongoose) {
  async function insertSeeder () {
    const Model = require('../../models/mongoose/user.js')(mongoose)
    await Model.insertMany(data)
  }

  insertSeeder()
}
