import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'

import connectDB from './config/db.js'
import homeRoutes from './routes/homeRoutes.js'
import userRoutes from './routes/userRoutes.js'
import completionRoutes from './routes/completionRoutes.js'
import subjectRoutes from './routes/subjectRoutes.js'

import { notFound, errorHandler } from './middlewares/errorMiddleware.js'

dotenv.config()
connectDB()
const app  = express()
const PORT = process.env.PORT
const ENV  = process.env.APP_ENV

if (ENV === 'staging' || ENV === 'local') {
    app.use(morgan('dev'))
}

app.use(cors())
app.use(express.json())

app.use('/', homeRoutes)
app.use('/api/users', userRoutes)
app.use('/api/completions', completionRoutes)
app.use('/api/subjects', subjectRoutes)

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, console.log(`Server running in ${ENV} mode on port ${PORT}`))