class ThreadCommentUseCase {
    constructor({ commentRepository, threadRepository }) {
        this._commentRepository = commentRepository
        this._threadRepository = threadRepository
    }

    async addThreadComment(payload) {
        const { threadId, content } = payload
        if (!content) {
            throw new Error("NEW_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY")
        }
        if (typeof content !== "string") {
            throw new Error(
                "NEW_THREAD_COMMENT.DID_NOT_MATCH_DATA_TYPE_SPECIFICATION",
            )
        }

        await this._threadRepository.verifyThread(threadId) // will throw NotFoundException if threadId doesnt exists

        return this._commentRepository.addThreadComment(payload)
    }

    async deleteThreadComment(loggedUserId, threadId, id) {
        const comment = await this._commentRepository.getThreadCommentById(
            threadId,
            id,
        )
        if (!comment) {
            throw new Error("THREAD_COMMENT_USE_CASE.COMMENT_NOT_FOUND")
        }

        if (comment.owner_id !== loggedUserId) {
            throw new Error("THREAD_COMMENT_USE_CASE.FORBIDDEN")
        }

        await this._commentRepository.deleteThreadComment(id)
    }

    async addCommentReply(payload) {
        const { threadId, commentId, content } = payload
        if (!content) {
            throw new Error("NEW_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY")
        }
        if (typeof content !== "string") {
            throw new Error(
                "NEW_COMMENT_REPLY.DID_NOT_MATCH_DATA_TYPE_SPECIFICATION",
            )
        }

        await this._threadRepository.verifyThread(threadId) // will throw NotFoundException if threadId doesn't exists
        await this._commentRepository.verifyThreadComment(commentId) // will throw NotFoundException if commentId doesn't exists

        return this._commentRepository.addCommentReply(payload)
    }

    async deleteCommentReply(loggedUserId, threadId, commentId, id) {
        const reply = await this._commentRepository.getCommentReplyById(
            threadId,
            commentId,
            id,
        )
        if (!reply) {
            throw new Error("COMMENT_REPLY.REPLY_NOT_FOUND")
        }

        if (reply.owner_id !== loggedUserId) {
            throw new Error("COMMENT_REPLY.FORBIDDEN")
        }

        await this._commentRepository.deleteCommentReply(id)
    }
}

module.exports = ThreadCommentUseCase
