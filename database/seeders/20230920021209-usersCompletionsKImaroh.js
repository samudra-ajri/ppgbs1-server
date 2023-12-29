const fs = require('fs')
const csv = require('csv-parser')

module.exports = {
  async up(queryInterface, Sequelize) {
    const materials = {
      "1": 1386,
      "2": 1387,
      "3": 1388,
      "4": 1389,
      "5": 1390,
      "6": 1391,
      "7": 1392,
      "8": 1393,
      "9": 1394,
      "10": 1395,
      "11": 1396,
      "12": 1397,
      "13": 1398,
      "14": 1399,
      "15": 1400,
      "16": 1401,
      "17": 1402,
      "18": 1403,
      "19": 1404,
      "20": 1405,
      "21": 1406,
      "22": 1407,
      "23": 1408,
      "24": 1409,
      "25": 1410,
      "26": 1411,
      "27": 1412,
      "28": 1413,
      "29": 1414,
      "30": 1415,
      "31": 1416,
      "32": 1417,
      "33": 1418,
      "34": 1419,
      "35": 1420,
      "36": 1421,
      "37": 1422,
      "38": 1423,
      "39": 1424,
      "40": 1425,
      "41": 1426,
      "42": 1427,
      "43": 1428,
      "44": 1429,
      "45": 1430,
      "46": 1431,
      "47": 1432,
      "48": 1433,
      "49": 1434,
      "50": 1435,
      "51": 1436,
      "52": 1437,
      "53": 1438,
      "54": 1439,
      "55": 1440,
      "56": 1441,
      "57": 1442,
      "58": 1443,
      "59": 1444,
      "60": 1445,
      "61": 1446,
      "62": 1447,
      "63": 1448,
      "64": 1449,
      "65": 1450,
      "66": 1451,
      "67": 1452,
      "68": 1453,
      "69": 1454,
      "70": 1455,
      "71": 1456,
      "72": 1457,
      "73": 1458,
      "74": 1459,
      "75": 1460,
      "76": 1461,
      "77": 1462,
      "78": 1463,
      "79": 1464,
      "80": 1465,
      "81": 1466,
      "82": 1467,
      "83": 1468,
      "84": 1469,
      "85": 1470,
      "86": 1471,
      "87": 1472,
      "88": 1473,
      "89": 1474,
      "90": 1475,
      "91": 1476,
      "92": 1477,
      "93": 1478,
      "94": 1479,
      "95": 1480,
      "96": 1481,
      "97": 1482,
      "98": 1483,
      "99": 1484,
      "100": 1485,
      "101": 1486,
      "102": 1487,
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
      const filePath = 'files/users-completions-kimaroh.csv'
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
