const fs = require('fs')
const csv = require('csv-parser')

module.exports = {
  async up(queryInterface, Sequelize) {
    const materials = {
      "1": 1209,
      "2": 1210,
      "3": 1211,
      "4": 1212,
      "5": 1213,
      "6": 1214,
      "7": 1215,
      "8": 1216,
      "9": 1217,
      "10": 1218,
      "11": 1219,
      "12": 1220,
      "13": 1221,
      "14": 1222,
      "15": 1223,
      "16": 1224,
      "17": 1225,
      "18": 1226,
      "19": 1227,
      "20": 1228,
      "21": 1229,
      "22": 1230,
      "23": 1231,
      "24": 1232,
      "25": 1233,
      "26": 1234,
      "27": 1235,
      "28": 1236,
      "29": 1237,
      "30": 1238,
      "31": 1239,
      "32": 1240,
      "33": 1241,
      "34": 1242,
      "35": 1243,
      "36": 1244,
      "37": 1245,
      "38": 1246,
      "39": 1247,
      "40": 1248,
      "41": 1249,
      "42": 1250,
      "43": 1251,
      "44": 1252,
      "45": 1253,
      "46": 1254,
      "47": 1255,
      "48": 1256,
      "49": 1257,
      "50": 1258,
      "51": 1259,
      "52": 1260,
      "53": 1261,
      "54": 1262,
      "55": 1263,
      "56": 1264,
      "57": 1265,
      "58": 1266,
      "59": 1267,
      "60": 1268,
      "61": 1269,
      "62": 1270,
      "63": 1271,
      "64": 1272,
      "65": 1273,
      "66": 1274,
      "67": 1275,
      "68": 1276,
      "69": 1277,
      "70": 1278,
      "71": 1279,
      "72": 1280,
      "73": 1281,
      "74": 1282,
      "75": 1283,
      "76": 1284,
      "77": 1285,
      "78": 1286,
      "79": 1287,
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
      const filePath = 'files/users-completions-kjanaiz.csv'
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
