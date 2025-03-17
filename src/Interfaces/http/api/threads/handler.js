const ThreadUseCase = require("../../../../Applications/use_case/ThreadUseCase")

class ThreadsHandler {
    constructor(container) {
        this._container = container

        this.getAccessTokenClaimHandler =
            this.getAccessTokenClaimHandler.bind(this)
        this.postThreadHandler = this.postThreadHandler.bind(this)
        this.getThreadDetailById = this.getThreadDetailById.bind(this)
    }

    async getAccessTokenClaimHandler(request, h) {
        const { id: userId, username } = request.auth.credentials
        const response = h.response({
            status: "success",
            data: {
                userId,
                username,
            },
        })
        response.code(200)
        return response
    }

    async postThreadHandler(request, h) {
        const { id: ownerId } = request.auth.credentials
        console.log(request.auth.credentials)
        const threadUseCase = this._container.getInstance(ThreadUseCase.name)
        const addedThread = await threadUseCase.addThread(
            ownerId,
            request.payload,
        )
        const response = h.response({
            status: "success",
            data: {
                addedThread,
            },
        })
        response.code(201)
        return response
    }

    async getThreadDetailById(request, h) {
        const { id: threadId } = request.params
        const threadUseCase = this._container.getInstance(ThreadUseCase.name)
        const thread = await threadUseCase.getThreadDetail(threadId)

        const response = h.response({
            status: "success",
            data: {
                thread,
            },
        })
        response.code(200)
        return response
    }
}

module.exports = ThreadsHandler
