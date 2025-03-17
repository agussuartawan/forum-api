const pool = require("../../database/postgres/pool")
const createServer = require("../createServer")
const container = require("../../container")
const ThreadTableTestHelper = require("../../../../tests/ThreadsTableTestHelper")
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper")
const ThreadCommentsTableTestHelper = require("../../../../tests/ThreadCommentsTableTestHelper")

describe("/threads endpoint", () => {
    afterAll(async () => {
        await pool.end()
    })

    afterEach(async () => {
        await ThreadTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
        await ThreadCommentsTableTestHelper.cleanTable()
    })

    describe("when POST /threads", () => {
        it("should response 201 and persisted thread", async () => {
            const token = await UsersTableTestHelper.addUser({
                id: "user-123",
                username: "kowo",
            })
            const server = await createServer(container)
            const payload = {
                title: "dicoding",
                body: "Dicoding Indonesia",
            }

            const response = await server.inject({
                method: "POST",
                url: "/threads",
                payload,
                headers: { Authorization: `Bearer ${token}` },
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(201)
            expect(responseJson.status).toEqual("success")
            expect(responseJson.data.addedThread).toBeDefined()
        })
    })

    describe("when POST /threads/{id}", () => {
        it("should response 200 and return correct threadDetail", async () => {
            const date = new Date()
            await UsersTableTestHelper.addUser({
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
                method: "GET",
                url: `/threads/thread-123`,
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(200)
            expect(responseJson.status).toEqual("success")
            expect(responseJson.data.thread).toBeDefined()
            expect(responseJson.data.thread).toStrictEqual({
                id: "thread-123",
                title: "Cara mencari jodoh",
                body: "Menurut anda bagaimana?",
                date: date.toISOString(),
                username: "kowo",
                comments: [
                    {
                        id: "comment-123",
                        username: "kowo",
                        date: date.toISOString(),
                        content: "Cepat beritahu aku caranya",
                    },
                ],
            })
        })

        it("should response 404 when threadId does not exist", async () => {
            const server = await createServer(container)
            const response = await server.inject({
                method: "GET",
                url: `/threads/thread-123`,
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(404)
            expect(responseJson.status).toEqual("fail")
        })
    })
})
