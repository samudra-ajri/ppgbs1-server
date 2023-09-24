const fs = require('fs')
const csv = require('csv-parser')

module.exports = {
  async up(queryInterface, Sequelize) {
    const materials = {
      "1": 1717,
      "10": 1726,
      "11": 1727,
      "12": 1728,
      "13": 1729,
      "14": 1730,
      "15": 1731,
      "16": 1732,
      "17": 1733,
      "18": 1734,
      "19": 1735,
      "2": 1718,
      "20": 1736,
      "21": 1737,
      "22": 1738,
      "23": 1739,
      "24": 1740,
      "25": 1741,
      "26": 1742,
      "27": 1743,
      "28": 1744,
      "29": 1745,
      "3": 1719,
      "30": 1746,
      "31": 1747,
      "32": 1748,
      "33": 1749,
      "34": 1750,
      "35": 1751,
      "36": 1752,
      "37": 1753,
      "38": 1754,
      "39": 1755,
      "4": 1720,
      "40": 1756,
      "41": 1757,
      "42": 1758,
      "43": 1759,
      "44": 1760,
      "45": 1761,
      "46": 1762,
      "47": 1763,
      "48": 1764,
      "49": 1765,
      "5": 1721,
      "50": 1766,
      "51": 1767,
      "52": 1768,
      "53": 1769,
      "54": 1770,
      "55": 1771,
      "56": 1772,
      "57": 1773,
      "58": 1774,
      "59": 1775,
      "6": 1722,
      "60": 1776,
      "61": 1777,
      "62": 1778,
      "63": 1779,
      "7": 1723,
      "8": 1724,
      "9": 1725,
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
      const filePath = 'files/users-completions-kjihad.csv'
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
