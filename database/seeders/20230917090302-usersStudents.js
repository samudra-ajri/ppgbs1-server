const fs = require('fs')
const csv = require('csv-parser')

module.exports = {
  async up(queryInterface, Sequelize) {
    const parseCsvLine = (line) => {
      return{
        userId: line.userId,
        grade: line.grade,
        createdAt: line.createdAt,
        createdBy: line.createdBy,
        updatedAt: line.updatedAt,
        updatedBy: line.updatedBy,
      }
    }

    const data = await new Promise((resolve, reject) => {
      const rows = []
      const filePath = 'files/users-students.csv'
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

    await queryInterface.bulkInsert('students', data)
  }
}
