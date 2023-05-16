const models = require('../moduls/users.moduls')
const db = require('../database')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require("jsonwebtoken");
const claudinary = require('../cloudinary')

function getToken (req){
  const token = req?.headers?.authorization?.slice(
    7,
    req?.headers?.authorization?.length
)

return token;
}

const getUsersById = async (req, res) => {
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

    const query = await models.getUsersById(id)

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

const getAllUsers = async function (req, res) {
  try {
    const query = await models.getAllUser()
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

const addNewProfile = async (req, res) => {
  try {
    const { email, fullName, phoneNumber, password } = req.body

    if (!(email && fullName && phoneNumber && password)) {
      res.status(400).json({
        status: false,
        massage: 'Bad input, pleace complate all of field'
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
        massage: 'Email Already in use'
      })

      return
    }
    // End Validasi Email

    const payload = {
      email,
      fullName,
      phoneNumber,
      password
    }

      let query


    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        // Store hash in your password DB.

      query = await models.insertUserById({ ...payload, password: hash });
      });
    });

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

const editUsers = async (req, res) => { 
  try {
    jwt.verify(getToken(req), process.env.PRIVATE_KEY, async (err, {id}) => {
      const {
        body: { email, fullName, phoneNumber, password},
      } = req;

      if (isNaN(id)) {
        res.status(400).json({
          status: false,
          massage: "ID must be integer",
        });

        return;
      }

      const checkData = await models.getUsersById(id);

      // validasi jika id yang kita mau edit tidak ada di database
      if (!checkData?.length) {
        res.status(404).json({
          status: false,
          massage: "ID not found",
        });

        return;
      }

      const payload = {
        email: email ?? checkData[0].email,
        fullName: fullName ?? checkData[0].fullName,
        phoneNumber: phoneNumber ?? checkData[0].phoneNumber,
        password: password ?? checkData[0].password
      };

      let query;

      if (password) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
          bcrypt.hash(password, salt, async function (err, hash) {
            // Store hash in your password DB.
            query = await models.EditUsersById(
              { ...payload, password: hash },
              id
            );
          });
        });
      } else {
        query = await models.EditUsersById(payload, id);
      }

      res.send({
        status: true,
        massage: "Success edit data",
        data: query,
      });
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Error in server'
    })
  }
}

const editAllUsers = async (req, res) => {
  res.status(404).json({
    status: false,
    message: 'Id cannot be empty'
  })
}

const deleteUsersById = async (req, res) => {
  try {
    jwt.verify(getToken(req), process.env.PRIVATE_KEY, async (err, {id}) => {
      if (isNaN(id)) {
        res.status(400).json({
          status: false,
          massage: "Id must be integer",
        });
        return;
      }

      const checkData = await models.getUsersById(id);

      // validasi jika id yang kita mau edit tidak ada di database
      if (!checkData.length) {
        res.status(404).json({
          status: false,
          massage: "ID not found",
        });

        return;
      }

      const query = await models.deleteUsersById(id);

      res.send({
        status: true,
        massage: "Delete Success",
        data: query,
      });
    })

  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Error in server'
    })
  }
}

const deleteAllUsers = async (req, res) => {
  res.status(404).json({
    status: false,
    message: 'Id cannot be empty'
  })
}

const editPhoto = async (req, res) => {
try{
  jwt.verify(getToken(req), process.env.PRIVATE_KEY, async (err, { id }) => {
    const { photo } = req?.files ?? {};
  
    if (!photo) {
      res.status(400).send({
        status: false,
        massage: "Photo is required",
      });
    }
  
    
    let mimeType = photo.mimetype.split("/")[1];
    let allowFile = ["jpeg", "jpg", "png", "webp"];
  
    // cari apakah tipe data yang di upload terdapat salah satu dari list yang ada diatas
    if (!allowFile?.find((item) => item === mimeType)) {
      res.status(400).send({
        status: false,
        message: "Only accept jpeg, jpg, png, webp",
      });
    }
  
    // validate size image
    if (photo.size > 2000000) {
      res.status(400).send({
        status: false,
        message: "File to big, max size 2MB",
      });
    }
  
    // Configuration
      claudinary.config({
        cloud_name: "dkehmtgjl",
        api_key: "398999231531429",
        api_secret: "mbEqjpo8Lx1gM0_-oOKVRZok1Bs",
      });
  
    const upload = claudinary.uploader.upload(photo.tempFilePath, {
      public_id: new Date().toISOString(),
    });
  
    upload
      .then(async (data) => {
        const payload = {
          photo: data?.secure_url,
        };
  
        models.editPhotoUsers(payload, id);
  
        res.status(200).send({
          status: false,
          message: "Success upload",
          data: payload,
        });
      })
      .catch((err) => {
        res.status(400).send({
          status: false,
          message: err,
        });
      });

  })

}catch(erorr){
  res.status(500).send({
        status: false,
        massage: 'Error on server',
      })
}
}

module.exports = {
  getUsersById,
  getAllUsers,
  addNewProfile,
  editUsers,
  editAllUsers,
  deleteUsersById,
  deleteAllUsers,
  editPhoto,
};
