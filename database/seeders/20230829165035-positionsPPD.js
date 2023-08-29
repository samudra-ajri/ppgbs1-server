const fs = require('fs')
const csv = require('csv-parser')
const positionTypes = require('../../constants/positionTypesConstant')

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = Date.now()
    const parseCsvLine = (line) => {
      const data = []
      for (let key in positionTypes) {
        if ([positionTypes.ADMIN, positionTypes.PENGURUS].includes(key)) {
          data.push({
            name: `${positionTypes[key]} ${line.name}`,
            type: key,
            organization_id: line.id,
            created_at: now,
            updated_at: now,
            deleted_at: null,
          })
        }
      }

      return data
    }

    const data = await new Promise((resolve, reject) => {
      const rows = []
      const filePath = 'files/ppd.csv'
      const readStream = fs.createReadStream(filePath)
      readStream.pipe(csv())
        .on('data', (line) => {
          rows.push(...parseCsvLine(line))
        })
        .on('end', () => {
          resolve(rows)
        })
        .on('error', (err) => {
          reject(err)
        })
    })

    await queryInterface.bulkInsert('positions', data)
  }
}
