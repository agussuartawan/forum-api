const InvariantError = require("./InvariantError")
const NotFoundError = require("./NotFoundError")
const AuthorizationError = require("./AuthorizationError")

const DomainErrorTranslator = {
    translate(error) {
        return DomainErrorTranslator._directories[error.message] || error
    },
}

DomainErrorTranslator._directories = {
    "REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
        "tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada",
    ),
    "REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
        "tidak dapat membuat user baru karena tipe data tidak sesuai",
    ),
    "REGISTER_USER.USERNAME_LIMIT_CHAR": new InvariantError(
        "tidak dapat membuat user baru karena karakter username melebihi batas limit",
    ),
    "REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER": new InvariantError(
        "tidak dapat membuat user baru karena username mengandung karakter terlarang",
    ),
    "USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
        "harus mengirimkan username dan password",
    ),
    "USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
        "username dan password harus string",
    ),
    "REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN":
        new InvariantError("harus mengirimkan token refresh"),
    "REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION":
        new InvariantError("refresh token harus string"),
    "DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN":
        new InvariantError("harus mengirimkan token refresh"),
    "DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION":
        new InvariantError("refresh token harus string"),
    "THREAD_COMMENT_USE_CASE.COMMENT_NOT_FOUND": new NotFoundError(
        "komentar tidak ditemukan",
    ),
    "THREAD_COMMENT_USE_CASE.FORBIDDEN": new AuthorizationError(
        "anda tidak berhak menghapus komentar ini",
    ),
    "NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
        "payload tidak valid",
    ),
    "NEW_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
        "payload tidak valid",
    ),
    "NEW_THREAD_COMMENT.DID_NOT_MATCH_DATA_TYPE_SPECIFICATION":
        new InvariantError("payload tidak valid"),
    "NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
        "payload tidak valid",
    ),
    "COMMENT_REPLY.REPLY_NOT_FOUND": new NotFoundError("reply tidak ditemukan"),
    "COMMENT_REPLY.FORBIDDEN": new AuthorizationError(
        "anda tidak berhak menghapus balasan ini",
    ),
    "NEW_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
        "payload tidak valid",
    ),
    "NEW_COMMENT_REPLY.DID_NOT_MATCH_DATA_TYPE_SPECIFICATION":
        new InvariantError("payload tidak valid"),
}

module.exports = DomainErrorTranslator
