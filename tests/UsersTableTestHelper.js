/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool")
const Jwt = require("@hapi/jwt")
const config = require("../src/Commons/config")

const UsersTableTestHelper = {
    async addUser({
        id = "user-123",
        username = "dicoding",
        password = "secret",
        fullname = "Dicoding Indonesia",
    }) {
        const query = {
            text: "INSERT INTO users VALUES($1, $2, $3, $4)",
            values: [id, username, password, fullname],
        }

        await pool.query(query)

        return Jwt.token.generate(
            { id, username },
            config.secret.accessTokenKey,
        )
    },

    async findUsersById(id) {
        const query = {
            text: "SELECT * FROM users WHERE id = $1",
            values: [id],
        }

        const result = await pool.query(query)
        return result.rows
    },

    async cleanTable() {
        await pool.query("DELETE FROM users WHERE 1=1")
    },
}

module.exports = UsersTableTestHelper
