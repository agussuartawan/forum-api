/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
    pgm.createTable("threads", {
        id: {
            type: "VARCHAR(50)",
            primaryKey: true,
        },
        owner_id: {
            type: "VARCHAR(50)",
            notNull: true,
            references: "users(id)",
            onDelete: "CASCADE",
        },
        title: {
            type: "VARCHAR(255)",
            notNull: true,
        },
        body: {
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
    pgm.dropTable("threads")
}
