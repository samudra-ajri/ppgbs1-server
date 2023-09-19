const fs = require('fs')
const csv = require('csv-parser')

module.exports = {
  async up(queryInterface, Sequelize) {
    const materials = {
      "1": 769,
      "10": 778,
      "11": 779,
      "12": 780,
      "13": 781,
      "14": 782,
      "15": 783,
      "16": 784,
      "17": 785,
      "18": 786,
      "19": 787,
      "2": 770,
      "20": 788,
      "21": 789,
      "22": 790,
      "23": 791,
      "24": 792,
      "25": 793,
      "26": 794,
      "27": 795,
      "28": 796,
      "29": 797,
      "3": 771,
      "30": 798,
      "31": 799,
      "32": 800,
      "33": 801,
      "34": 802,
      "35": 803,
      "36": 804,
      "37": 805,
      "38": 806,
      "39": 807,
      "4": 772,
      "40": 808,
      "41": 809,
      "42": 810,
      "43": 811,
      "44": 812,
      "45": 813,
      "46": 814,
      "47": 815,
      "48": 816,
      "49": 817,
      "5": 773,
      "50": 818,
      "51": 819,
      "52": 820,
      "53": 821,
      "54": 822,
      "55": 823,
      "56": 824,
      "57": 825,
      "58": 826,
      "59": 827,
      "6": 774,
      "60": 828,
      "61": 829,
      "62": 830,
      "63": 831,
      "64": 832,
      "65": 833,
      "7": 775,
      "8": 776,
      "9": 777,
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
      const filePath = 'files/users-completions-kdawat.csv'
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
