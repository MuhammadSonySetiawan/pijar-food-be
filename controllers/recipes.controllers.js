const models = require('../moduls/users.moduls')
const db = require('../database')

const getRecipesById = async (req, res) => {
  try {
    const {
      params: { id }
    } = req

    if (isNaN(id)) {
      res.status(400).json({
        status: false,
        message: 'ID must be integer'
      })

      return
    }

    const query = await models.getRecipesById(id)

    res.json({
      status: true,
      message: 'Get data success',
      data: query
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Error in server'
    })
  }
}

const getAllRecipes = async (req, res) => {
  try {
    let query
    const keyword = `%${req?.query?.keyword}%`
    let sort = db`DESC`
    const isPagination =
      req?.query?.page &&
      !isNaN(req?.query?.page) &&
      parseInt(req?.query?.page) >= 1

    // check if sort type exitand paginate exist

    if (req?.query?.sortType?.toLowerCase() === 'asc') {
      if (isPagination) {
        sort = db`LIMIT 10 OFFSET ${10 * (parseInt(req?.query?.page) - 1)}`
      } else {
        sort = db`ASC`
      }
    }

    // check if sort type not exist paginate exist
    if (isPagination && !req?.query?.sortType) {
      sort = db`DESC LIMIT 10 OFFSET ${10 * (parseInt(req?.query?.page) - 1)}`
    }

    if (req?.query?.keyword) {
      query = await models.getAllRecipes(keyword, sort)
    } else {
      query =
        await db`SELECT *,count(*) OVER() AS full_count FROM recipes ORDER BY recipes.id ${sort}`
    }

    //  query = await db`SELECT * FROM recipes ORDER BY id ASC`

    // OFFSET LIMIT

    res.json({
      status: !!query?.length,
      message: query?.length ? 'Get data success' : 'Data not found',
      total: query?.length ?? 0,
      pages: isPagination
        ? {
            carrent: parseInt(req?.query?.page),
            total: query?.[0]?.full_count
              ? Math.ceil(parseInt(query?.[0]?.full_count) / 10)
              : 0
          }
        : null,
      data: query?.map((item) => {
        delete item.full_count
        return item
      })
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Error in server'
    })
  }
}

const postAllrecipes = async (req, res) => {
  try {
    const { recipePicture, title, ingredients, videoLink } = req.body

    if (!(recipePicture && title && ingredients && videoLink)) {
      res.status(400).json({
        status: false,
        massage: 'Bad input, pleace complate all of field'
      })

      return
    }

    const payload = {
      recipePicture,
      title,
      ingredients,
      videoLink
    }

    const query = await models.postAllrecipes(payload)

    res.send({
      status: true,
      message: 'Success insert data',
      data: query
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Error in server'
    })
  }
}

const patchRecipesById = async (req, res) => {
  try {
    const {
      params: { id },
      body: { recipePicture, title, ingredients, videoLink }
    } = req

    if (isNaN(id)) {
      res.status(400).json({
        status: false,
        massage: 'ID must be integer'
      })

      return
    }

    const checkData = await db`SELECT * FROM recipes WHERE id = ${id}`

    if (!checkData?.length) {
      res.status(404).json({
        status: false,
        massage: 'ID not found'
      })

      return
    }

    const payload = {
      recipePicture: recipePicture ?? checkData[0].recipePicture,
      title: title ?? checkData[0].title,
      ingredients: ingredients ?? checkData[0].ingredients,
      videoLink: videoLink ?? checkData[0].videoLink
    }

    const query = await models.patchRecipesById(payload, id)

    res.send({
      status: true,
      massage: 'Success edit data',
      data: query
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Error in server'
    })
  }
}

const patchAllRecipes = async (req, res) => {
  res.status(404).json({
    status: false,
    message: 'Id cannot be empty'
  })
}

const deleteRecipesById = async (req, res) => {
  try {
    const {
      params: { id }
    } = req

    if (isNaN(id)) {
      res.status(400).json({
        status: false,
        massage: 'ID must be integer'
      })

      return
    }

    const checkData = await db`SELECT * FROM recipes WHERE id = ${id}`;

    if (!checkData.length) {
      res.status(404).json({
        status: false,
        massage: 'ID not found'
      })

      return
    }

    const query = await models.deleteRecipesById(id)

    res.send({
      status: true,
      massage: 'Delete Success',
      data: query
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Error in server'
    })
  }
}

const DeleteAllRecipes = async (req, res) => {
  res.status(404).json({
    status: false,
    message: 'Id cannot be empty'
  })
}

module.exports = {
  getRecipesById,
  getAllRecipes,
  postAllrecipes,
  patchRecipesById,
  patchAllRecipes,
  deleteRecipesById,
  DeleteAllRecipes
}
