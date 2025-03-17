const ThreadRepository = require("../../../Domains/threads/ThreadRepository")
const AddedThread = require("../../../Domains/threads/entities/AddedThread")
const NewThread = require("../../../Domains/threads/entities/NewThread")
const ThreadUseCase = require("../ThreadUseCase")

jest.mock("../../../Domains/threads/entities/NewThread", () => {
    return jest.fn().mockImplementation(function (payload) {
        this.title = payload.title
        this.body = payload.body
        this.owner = payload.owner
    })
})

describe("ThreadUseCase", () => {
    describe("addThread function", () => {
        it("should orchestrating the add thread action correctly", async () => {
            // Arrange
            const useCasePayload = {
                title: "Cara mencari jodoh",
                body: "Menurut anda bagaimana?",
            }
            const mockThreadRepository = new ThreadRepository()
            const mockAddedThread = new AddedThread({
                id: "thread-123",
                title: useCasePayload.title,
                owner: "user-123",
            })

            // mock needed function
            mockThreadRepository.addThread = jest.fn(() =>
                Promise.resolve(mockAddedThread),
            )
            const threadUseCase = new ThreadUseCase({
                threadRepository: mockThreadRepository,
            })

            // Action
            const addedThread = await threadUseCase.addThread(
                "user-123",
                useCasePayload,
            )

            // Assert
            expect(addedThread).toStrictEqual(mockAddedThread)
            expect(mockThreadRepository.addThread).toBeCalledWith(
                "user-123",
                useCasePayload,
            )
            expect(NewThread).toBeCalledWith(useCasePayload)
            expect(NewThread).toHaveBeenCalledTimes(1)
        })
    })

    describe("getThreadDetail function", () => {
        it("should orchestrating the getThreadDetail correctly", async () => {
            const date = new Date()
            const mockThreadRepository = new ThreadRepository()
            const mockThreadDetail = {
                id: "thread-123",
                title: "Cara mencari jodoh",
                body: "Menurut anda bagaimana?",
                date: date.toISOString(),
                username: "kowo",
                comments: [
                    {
                        id: "comment-123",
                        username: "kowo",
                        date: date.toISOString(),
                        content: "Cepat beritahu aku caranya",
                    },
                ],
            }

            // mock needed function
            mockThreadRepository.getThreadDetail = jest.fn(() =>
                Promise.resolve(mockThreadDetail),
            )
            const threadUseCase = new ThreadUseCase({
                threadRepository: mockThreadRepository,
            })

            // Action
            const threadDetail =
                await threadUseCase.getThreadDetail("thread-123")

            expect(threadDetail).toStrictEqual(mockThreadDetail)
            expect(mockThreadRepository.getThreadDetail).toBeCalledWith(
                "thread-123",
            )
        })
    })
})
