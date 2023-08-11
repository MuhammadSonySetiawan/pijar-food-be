const models = require('../moduls/recipes.moduls')
const db = require('../database')
const jwt = require("jsonwebtoken");
const cloudinary = require("../cloudinary");

function getToken(req) {
  const token = req?.headers?.authorization?.slice(7, req?.headers?.authorization?.length);
    // console.log(token)
  return token;
}

const getRecipesById = async (req, res) => {
  try {
    const {id} = req.params;
    query = await db`SELECT * FROM recipes WHERE id =${id}`;

        res.json({
          status: true,
          message: "Get data success",
          data: query
        });
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
        sort = db`ASC LIMIT 6 OFFSET ${6 * (parseInt(req?.query?.page) - 1)}`
      } else {
        sort = db`ASC`
      }
    }

    // check if sort type not exist paginate exist
    if (isPagination && !req?.query?.sortType) {
      sort = db`DESC LIMIT 6 OFFSET ${6 * (parseInt(req?.query?.page) - 1)}`
    }

    if (req?.query?.keyword) {
      query = await models.getAllRecipes(keyword, sort)
    } else {
      query =
        await db`SELECT *,count(*) OVER() AS full_count FROM recipes ORDER BY id ${sort}`
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
              ? Math.ceil(parseInt(query?.[0]?.full_count) / 6)
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
    console.log(error)
  }
}

const getAllRecipesUsersMe = async (req, res) => {
  try {
    jwt.verify(getToken(req), process.env.PRIVATE_KEY, async (err, {id}) => {
      let query;
      const keyword = `%${req?.query?.keyword}%`;
      let sort = db`DESC`;
      const isPagination = req?.query?.page && !isNaN(req?.query?.page) && parseInt(req?.query?.page) >= 1;
  
      // check if sort type exitand paginate exist
  
      if (req?.query?.sortType?.toLowerCase() === "asc") {
        if (isPagination) {
          sort = db`ASC LIMIT 6 OFFSET ${6 * (parseInt(req?.query?.page) - 1)}`;
        } else {
          sort = db`ASC`;
        }
      }
  
      // check if sort type not exist paginate exist
      if (isPagination && !req?.query?.sortType) {
        sort = db`DESC LIMIT 6 OFFSET ${6 * (parseInt(req?.query?.page) - 1)}`;
      }
  
      if (req?.query?.keyword) {
        query = await db`SELECT *,count(*) OVER() AS full_count FROM recipes WHERE LOWER(recipes.title) LIKE LOWER(${keyword}) AND createby = ${id} ORDER BY id ${sort}`;
      } else {
        query = await db`SELECT *,count(*) OVER() AS full_count FROM recipes WHERE createby = ${id} ORDER BY id ${sort}`;
      }
  
      //  query = await db`SELECT * FROM recipes ORDER BY id ASC`
  
      // OFFSET LIMIT
  
      res.json({
        status: !!query?.length,
        message: query?.length ? "Get data success" : "Data not found",
        total: query?.length ?? 0,
        pages: isPagination
          ? {
              carrent: parseInt(req?.query?.page),
              total: query?.[0]?.full_count ? Math.ceil(parseInt(query?.[0]?.full_count) / 6) : 0,
            }
          : null,
        data: query?.map((item) => {
          delete item.full_count;
          return item;
        }),
      });
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error in server",
    });
  }
};


const postAllrecipes = async (req, res) => {
  try {
        jwt.verify(getToken(req), process.env.PRIVATE_KEY, async (err, {id}) => {

                const { recipePicture } = req?.files ?? {};
                const { title, ingredients, videoLink } = req.body;

                if (!(title && ingredients && videoLink)) {
                  res.status(400).json({
                    status: false,
                    massage: "Bad input, pleace complate all of field",
                  });
                }

                if (!recipePicture) {
                  res.status(400).json({
                    status: false,
                    massage: "Photo is required",
                  });
                }

                let mimeType = recipePicture.mimetype.split("/")[1];
                let allowFile = ["jpeg", "jpg", "png", "webp"];

                // cari apakah tipe data yang di upload terdapat salah satu dari list yang ada diatas
                if (!allowFile?.find((item) => item === mimeType)) {
                  res.status(400).send({
                    status: false,
                    message: "Only accept jpeg, jpg, png, webp",
                  });
                }

                // validate size image
                if (recipePicture.size > 2000000) {
                  res.status(400).send({
                    status: false,
                    message: "File to big, max size 2MB",
                  });
                }
                const upload = cloudinary.uploader.upload(
                  recipePicture.tempFilePath,
                  {
                    public_id: new Date().toISOString(),
                  }
                );

                upload.then(async (data) => {
                  const payload = {
                    recipePicture: data?.secure_url,
                    title,
                    ingredients,
                    videoLink,
                    createby: id,
                  };

                  const test = await models.postPhotoRecipe(payload, id);

                  console.log(test);

                  res.status(200).send({
                    status: true,
                    message: "Success insert data",
                    data: payload,
                  });
                });
          
        })

     .catch((err) => {
       res.status(400).send({
         status: false,
         message: err,
       });
     });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Error in server'
    })
  }
}


const postMobileRecipes = async (req, res) => {
  try {
    jwt
      .verify(getToken(req), process.env.PRIVATE_KEY, async (err, { id }) => {
        const { title, ingredients, videoLink, recipePicture } = req.body;

        if (!(title && ingredients && videoLink)) {
          res.status(400).json({
            status: false,
            massage: "Bad input, pleace complate all of field",
          });
        }

        const payload = {
          recipePicture: recipePicture,
          title,
          ingredients,
          videoLink,
          createby: id,
        };

        const test = await models.postPhotoRecipe(payload, id);

        res.status(200).send({
          status: true,
          message: "Success insert data",
          data: payload,
        });
      })

      .catch((err) => {
        res.status(400).send({
          status: false,
          message: err,
        });
      });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error in server",
    });
  }
};

// const uploadImage = async function (photo) {
//   try {
//     cloudinary.config({
//       cloud_name: "df9mh6l4n",
//       api_key: "368677466729715",
//       api_secret: "aZElKVwuvGJdPPZkOXAb-BRUk10",
//     });

//     const upload = await cloudinary.uploader.upload(photo.tempFilePath, {
//       public_id: new Date().toISOString(),
//     });

//     return upload.secure_url;
//   } catch (error) {
//     throw new Error("Failed to upload image to Cloudinary");
//   }
// };

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

    const checkData = await db`SELECT * FROM recipes WHERE id = ${id}`

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
  getAllRecipesUsersMe,
  postAllrecipes,
  // uploadImage,
  patchRecipesById,
  patchAllRecipes,
  deleteRecipesById,
  DeleteAllRecipes,
  postMobileRecipes,
};
