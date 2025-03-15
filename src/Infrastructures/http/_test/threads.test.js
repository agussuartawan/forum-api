const pool = require("../../database/postgres/pool")
const createServer = require("../createServer")
const container = require("../../container")
const ThreadTableTestHelper = require("../../../../tests/ThreadsTableTestHelper")
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper")
const config = require("../../../Commons/config")

describe("/threads endpoint", () => {
    afterAll(async () => {
        await pool.end()
    })

    afterEach(async () => {
        await ThreadTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
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
})
