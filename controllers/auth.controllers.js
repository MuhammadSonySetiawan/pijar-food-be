const models = require('../moduls/users.moduls')
const db = require('../database')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const loginUsers = async (req, res) => {
  try {
    const {
      body: { email, password }
    } = req

    if (!(email && password)) {
      res.status(400).json({
        status: false,
        message: 'Bad input, pplease compleate all of fields'
      })
      return
    }

    const checkUsers = await models.getUsersByEmail(email)

    if (checkUsers?.length === 0) {
      res.status(400).json({
        status: false,
        message: 'Email not registered in app'
      })

      return
    }
    // node : fix this in future
    bcrypt.compare(password, checkUsers[0]?.password, function (err, result) {
      if(result){
        const token = jwt.sign(
          {
            ...checkUsers[0],
            password: null,
          },
          process.env.PRIVATE_KEY
        );
  
        res.json({
          status: true,
          message: "Get data success",
          data: checkUsers,
          token,
        });
          }else{
            res.status(400).json({
              status: false,
              message: "Password invalid",
            });

            return;
          }
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Error in server'
    })
  }
}

module.exports = {
  loginUsers
}
