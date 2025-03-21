const AddedComment = require("../AddedComment")
const RegisteredUser = require("../../../users/entities/RegisteredUser")

describe("AddedComment", () => {
    it("should throw error when payload did not contain needed property", () => {
        const payload = {
            content: "This is a comment",
            owner: "user-123",
        }

        expect(() => new AddedComment(payload)).toThrowError(
            "ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY",
        )
    })

    it("should throw error when payload did not meet data type specification", () => {
        // Arrange
        const payload = {
            id: 123,
            content: "dicoding",
            owner: {},
        }

        // Action and Assert
        expect(() => new AddedComment(payload)).toThrowError(
            "ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION",
        )
    })

    it("should create AddedComment object correctly", () => {
        // Arrange
        const payload = {
            id: "comment-123",
            content: "content",
            owner: "user-123",
        }

        // Action
        const addedComment = new AddedComment(payload)

        // Assert
        expect(addedComment.id).toEqual(payload.id)
        expect(addedComment.content).toEqual(payload.content)
        expect(addedComment.owner).toEqual(payload.owner)
    })
})
