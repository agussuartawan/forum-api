const routes = (handler) => ([
  {
    method: 'GET',
    path: '/threads/get-access-token-claims',
    options: {
      auth: "jwt"
    },
    handler: handler.getAccessTokenClaimHandler,
  }
]);

module.exports = routes;
