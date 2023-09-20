const fs = require('fs')
const csv = require('csv-parser')

module.exports = {
  async up(queryInterface, Sequelize) {
    const materials = {
      "1": 1387,
      "10": 1396,
      "100": 1486,
      "101": 1487,
      "102": 1488,
      "11": 1397,
      "12": 1398,
      "13": 1399,
      "14": 1400,
      "15": 1401,
      "16": 1402,
      "17": 1403,
      "18": 1404,
      "19": 1405,
      "2": 1388,
      "20": 1406,
      "21": 1407,
      "22": 1408,
      "23": 1409,
      "24": 1410,
      "25": 1411,
      "26": 1412,
      "27": 1413,
      "28": 1414,
      "29": 1415,
      "3": 1389,
      "30": 1416,
      "31": 1417,
      "32": 1418,
      "33": 1419,
      "34": 1420,
      "35": 1421,
      "36": 1422,
      "37": 1423,
      "38": 1424,
      "39": 1425,
      "4": 1390,
      "40": 1426,
      "41": 1427,
      "42": 1428,
      "43": 1429,
      "44": 1430,
      "45": 1431,
      "46": 1432,
      "47": 1433,
      "48": 1434,
      "49": 1435,
      "5": 1391,
      "50": 1436,
      "51": 1437,
      "52": 1438,
      "53": 1439,
      "54": 1440,
      "55": 1441,
      "56": 1442,
      "57": 1443,
      "58": 1444,
      "59": 1445,
      "6": 1392,
      "60": 1446,
      "61": 1447,
      "62": 1448,
      "63": 1449,
      "64": 1450,
      "65": 1451,
      "66": 1452,
      "67": 1453,
      "68": 1454,
      "69": 1455,
      "7": 1393,
      "70": 1456,
      "71": 1457,
      "72": 1458,
      "73": 1459,
      "74": 1460,
      "75": 1461,
      "76": 1462,
      "77": 1463,
      "78": 1464,
      "79": 1465,
      "8": 1394,
      "80": 1466,
      "81": 1467,
      "82": 1468,
      "83": 1469,
      "84": 1470,
      "85": 1471,
      "86": 1472,
      "87": 1473,
      "88": 1474,
      "89": 1475,
      "9": 1395,
      "90": 1476,
      "91": 1477,
      "92": 1478,
      "93": 1479,
      "94": 1480,
      "95": 1481,
      "96": 1482,
      "97": 1483,
      "98": 1484,
      "99": 1485,
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
