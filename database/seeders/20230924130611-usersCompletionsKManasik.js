const fs = require('fs')
const csv = require('csv-parser')

module.exports = {
  async up(queryInterface, Sequelize) {
    const materials = {
      "1": 1779,
      "2": 1780,
      "3": 1781,
      "4": 1782,
      "5": 1783,
      "6": 1784,
      "7": 1785,
      "8": 1786,
      "9": 1787,
      "10": 1788,
      "11": 1789,
      "12": 1790,
      "13": 1791,
      "14": 1792,
      "15": 1793,
      "16": 1794,
      "17": 1795,
      "18": 1796,
      "19": 1797,
      "20": 1798,
      "21": 1799,
      "22": 1800,
      "23": 1801,
      "24": 1802,
      "25": 1803,
      "26": 1804,
      "27": 1805,
      "28": 1806,
      "29": 1807,
      "30": 1808,
      "31": 1809,
      "32": 1810,
      "33": 1811,
      "34": 1812,
      "35": 1813,
      "36": 1814,
      "37": 1815,
      "38": 1816,
      "39": 1817,
      "40": 1818,
      "41": 1819,
      "42": 1820,
      "43": 1821,
      "44": 1822,
      "45": 1823,
      "46": 1824,
      "47": 1825,
      "48": 1826,
      "49": 1827,
      "50": 1828,
      "51": 1829,
  }

    const now = Date.now()

    const parseCsv = (line) => {
      return {
        userId: line.userId,
        materialId: line.materialId,
        createdAt: now,
      }
    }

    const data = await new Promise((resolve, reject) => {
      const rows = []
      const filePath = 'files/users-completions-kmanasik.csv'
      const readStream = fs.createReadStream(filePath)
      readStream.pipe(csv())
        .on('data', (line) => {
          const completedArray = [...new Set(JSON.parse(line.completed))]
          completedArray.forEach(materialId => {
            line.materialId = materials[materialId]
            rows.push(parseCsv(line))
          })
        })
        .on('end', () => {
          resolve({ rows })
        })
        .on('error', (err) => {
          reject(err)
        })
    })
    await queryInterface.bulkInsert('usersCompletions', data.rows)
  }
}
