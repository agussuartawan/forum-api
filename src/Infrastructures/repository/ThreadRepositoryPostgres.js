const InvariantError = require("../../Commons/exceptions/InvariantError")
const AddedThread = require("../../Domains/threads/entities/AddedThread")
const ThreadRepository = require("../../Domains/threads/ThreadRepository")

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator) {
        super()
        this._pool = pool
        this._idGenerator = idGenerator
    }

    async verifyThread(id) {
        const query = {
            text: "SELECT id FROM threads WHERE id = $1",
            values: [id],
        }
        const result = await this._pool.query(query)
        if (!result.rowCount) {
            throw new InvariantError("thread tidak ditemukan")
        }
    }

    async addThread(ownerId, newThread) {
        const { title, body } = newThread
        const id = `thread-${this._idGenerator()}`

        const query = {
            text: "INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner_id",
            values: [id, ownerId, title, body],
        }

        const result = await this._pool.query(query)

        return new AddedThread({
            id: result.rows[0].id,
            title: result.rows[0].title,
            owner: result.rows[0].owner_id,
        })
    }

    async getThreadDetail(id) {
        const query = {
            text: `
                SELECT 
                    t.id, 
                    t.title, 
                    t.body, 
                    u.username, 
                    t.created_at AS date,
                    COALESCE(
                        json_agg(
                            json_build_object(
                                'id', c.id,
                                'content', c.content,
                                'date', c.created_at,
                                'username', uc.username
                            )
                        ) FILTER (WHERE c.id IS NOT NULL), '[]'
                    ) AS comments
                FROM threads t
                LEFT JOIN users u ON t.owner_id = u.id
                LEFT JOIN thread_comments c ON t.id = c.thread_id
                LEFT JOIN users uc ON c.owner_id = uc.id
                WHERE t.id = $1
                GROUP BY t.id, u.username
            `,
            values: [id],
        }
        const result = await this._pool.query(query)
        if (!result.rowCount) {
            throw new InvariantError("thread tidak ditemukan")
        }

        const thread = result.rows[0]
        return {
            id: thread.id,
            title: thread.title,
            body: thread.body,
            date: new Date(thread.date), // Konversi ke Date object
            username: thread.username,
            comments: thread.comments.map((comment) => ({
                id: comment.id,
                content: comment.content,
                date: new Date(comment.date), // Konversi ke Date object
                username: comment.username,
            })),
        }
    }
}

module.exports = ThreadRepositoryPostgres
