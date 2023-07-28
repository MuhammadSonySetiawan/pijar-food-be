const router = require('express').Router()
const controllers = require('../controllers/recipes.controllers')


// routing RECIPES
// get data by id RECIPES
router.get('/recipes/:id', controllers.getRecipesById)

// get all data RECIPES
router.get('/recipes', controllers.getAllRecipes)

//get recipes profile
router.get('/recipes/users/me', controllers.getAllRecipesUsersMe)
// get all data pagination RECIPES
//   router.post("/recipes", async function (req, res) {
//     try { 
 
//       for(let index = 0 ; index < 20 ; index++){
//         await db`INSERT INTO "public"."recipes" ("recipePicture", "title", "ingredients", "videoLink") VALUES
//     ('text', 'text', 'text', 'text')`
//       }

//       const query = res.json({
//         status: query?.length ? true : false,
//         message: query?.length ? "Get data success": "Data not found",
//         data: query
//       })
//     } catch (error) {
//       res.status(500).json({
//         status: false,
//         message: "Error in server",
//       })
//     }
//   })

// Post RECIPES
router.post('/recipes', controllers.postAllrecipes)

// Patch RECIPES
router.patch('/recipes/:id', controllers.patchRecipesById)

// All patch RECIPES
router.patch('/recipes', controllers.patchAllRecipes)

// Delete with id RECIPES
router.delete('/recipes/:id', controllers.deleteRecipesById)

// All Delete RECIPES
router.delete('/recipes', controllers.DeleteAllRecipes)

module.exports = router
