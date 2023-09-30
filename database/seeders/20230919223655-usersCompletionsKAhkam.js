const fs = require('fs')
const csv = require('csv-parser')

module.exports = {
  async up(queryInterface, Sequelize) {
    const materials = {
      "1": 1593,
      "10": 1602,
      "100": 1692,
      "101": 1693,
      "102": 1694,
      "103": 1695,
      "104": 1696,
      "105": 1697,
      "106": 1698,
      "107": 1699,
      "108": 1700,
      "109": 1701,
      "11": 1603,
      "110": 1702,
      "111": 1703,
      "112": 1704,
      "113": 1705,
      "114": 1706,
      "115": 1707,
      "116": 1708,
      "117": 1709,
      "118": 1710,
      "119": 1711,
      "12": 1604,
      "120": 1712,
      "121": 1713,
      "122": 1714,
      "123": 1715,
      "124": 1716,
      "13": 1605,
      "14": 1606,
      "15": 1607,
      "16": 1608,
      "17": 1609,
      "18": 1610,
      "19": 1611,
      "2": 1594,
      "20": 1612,
      "21": 1613,
      "22": 1614,
      "23": 1615,
      "24": 1616,
      "25": 1617,
      "26": 1618,
      "27": 1619,
      "28": 1620,
      "29": 1621,
      "3": 1595,
      "30": 1622,
      "31": 1623,
      "32": 1624,
      "33": 1625,
      "34": 1626,
      "35": 1627,
      "36": 1628,
      "37": 1629,
      "38": 1630,
      "39": 1631,
      "4": 1596,
      "40": 1632,
      "41": 1633,
      "42": 1634,
      "43": 1635,
      "44": 1636,
      "45": 1637,
      "46": 1638,
      "47": 1639,
      "48": 1640,
      "49": 1641,
      "5": 1597,
      "50": 1642,
      "51": 1643,
      "52": 1644,
      "53": 1645,
      "54": 1646,
      "55": 1647,
      "56": 1648,
      "57": 1649,
      "58": 1650,
      "59": 1651,
      "6": 1598,
      "60": 1652,
      "61": 1653,
      "62": 1654,
      "63": 1655,
      "64": 1656,
      "65": 1657,
      "66": 1658,
      "67": 1659,
      "68": 1660,
      "69": 1661,
      "7": 1599,
      "70": 1662,
      "71": 1663,
      "72": 1664,
      "73": 1665,
      "74": 1666,
      "75": 1667,
      "76": 1668,
      "77": 1669,
      "78": 1670,
      "79": 1671,
      "8": 1600,
      "80": 1672,
      "81": 1673,
      "82": 1674,
      "83": 1675,
      "84": 1676,
      "85": 1677,
      "86": 1678,
      "87": 1679,
      "88": 1680,
      "89": 1681,
      "9": 1601,
      "90": 1682,
      "91": 1683,
      "92": 1684,
      "93": 1685,
      "94": 1686,
      "95": 1687,
      "96": 1688,
      "97": 1689,
      "98": 1690,
      "99": 1691,
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
      const filePath = 'files/users-completions-kahkam.csv'
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