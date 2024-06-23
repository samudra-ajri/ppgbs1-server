const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const config = require('./config')
const db = require('./database/config/postgresql')
const errorMiddleware = require('./middlewares/errorMiddleware')
const redis = require('./pkg/redis')
const homeRoutes = require('./routes/homeRoutes')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const eventRoutes = require('./routes/eventRoutes')
const materialRoutes = require('./routes/materialRoutes')
const completionRoutes = require('./routes/completionRoutes')
const positionRoutes = require('./routes/positionRoutes')
const organizationRoutes = require('./routes/organizationRoutes')
const directoryRoutes = require('./routes/directoryRoutes')

// Connecting db
db.authenticate()
  .then(() => console.log('Database connected 🚀'))
  .catch(err => console.log('Error: ' + err))

// Connecting redis
redis.client.connect()
  .then(() => console.log('Redis connected 🚀'))
  .catch(err => console.log('Error: ' + err))

// Connecting express
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Logging
if (config.NODE_ENV !== 'production') app.use(morgan('dev'))

// Routes
const version = `api/${config.APP_VERSION}`
app.use(`/${version}/auths`, authRoutes)
app.use(`/${version}/users`, userRoutes)
app.use(`/${version}/events`, eventRoutes)
app.use(`/${version}/materials`, materialRoutes)
app.use(`/${version}/completions`, completionRoutes)
app.use(`/${version}/positions`, positionRoutes)
app.use(`/${version}/organizations`, organizationRoutes)
app.use(`/${version}/directories`, directoryRoutes)
app.use('/api', homeRoutes)

// Error handler
app.use(errorMiddleware.notFound)
app.use(errorMiddleware.errorHandler)

// Listening port
app.listen(config.PORT, console.log('API server running on port:', `${config.APP_URL}:${config.PORT} 🚀`))