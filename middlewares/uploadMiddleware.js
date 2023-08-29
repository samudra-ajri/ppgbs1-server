const multer = require('multer')
const config = require('../config')
const { generateFileName } = require('../utils/fileNameUtils')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, config.UPLOAD_PATH)
    },
    filename: function(req, file, cb) {
        cb(null, generateFileName(file.originalname))
    }
})

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype == 'image/jpeg' || 
        file.mimetype == 'image/jpg' ||
        file.mimetype == 'image/png' ||
        file.mimetype == 'image/svg+xml' ||
        file.mimetype == 'image/gif' ||
        file.mimetype == 'image/webp'
    ) {
        cb(null, true)
    } else {
        cb(new Error('file format not valid'), false)
    }
}

const upload = multer({ 
    storage, 
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB limit
    }
})

module.exports = upload
