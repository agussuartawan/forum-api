const routes = require("./routes")
const ThreadCommentHandler = require("./handler")

module.exports = {
    name: "thread_comments",
    register: async (server, { container }) => {
        const handler = new ThreadCommentHandler(container)
        server.route(routes(handler))
    },
}
