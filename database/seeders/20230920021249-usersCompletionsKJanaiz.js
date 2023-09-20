const fs = require('fs')
const csv = require('csv-parser')

module.exports = {
  async up(queryInterface, Sequelize) {
    const materials = {
      "1": 1210,
      "10": 1219,
      "11": 1220,
      "12": 1221,
      "13": 1222,
      "14": 1223,
      "15": 1224,
      "16": 1225,
      "17": 1226,
      "18": 1227,
      "19": 1228,
      "2": 1211,
      "20": 1229,
      "21": 1230,
      "22": 1231,
      "23": 1232,
      "24": 1233,
      "25": 1234,
      "26": 1235,
      "27": 1236,
      "28": 1237,
      "29": 1238,
      "3": 1212,
      "30": 1239,
      "31": 1240,
      "32": 1241,
      "33": 1242,
      "34": 1243,
      "35": 1244,
      "36": 1245,
      "37": 1246,
      "38": 1247,
      "39": 1248,
      "4": 1213,
      "40": 1249,
      "41": 1250,
      "42": 1251,
      "43": 1252,
      "44": 1253,
      "45": 1254,
      "46": 1255,
      "47": 1256,
      "48": 1257,
      "49": 1258,
      "5": 1214,
      "50": 1259,
      "51": 1260,
      "52": 1261,
      "53": 1262,
      "54": 1263,
      "55": 1264,
      "56": 1265,
      "57": 1266,
      "58": 1267,
      "59": 1268,
      "6": 1215,
      "60": 1269,
      "61": 1270,
      "62": 1271,
      "63": 1272,
      "64": 1273,
      "65": 1274,
      "66": 1275,
      "67": 1276,
      "68": 1277,
      "69": 1278,
      "7": 1216,
      "70": 1279,
      "71": 1280,
      "72": 1281,
      "73": 1282,
      "74": 1283,
      "75": 1284,
      "76": 1285,
      "77": 1286,
      "78": 1287,
      "79": 1288,
      "8": 1217,
      "9": 1218,
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
      const filePath = 'files/users-completions-kjanaiz.csv'
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
