const db = require('../database')

const getRecipesById = async (id) => {
  try {
    const query = await db`SELECT * FROM recipes WHERE id = ${id}`
    return query
  } catch (error) {
    return error
  }
}

const getAllRecipes = async (keyword, sort) => {
  try {
    const query =
      await db`SELECT *,count(*) OVER() AS full_count FROM recipes WHERE LOWER(recipes.title) LIKE LOWER(${keyword}) ORDER BY id ${sort}`

    return query
  } catch (error) {
    return error
  }
}

const postAllrecipes = async (payload) => {
  try {
    const query = await db`INSERT INTO recipes ${db(
      payload,
      'recipePicture',
      'title',
      'ingredients',
      'videoLink'
    )} returning *`

    return query
  } catch (error) {
    return error
  }
}

const postPhotoRecipe = async(payload) =>{
  try{
 const query = await db`INSERT INTO recipes ${db(
   payload,
   "recipePicture",
   "title",
   "ingredients",
   "videoLink",
   "createby",
   "category"
 )} returning *`;
    return query
  } catch (error) {
    return error
  }
}

const patchRecipesById = async (payload, id) => {
  try {
    const query = await db`UPDATE recipes set ${db(
      payload,
      'recipePicture',
      'title',
      'ingredients',
      'videoLink'
    )} WHERE id = ${id} returning *`

    return query
  } catch (error) {
    return error
  }
}

const deleteRecipesById = async (id) => {
  try {
    const query = await db`DELETE FROM recipes WHERE id = ${id} returning *`

    return query
  } catch (error) {
    return error
  }
}

module.exports = {
  getRecipesById,
  getAllRecipes,
  postAllrecipes,
  postPhotoRecipe,
  patchRecipesById,
  deleteRecipesById
}
