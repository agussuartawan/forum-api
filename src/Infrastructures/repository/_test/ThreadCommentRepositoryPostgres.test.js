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
