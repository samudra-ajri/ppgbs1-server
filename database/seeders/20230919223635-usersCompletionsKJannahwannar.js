const fs = require('fs')
const csv = require('csv-parser')

module.exports = {
  async up(queryInterface, Sequelize) {
    const materials = {
      "1": 1020,
      "2": 1021,
      "3": 1022,
      "4": 1023,
      "5": 1024,
      "6": 1025,
      "7": 1026,
      "8": 1027,
      "9": 1028,
      "10": 1029,
      "11": 1030,
      "12": 1031,
      "13": 1032,
      "14": 1033,
      "15": 1034,
      "16": 1035,
      "17": 1036,
      "18": 1037,
      "19": 1038,
      "20": 1039,
      "21": 1040,
      "22": 1041,
      "23": 1042,
      "24": 1043,
      "25": 1044,
      "26": 1045,
      "27": 1046,
      "28": 1047,
      "29": 1048,
      "30": 1049,
      "31": 1050,
      "32": 1051,
      "33": 1052,
      "34": 1053,
      "35": 1054,
      "36": 1055,
      "37": 1056,
      "38": 1057,
      "39": 1058,
      "40": 1059,
      "41": 1060,
      "42": 1061,
      "43": 1062,
      "44": 1063,
      "45": 1064,
      "46": 1065,
      "47": 1066,
      "48": 1067,
      "49": 1068,
      "50": 1069,
      "51": 1070,
      "52": 1071,
      "53": 1072,
      "54": 1073,
      "55": 1074,
      "56": 1075,
      "57": 1076,
      "58": 1077,
      "59": 1078,
      "60": 1079,
      "61": 1080,
      "62": 1081,
      "63": 1082,
      "64": 1083,
      "65": 1084,
      "66": 1085,
      "67": 1086,
      "68": 1087,
      "69": 1088,
      "70": 1089,
      "71": 1090,
      "72": 1091,
      "73": 1092,
      "74": 1093,
      "75": 1094,
      "76": 1095,
      "77": 1096,
      "78": 1097,
      "79": 1098,
      "80": 1099,
      "81": 1100,
      "82": 1101,
      "83": 1102,
      "84": 1103,
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
