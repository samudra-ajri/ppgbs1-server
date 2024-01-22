const fs = require('fs')
const csv = require('csv-parser')
const positionTypes = require('../../constants/positionTypesConstant')

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = Date.now()
    const parseCsvLine = (line) => {
      const data = []
      for (let key in positionTypes) {
        data.push({
          name: `${positionTypes[key]} ${line.name}`,
          type: key,
          organizationId: line.id,
          ancestorOrgId: line.ppdId,
          createdAt: now,
          updatedAt: now,
          deletedAt: null,
        })
      }

      return data
    }

    const data = await new Promise((resolve, reject) => {
      const rows = []
      const filePath = 'files/ppk.csv'
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
