import Vue from 'vue'
import Vuex from 'vuex'
import finger from 'fingerprintjs2'

import { IRoom, IRoomForm } from '@/models/IRoom'
import { api } from '@/shared/api'
import socketApi from '@/shared/socketApi'
import { Actions, RoomActions } from '@/shared/Actions'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    rooms: [] as IRoom[],
    isProcessing: {
      [RoomActions.FEACH_ALL_ROOMS]: false as boolean,
      [RoomActions.CREATE_ROOM]: false as boolean,
      [RoomActions.DELETE_ROOM]: false as boolean,
    },
    user: {
      uuid: '' as string,
    },
    clientsCount: 0
  },
  mutations: {
    setRooms(state, rooms: IRoom[]) {
      state.rooms = rooms
    },
    pushRoom(state, room: IRoom) {
      state.rooms.push(room)
    },
    removeRoom(state, room: IRoom) {
      state.rooms = state.rooms.filter((it: IRoom) => it._id !== room._id)
    },
    updateRoomStudents(state, updatedRoom: IRoom) {
      const room = state.rooms.find((it) => it._id === updatedRoom._id)
      if (room) {
        room.students = updatedRoom.students
      }
    },
    updateRoomReservation(state, updatedRoom: IRoom) {
      const room = state.rooms.find((it) => it._id === updatedRoom._id)
      if (room) {
        room.reservedBy = updatedRoom.reservedBy
        room.reservedUntil = updatedRoom.reservedUntil
      }
    },
    updateRoomProcessing(state, { type, isProcessing }: { type: RoomActions, isProcessing: boolean }) {
      state.isProcessing[type] = isProcessing
    },
    setUserUUID(state, uuid) {
      state.user.uuid = uuid
    },
    setClientsCount(state, count) {
      state.clientsCount = count
    }
  },
  actions: {
    async [Actions.RESERVE_ROOM]({commit}, {roomId, userUUID}) {
      socketApi.reserve_room(roomId, userUUID)
    },
    async [Actions.REMOVE_STUDENT]({ commit }, { roomId, student, removedBy }) {
      socketApi.remove_student(roomId, student, removedBy)
    },
    async [Actions.REGISTER_STUDENT]({ commit }, { roomId, student }) {
      socketApi.register_student(roomId, student)
    },
    async [RoomActions.FEACH_ALL_ROOMS]({ commit }) {
      commit('updateRoomProcessing', { type: RoomActions.FEACH_ALL_ROOMS, isProcessing: true })
      try {
        const response = await api.rooms.findAll()
        commit('setRooms', response.data)
      } finally {
        commit('updateRoomProcessing', { type: RoomActions.FEACH_ALL_ROOMS, isProcessing: false })
      }
    },
    async [RoomActions.CREATE_ROOM]({ commit }, room: IRoomForm) {
      commit('updateRoomProcessing', { type: RoomActions.CREATE_ROOM, isProcessing: true })
      try {
        const response = await api.rooms.create(room)
        commit('pushRoom', response.data)
      } finally {
        commit('updateRoomProcessing', { type: RoomActions.CREATE_ROOM, isProcessing: false })
      }
    },
    async [RoomActions.DELETE_ROOM]({ commit }, id: string) {
      commit('updateRoomProcessing', { type: RoomActions.DELETE_ROOM, isProcessing: true })
      try {
        const response = await api.rooms.delete(id)
        commit('removeRoom', response.data)
      } finally {
        commit('updateRoomProcessing', { type: RoomActions.DELETE_ROOM, isProcessing: false })
      }
    },
    countUserFingerPrint({ commit }) {
      setTimeout(() => {
        finger.get((components) => {
          const extractedValues = components.map((it) => it.value)
          const hash = finger.x64hash128(extractedValues.join(''), 31)
          commit('setUserUUID', hash)
        })
      }, 500)
    },
  },
})
