const fs = require('fs')
const csv = require('csv-parser')

module.exports = {
  async up(queryInterface, Sequelize) {
    const materials = {
      "1": 768,
      "2": 769,
      "3": 770,
      "4": 771,
      "5": 772,
      "6": 773,
      "7": 774,
      "8": 775,
      "9": 776,
      "10": 777,
      "11": 778,
      "12": 779,
      "13": 780,
      "14": 781,
      "15": 782,
      "16": 783,
      "17": 784,
      "18": 785,
      "19": 786,
      "20": 787,
      "21": 788,
      "22": 789,
      "23": 790,
      "24": 791,
      "25": 792,
      "26": 793,
      "27": 794,
      "28": 795,
      "29": 796,
      "30": 797,
      "31": 798,
      "32": 799,
      "33": 800,
      "34": 801,
      "35": 802,
      "36": 803,
      "37": 804,
      "38": 805,
      "39": 806,
      "40": 807,
      "41": 808,
      "42": 809,
      "43": 810,
      "44": 811,
      "45": 812,
      "46": 813,
      "47": 814,
      "48": 815,
      "49": 816,
      "50": 817,
      "51": 818,
      "52": 819,
      "53": 820,
      "54": 821,
      "55": 822,
      "56": 823,
      "57": 824,
      "58": 825,
      "59": 826,
      "60": 827,
      "61": 828,
      "62": 829,
      "63": 830,
      "64": 831,
      "65": 832,
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
