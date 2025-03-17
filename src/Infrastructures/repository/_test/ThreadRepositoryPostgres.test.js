const ThreadRepositoryPostgres = require(`../ThreadRepositoryPostgres`)
const ThreadTableTestHelper = require("../../../../tests/ThreadsTableTestHelper")
const pool = require("../../database/postgres/pool")
const NotFoundError = require("../../../Commons/exceptions/NotFoundError")
const NewThread = require("../../../Domains/threads/entities/NewThread")
const ThreadCommentTableTestHelper = require("../../../../tests/ThreadCommentsTableTestHelper")
const UserTableTestHelper = require("../../../../tests/UsersTableTestHelper")

describe("ThreadRepositoryPostgres", () => {
    afterEach(async () => {
        await ThreadTableTestHelper.cleanTable()
        await UserTableTestHelper.cleanTable()
        await ThreadCommentTableTestHelper.cleanTable()
    })

    afterAll(async () => {
        await pool.end()
    })

    describe("verifyThread functions", () => {
        it("should throw NotFoundError when thread not exists", async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(
                pool,
                {},
            )

            await expect(
                threadRepositoryPostgres.verifyThread("thread-123"),
            ).rejects.toThrowError(NotFoundError)
        })

        it("should not throw NotFoundError when thread exists", async () => {
            await UserTableTestHelper.addUser({
                id: "user-1234",
                username: "kowo",
            })
            await ThreadTableTestHelper.addThread({
                id: "thread-123",
                ownerId: "user-1234",
            })
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(
                pool,
                {},
            )

            await expect(
                threadRepositoryPostgres.verifyThread("thread-123"),
            ).resolves.not.toThrowError(NotFoundError)
        })
    })

    describe("addThread functions", () => {
        it("should persist new thread and return added thread correctly", async () => {
            await UserTableTestHelper.addUser({ id: "user-123" })
            const newThread = new NewThread({
                title: "New Thread",
                body: "new body",
            })
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(
                pool,
                () => "123",
            )

            const addedThread = await threadRepositoryPostgres.addThread(
                "user-123",
                newThread,
            )

            const threads = await ThreadTableTestHelper.findThreadById(
                addedThread.id,
            )

            expect(threads).toHaveLength(1)
            expect(threads[0].title).toEqual(newThread.title)
            expect(threads[0].body).toEqual(newThread.body)
            expect(threads[0].owner_id).toEqual("user-123")
        })
    })

    describe("getThreadDetail functions", () => {
        it("should throw NotFoundError when thread not exists", async () => {
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(
                pool,
                {},
            )

            await expect(
                threadRepositoryPostgres.getThreadDetail("thread-123"),
            ).rejects.toThrowError(NotFoundError)
        })

        it("should return thread correctly", async () => {
            const date = new Date()
            await UserTableTestHelper.addUser({
                id: "user-123kowo",
                username: "kowo_kuwu",
            })
            await ThreadTableTestHelper.addThread({
                id: "thread-123",
                ownerId: "user-123kowo",
                date,
            })
            await ThreadCommentTableTestHelper.addComment({
                id: "comment-123",
                threadId: "thread-123",
                ownerId: "user-123kowo",
                content: "new comment",
                date,
            })
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(
                pool,
                {},
            )

            const thread =
                await threadRepositoryPostgres.getThreadDetail("thread-123")

            expect(thread).toStrictEqual({
                id: "thread-123",
                title: "Cara mencari jodoh",
                body: "Menurut anda bagaimana?",
                date,
                username: "kowo_kuwu",
                comments: [
                    {
                        id: "comment-123",
                        content: "new comment",
                        date,
                        username: "kowo_kuwu",
                    },
                ],
            })
        })
    })
})
