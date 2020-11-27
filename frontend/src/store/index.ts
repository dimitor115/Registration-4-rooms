import Vue from 'vue'
import Vuex from 'vuex'
import finger from 'fingerprintjs2'
import { api } from '@/shared/api'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
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
    setUserUUID(state, uuid) {
      state.user.uuid = uuid
    },
    setClientsCount(state, count) {
      state.clientsCount = count
    },
    setUserData(state, userData) {
      state.user.data = userData
    }
  },
  actions: {
    async fetchUserData({ commit }) {
      const result = await api.admins.findMe()
      commit('setUserData', result.data)
    },

    countUserFingerPrint({ commit }) {
      setTimeout(() => {
        finger.get(components => {
          const extractedValues = components.map(it => it.value)
          const hash = finger.x64hash128(extractedValues.join(''), 31)
          commit('setUserUUID', hash)
        })
      }, 500)
    }
  }
})

export default store
