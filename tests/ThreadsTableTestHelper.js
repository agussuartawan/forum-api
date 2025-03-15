/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool")

const ThreadTableTestHelper = {
    async addThread({
        id = "thread-123",
        ownerId = "user-123",
        title = "Cara mencari jodoh",
        body = "Menurut anda bagaimana?",
        date = new Date(),
    }) {
        const query = {
            text: "INSERT INTO threads VALUES($1, $2, $3, $4, $5)",
            values: [id, ownerId, title, body, date],
        }

        await pool.query(query)
    },

    async findThreadById(id) {
        const query = {
            text: "SELECT * FROM threads WHERE id = $1",
            values: [id],
        }

        const result = await pool.query(query)
        return result.rows
    },

    async cleanTable() {
        await pool.query("DELETE FROM threads WHERE 1=1")
    },
}

module.exports = ThreadTableTestHelper
