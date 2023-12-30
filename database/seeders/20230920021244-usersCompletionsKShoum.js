const fs = require('fs')
const csv = require('csv-parser')

module.exports = {
  async up(queryInterface, Sequelize) {
    const materials = {
      "1": 1288,
      "2": 1289,
      "3": 1290,
      "4": 1291,
      "5": 1292,
      "6": 1293,
      "7": 1294,
      "8": 1295,
      "9": 1296,
      "10": 1297,
      "11": 1298,
      "12": 1299,
      "13": 1300,
      "14": 1301,
      "15": 1302,
      "16": 1303,
      "17": 1304,
      "18": 1305,
      "19": 1306,
      "20": 1307,
      "21": 1308,
      "22": 1309,
      "23": 1310,
      "24": 1311,
      "25": 1312,
      "26": 1313,
      "27": 1314,
      "28": 1315,
      "29": 1316,
      "30": 1317,
      "31": 1318,
      "32": 1319,
      "33": 1320,
      "34": 1321,
      "35": 1322,
      "36": 1323,
      "37": 1324,
      "38": 1325,
      "39": 1326,
      "40": 1327,
      "41": 1328,
      "42": 1329,
      "43": 1330,
      "44": 1331,
      "45": 1332,
      "46": 1333,
      "47": 1334,
      "48": 1335,
      "49": 1336,
      "50": 1337,
      "51": 1338,
      "52": 1339,
      "53": 1340,
      "54": 1341,
      "55": 1342,
      "56": 1343,
      "57": 1344,
      "58": 1345,
      "59": 1346,
      "60": 1347,
      "61": 1348,
      "62": 1349,
      "63": 1350,
      "64": 1351,
      "65": 1352,
      "66": 1353,
      "67": 1354,
      "68": 1355,
      "69": 1356,
      "70": 1357,
      "71": 1358,
      "72": 1359,
      "73": 1360,
      "74": 1361,
      "75": 1362,
      "76": 1363,
      "77": 1364,
      "78": 1365,
      "79": 1366,
      "80": 1367,
      "81": 1368,
      "82": 1369,
      "83": 1370,
      "84": 1371,
      "85": 1372,
      "86": 1373,
      "87": 1374,
      "88": 1375,
      "89": 1376,
      "90": 1377,
      "91": 1378,
      "92": 1379,
      "93": 1380,
      "94": 1381,
      "95": 1382,
      "96": 1383,
      "97": 1384,
      "98": 1385,
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
