const db = require('../database')

const getUsersById = async (id) => {
  try {
    const query = await db`SELECT * FROM users WHERE id = ${id}`
    return query
  } catch (error) {
    return error
  }
}

const getUsersByEmail = async (email) => {
  try {
    const query = await db`SELECT * FROM users WHERE LOWER(email) = LOWER(${email})`
    return query
  } catch (error) {
    return error
  }
}

const getAllUser = async () => {
  try {
    const query = await db`SELECT * FROM users ORDER BY id ASC`
    return query
  } catch (error) {
    return error
  }
}

const insertUserById = async (payload) => {
  try {
    const query = await db`INSERT INTO users ${db(payload, 'email', 'fullName', 'phoneNumber', 'password')} returning *`
    return query
  } catch (error) {
    return error
  }
}

const EditUsersById = async (payload, id) => {
  try {
    const query = await db`UPDATE users set ${db(payload, 'email', 'fullName', 'phoneNumber', 'password')} WHERE id = ${id} returning *`
    return query
  } catch (error) {
    return error
  }
}

const editPhotoUsers = async (payload, id) => {
   try {
    const query = await db`UPDATE users set ${db(
      payload,
      "photo"
    )} WHERE id = ${id} returning *`;

    return query;
  } catch (error) {
    return error;
  }
};

const deleteUsersById = async (id) => {
  try {
    const query = await db`DELETE FROM users WHERE id = ${id} returning *`
    return query
  } catch (error) {
    return error
  }
}

module.exports = {
  getUsersById,
  getAllUser,
  insertUserById,
  EditUsersById,
  editPhotoUsers,
  deleteUsersById,
  getUsersByEmail,
};
