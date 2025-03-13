/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool")
const threadTableTestHelper = require("ThreadsTableTestHelper")
const usersTableTestHelper = require("UsersTableTestHelper")

const ThreadCommentsTableTestHelper = {
    async addComment({
        id = "comment-123",
        threadId = "thread-123",
        ownerId = "user-1234",
        content = "Cepat beritahu aku caranya",
    }) {
        await threadTableTestHelper.addThread({ id: threadId })
        await usersTableTestHelper.addUser({ id: ownerId })

        const query = {
            text: "INSERT INTO thread_comments VALUES($1, $2, $3, $4)",
            values: [id, threadId, ownerId, content],
        }

        await pool.query(query)
    },

    async findCommentById(id) {
        const query = {
            text: "SELECT * FROM thread_comments WHERE id = $1",
            values: [id],
        }

        const result = await pool.query(query)
        return result.rows
    },

    async cleanTable() {
        await pool.query("DELETE FROM thread_comments WHERE 1=1")
    },
}

module.exports = ThreadCommentsTableTestHelper
