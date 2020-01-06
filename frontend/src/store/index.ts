import Vue from 'vue'
import Vuex from 'vuex'
import finger from 'fingerprintjs2'

import { IRoom, IRoomForm } from '@/models/IRoom'
import { api } from '@/shared/api'
import socketApi from '@/shared/socketApi'
import { Actions } from '@/shared/Actions'
import { Admin } from '@/models/Admin'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    rooms: [] as IRoom[],
    isProcessing: {
      [Actions.FETCH_ALL_ROOMS]: false as boolean,
      [Actions.CREATE_ROOM]: false as boolean,
      [Actions.DELETE_ROOM]: false as boolean,
      [Actions.REGISTER_STUDENT]: false as boolean,
      [Actions.REMOVE_STUDENT]: false as boolean,
      [Actions.RESERVE_ROOM]: false as boolean,
      [Actions.FETCH_ALL_ADMINS]: false as boolean,
    },
    admins: [] as Admin[],
    user: {
      uuid: '' as string,
      data: {
        name: null as string | null,
        imageUrl: null as string | null,
        email: null as string | null        
      }
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
    updateProcessing(state, { type, isProcessing }: { type: Actions, isProcessing: boolean }) {
      state.isProcessing[type] = isProcessing
    },
    setUserUUID(state, uuid) {
      state.user.uuid = uuid
    },
    setClientsCount(state, count) {
      state.clientsCount = count
    },
    setUserData(state, userData) {
      state.user.data = userData
    },

    setAdmins(state, admins) {
      state.admins = admins
    }
  },
  actions: {
    async fetchUserData({commit}) {
      const result  = await api.admins.findMe()
      commit('setUserData', result.data)
    },

    async removeAdmin({dispatch}, email) {
      await api.admins.remove(email)
      dispatch(Actions.FETCH_ALL_ADMINS)
    },

    async acceptAdmin({dispatch}, email) {
        await api.admins.accept(email)
        dispatch(Actions.FETCH_ALL_ADMINS)
    },

    async [Actions.FETCH_ALL_ADMINS]({commit}) {
      commit('updateProcessing', { type: Actions.FETCH_ALL_ADMINS, isProcessing: true })
      try {
        const result = await api.admins.fetchAll()
        commit('setAdmins', result.data)

      } finally {
        commit('updateProcessing', { type: Actions.FETCH_ALL_ADMINS, isProcessing: false })
      }
    },

    async [Actions.RESERVE_ROOM]({ commit }, { roomId, userUUID }) {
      commit('updateProcessing', { type: Actions.RESERVE_ROOM, isProcessing: true })
      try {
        await socketApi.reserve_room(roomId, userUUID)
      } finally {
        commit('updateProcessing', { type: Actions.RESERVE_ROOM, isProcessing: false })
      }
    },
    async [Actions.REMOVE_STUDENT]({ commit }, { roomId, student, removedBy }) {
      commit('updateProcessing', { type: Actions.REMOVE_STUDENT, isProcessing: true })
      try {
        await socketApi.remove_student(roomId, student, removedBy)
      } finally {
        commit('updateProcessing', { type: Actions.REMOVE_STUDENT, isProcessing: false })
      }
    },
    async [Actions.REGISTER_STUDENT]({ commit }, { roomId, student }) {
      commit('updateProcessing', { type: Actions.REGISTER_STUDENT, isProcessing: true })
      try {
        await socketApi.register_student(roomId, student)
      } finally {
        commit('updateProcessing', { type: Actions.REGISTER_STUDENT, isProcessing: false })
      }
    },
    async [Actions.FETCH_ALL_ROOMS]({ commit }) {
      commit('updateProcessing', { type: Actions.FETCH_ALL_ROOMS, isProcessing: true })
      try {
        const response = await api.rooms.findAll()
        commit('setRooms', response.data)
      } finally {
        commit('updateProcessing', { type: Actions.FETCH_ALL_ROOMS, isProcessing: false })
      }
    },
    async [Actions.CREATE_ROOM]({ commit }, room: IRoomForm) {
      commit('updateProcessing', { type: Actions.CREATE_ROOM, isProcessing: true })
      try {
        const response = await api.rooms.create(room)
        commit('pushRoom', response.data)
      } finally {
        commit('updateProcessing', { type: Actions.CREATE_ROOM, isProcessing: false })
      }
    },
    async [Actions.DELETE_ROOM]({ commit }, id: string) {
      commit('updateProcessing', { type: Actions.DELETE_ROOM, isProcessing: true })
      try {
        const response = await api.rooms.delete(id)
        commit('removeRoom', response.data)
      } finally {
        commit('updateProcessing', { type: Actions.DELETE_ROOM, isProcessing: false })
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
