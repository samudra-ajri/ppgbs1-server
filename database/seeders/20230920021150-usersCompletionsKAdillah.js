const fs = require('fs')
const csv = require('csv-parser')

module.exports = {
  async up(queryInterface, Sequelize) {
    const materials = {
      "1": 924,
      "2": 925,
      "3": 926,
      "4": 927,
      "5": 928,
      "6": 929,
      "7": 930,
      "8": 931,
      "9": 932,
      "10": 933,
      "11": 934,
      "12": 935,
      "13": 936,
      "14": 937,
      "15": 938,
      "16": 939,
      "17": 940,
      "18": 941,
      "19": 942,
      "20": 943,
      "21": 944,
      "22": 945,
      "23": 946,
      "24": 947,
      "25": 948,
      "26": 949,
      "27": 950,
      "28": 951,
      "29": 952,
      "30": 953,
      "31": 954,
      "32": 955,
      "33": 956,
      "34": 957,
      "35": 958,
      "36": 959,
      "37": 960,
      "38": 961,
      "39": 962,
      "40": 963,
      "41": 964,
      "42": 965,
      "43": 966,
      "44": 967,
      "45": 968,
      "46": 969,
      "47": 970,
      "48": 971,
      "49": 972,
      "50": 973,
      "51": 974,
      "52": 975,
      "53": 976,
      "54": 977,
      "55": 978,
      "56": 979,
      "57": 980,
      "58": 981,
      "59": 982,
      "60": 983,
      "61": 984,
      "62": 985,
      "63": 986,
      "64": 987,
      "65": 988,
      "66": 989,
      "67": 990,
      "68": 991,
      "69": 992,
      "70": 993,
      "71": 994,
      "72": 995,
      "73": 996,
      "74": 997,
      "75": 998,
      "76": 999,
      "77": 1000,
      "78": 1001,
      "79": 1002,
      "80": 1003,
      "81": 1004,
      "82": 1005,
      "83": 1006,
      "84": 1007,
      "85": 1008,
      "86": 1009,
      "87": 1010,
      "88": 1011,
      "89": 1012,
      "90": 1013,
      "91": 1014,
      "92": 1015,
      "93": 1016,
      "94": 1017,
      "95": 1018,
      "96": 1019,
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
      const filePath = 'files/users-completions-kadillah.csv'
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
