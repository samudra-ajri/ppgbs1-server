const fs = require('fs')
const csv = require('csv-parser')

module.exports = {
  async up(queryInterface, Sequelize) {
    const materials = {
      "1": 1021,
      "10": 1030,
      "11": 1031,
      "12": 1032,
      "13": 1033,
      "14": 1034,
      "15": 1035,
      "16": 1036,
      "17": 1037,
      "18": 1038,
      "19": 1039,
      "2": 1022,
      "20": 1040,
      "21": 1041,
      "22": 1042,
      "23": 1043,
      "24": 1044,
      "25": 1045,
      "26": 1046,
      "27": 1047,
      "28": 1048,
      "29": 1049,
      "3": 1023,
      "30": 1050,
      "31": 1051,
      "32": 1052,
      "33": 1053,
      "34": 1054,
      "35": 1055,
      "36": 1056,
      "37": 1057,
      "38": 1058,
      "39": 1059,
      "4": 1024,
      "40": 1060,
      "41": 1061,
      "42": 1062,
      "43": 1063,
      "44": 1064,
      "45": 1065,
      "46": 1066,
      "47": 1067,
      "48": 1068,
      "49": 1069,
      "5": 1025,
      "50": 1070,
      "51": 1071,
      "52": 1072,
      "53": 1073,
      "54": 1074,
      "55": 1075,
      "56": 1076,
      "57": 1077,
      "58": 1078,
      "59": 1079,
      "6": 1026,
      "60": 1080,
      "61": 1081,
      "62": 1082,
      "63": 1083,
      "64": 1084,
      "65": 1085,
      "66": 1086,
      "67": 1087,
      "68": 1088,
      "69": 1089,
      "7": 1027,
      "70": 1090,
      "71": 1091,
      "72": 1092,
      "73": 1093,
      "74": 1094,
      "75": 1095,
      "76": 1096,
      "77": 1097,
      "78": 1098,
      "79": 1099,
      "8": 1028,
      "80": 1100,
      "81": 1101,
      "82": 1102,
      "83": 1103,
      "84": 1104,
      "9": 1029,
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
      const filePath = 'files/users-completions-kjannahwannar.csv'
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
