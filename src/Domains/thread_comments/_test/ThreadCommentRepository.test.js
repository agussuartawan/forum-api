const ThreadCommentRepository = require("../ThreadCommentRepository")

describe("ThreadCommentRepository", () => {
    it("should throw error when invoke abstract behaviour", async () => {
        const commentRepository = new ThreadCommentRepository()

        await expect(
            commentRepository.addThreadComment({}),
        ).rejects.toThrowError(
            "THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED",
        )

        await expect(
            commentRepository.deleteThreadComment(""),
        ).rejects.toThrowError(
            "THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED",
        )

        await expect(
            commentRepository.verifyThreadComment(""),
        ).rejects.toThrowError(
            "THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED",
        )

        await expect(
            commentRepository.getThreadCommentById(""),
        ).rejects.toThrowError(
            "THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED",
        )
    })
})
