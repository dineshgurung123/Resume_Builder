const bcryptjs = require("bcryptjs")

const generateHash = (password) => bcryptjs.hashSync(password, +process.env.SALT_ROUND)

const compareHash = (hashPw, password) => bcryptjs.compareSync(password, hashPw)

module.exports = {compareHash, generateHash}