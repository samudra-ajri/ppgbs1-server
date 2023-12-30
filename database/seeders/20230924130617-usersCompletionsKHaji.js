const fs = require('fs')
const csv = require('csv-parser')

module.exports = {
  async up(queryInterface, Sequelize) {
    const materials = {
      "1": 2085,
      "2": 2086,
      "3": 2087,
      "4": 2088,
      "5": 2089,
      "6": 2090,
      "7": 2091,
      "8": 2092,
      "9": 2093,
      "10": 2094,
      "11": 2095,
      "12": 2096,
      "13": 2097,
      "14": 2098,
      "15": 2099,
      "16": 2100,
      "17": 2101,
      "18": 2102,
      "19": 2103,
      "20": 2104,
      "21": 2105,
      "22": 2106,
      "23": 2107,
      "24": 2108,
      "25": 2109,
      "26": 2110,
      "27": 2111,
      "28": 2112,
      "29": 2113,
      "30": 2114,
      "31": 2115,
      "32": 2116,
      "33": 2117,
      "34": 2118,
      "35": 2119,
      "36": 2120,
      "37": 2121,
      "38": 2122,
      "39": 2123,
      "40": 2124,
      "41": 2125,
      "42": 2126,
      "43": 2127,
      "44": 2128,
      "45": 2129,
      "46": 2130,
      "47": 2131,
      "48": 2132,
      "49": 2133,
      "50": 2134,
      "51": 2135,
      "52": 2136,
      "53": 2137,
      "54": 2138,
      "55": 2139,
      "56": 2140,
      "57": 2141,
      "58": 2142,
      "59": 2143,
      "60": 2144,
      "61": 2145,
      "62": 2146,
      "63": 2147,
      "64": 2148,
      "65": 2149,
      "66": 2150,
      "67": 2151,
      "68": 2152,
      "69": 2153,
      "70": 2154,
      "71": 2155,
      "72": 2156,
      "73": 2157,
      "74": 2158,
      "75": 2159,
      "76": 2160,
      "77": 2161,
      "78": 2162,
      "79": 2163,
      "80": 2164,
      "81": 2165,
      "82": 2166,
      "83": 2167,
      "84": 2168,
      "85": 2169,
      "86": 2170,
      "87": 2171,
      "88": 2172,
      "89": 2173,
      "90": 2174,
      "91": 2175,
      "92": 2176,
      "93": 2177,
      "94": 2178,
      "95": 2179,
      "96": 2180,
      "97": 2181,
      "98": 2182,
      "99": 2183,
      "100": 2184,
      "101": 2185,
      "102": 2186,
      "103": 2187,
      "104": 2188,
      "105": 2189,
      "106": 2190,
      "107": 2191,
      "108": 2192,
      "109": 2193,
      "110": 2194,
      "111": 2195,
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
