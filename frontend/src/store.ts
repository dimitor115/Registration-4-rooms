import Vue from 'vue'
import Vuex from 'vuex'
import io from 'socket.io-client'
import { IRoom, IRoomForm } from './models/IRoom'
import { api } from '@/shared/api'
import { Actions } from './shared/Actions'
import { IResponse } from './shared/IResponse';

const socket = io('http://localhost:3000')

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    rooms: [] as IRoom[],
    isProcessing: {
      [Actions.FEACH_ALL_ROOMS]: false as boolean,
      [Actions.CREATE_ROOM]: false as boolean,
      [Actions.DELETE_ROOM]: false as boolean,
      [Actions.REGISTER_STUDENT]: false as boolean,
      [Actions.REMOVE_STUDENT]: false as boolean,
    },
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
    updateProcessing(state, { type, isProcessing }: { type: Actions, isProcessing: boolean }) {
      state.isProcessing[type] = isProcessing
    },
    updateRoomStudents(state, updatedRoom: IRoom) {
      const room = state.rooms.find(it => it._id === updatedRoom._id)
      if (room) {
        room.students = updatedRoom.students
      }
    }
  },
  actions: {
    async [Actions.REGISTER_STUDENT]({ commit }, {roomId, student}) {
      socket.emit('register_student', roomId, student)
      socket.on('room_update', (room: IResponse<IRoom>) => {
        commit('updateRoomStudents', room.body)
      })
    },
    async [Actions.FEACH_ALL_ROOMS]({ commit }) {
      commit('updateProcessing', { type: Actions.FEACH_ALL_ROOMS, isProcessing: true })
      try {
        const response = await api.rooms.findAll()
        commit('setRooms', response.data)
        commit('updateProcessing', { type: Actions.FEACH_ALL_ROOMS, isProcessing: false })
      } catch {
        commit('updateProcessing', { type: Actions.FEACH_ALL_ROOMS, isProcessing: false })
      }
    },
    async [Actions.CREATE_ROOM]({ commit }, room: IRoomForm) {
      commit('updateProcessing', { type: Actions.CREATE_ROOM, isProcessing: true })
      try {
        const response = await api.rooms.create(room)
        commit('pushRoom', response.data)
        commit('updateProcessing', { type: Actions.CREATE_ROOM, isProcessing: false })
      } catch {
        commit('updateProcessing', { type: Actions.CREATE_ROOM, isProcessing: false })
      }
    },
    async [Actions.DELETE_ROOM]({ commit }, id: string) {
      commit('updateProcessing', { type: Actions.DELETE_ROOM, isProcessing: true })
      try {
        const response = await api.rooms.delete(id)
        commit('removeRoom', response.data)
        commit('updateProcessing', { type: Actions.DELETE_ROOM, isProcessing: false })
      } catch {
        commit('updateProcessing', { type: Actions.DELETE_ROOM, isProcessing: false })
      }
    },
  },
})
