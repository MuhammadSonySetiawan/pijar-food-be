// import / intial
require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const helmet = require('helmet')
const xssClean = require('xss-clean')
const cors = require('cors')
const compression = require('compression')
const fileUpload = require('express-fileupload')

// import routes
const usersRoutes = require('./routes/users.routes')
const recipesRouter = require('./routes/recipes.routes')
const authRoutes = require('./routes/auth.routes')

// parse application
app.use(bodyParser.urlencoded({ extended: false }))

// parse appliaction Json
app.use(bodyParser.json())

// Use helmet
app.use(helmet())

// Use xss-clean
app.use(xssClean())

// Use cors
app.use(cors())

// use compression
app.use(compression())
// grame acces to upload file
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
  })
)

// Use router
app.use(usersRoutes)
app.use(recipesRouter)
app.use(authRoutes)

app.listen(8000, () => {
  console.log('App running in port 8000')
})
