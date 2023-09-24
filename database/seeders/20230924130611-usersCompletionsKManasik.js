const fs = require('fs')
const csv = require('csv-parser')

module.exports = {
  async up(queryInterface, Sequelize) {
    const materials = {
      "1": 1780,
      "10": 1789,
      "11": 1790,
      "12": 1791,
      "13": 1792,
      "14": 1793,
      "15": 1794,
      "16": 1795,
      "17": 1796,
      "18": 1797,
      "19": 1798,
      "2": 1781,
      "20": 1799,
      "21": 1800,
      "22": 1801,
      "23": 1802,
      "24": 1803,
      "25": 1804,
      "26": 1805,
      "27": 1806,
      "28": 1807,
      "29": 1808,
      "3": 1782,
      "30": 1809,
      "31": 1810,
      "32": 1811,
      "33": 1812,
      "34": 1813,
      "35": 1814,
      "36": 1815,
      "37": 1816,
      "38": 1817,
      "39": 1818,
      "4": 1783,
      "40": 1819,
      "41": 1820,
      "42": 1821,
      "43": 1822,
      "44": 1823,
      "45": 1824,
      "46": 1825,
      "47": 1826,
      "48": 1827,
      "49": 1828,
      "5": 1784,
      "50": 1829,
      "51": 1830,
      "6": 1785,
      "7": 1786,
      "8": 1787,
      "9": 1788,
    }

    const now = Date.now()

    const parseCsv = (line) => {
      return {
        userId: line.id,
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
          const completedArray = JSON.parse(line.completed)
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
