const ThreadCommentRepository = require("../../../Domains/thread_comments/ThreadCommentRepository")
const AddedComment = require("../../../Domains/thread_comments/entities/AddedComment")
const ThreadCommentUseCase = require("../ThreadCommentUseCase")
const ThreadRepository = require("../../../Domains/threads/ThreadRepository")

describe("ThreadCommentUseCase", () => {
    describe("addThreadComment function", () => {
        it("should orchestrating the add thread action correctly", async () => {
            const commentPayload = {
                ownerId: "user-123",
                threadId: "thread-123",
                content: "new comment",
            }
            const mockCommentRepository = new ThreadCommentRepository()
            const mockThreadRepository = new ThreadRepository()
            const mockAddedComment = new AddedComment({
                id: "comment-123",
                owner: commentPayload.ownerId,
                content: commentPayload.content,
            })

            mockCommentRepository.addThreadComment = jest.fn(() =>
                Promise.resolve(mockAddedComment),
            )
            mockThreadRepository.verifyThread = jest
                .fn()
                .mockImplementation(() =>
                    Promise.resolve(commentPayload.threadId),
                )
            const commentUseCase = new ThreadCommentUseCase({
                commentRepository: mockCommentRepository,
                threadRepository: mockThreadRepository,
            })

            const addedComment =
                await commentUseCase.addThreadComment(commentPayload)

            expect(addedComment).toStrictEqual(mockAddedComment)
            expect(mockThreadRepository.verifyThread).toHaveBeenCalledWith(
                commentPayload.threadId,
            )
            expect(mockCommentRepository.addThreadComment).toHaveBeenCalledWith(
                commentPayload,
            )
        })

        it("should throw error when payload not valid", async () => {
            const commentPayload = {
                ownerId: "user-123",
                threadId: "thread-123",
            }

            const commentUseCase = new ThreadCommentUseCase({
                commentRepository: new ThreadCommentRepository(),
                threadRepository: new ThreadRepository(),
            })

            await expect(
                commentUseCase.addThreadComment(commentPayload),
            ).rejects.toThrow("NEW_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY")
        })

        it("should throw error when payload did not meet data type specification", async () => {
            const commentPayload = {
                ownerId: "user-123",
                threadId: "thread-123",
                content: true,
            }

            const commentUseCase = new ThreadCommentUseCase({
                commentRepository: new ThreadCommentRepository(),
                threadRepository: new ThreadRepository(),
            })

            await expect(
                commentUseCase.addThreadComment(commentPayload),
            ).rejects.toThrow(
                "NEW_THREAD_COMMENT.DID_NOT_MATCH_DATA_TYPE_SPECIFICATION",
            )
        })
    })

    describe("addCommentReply function", () => {
        it("should orchestrating the add comment reply action correctly", async () => {
            const commentPayload = {
                ownerId: "user-123",
                threadId: "thread-123",
                commentId: "comment-123",
                content: "new comment",
            }
            const mockCommentRepository = new ThreadCommentRepository()
            const mockThreadRepository = new ThreadRepository()
            const mockAddedComment = new AddedComment({
                id: "reply-123",
                owner: commentPayload.ownerId,
                content: commentPayload.content,
                commentId: commentPayload.commentId,
            })

            mockCommentRepository.addCommentReply = jest.fn(() =>
                Promise.resolve(mockAddedComment),
            )
            mockCommentRepository.verifyThreadComment = jest.fn(() =>
                Promise.resolve(commentPayload.commentId),
            )
            mockThreadRepository.verifyThread = jest
                .fn()
                .mockImplementation(() =>
                    Promise.resolve(commentPayload.threadId),
                )
            const commentUseCase = new ThreadCommentUseCase({
                commentRepository: mockCommentRepository,
                threadRepository: mockThreadRepository,
            })

            const addedComment =
                await commentUseCase.addCommentReply(commentPayload)

            expect(addedComment).toStrictEqual(mockAddedComment)
            expect(mockThreadRepository.verifyThread).toHaveBeenCalledWith(
                commentPayload.threadId,
            )
            expect(mockCommentRepository.addCommentReply).toHaveBeenCalledWith(
                commentPayload,
            )
            expect(
                mockCommentRepository.verifyThreadComment,
            ).toHaveBeenCalledWith(commentPayload.commentId)
        })

        it("should throw error when payload not valid", async () => {
            const commentPayload = {
                ownerId: "user-123",
                threadId: "thread-123",
            }

            const commentUseCase = new ThreadCommentUseCase({
                commentRepository: new ThreadCommentRepository(),
                threadRepository: new ThreadRepository(),
            })

            await expect(
                commentUseCase.addCommentReply(commentPayload),
            ).rejects.toThrow("NEW_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY")
        })

        it("should throw error when payload did not meet data type specification", async () => {
            const commentPayload = {
                ownerId: "user-123",
                threadId: "thread-123",
                content: true,
            }

            const commentUseCase = new ThreadCommentUseCase({
                commentRepository: new ThreadCommentRepository(),
                threadRepository: new ThreadRepository(),
            })

            await expect(
                commentUseCase.addCommentReply(commentPayload),
            ).rejects.toThrow(
                "NEW_COMMENT_REPLY.DID_NOT_MATCH_DATA_TYPE_SPECIFICATION",
            )
        })
    })

    describe("deleteThreadComment function", () => {
        it("should orchestrating the delete thread action correctly", async () => {
            const deletedId = "comment-123"
            const loggedUserId = "user-123"
            const threadId = "thread-123"
            const mockComment = {
                id: deletedId,
                owner_id: loggedUserId,
            }
            const mockCommentRepository = new ThreadCommentRepository()
            const mockThreadRepository = new ThreadRepository()

            mockCommentRepository.deleteThreadComment = jest.fn(() =>
                Promise.resolve(deletedId),
            )
            mockCommentRepository.getThreadCommentById = jest
                .fn()
                .mockImplementation(() => Promise.resolve(mockComment))
            const commentUseCase = new ThreadCommentUseCase({
                commentRepository: mockCommentRepository,
                threadRepository: mockThreadRepository,
            })

            await commentUseCase.deleteThreadComment(
                loggedUserId,
                threadId,
                deletedId,
            )

            expect(
                mockCommentRepository.getThreadCommentById,
            ).toHaveBeenCalledWith(threadId, deletedId)
            expect(
                mockCommentRepository.deleteThreadComment,
            ).toHaveBeenCalledWith(deletedId)
        })

        it("should throw error when loggedUser trying to delete comment from another user", async () => {
            const deletedId = "comment-123"
            const loggedUserId = "user-123"
            const mockComment = {
                id: deletedId,
                owner_id: "user-1234",
            }
            const mockCommentRepository = new ThreadCommentRepository()
            const mockThreadRepository = new ThreadRepository()

            mockCommentRepository.deleteThreadComment = jest.fn(() =>
                Promise.resolve(deletedId),
            )
            mockCommentRepository.getThreadCommentById = jest
                .fn()
                .mockImplementation(() => Promise.resolve(mockComment))
            const commentUseCase = new ThreadCommentUseCase({
                commentRepository: mockCommentRepository,
                threadRepository: mockThreadRepository,
            })

            await expect(
                commentUseCase.deleteThreadComment(loggedUserId, deletedId),
            ).rejects.toThrow("THREAD_COMMENT_USE_CASE.FORBIDDEN")
        })

        it("should throw error when comment doesn't exists", async () => {
            const deletedId = "comment-123"
            const loggedUserId = "user-123"
            const mockCommentRepository = new ThreadCommentRepository()
            const mockThreadRepository = new ThreadRepository()

            mockCommentRepository.deleteThreadComment = jest.fn(() =>
                Promise.resolve(deletedId),
            )
            mockCommentRepository.getThreadCommentById = jest
                .fn()
                .mockImplementation(() => Promise.resolve())
            const commentUseCase = new ThreadCommentUseCase({
                commentRepository: mockCommentRepository,
                threadRepository: mockThreadRepository,
            })

            await expect(
                commentUseCase.deleteThreadComment(loggedUserId, deletedId),
            ).rejects.toThrow("THREAD_COMMENT_USE_CASE.COMMENT_NOT_FOUND")
        })
    })

    describe("deleteCommentReply function", () => {
        it("should orchestrating the delete comment reply correctly", async () => {
            const deletedId = "reply-123"
            const loggedUserId = "user-123"
            const threadId = "thread-123"
            const commentId = "comment-123"

            const mockComment = {
                id: deletedId,
                owner_id: loggedUserId,
            }
            const mockCommentRepository = new ThreadCommentRepository()
            const mockThreadRepository = new ThreadRepository()

            mockCommentRepository.deleteCommentReply = jest.fn(() =>
                Promise.resolve(deletedId),
            )
            mockCommentRepository.getCommentReplyById = jest
                .fn()
                .mockImplementation(() => Promise.resolve(mockComment))
            const commentUseCase = new ThreadCommentUseCase({
                commentRepository: mockCommentRepository,
                threadRepository: mockThreadRepository,
            })

            await commentUseCase.deleteCommentReply(
                loggedUserId,
                threadId,
                commentId,
                deletedId,
            )

            expect(
                mockCommentRepository.getCommentReplyById,
            ).toHaveBeenCalledWith(threadId, commentId, deletedId)
            expect(
                mockCommentRepository.deleteCommentReply,
            ).toHaveBeenCalledWith(deletedId)
        })

        it("should throw error when loggedUser trying to delete comment from another user", async () => {
            const deletedId = "reply-123"
            const loggedUserId = "user-123"
            const threadId = "thread-123"
            const commentId = "comment-123"
            const mockComment = {
                id: deletedId,
                owner_id: "user-1234",
            }
            const mockCommentRepository = new ThreadCommentRepository()
            const mockThreadRepository = new ThreadRepository()

            mockCommentRepository.deleteCommentReply = jest.fn(() =>
                Promise.resolve(deletedId),
            )
            mockCommentRepository.getCommentReplyById = jest
                .fn()
                .mockImplementation(() => Promise.resolve(mockComment))
            const commentUseCase = new ThreadCommentUseCase({
                commentRepository: mockCommentRepository,
                threadRepository: mockThreadRepository,
            })

            await expect(
                commentUseCase.deleteCommentReply(
                    loggedUserId,
                    threadId,
                    commentId,
                    deletedId,
                ),
            ).rejects.toThrow("COMMENT_REPLY.FORBIDDEN")
        })

        it("should throw error when comment reply doesn't exists", async () => {
            const deletedId = "reply-123"
            const loggedUserId = "user-123"
            const threadId = "thread-123"
            const commentId = "comment-123"
            const mockCommentRepository = new ThreadCommentRepository()
            const mockThreadRepository = new ThreadRepository()

            mockCommentRepository.deleteThreadComment = jest.fn(() =>
                Promise.resolve(deletedId),
            )
            mockCommentRepository.getCommentReplyById = jest
                .fn()
                .mockImplementation(() => Promise.resolve())
            const commentUseCase = new ThreadCommentUseCase({
                commentRepository: mockCommentRepository,
                threadRepository: mockThreadRepository,
            })

            await expect(
                commentUseCase.deleteCommentReply(
                    loggedUserId,
                    threadId,
                    commentId,
                    deletedId,
                ),
            ).rejects.toThrow("COMMENT_REPLY.REPLY_NOT_FOUND")
        })
    })
})
