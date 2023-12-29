const fs = require('fs')
const csv = require('csv-parser')

module.exports = {
  async up(queryInterface, Sequelize) {
    const materials = {
      "1": 1716,
      "2": 1717,
      "3": 1718,
      "4": 1719,
      "5": 1720,
      "6": 1721,
      "7": 1722,
      "8": 1723,
      "9": 1724,
      "10": 1725,
      "11": 1726,
      "12": 1727,
      "13": 1728,
      "14": 1729,
      "15": 1730,
      "16": 1731,
      "17": 1732,
      "18": 1733,
      "19": 1734,
      "20": 1735,
      "21": 1736,
      "22": 1737,
      "23": 1738,
      "24": 1739,
      "25": 1740,
      "26": 1741,
      "27": 1742,
      "28": 1743,
      "29": 1744,
      "30": 1745,
      "31": 1746,
      "32": 1747,
      "33": 1748,
      "34": 1749,
      "35": 1750,
      "36": 1751,
      "37": 1752,
      "38": 1753,
      "39": 1754,
      "40": 1755,
      "41": 1756,
      "42": 1757,
      "43": 1758,
      "44": 1759,
      "45": 1760,
      "46": 1761,
      "47": 1762,
      "48": 1763,
      "49": 1764,
      "50": 1765,
      "51": 1766,
      "52": 1767,
      "53": 1768,
      "54": 1769,
      "55": 1770,
      "56": 1771,
      "57": 1772,
      "58": 1773,
      "59": 1774,
      "60": 1775,
      "61": 1776,
      "62": 1777,
      "63": 1778,
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
