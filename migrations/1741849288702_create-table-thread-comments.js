/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
    pgm.createTable("thread_comments", {
        id: {
            type: "VARCHAR(50)",
            primaryKey: true,
        },
        thread_id: {
            type: "VARCHAR(50)",
            notNull: true,
            references: "threads(id)",
            onDelete: "CASCADE",
        },
        owner_id: {
            type: "VARCHAR(50)",
            notNull: true,
            references: "users(id)",
            onDelete: "CASCADE",
        },
        parent_id: {
            type: "VARCHAR(50)",
            notNull: false,
            references: "thread_comments(id)",
            onDelete: "CASCADE",
        },
        content: {
            type: "TEXT",
            notNull: true,
        },
        created_at: {
            type: "TIMESTAMP",
            default: pgm.func("CURRENT_TIMESTAMP"),
            notNull: true,
        },
    })
}

exports.down = (pgm) => {
    pgm.dropTable("thread_comments")
}
