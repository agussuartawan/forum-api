const routes = (handler) => [
    {
        method: "GET",
        path: "/threads/get-access-token-claims",
        options: {
            auth: "jwt",
        },
        handler: handler.getAccessTokenClaimHandler,
    },
    {
        method: "POST",
        path: "/threads",
        options: {
            auth: "jwt",
        },
        handler: handler.postThreadHandler,
    },
    {
        method: "GET",
        path: "/threads/{id}",
        handler: handler.getThreadDetailById,
    },
]

module.exports = routes
