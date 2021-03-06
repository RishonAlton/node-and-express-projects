require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()

const cookieParser = require('cookie-parser')

const rateLimiter = require('express-rate-limit')
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize')

const connectDB = require('./DB/connect')

const authRouter = require('./Routes/auth')
const userRouter = require('./Routes/user')

const notFoundRoute = require('./Middleware/not-found')
const errorHandler = require('./Middleware/error-handler')


app.set('trust proxy', 1)

app.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 60 }))
app.use(helmet())
app.use(cors())
app.use(xss())
app.use(mongoSanitize())

app.use(express.json())

app.use(cookieParser(process.env.JWT_SECRET))


app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)

app.use(notFoundRoute)
app.use(errorHandler)


const port = process.env.PORT || 5000


const start = async () => {

    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(port, console.log(`Server is listening on Port ${port}...`))
    } 
    
    catch (error) {
        console.log(error)
    }

}

start()