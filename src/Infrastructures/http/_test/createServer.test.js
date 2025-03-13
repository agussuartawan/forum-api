const createServer = require("../createServer")
const container = require("../../container")
const Jwt = require("@hapi/jwt")
const config = require("../../../Commons/config")

describe("HTTP server", () => {
    it("should response 404 when request unregistered route", async () => {
        // Arrange
        const server = await createServer({})

        // Action
        const response = await server.inject({
            method: "GET",
            url: "/unregisteredRoute",
        })

        // Assert
        expect(response.statusCode).toEqual(404)
    })

    it("should handle server error correctly", async () => {
        // Arrange
        const requestPayload = {
            username: "dicoding",
            fullname: "Dicoding Indonesia",
            password: "super_secret",
        }
        const server = await createServer({}) // fake injection

        // Action
        const response = await server.inject({
            method: "POST",
            url: "/users",
            payload: requestPayload,
        })

        // Assert
        const responseJson = JSON.parse(response.payload)
        expect(response.statusCode).toEqual(500)
        expect(responseJson.status).toEqual("error")
        expect(responseJson.message).toEqual(
            "terjadi kegagalan pada server kami",
        )
    })

    it("should response 401 when accessing protected route without bearer token", async () => {
        const server = await createServer(container)

        const response = await server.inject({
            method: "GET",
            url: "/threads/get-access-token-claims",
        })

        const responseJson = JSON.parse(response.payload)
        expect(response.statusCode).toEqual(401)
        expect(responseJson.message).toEqual("Missing authentication")
    })

    it("should response 200 when accessing protected route with bearer token", async () => {
        const server = await createServer(container)
        const token = Jwt.token.generate(
            { id: "user-123", username: "kowo" },
            config.secret.accessTokenKey,
        )

        const response = await server.inject({
            method: "GET",
            url: "/threads/get-access-token-claims",
            headers: { Authorization: `Bearer ${token}` },
        })

        const responseJson = JSON.parse(response.payload)
        expect(response.statusCode).toEqual(200)
        expect(responseJson.data).toStrictEqual({
            userId: "user-123",
            username: "kowo",
        })
    })
})
