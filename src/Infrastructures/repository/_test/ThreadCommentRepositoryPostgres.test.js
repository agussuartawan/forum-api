const ThreadCommentRepositoryPostgres = require("../ThreadCommentRepositoryPostgres")
const ThreadCommentTableTestHelper = require("../../../../tests/ThreadCommentsTableTestHelper")
const UserTableTestHelper = require("../../../../tests/UsersTableTestHelper")
const ThreadTableTestHelper = require("../../../../tests/ThreadsTableTestHelper")
const pool = require("../../database/postgres/pool")
const NotFoundError = require("../../../Commons/exceptions/NotFoundError")
const AddedComment = require("../../../Domains/thread_comments/entities/AddedComment")

describe("ThreadCommentRepositoryPostgres", () => {
    afterEach(async () => {
        await ThreadCommentTableTestHelper.cleanTable()
        await UserTableTestHelper.cleanTable()
        await ThreadCommentTableTestHelper.cleanTable()
    })

    afterAll(async () => {
        await pool.end()
    })

    describe("addThreadComment function", () => {
        it("should persist new comment and return added comment correctly", async () => {
            await UserTableTestHelper.addUser({})
            await ThreadTableTestHelper.addThread({})
            const newComment = {
                ownerId: "user-123",
                threadId: "thread-123",
                content: "New comment",
            }
            const commentRepository = new ThreadCommentRepositoryPostgres(
                pool,
                () => "123",
            )

            const addedComment =
                await commentRepository.addThreadComment(newComment)

            const thread = await commentRepository.getThreadCommentById(
                newComment.threadId,
                addedComment.id,
            )

            expect(addedComment).toStrictEqual(
                new AddedComment({
                    id: "comment-123",
                    content: "New comment",
                    owner: "user-123",
                }),
            )
            expect(thread.id).toEqual("comment-123")
            expect(thread.content).toEqual(newComment.content)
            expect(thread.owner_id).toEqual(newComment.ownerId)
        })
    })

    describe("addCommentReply function", () => {
        it("should persist new comment reply and return it correctly", async () => {
            await UserTableTestHelper.addUser({})
            await ThreadTableTestHelper.addThread({})
            await ThreadCommentTableTestHelper.addComment({
                id: "comment-123",
                ownerId: "user-123",
            })
            const newReply = {
                ownerId: "user-123",
                threadId: "thread-123",
                commentId: "comment-123",
                content: "New reply",
            }
            const commentRepository = new ThreadCommentRepositoryPostgres(
                pool,
                () => "123",
            )

            const addedReply = await commentRepository.addCommentReply(newReply)

            const reply = await commentRepository.getCommentReplyById(
                newReply.threadId,
                newReply.commentId,
                addedReply.id,
            )

            expect(addedReply).toStrictEqual(
                new AddedComment({
                    id: "reply-123",
                    content: "New reply",
                    owner: "user-123",
                }),
            )
            expect(reply.id).toEqual("reply-123")
            expect(reply.content).toEqual(newReply.content)
            expect(reply.owner_id).toEqual(newReply.ownerId)
        })
    })

    describe("deleteThreadComment function", () => {
        it("should soft delete comment correctly", async () => {
            await UserTableTestHelper.addUser({
                id: "user-1234",
                username: "kowo",
            })
            await ThreadTableTestHelper.addThread({
                id: "thread-123",
                ownerId: "user-1234",
            })
            await ThreadCommentTableTestHelper.addComment({
                threadId: "thread-123",
                ownerId: "user-1234",
            })
            const commentRepositoryPostgres =
                new ThreadCommentRepositoryPostgres(pool, {})

            await commentRepositoryPostgres.deleteThreadComment("comment-123")
            const comment =
                await commentRepositoryPostgres.getThreadCommentById(
                    "thread-123",
                    "comment-123",
                )

            expect(comment.id).toEqual("comment-123")
            expect(comment.deleted_at).not.toBeNull()
        })
    })

    describe("deleteCommentReply function", () => {
        it("should soft delete comment correctly reply", async () => {
            await UserTableTestHelper.addUser({
                id: "user-1234",
                username: "kowo",
            })
            await ThreadTableTestHelper.addThread({
                id: "thread-123",
                ownerId: "user-1234",
            })
            await ThreadCommentTableTestHelper.addComment({
                threadId: "thread-123",
            })
            await ThreadCommentTableTestHelper.addComment({
                id: "reply-123",
                parentId: "comment-123",
            })
            const commentRepositoryPostgres =
                new ThreadCommentRepositoryPostgres(pool, {})

            await commentRepositoryPostgres.deleteCommentReply("reply-123")
            const comment = await commentRepositoryPostgres.getCommentReplyById(
                "thread-123",
                "comment-123",
                "reply-123",
            )

            expect(comment.id).toEqual("reply-123")
            expect(comment.deleted_at).not.toBeNull()
        })
    })

    describe("verifyThreadComment function", () => {
        it("should throw NotFoundError when comment not exists", async () => {
            const commentRepositoryPostgres =
                new ThreadCommentRepositoryPostgres(pool, {})

            await expect(
                commentRepositoryPostgres.verifyThreadComment("comment-123"),
            ).rejects.toThrowError(NotFoundError)
        })

        it("should not throw NotFoundError when comment exists", async () => {
            await UserTableTestHelper.addUser({
                id: "user-1234",
                username: "kowo",
            })
            await ThreadTableTestHelper.addThread({
                id: "thread-123",
                ownerId: "user-1234",
            })
            await ThreadCommentTableTestHelper.addComment({
                threadId: "thread-123",
                ownerId: "user-1234",
            })
            const commentRepositoryPostgres =
                new ThreadCommentRepositoryPostgres(pool, {})

            await expect(
                commentRepositoryPostgres.verifyThreadComment("comment-123"),
            ).resolves.not.toThrowError(NotFoundError)
        })
    })

    describe("getThreadCommentById function", () => {
        it("should throw NotFoundError when comment not exists", async () => {
            await UserTableTestHelper.addUser({
                id: "user-1234",
                username: "kowo",
            })
            await ThreadTableTestHelper.addThread({
                id: "thread-123",
                ownerId: "user-1234",
            })
            await ThreadCommentTableTestHelper.addComment({
                threadId: "thread-123",
                ownerId: "user-1234",
            })
            const commentRepositoryPostgres =
                new ThreadCommentRepositoryPostgres(pool, {})

            await expect(
                commentRepositoryPostgres.getThreadCommentById(
                    "thread-123",
                    "comment-123",
                ),
            ).resolves.not.toThrowError(NotFoundError)
        })

        it("should throw NotFoundError when comment not exists", async () => {
            const commentRepositoryPostgres =
                new ThreadCommentRepositoryPostgres(pool, {})

            await expect(
                commentRepositoryPostgres.getThreadCommentById("comment-123"),
            ).rejects.toThrowError(NotFoundError)
        })
    })
})
