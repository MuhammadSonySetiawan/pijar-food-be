const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const db = require('./database')
const helmet = require('helmet')
const xssClean = require('xss-clean')
const cors =  require('cors')


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

// routing USERS
// get data by id USERS
app.get('/users/:id', async function (req, res) {
  try {
    const {
      params: { id },
    } = req;

    if (isNaN(id)) {
      res.status(400).json({
        status: false,
        message: "ID must be integer",
      })

      return
    }

    const query = await db`SELECT * FROM users WHERE id = ${id}`

    res.json({
      status: true,
      message: "Get data success",
      data: query,
    })

  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error in server",
    })
  }
})

// get all data USERS
app.get("/users", async function (req, res) {
  try {
    const query = await db`SELECT * FROM users ORDER BY id ASC`
    res.json({
      status: true,
      message: "Get data success",
      data: query,
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error in server",
    })
  }
})

// post data by id USERS
app.post('/users', async function (req, res) {
  try {
    const { email, fullName, phoneNumber, password, profilePicture } = req.body

    if (!(email && fullName && phoneNumber && password && profilePicture)) {
      res.status(400).json({
        status: false,
        massage: "Bad input, pleace complate all of field"
      })

      return
    }

    // Validasi Email
    const checkData = await db`SELECT * FROM users WHERE email = ${email}`
    console.log(checkData[0])
    const input = req.body
    console.log(input)

    if (!(checkData)) {
      res.json({
        status: false,
        massage: "Email Already in use"
      })

      return
    }
    // End Validasi Email
    
    const payload = {
      email,
      fullName,
      phoneNumber,
      password,
      profilePicture
    }

    const query = await db`INSERT INTO users ${db(payload, 'email', 'fullName', 'phoneNumber', 'password', 'profilePicture')} returning *`

    res.send({
      status: true,
      message: "Success insert data",
      data: query,
    })

  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error in server",
    })
  }
})

// patch data by id USERS
app.patch('/users/:id', async function (req, res) {
  try {
    const {
      params: { id },
      body: { 
        email,
        fullName,
        phoneNumber,
        password,
        profilePicture }
    } = req

    if (isNaN(id)) {
      res.status(400).json({
        status: false,
        massage: "ID must be integer"
      })

      return
    }

    const checkData = await db`SELECT * FROM users WHERE id = ${id}`

    if (!checkData?.length) {
      res.status(404).json({
        status: false,
        massage: "ID not found"
      })

      return
    }

    const payload = {
      email: email ?? checkData[0].email,
      fullName: fullName ?? checkData[0].fullName,
      phoneNumber: phoneNumber ?? checkData[0].phoneNumber,
      password: password ?? checkData[0].password,
      profilePicture: profilePicture ?? checkData[0].profilePicture, 

    }

    const query = await db`UPDATE users set ${db(payload, 'email', 'fullName', 'phoneNumber', 'password', 'profilePicture')} WHERE id = ${id} returning *`

    res.send({
      status: true,
      massage: "Success edit data",
      data: query
    })

  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error in server",
    })
  }
})

// All patch USERS
app.patch('/users', async function (req, res) {
  res.status(404).json({
    status: false,
    message: "Id cannot be empty",
  })
})

// delate data by id USERS
app.delete('/users/:id', async function (req, res) {
  try {
    const {
      params: { id }
    } = req
    
    const checkData = await db`SELECT * FROM users WHERE id = ${id}`

    if (!checkData.length) {
      res.status(404).json({
        status: false,
        massage: "ID not found"
      })

      return
    }

    if (isNaN(id)) {
      res.status(400).json({
        status: false,
        massage: "ID must be integer"
      })

      return
    }

    const query = await db`DELETE FROM users WHERE id = ${id} returning *`

    res.send({
      status: true,
      massage: "Delete Success",
      data: query
    })

  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error in server",
    })
  }
})

// All Delete USERS
app.delete('/users', async function (req, res) {
  res.status(404).json({
    status: false,
    message: "Id cannot be empty",
  })
})

// routing RECIPES
// get data by id RECIPES
app.get('/recipes/:id', async function (req, res) {
  try {
    const {
      params: { id },
    } = req;

    if (isNaN(id)) {
      res.status(400).json({
        status: false,
        message: "ID must be integer",
      })

      return
    }

    const query = await db`SELECT * FROM recipes WHERE id = ${id}`

    res.json({
      status: true,
      message: "Get data success",
      data: query,
    })

  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error in server",
    })
  }
})

