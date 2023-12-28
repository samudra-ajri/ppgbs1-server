const fs = require('fs')
const csv = require('csv-parser')

module.exports = {
  async up(queryInterface, Sequelize) {
    const parseCsvLine = (line) => {
      return{
        userId: line.userId,
        positionId: line.positionId,
        isMain: line.isMain,
        createdAt: line.createdAt,
      }
    }			

    const data = await new Promise((resolve, reject) => {
      const rows = []
      const filePath = 'files/users-usersPositions.csv'
      const readStream = fs.createReadStream(filePath)
      readStream.pipe(csv())
        .on('data', (line) => {
          rows.push(parseCsvLine(line))
        })
        .on('end', () => {
          resolve(rows)
        })
        .on('error', (err) => {
          reject(err)
        })
    })

    await queryInterface.bulkInsert('usersPositions', data)
  }
}
