const express = require('express')
const asyncHandler = require('express-async-handler')

const router = express.Router()

const home = asyncHandler(async (req, res) => {
    res.json({
        app: process.env.APP_NAME,
        server: process.env.NODE_ENV
    })
})

router.route('/').get(home)

module.exports = router