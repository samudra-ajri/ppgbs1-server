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
        level: organizationLevelsConstant.ppd,
        created_at: now,
        updated_at: now,
        deleted_at: null,
      }
    }

    const parseCsvLineHierarchy = (line) => {
      return [
        {
          ancestor_id: 1, // PPG organization id
          descendant_id: line.id,
          depth: 1,
          updated_at: now,
        },
        {
          ancestor_id: line.id,
          descendant_id: line.id,
          depth: 0,
          updated_at: now,
        },
      ]
    }

    const data = await new Promise((resolve, reject) => {
      const rows = []
      const rowHierarchies = []
      const filePath = 'files/ppd.csv'
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
    await queryInterface.bulkInsert('organization_hierarchies', data.rowHierarchies)
  }
}
