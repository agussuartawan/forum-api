const NewThread = require("../NewThread")

describe("New Thread", () => {
    it("should throw error when payload did not contain needed property", () => {
        const payload = {
            body: "This is a new thing",
        }

        expect(() => new NewThread(payload)).toThrowError(
            "NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY",
        )
    })

    it("should throw error when payload did not meet data type specification", () => {
        const payload = {
            title: true,
            body: 123,
        }

        expect(() => new NewThread(payload)).toThrowError(
            "NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION",
        )
    })

    it("should throw error when title contain more than 255 characters", () => {
        const payload = {
            title: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Fusce vulputate eleifend sapien. Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem in dui. Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In ac dui quis mi consectetuer lacinia. Nam pretium turpis",
            body: "oke",
        }

        expect(() => new NewThread(payload)).toThrowError(
            "NEW_THREAD.TITLE_LIMIT_CHAR",
        )
    })

    it("should create NewThread object correctly", () => {
        const payload = {
            title: "New Thread",
            body: "new body",
        }

        const { title, body } = new NewThread(payload)

        expect(title).toEqual(payload.title)
        expect(body).toEqual(payload.body)
    })
})
