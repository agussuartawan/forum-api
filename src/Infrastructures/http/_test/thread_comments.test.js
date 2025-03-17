const pool = require("../../database/postgres/pool")
const createServer = require("../createServer")
const container = require("../../container")
const ThreadTableTestHelper = require("../../../../tests/ThreadsTableTestHelper")
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper")
const ThreadCommentsTableTestHelper = require("../../../../tests/ThreadCommentsTableTestHelper")

describe("/threads/{threadId}/comments endpoint", () => {
    afterAll(async () => {
        await pool.end()
    })

    afterEach(async () => {
        await ThreadTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
        await ThreadCommentsTableTestHelper.cleanTable()
    })

    describe("when POST /threads/{threadId}/comments", () => {
        it("should response 201 and persisted thread comment", async () => {
            const token = await UsersTableTestHelper.addUser({
                id: "user-123",
                username: "kowo",
            })
            await ThreadTableTestHelper.addThread({})
            const server = await createServer(container)
            const payload = {
                content: "new comment",
            }

            const response = await server.inject({
                method: "POST",
                url: "/threads/thread-123/comments",
                payload,
                headers: { Authorization: `Bearer ${token}` },
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(201)
            expect(responseJson.status).toEqual("success")
            expect(responseJson.data.addedComment).toBeDefined()
        })
    })

    describe("when POST /threads/{threadId}/comments/{commentId}/replies", () => {
        it("should response 201 and persisted comment reply", async () => {
            const token = await UsersTableTestHelper.addUser({
                id: "user-123",
                username: "kowo",
            })
            await ThreadTableTestHelper.addThread({})
            await ThreadCommentsTableTestHelper.addComment({
                ownerId: "user-123",
            })
            const server = await createServer(container)
            const payload = {
                content: "new comment reply",
            }

            const response = await server.inject({
                method: "POST",
                url: "/threads/thread-123/comments/comment-123/replies",
                payload,
                headers: { Authorization: `Bearer ${token}` },
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(201)
            expect(responseJson.status).toEqual("success")
            expect(responseJson.data.addedReply).toBeDefined()
        })
    })

    describe("when POST /threads/{threadId}/comments/{commentId}", () => {
        it("should response 200 and soft delete comment successfully", async () => {
            const date = new Date()
            const token = await UsersTableTestHelper.addUser({
                id: "user-123",
                username: "kowo",
            })
            await ThreadTableTestHelper.addThread({
                ownerId: "user-123",
                date: date,
            })
            await ThreadCommentsTableTestHelper.addComment({
                threadId: "thread-123",
                ownerId: "user-123",
                date: date,
            })
            const server = await createServer(container)

            const response = await server.inject({
                method: "DELETE",
                url: `/threads/thread-123/comments/comment-123`,
                headers: { Authorization: `Bearer ${token}` },
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(200)
            expect(responseJson.status).toEqual("success")
        })

        it("should response 404 when comment does not exist", async () => {
            const token = await UsersTableTestHelper.addUser({
                id: "user-123",
                username: "kowo",
            })
            const server = await createServer(container)
            const response = await server.inject({
                method: "DELETE",
                url: `/threads/thread-123/comments/comment-123`,
                headers: { Authorization: `Bearer ${token}` },
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(404)
            expect(responseJson.status).toEqual("fail")
        })

        it("should response 403 when trying to delete another user comment", async () => {
            const date = new Date()
            const token = await UsersTableTestHelper.addUser({
                id: "user-123",
                username: "kowo",
            })
            await UsersTableTestHelper.addUser({
                id: "user-1234",
                username: "kowo_kuwu",
            })
            await ThreadTableTestHelper.addThread({
                ownerId: "user-1234",
                date: date,
            })
            await ThreadCommentsTableTestHelper.addComment({
                threadId: "thread-123",
                ownerId: "user-1234",
                date: date,
            })
            const server = await createServer(container)
            const response = await server.inject({
                method: "DELETE",
                url: `/threads/thread-123/comments/comment-123`,
                headers: { Authorization: `Bearer ${token}` },
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(403)
            expect(responseJson.status).toEqual("fail")
        })
    })

    describe("when POST /threads/{threadId}/comments/{commentId}/replies/{replyId}", () => {
        it("should response 200 and soft delete comment reply successfully", async () => {
            const date = new Date()
            const token = await UsersTableTestHelper.addUser({
                id: "user-123",
                username: "kowo",
            })
            await ThreadTableTestHelper.addThread({
                ownerId: "user-123",
                date: date,
            })
            await ThreadCommentsTableTestHelper.addComment({
                threadId: "thread-123",
                ownerId: "user-123",
                date: date,
            })
            await ThreadCommentsTableTestHelper.addComment({
                id: "reply-123",
                parentId: "comment-123",
                ownerId: "user-123",
            })
            const server = await createServer(container)

            const response = await server.inject({
                method: "DELETE",
                url: `/threads/thread-123/comments/comment-123/replies/reply-123`,
                headers: { Authorization: `Bearer ${token}` },
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(200)
            expect(responseJson.status).toEqual("success")
        })

        it("should response 404 when comment reply does not exist", async () => {
            const token = await UsersTableTestHelper.addUser({
                id: "user-123",
                username: "kowo",
            })
            const server = await createServer(container)
            const response = await server.inject({
                method: "DELETE",
                url: `/threads/thread-123/comments/comment-123/replies/reply-123`,
                headers: { Authorization: `Bearer ${token}` },
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(404)
            expect(responseJson.status).toEqual("fail")
        })

        it("should response 403 when trying to delete another user comment reply", async () => {
            const date = new Date()
            const token = await UsersTableTestHelper.addUser({
                id: "user-123",
                username: "kowo",
            })
            await UsersTableTestHelper.addUser({
                id: "user-1234",
                username: "kowo_kuwu",
            })
            await ThreadTableTestHelper.addThread({
                ownerId: "user-1234",
                date: date,
            })
            await ThreadCommentsTableTestHelper.addComment({
                threadId: "thread-123",
                ownerId: "user-1234",
                date: date,
            })
            await ThreadCommentsTableTestHelper.addComment({
                id: "reply-123",
                ownerId: "user-1234",
                parentId: "comment-123",
                date: date,
            })
            const server = await createServer(container)
            const response = await server.inject({
                method: "DELETE",
                url: `/threads/thread-123/comments/comment-123/replies/reply-123`,
                headers: { Authorization: `Bearer ${token}` },
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(403)
            expect(responseJson.status).toEqual("fail")
        })
    })
})
