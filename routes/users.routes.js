const router = require('express').Router()
const controllers = require('../controllers/users.controllers')
const middleware = require('../middleware/jwt.middleware')

// routing USERS
// get data by id USERS
router.get("/users/:id", middleware, controllers.getUsersById);

// get all data USERS
router.get("/users", middleware, controllers.getAllUsers)

// post data by id USERS
router.post("/users", controllers.addNewProfile);

// patch data by id USERS
router.patch("/users/", middleware, controllers.editUsers);

// patch EDIT PHOTO
router.patch("/users/photo", middleware, controllers.editPhoto);

// All patch USERS
router.patch("/users", middleware, controllers.editAllUsers);

// delate data by id USERS
router.delete('/users', middleware, controllers.deleteUsersById)

// All Delete USERS
router.delete('/users', controllers.deleteAllUsers)

module.exports = router
