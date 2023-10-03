const eventRepository = require('./eventRepository')

const eventService = {}

eventService.createEvent = async ({ session, payload }) => {
    const { name, passcode, startDate, endDate, location, description } = payload
    const data = {
        createdBy: session.id,
        organizationId: session.position.orgId,
        roomId: generateRoomId(),
        name,
        passcode,
        startDate,
        endDate,
        location,
        description,
    }
    await eventRepository.insertEvent(data)
}

const generateRoomId = () => {
    const roomId = Math.floor(Math.random() * 9000000000) + 1000000000
    return roomId.toString()
}

module.exports = eventService
