const Hapi = require("@hapi/hapi")
const ClientError = require("../../Commons/exceptions/ClientError")
const DomainErrorTranslator = require("../../Commons/exceptions/DomainErrorTranslator")
const users = require("../../Interfaces/http/api/users")
const authentications = require("../../Interfaces/http/api/authentications")
const threads = require("../../Interfaces/http/api/threads")
const thread_comments = require("../../Interfaces/http/api/thread_comments")
const config = require("../../Commons/config")
const Jwt = require("@hapi/jwt")

const createServer = async (container) => {
    const server = Hapi.server({
        host: config.app.host,
        port: config.app.port,
        debug: { log: ["error", "info"] },
    })

    await server.register(Jwt)
    // Mendefinisikan strategi autentikasi JWT
    server.auth.strategy("jwt", "jwt", {
        keys: config.secret.accessTokenKey,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            nbf: true,
            exp: true,
            maxAgeSec: 14400, // 4 jam
            timeSkewSec: 15,
        },
        validate: (artifacts, request, h) => {
            return { isValid: true, credentials: artifacts.decoded.payload }
        },
    })

    await server.register([
        {
            plugin: users,
            options: { container },
        },
        {
            plugin: authentications,
            options: { container },
        },
        {
            plugin: threads,
            options: { container },
        },
        {
            plugin: thread_comments,
            options: { container },
        },
    ])

    server.ext("onPreResponse", (request, h) => {
        // mendapatkan konteks response dari request
        const { response } = request

        if (response instanceof Error) {
            console.error(response.message)

            // bila response tersebut error, tangani sesuai kebutuhan
            const translatedError = DomainErrorTranslator.translate(response)

            // penanganan client error secara internal.
            if (translatedError instanceof ClientError) {
                const newResponse = h.response({
                    status: "fail",
                    message: translatedError.message,
                })
                newResponse.code(translatedError.statusCode)
                return newResponse
            }

            // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
            if (!translatedError.isServer) {
                return h.continue
            }

            // penanganan server error sesuai kebutuhan
            const newResponse = h.response({
                status: "error",
                message: "terjadi kegagalan pada server kami",
            })
            newResponse.code(500)
            return newResponse
        }

        // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
        return h.continue
    })

    return server
}

module.exports = createServer
