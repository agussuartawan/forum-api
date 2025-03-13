const ThreadCommentRepository = require("../ThreadCommentRepository")

describe("ThreadCommentRepository", () => {
    it("should throw error when invoke abstract behaviour", async () => {
        const threadRepository = new ThreadCommentRepository()

        await expect(
            threadRepository.addThreadComment({}),
        ).rejects.toThrowError(
            "THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED",
        )
        await expect(
            threadRepository.deleteThreadComment(""),
        ).rejects.toThrowError(
            "THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED",
        )
        await expect(
            threadRepository.verifyThreadComment(""),
        ).rejects.toThrowError(
            "THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED",
        )
    })
})
