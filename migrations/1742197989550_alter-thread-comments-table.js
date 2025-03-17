/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
    pgm.addColumn("thread_comments", {
        deleted_at: {
            type: "TIMESTAMP",
            notNull: false,
        },
    })
}

exports.down = (pgm) => {
    pgm.dropColumn("thread_comments", "deleted_at")
}
