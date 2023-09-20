const fs = require('fs')
const csv = require('csv-parser')

module.exports = {
  async up(queryInterface, Sequelize) {
    const materials = {
      "1": 1289,
      "10": 1298,
      "11": 1299,
      "12": 1300,
      "13": 1301,
      "14": 1302,
      "15": 1303,
      "16": 1304,
      "17": 1305,
      "18": 1306,
      "19": 1307,
      "2": 1290,
      "20": 1308,
      "21": 1309,
      "22": 1310,
      "23": 1311,
      "24": 1312,
      "25": 1313,
      "26": 1314,
      "27": 1315,
      "28": 1316,
      "29": 1317,
      "3": 1291,
      "30": 1318,
      "31": 1319,
      "32": 1320,
      "33": 1321,
      "34": 1322,
      "35": 1323,
      "36": 1324,
      "37": 1325,
      "38": 1326,
      "39": 1327,
      "4": 1292,
      "40": 1328,
      "41": 1329,
      "42": 1330,
      "43": 1331,
      "44": 1332,
      "45": 1333,
      "46": 1334,
      "47": 1335,
      "48": 1336,
      "49": 1337,
      "5": 1293,
      "50": 1338,
      "51": 1339,
      "52": 1340,
      "53": 1341,
      "54": 1342,
      "55": 1343,
      "56": 1344,
      "57": 1345,
      "58": 1346,
      "59": 1347,
      "6": 1294,
      "60": 1348,
      "61": 1349,
      "62": 1350,
      "63": 1351,
      "64": 1352,
      "65": 1353,
      "66": 1354,
      "67": 1355,
      "68": 1356,
      "69": 1357,
      "7": 1295,
      "70": 1358,
      "71": 1359,
      "72": 1360,
      "73": 1361,
      "74": 1362,
      "75": 1363,
      "76": 1364,
      "77": 1365,
      "78": 1366,
      "79": 1367,
      "8": 1296,
      "80": 1368,
      "81": 1369,
      "82": 1370,
      "83": 1371,
      "84": 1372,
      "85": 1373,
      "86": 1374,
      "87": 1375,
      "88": 1376,
      "89": 1377,
      "9": 1297,
      "90": 1378,
      "91": 1379,
      "92": 1380,
      "93": 1381,
      "94": 1382,
      "95": 1383,
      "96": 1384,
      "97": 1385,
      "98": 1386,
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
      const filePath = 'files/users-completions-kshoum.csv'
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
