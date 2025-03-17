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
    {
        method: "POST",
        path: "/threads/{threadId}/comments/{commentId}/replies",
        options: {
            auth: "jwt",
        },
        handler: handler.postCommentReply,
    },
    {
        method: "DELETE",
        path: "/threads/{threadId}/comments/{commentId}/replies/{replyId}",
        options: {
            auth: "jwt",
        },
        handler: handler.deleteCommentReply,
    },
]

module.exports = routes
