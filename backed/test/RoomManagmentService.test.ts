
import { Room } from '../src/core/RoomModel'
import RoomsManagementService from '../src/modules/rooms/RoomsManagementService'
import { Context } from 'koa'

describe('Room Management Service Tests', () => {

    const roomsManagementService = new RoomsManagementService()

    test('Should find all rooms and return proper body and status', async () => {
        // given
        const room = new Room()
        jest.spyOn(Room, 'find').mockResolvedValue([room])

        const koaContext = { body: null, status: null } as Context

        // when
        await roomsManagementService.findAll(koaContext)

        // then response contains given room and proper status
        expect(koaContext.body.body[0]).toEqual(room)
        expect(koaContext.status).toEqual(200)
    })

    test('Should return not found status when there was problem with rooms fetching', async () => {
        // given
        jest.spyOn(Room, 'find').mockResolvedValue(null)

        const koaContext = { body: null, status: null } as Context

        // when
        await roomsManagementService.findAll(koaContext)

        // then response contains error status and some message
        expect(koaContext.body.messages[0]).toBeTruthy()
        expect(koaContext.status).toEqual(500)
    })

    test('Should delete room and return proper body and status', async () => {
        // given
        const room = new Room()
        jest.spyOn(Room, 'findByIdAndDelete').mockResolvedValue(room)

        const koaContext = { body: null, status: null, params: { id: room._id} } as unknown as Context

        // when
        await roomsManagementService.delete(koaContext)

        // then response contains given room and proper status
        expect(koaContext.body.body).toEqual(room)
        expect(koaContext.status).toEqual(200)
    })

    test('Should return not found when there is no room to delete', async () => {
        // given
        jest.spyOn(Room, 'findByIdAndDelete').mockResolvedValue(null)

        const koaContext = { body: null, status: null, params: { id: 'sth'} } as unknown as Context

        // when
        await roomsManagementService.delete(koaContext)

        // then response contains error status and some message
        expect(koaContext.body.messages[0]).toBeTruthy()
        expect(koaContext.status).toEqual(404)
    })
})

