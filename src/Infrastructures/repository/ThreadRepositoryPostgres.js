const AddedThread = require("../../Domains/threads/entities/AddedThread")
const ThreadRepository = require("../../Domains/threads/ThreadRepository")
const NotFoundError = require("../../Commons/exceptions/NotFoundError")

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
            throw new NotFoundError("thread tidak ditemukan")
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
                                'content', CASE WHEN c.deleted_at IS NOT NULL THEN '**komentar telah dihapus**' ELSE c.content END,
                                'date', c.created_at,
                                'username', uc.username,
                                'replies', (
                                    SELECT COALESCE(
                                       json_agg(
                                           json_build_object(
                                               'id', r.id,
                                               'content',
                                                CASE
                                                   WHEN r.deleted_at IS NOT NULL THEN '**balasan telah dihapus**'
                                                   ELSE r.content
                                                END,
                                               'date', r.created_at,
                                               'username', ur.username
                                           ) ORDER BY r.created_at ASC
                                       ), '[]'
                                    )
                                    FROM thread_comments r
                                    LEFT JOIN users ur ON r.owner_id = ur.id
                                    WHERE r.parent_id = c.id
                                )
                            ) ORDER BY c.created_at ASC
                        ) FILTER (WHERE c.id IS NOT NULL), '[]'
                    ) AS comments
                FROM threads t
                LEFT JOIN users u ON t.owner_id = u.id
                LEFT JOIN thread_comments c ON t.id = c.thread_id AND c.parent_id IS NULL
                LEFT JOIN users uc ON c.owner_id = uc.id
                WHERE t.id = $1
                GROUP BY t.id, u.username
            `,
            values: [id],
        }
        const result = await this._pool.query(query)
        if (!result.rowCount) {
            throw new NotFoundError("thread tidak ditemukan")
        }

        const thread = result.rows[0]
        return {
            id: thread.id,
            title: thread.title,
            body: thread.body,
            date: new Date(thread.date),
            username: thread.username,
            comments: thread.comments.map((comment) => ({
                id: comment.id,
                content: comment.content,
                date: new Date(comment.date),
                username: comment.username,
                replies: comment.replies.map((reply) => ({
                    id: reply.id,
                    content: reply.content,
                    date: new Date(reply.date),
                    username: reply.username,
                })),
            })),
        }
    }
}

module.exports = ThreadRepositoryPostgres
