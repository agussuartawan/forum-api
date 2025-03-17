const NewThread = require("../../Domains/threads/entities/NewThread")

class ThreadUseCase {
    constructor({ threadRepository }) {
        this._threadRepository = threadRepository
    }

    async addThread(ownerId, useCasePayload) {
        const newThread = new NewThread(useCasePayload)
        return this._threadRepository.addThread(ownerId, newThread)
    }

    async getThreadDetail(id) {
        return this._threadRepository.getThreadDetail(id)
    }
}

module.exports = ThreadUseCase
