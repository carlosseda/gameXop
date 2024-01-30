const sequelizeDb = require('../models/sequelize')
const Op = sequelizeDb.Sequelize.Op
const ApiTracking = sequelizeDb.ApiTracking
const PageTracking = sequelizeDb.PageTracking
const CustomerTracking = sequelizeDb.CustomerTracking

module.exports = class TrackingService {
  async createApiLog (log) {
    try {
      await ApiTracking.create(log)
    } catch (error) {
      console.log(error)
    }
  }

  async createPageLog (log) {
    try {
      await PageTracking.create(log)
    } catch (error) {
      console.log(error)
    }
  }

  // async createFunctionLog(log) {
  //   try {
  //     await Tracking.create(log)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  async findAllLogs () {
    try {
      const customerTracking = await CustomerTracking.findAll({
        order: [['eventTime', 'DESC']]
      })

      const apiTracking = await ApiTracking.findAll({
        order: [['startTime', 'DESC']]
      })

      const combinedResults = customerTracking.concat(apiTracking)

      const sortedResults = combinedResults.sort((a, b) => {
        const eventTimeA = a.eventTime || a.startTime
        const eventTimeB = b.eventTime || b.startTime
        return eventTimeB - eventTimeA
      })

      return sortedResults
    } catch (error) {
      console.log(error)
    }
  }

  async findCustomerLogs (userId = null, fingerprint = null, order = 'ASC') {
    try {
      const customerTracking = await CustomerTracking.findAll({
        attributes: ['id', 'eventTime', 'eventName', 'path'],
        order: [['eventTime', 'ASC']],
        [Op.or]: [
          { userId },
          { fingerprint }
        ]
      })

      const apiTracking = await ApiTracking.findAll({
        attributes: ['id', 'startTime', 'resource', 'method', 'httpCode', 'latencyMs'],
        order: [['startTime', 'ASC']],
        [Op.or]: [
          { userId },
          { fingerprint }
        ]
      })

      const combinedResults = customerTracking.concat(apiTracking)

      const sortedResults = combinedResults.sort((a, b) => {
        const eventTimeA = a.eventTime || a.startTime
        const eventTimeB = b.eventTime || b.startTime
        let result

        if (order === 'DESC') {
          result = eventTimeB - eventTimeA
        }

        if (order === 'ASC') {
          result = eventTimeA - eventTimeB
        }

        return result
      })

      return sortedResults
    } catch (error) {
      console.log(error)
    }
  }
}
