const { client } = require("../db/client");
var _ = require("lodash");

const getAll = async (req, res, next) => {
  try {
    let response = await client.query("SELECT * FROM users ORDER BY id ASC");
    let result = [];
    for (let [i, user] of response.rows.entries()) {
      result.push(_.pickBy(user, (value, key) => key != "password"));
    }
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    let id = Number(req.params.id);
    let response = await client.query("SELECT * FROM users where id = $1", [
      id,
    ]);
    response.rowCount
      ? res.status(200).json(response.rows[0])
      : res.status(404).json({ error: true, message: "Not found" });
  } catch (err) {
    next(err);
  }
};

const deleteById = async (req, res, next) => {
  try {
    let id = Number(req.params.id);
    let response = await client.query("DELETE FROM users where id = $1", [id]);
    response.rowCount
      ? res.status(200).json({ message: `User deleted with ID: ${id}` })
      : res.status(404).json({ error: true, message: "Not found" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAll,
  getById,
  deleteById,
};
