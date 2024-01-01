const fs = require('fs')
const csv = require('csv-parser')

const now = Date.now()

const parseCsvLine = (line) => ({
  material: line.material,
  grade: line.grade,
  subject: line.subject,
  category: line.category,
  subcategory: line.subcategory,
  createdAt: now,
  deletedAt: null,
})

const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const rows = []
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (line) => rows.push(parseCsvLine(line)))
      .on('end', () => resolve(rows))
      .on('error', reject)
  })
}

module.exports = {
  async up(queryInterface, Sequelize) {
    for (let i = 0; i <= 16; i++) {
      try {
        const rows = await parseCSV(`files/Subject-Alim-${i}.csv`)
        await queryInterface.bulkInsert('materials', rows)
        await queryInterface.sequelize.query(
          "SELECT setval('materials_id_seq', (SELECT MAX(id) FROM materials) + 1, false);"
        )
      } catch (error) {
        console.error(`Error processing file Subject-Alim-${i}.csv:`, error)
      }
    }
  },
}