// get all data RECIPES
app.get("/recipes", async function (req, res) {
  try {
    let query 
    let keyword = `%${req?.query?.keyword}%`
    let sort = db`DESC` 

    if(req.query.sortType && req.query.sortType.toLowerCase() === "asc"){
      sort = db`ASC`
    }

    if(req?.query?.keyword){
      query = await db`SELECT * FROM recipes WHERE LOWER(recipes.title) LIKE LOWER(${keyword}) ORDER BY recipes.id ${sort}`
    } else{
      query = await db`SELECT * FROM recipes ORDER BY recipes.id ${sort}`
    }

    //  query = await db`SELECT * FROM recipes ORDER BY id ASC`

    res.json({
      status: query?.length ? true : false,
      message: query?.length ? "Get data success": "Data not found",
      data: query
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error in server",
    })
  }
})

// get all data pagination RECIPES 
app.get("/recipes", async function (req, res) {
  try {
    const query = await db`INSERT INTO "public"."recipes" ("recipePicture", "title", "ingredients", "videoLink") VALUES
('text', 'text', 'text', 'text')`

    res.json({
      status: query?.length ? true : false,
      message: query?.length ? "Get data success": "Data not found",
      data: query
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error in server",
    })
  }
})

// Post RECIPES
app.post('/recipes', async function (req, res) {
  try {
    const { recipePicture, title, ingredients, videoLink } = req.body

    if (!(recipePicture && title && ingredients && videoLink)) {
      res.status(400).json({
        status: false,
        massage: "Bad input, pleace complate all of field"
      })

      return
    }

    const payload = {
      recipePicture,
      title,
      ingredients,
      videoLink
    }

    const query = await db`INSERT INTO recipes ${db(payload, 'recipePicture', 'title', 'ingredients', 'videoLink')} returning *`

    res.send({
      status: true,
      message: "Success insert data",
      data: query,
    })

  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error in server",
    })
  }
})

// Patch RECIPES
app.patch('/recipes/:id', async function (req, res) {
  try {
    const {
      params: { id },
      body: { recipePicture, title, ingredients, videoLink }
    } = req

    if (isNaN(id)) {
      res.status(400).json({
        status: false,
        massage: "ID must be integer"
      })

      return
    }

    const checkData = await db`SELECT * FROM recipes WHERE id = ${id}`

    if (!checkData?.length) {
      res.status(404).json({
        status: false,
        massage: "ID not found"
      })

      return
    }

    const payload = {
      recipePicture: recipePicture ?? checkData[0].recipePicture,
      title: title ?? checkData[0].title,
      ingredients: ingredients ?? checkData[0].ingredients,
      videoLink: videoLink ?? checkData[0].videoLink,
    }

    const query = await db`UPDATE recipes set ${db(payload, 'recipePicture', 'title', 'ingredients', 'videoLink')} WHERE id = ${id} returning *`

    res.send({
      status: true,
      massage: "Success edit data",
      data: query
    })

  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error in server",
    })
  }
})

// All patch RECIPES
app.patch('/recipes', async function (req, res) {
  res.status(404).json({
    status: false,
    message: "Id cannot be empty",
  })
})

// Delete with id RECIPES
app.delete('/recipes/:id', async function (req, res) {
  try {

    const {
      params: { id }
    } = req

    if (isNaN(id)) {
      res.status(400).json({
        status: false,
        massage: "ID must be integer"
      })

      return
    }

    const checkData = await db`SELECT * FROM recipes WHERE id = ${id}`

    if (!checkData.length) {
      res.status(404).json({
        status: false,
        massage: "ID not found"
      })

      return
    }

    const query = await db`DELETE FROM recipes WHERE id = ${id} returning *`

    res.send({
      status: true,
      massage: "Delete Success",
      data: query
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error in server",
    })
  }
})

// All Delete RECIPES
app.delete('/recipes', async function (req, res) {
  res.status(404).json({
    status: false,
    message: "Id cannot be empty",
  })
})

app.listen(3000, () => {
  console.log("running port 3000")
})