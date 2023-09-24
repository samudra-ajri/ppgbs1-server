const fs = require('fs')
const csv = require('csv-parser')

module.exports = {
  async up(queryInterface, Sequelize) {
    const materials = {
      "1": 2086,
      "10": 2095,
      "100": 2185,
      "101": 2186,
      "102": 2187,
      "103": 2188,
      "104": 2189,
      "105": 2190,
      "106": 2191,
      "107": 2192,
      "108": 2193,
      "109": 2194,
      "11": 2096,
      "110": 2195,
      "111": 2196,
      "12": 2097,
      "13": 2098,
      "14": 2099,
      "15": 2100,
      "16": 2101,
      "17": 2102,
      "18": 2103,
      "19": 2104,
      "2": 2087,
      "20": 2105,
      "21": 2106,
      "22": 2107,
      "23": 2108,
      "24": 2109,
      "25": 2110,
      "26": 2111,
      "27": 2112,
      "28": 2113,
      "29": 2114,
      "3": 2088,
      "30": 2115,
      "31": 2116,
      "32": 2117,
      "33": 2118,
      "34": 2119,
      "35": 2120,
      "36": 2121,
      "37": 2122,
      "38": 2123,
      "39": 2124,
      "4": 2089,
      "40": 2125,
      "41": 2126,
      "42": 2127,
      "43": 2128,
      "44": 2129,
      "45": 2130,
      "46": 2131,
      "47": 2132,
      "48": 2133,
      "49": 2134,
      "5": 2090,
      "50": 2135,
      "51": 2136,
      "52": 2137,
      "53": 2138,
      "54": 2139,
      "55": 2140,
      "56": 2141,
      "57": 2142,
      "58": 2143,
      "59": 2144,
      "6": 2091,
      "60": 2145,
      "61": 2146,
      "62": 2147,
      "63": 2148,
      "64": 2149,
      "65": 2150,
      "66": 2151,
      "67": 2152,
      "68": 2153,
      "69": 2154,
      "7": 2092,
      "70": 2155,
      "71": 2156,
      "72": 2157,
      "73": 2158,
      "74": 2159,
      "75": 2160,
      "76": 2161,
      "77": 2162,
      "78": 2163,
      "79": 2164,
      "8": 2093,
      "80": 2165,
      "81": 2166,
      "82": 2167,
      "83": 2168,
      "84": 2169,
      "85": 2170,
      "86": 2171,
      "87": 2172,
      "88": 2173,
      "89": 2174,
      "9": 2094,
      "90": 2175,
      "91": 2176,
      "92": 2177,
      "93": 2178,
      "94": 2179,
      "95": 2180,
      "96": 2181,
      "97": 2182,
      "98": 2183,
      "99": 2184,
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
      const filePath = 'files/users-completions-khaji.csv'
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
