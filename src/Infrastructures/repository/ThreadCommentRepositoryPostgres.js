const ThreadCommentRepository = require("../../Domains/thread_comments/ThreadCommentRepository")
const AddedComment = require("../../Domains/thread_comments/entities/AddedComment")
const NotFoundError = require("../../Commons/exceptions/NotFoundError")

class ThreadCommentRepositoryPostgres extends ThreadCommentRepository {
    constructor(pool, idGenerator) {
        super()
        this._pool = pool
        this._idGenerator = idGenerator
    }

    async addThreadComment(payload) {
        const { ownerId, threadId, content } = payload
        const id = `comment-${this._idGenerator()}`
        const query = {
            text: "INSERT INTO thread_comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner_id",
            values: [id, threadId, ownerId, null, content],
        }

        const result = await this._pool.query(query)

        return new AddedComment({
            id: result.rows[0].id,
            content: result.rows[0].content,
            owner: result.rows[0].owner_id,
        })
    }

    async verifyThreadComment(id) {
        const query = {
            text: "SELECT id FROM thread_comments WHERE id = $1",
            values: [id],
        }
        const result = await this._pool.query(query)
        if (!result.rowCount) {
            throw new NotFoundError("komentar tidak ditemukan")
        }
    }

    async deleteThreadComment(id) {
        const query = {
            text: "UPDATE thread_comments SET deleted_at = now() WHERE id = $1",
            values: [id],
        }

        await this._pool.query(query)
    }

    async getThreadCommentById(threadId, id) {
        const query = {
            text: "SELECT * FROM thread_comments WHERE id = $1 AND thread_id = $2",
            values: [id, threadId],
        }

        const result = await this._pool.query(query)
        if (!result.rowCount) {
            throw new NotFoundError("komentar tidak ditemukan")
        }

        return result.rows[0]
    }

    async addCommentReply(payload) {
        const { ownerId, threadId, commentId, content } = payload
        const id = `reply-${this._idGenerator()}`
        const query = {
            text: "INSERT INTO thread_comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner_id",
            values: [id, threadId, ownerId, commentId, content],
        }

        const result = await this._pool.query(query)

        return new AddedComment({
            id: result.rows[0].id,
            content: result.rows[0].content,
            owner: result.rows[0].owner_id,
        })
    }

    async deleteCommentReply(id) {
        const query = {
            text: "UPDATE thread_comments SET deleted_at = now() WHERE id = $1",
            values: [id],
        }

        await this._pool.query(query)
    }

    async getCommentReplyById(threadId, commentId, id) {
        const query = {
            text: "SELECT * FROM thread_comments WHERE id = $1 AND thread_id = $2 AND parent_id = $3",
            values: [id, threadId, commentId],
        }

        const result = await this._pool.query(query)
        if (!result.rowCount) {
            throw new NotFoundError("balasan tidak ditemukan")
        }

        return result.rows[0]
    }
}

module.exports = ThreadCommentRepositoryPostgres
