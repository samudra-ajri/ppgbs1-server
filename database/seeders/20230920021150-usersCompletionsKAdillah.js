const fs = require('fs')
const csv = require('csv-parser')

module.exports = {
  async up(queryInterface, Sequelize) {
    const materials = {
      "1": 925,
      "10": 934,
      "11": 935,
      "12": 936,
      "13": 937,
      "14": 938,
      "15": 939,
      "16": 940,
      "17": 941,
      "18": 942,
      "19": 943,
      "2": 926,
      "20": 944,
      "21": 945,
      "22": 946,
      "23": 947,
      "24": 948,
      "25": 949,
      "26": 950,
      "27": 951,
      "28": 952,
      "29": 953,
      "3": 927,
      "30": 954,
      "31": 955,
      "32": 956,
      "33": 957,
      "34": 958,
      "35": 959,
      "36": 960,
      "37": 961,
      "38": 962,
      "39": 963,
      "4": 928,
      "40": 964,
      "41": 965,
      "42": 966,
      "43": 967,
      "44": 968,
      "45": 969,
      "46": 970,
      "47": 971,
      "48": 972,
      "49": 973,
      "5": 929,
      "50": 974,
      "51": 975,
      "52": 976,
      "53": 977,
      "54": 978,
      "55": 979,
      "56": 980,
      "57": 981,
      "58": 982,
      "59": 983,
      "6": 930,
      "60": 984,
      "61": 985,
      "62": 986,
      "63": 987,
      "64": 988,
      "65": 989,
      "66": 990,
      "67": 991,
      "68": 992,
      "69": 993,
      "7": 931,
      "70": 994,
      "71": 995,
      "72": 996,
      "73": 997,
      "74": 998,
      "75": 999,
      "76": 1000,
      "77": 1001,
      "78": 1002,
      "79": 1003,
      "8": 932,
      "80": 1004,
      "81": 1005,
      "82": 1006,
      "83": 1007,
      "84": 1008,
      "85": 1009,
      "86": 1010,
      "87": 1011,
      "88": 1012,
      "89": 1013,
      "9": 933,
      "90": 1014,
      "91": 1015,
      "92": 1016,
      "93": 1017,
      "94": 1018,
      "95": 1019,
      "96": 1020,
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
