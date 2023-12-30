const fs = require('fs')
const csv = require('csv-parser')

module.exports = {
  async up(queryInterface, Sequelize) {
    const materials = {
      "1": 485,
      "2": 486,
      "3": 487,
      "4": 488,
      "5": 489,
      "6": 490,
      "7": 491,
      "8": 492,
      "9": 493,
      "10": 494,
      "11": 495,
      "12": 496,
      "13": 497,
      "14": 498,
      "15": 499,
      "16": 500,
      "17": 501,
      "18": 502,
      "19": 503,
      "20": 504,
      "21": 505,
      "22": 506,
      "23": 507,
      "24": 508,
      "25": 509,
      "26": 510,
      "27": 511,
      "28": 512,
      "29": 513,
      "30": 514,
      "31": 515,
      "32": 516,
      "33": 517,
      "34": 518,
      "35": 519,
      "36": 520,
      "37": 521,
      "38": 522,
      "39": 523,
      "40": 524,
      "41": 525,
      "42": 526,
      "43": 527,
      "44": 528,
      "45": 529,
      "46": 530,
      "47": 531,
      "48": 532,
      "49": 533,
      "50": 534,
      "51": 535,
      "52": 536,
      "53": 537,
      "54": 538,
      "55": 539,
      "56": 540,
      "57": 541,
      "58": 542,
      "59": 543,
      "60": 544,
      "61": 545,
      "62": 546,
      "63": 547,
      "64": 548,
      "65": 549,
      "66": 550,
      "67": 551,
      "68": 552,
      "69": 553,
      "70": 554,
      "71": 555,
      "72": 556,
      "73": 557,
      "74": 558,
      "75": 559,
      "76": 560,
      "77": 561,
      "78": 562,
      "79": 563,
      "80": 564,
      "81": 565,
      "82": 566,
      "83": 567,
      "84": 568,
      "85": 569,
      "86": 570,
      "87": 571,
      "88": 572,
      "89": 573,
      "90": 574,
      "91": 575,
      "92": 576,
      "93": 577,
      "94": 578,
      "95": 579,
      "96": 580,
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
      const filePath = 'files/users-completions-kadab.csv'
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
