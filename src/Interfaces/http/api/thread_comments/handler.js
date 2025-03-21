const ThreadCommentUseCase = require("../../../../Applications/use_case/ThreadCommentUseCase")

class ThreadCommentHandler {
    constructor(container) {
        this._container = container

        this.postThreadComment = this.postThreadComment.bind(this)
        this.deleteThreadComment = this.deleteThreadComment.bind(this)
        this.postCommentReply = this.postCommentReply.bind(this)
        this.deleteCommentReply = this.deleteCommentReply.bind(this)
    }

    async postThreadComment(request, h) {
        const { id: ownerId } = request.auth.credentials

        const commentUseCase = this._container.getInstance(
            ThreadCommentUseCase.name,
        )
        const addedComment = await commentUseCase.addThreadComment({
            ownerId: ownerId,
            content: request.payload.content,
            threadId: request.params.threadId,
        })

        const response = h.response({
            status: "success",
            data: {
                addedComment,
            },
        })
        response.code(201)
        return response
    }

    async deleteThreadComment(request, h) {
        const { id: ownerId } = request.auth.credentials
        const { threadId, commentId } = request.params
        const commentUseCase = this._container.getInstance(
            ThreadCommentUseCase.name,
        )

        await commentUseCase.deleteThreadComment(ownerId, threadId, commentId)

        const response = h.response({
            status: "success",
        })
        response.code(200)
        return response
    }

    async postCommentReply(request, h) {
        const { id: ownerId } = request.auth.credentials
        const { threadId, commentId } = request.params

        const commentUseCase = this._container.getInstance(
            ThreadCommentUseCase.name,
        )
        const addedReply = await commentUseCase.addCommentReply({
            ownerId: ownerId,
            content: request.payload.content,
            threadId: threadId,
            commentId: commentId,
        })

        const response = h.response({
            status: "success",
            data: { addedReply },
        })
        response.code(201)
        return response
    }

    async deleteCommentReply(request, h) {
        const { id: ownerId } = request.auth.credentials
        const { threadId, commentId, replyId } = request.params

        const commentUseCase = this._container.getInstance(
            ThreadCommentUseCase.name,
        )

        await commentUseCase.deleteCommentReply(
            ownerId,
            threadId,
            commentId,
            replyId,
        )

        const response = h.response({
            status: "success",
        })
        response.code(200)
        return response
    }
}

module.exports = ThreadCommentHandler
