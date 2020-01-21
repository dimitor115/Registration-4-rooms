import Vue from 'vue'
import Vuex from 'vuex'
import finger from 'fingerprintjs2'

import { IRoom, IRoomForm } from '@/models/IRoom'
import { api } from '@/shared/api'
import socketApi from '@/shared/socketApi'
import { Actions } from '@/shared/Actions'
import { Admin } from '@/models/Admin'
import { SingleActions } from '../shared/Actions';

Vue.use(Vuex)

const store =  new Vuex.Store({
  state: {
    rooms: [] as IRoom[],
    isProcessing: {
      [SingleActions.FETCH_ALL_ROOMS]: false as boolean,
      [SingleActions.CREATE_ROOM]: false as boolean,
      [SingleActions.FETCH_ALL_ADMINS]: false as boolean,

      [Actions.DELETE_ROOM]: {} as any,
      [Actions.UPDATE_ROOM]: {} as any,
      [Actions.REGISTER_STUDENT]: {} as any,
      [Actions.REMOVE_STUDENT]: {} as any,
      [Actions.RESERVE_ROOM]: {} as any,

      [Actions.ADMIN_STUDENT_ADD]: {} as any,
      [Actions.ADMIN_STUDENT_EDIT]: {} as any,
      [Actions.ADMIN_STUDENT_REMOVE]: {} as any,
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
    },

    updateProcessing(state, { type, isProcessing }: { type: SingleActions, isProcessing: boolean }) {
      state.isProcessing[type] = isProcessing
    },
    updateActionProcessing(state, {type, id, isProcessing}: { type: Actions, id: any, isProcessing: boolean }) {
      Vue.set(state.isProcessing[type], id, isProcessing)
    }
  },
  actions: {
    async fetchUserData({commit}) {
      const result  = await api.admins.findMe()
      commit('setUserData', result.data)
    },

    async removeAdmin({dispatch}, email) {
      await api.admins.remove(email)
      dispatch(SingleActions.FETCH_ALL_ADMINS)
    },

    async acceptAdmin({dispatch}, email) {
        await api.admins.accept(email)
        dispatch(SingleActions.FETCH_ALL_ADMINS)
    },

    async [SingleActions.FETCH_ALL_ADMINS]({commit}) {
      _setSingleProcessing(SingleActions.FETCH_ALL_ADMINS)
      try {
        const result = await api.admins.fetchAll()
        commit('setAdmins', result.data)

      } finally {
        _setSingleDone(SingleActions.FETCH_ALL_ADMINS)
      }
    },

    async [Actions.RESERVE_ROOM]({ }, { roomId, userUUID }) {
      _setActionProcessing(roomId, Actions.RESERVE_ROOM)
      try {
        await socketApi.reserve_room(roomId, userUUID)
      } finally {
       _setActionDone(roomId, Actions.RESERVE_ROOM)
      }
    },
    async [Actions.REMOVE_STUDENT]({ }, { roomId, student, removedBy }) {
      _setActionProcessing(roomId+student, Actions.REMOVE_STUDENT)
      try {
        await socketApi.remove_student(roomId, student, removedBy)
      } finally {
       _setActionDone(roomId+student, Actions.REMOVE_STUDENT)
      }
    },
    async [Actions.REGISTER_STUDENT]({ }, { roomId, student }) {
      _setActionProcessing(roomId, Actions.REGISTER_STUDENT)
      try {
        await socketApi.register_student(roomId, student)
      } finally {
        _setActionDone(roomId, Actions.REGISTER_STUDENT)
      }
    },
    async [SingleActions.FETCH_ALL_ROOMS]({ commit }) {
     _setSingleProcessing(SingleActions.FETCH_ALL_ROOMS)
      try {
        const response = await api.rooms.findAll()
        commit('setRooms', response.data)
      } finally {
        _setSingleDone(SingleActions.FETCH_ALL_ROOMS)
      }
    },
    async [SingleActions.CREATE_ROOM]({ commit }, room: IRoomForm) {
      _setSingleProcessing(SingleActions.CREATE_ROOM)
      try {
        const response = await api.rooms.create(room)
        commit('pushRoom', response.data)
      } finally {
        _setSingleDone(SingleActions.CREATE_ROOM)
      }
    },
    async [Actions.DELETE_ROOM]({ commit }, id: string) {
      _setActionProcessing(id, Actions.DELETE_ROOM)
      try {
        const response = await api.rooms.delete(id)
        commit('removeRoom', response.data)
      } finally {
        _setActionDone(id, Actions.DELETE_ROOM)
      }
    },
    async [Actions.UPDATE_ROOM]({ dispatch }, {id, payload}) {
      _setActionProcessing(id, Actions.UPDATE_ROOM)
      try {
        await api.rooms.update(id, payload)
        dispatch(SingleActions.FETCH_ALL_ROOMS)
      } finally {
        _setActionDone(id, Actions.UPDATE_ROOM)
      }
    },

    async [Actions.ADMIN_STUDENT_ADD]({ }, {roomId, student}) {
      _setActionProcessing(roomId + student, Actions.ADMIN_STUDENT_ADD)
      try {
        await api.rooms.students.register_by_admin(student, roomId)
      } finally {
        _setActionDone(roomId + student, Actions.ADMIN_STUDENT_ADD)
      }
    },
    async [Actions.ADMIN_STUDENT_EDIT]({ }, {roomId, studentId, student}) {
      _setActionProcessing(roomId + studentId, Actions.ADMIN_STUDENT_EDIT)
      try {
        await api.rooms.students.update_by_admin(student, roomId, studentId)
      } finally {
        _setActionDone(roomId + studentId, Actions.ADMIN_STUDENT_EDIT)
      }
    },
    async [Actions.ADMIN_STUDENT_REMOVE]({ }, {roomId, studentId}) {
      _setActionProcessing(roomId + studentId, Actions.ADMIN_STUDENT_REMOVE)
      try {
        await api.rooms.students.delete_by_admin(roomId, studentId)
      } finally {
        _setActionDone(roomId + studentId, Actions.ADMIN_STUDENT_REMOVE)
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
  }
})

function _setSingleProcessing(type: SingleActions) {
  store.commit('updateProcessing', {type, isProcessing: true})
}

function _setSingleDone(type: SingleActions) {
  store.commit('updateProcessing', {type, isProcessing: false})
}

function _setActionProcessing(id: any, type: Actions) {
  store.commit('updateActionProcessing', {type, id, isProcessing: true})
}

function _setActionDone(id: any, type: Actions) {
  store.commit('updateActionProcessing', {type, id, isProcessing: false})
}

export default store