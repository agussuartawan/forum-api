const NewThread = require("../../Domains/threads/entities/NewThread")

class ThreadUseCase {
    constructor({ threadRepository }) {
        this._threadRepository = threadRepository
    }

    async addThread(ownerId, useCasePayload) {
        const newThread = new NewThread(useCasePayload)
        return this._threadRepository.addThread(ownerId, newThread)
    }
}

module.exports = ThreadUseCase
