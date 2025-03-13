
class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.getAccessTokenClaimHandler = this.getAccessTokenClaimHandler.bind(this);
  }

  async getAccessTokenClaimHandler(request, h) {
    const {id: userId, username} = request.auth.credentials;
    const response = h.response({
      status: 'success',
      data: {
        userId,
        username,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
