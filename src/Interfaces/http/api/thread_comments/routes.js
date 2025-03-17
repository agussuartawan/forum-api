const routes = (handler) => [
    {
        method: "POST",
        path: "/threads/{threadId}/comments",
        options: {
            auth: "jwt",
        },
        handler: handler.postThreadComment,
    },
    {
        method: "DELETE",
        path: "/threads/{threadId}/comments/{commentId}",
        options: {
            auth: "jwt",
        },
        handler: handler.deleteThreadComment,
    },
]

module.exports = routes
