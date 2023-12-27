const fs = require('fs')
const csv = require('csv-parser')
const organizationLevelsConstant = require('../../constants/organizationLevelsConstant')

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = Date.now()

    const parseCsvLine = (line) => {
      return {
        id: line.id,
        name: line.name,
        level: organizationLevelsConstant.ppk,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      }
    }

    const parseCsvLineHierarchy = (line) => {
      return [
        {
          ancestorId: 1, // PPG organization id
          descendantId: line.id,
          depth: 2,
          updatedAt: now,
        },
        {
          ancestorId: line.ppdId,
          descendantId: line.id,
          depth: 1,
          updatedAt: now,
        },
        {
          ancestorId: line.id,
          descendantId: line.id,
          depth: 0,
          updatedAt: now,
        },
      ]
    }

    const data = await new Promise((resolve, reject) => {
      const rows = []
      const rowHierarchies = []
      const filePath = 'files/ppk.csv'
      const readStream = fs.createReadStream(filePath)
      readStream.pipe(csv())
        .on('data', (line) => {
          rows.push(parseCsvLine(line))
          rowHierarchies.push(...parseCsvLineHierarchy(line))
        })
        .on('end', () => {
          resolve({ rows, rowHierarchies })
        })
        .on('error', (err) => {
          reject(err)
        })
    })

    await queryInterface.bulkInsert('organizations', data.rows)
    await queryInterface.bulkInsert('organizationHierarchies', data.rowHierarchies)
  }
}
