<template>
  <div class="wrapper">
    <spinner action="FETCH_ALL_ADMINS">
      <h2>Administratorzy</h2>
      <el-card>
        <template v-for="(admin, idx) in admins">
          <single-admin :key="idx" :admin="admin" @onAdminRemove="removeAdmin" />
        </template>
      </el-card>
      <h2>Prośby o dołączenie</h2>
      <el-card v-if="adminRequests && adminRequests.length > 0">
        <template v-for="(admin, idx) in adminRequests">
          <single-admin
            :key="idx"
            :admin="admin"
            is-acceptable
            @onAdminAccept="acceptAdmin"
            @onAdminRemove="rejectAdmin"
          />
        </template>
      </el-card>
      <el-alert
        v-else
        :closable="false"
        show-icon
        title="W tej chwili nie ma żadnych próśb o dołączenie."
        type="info"
      />
    </spinner>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { SingleActions } from '@/shared/Actions'

import SingleAdmin from '@/components/SingleAdmin.vue'
import Spinner from '@/components/Spinner.vue'
import { Admin } from '@/models/Admin'

export default Vue.extend({
  components: {
    SingleAdmin,
    Spinner
  },
  computed: {
    admins(): Admin[] {
      return this.$store.state.admins.filter((it: Admin) => it.isAccepted === true)
    },
    adminRequests(): Admin[] {
      return this.$store.state.admins.filter((it: Admin) => it.isAccepted === false)
    }
  },
  mounted() {
    this.$store.dispatch(SingleActions.FETCH_ALL_ADMINS)
  },
  methods: {
    async acceptAdmin(email: string) {
      this.$confirm(
        `Jesteś pewnien, że chcesz zezwolić użytkownikowi ${email} na dostęp do systemu?`,
        'Potwierdzenie',
        {
          confirmButtonText: 'Tak',
          cancelButtonText: 'Nie',
          type: 'success'
        }
      ).then(() => {
        this.$store.dispatch('acceptAdmin', email)
      })
    },
    async removeAdmin(email: string) {
      this.$confirm(`Jesteś pewnien, że chcesz usunąć administratora ${email}?`, 'Potwierdzenie', {
        confirmButtonText: 'Tak',
        cancelButtonText: 'Nie',
        type: 'error'
      }).then(() => {
        this.$store.dispatch('removeAdmin', email)
      })
    },
    async rejectAdmin(email: string) {
      this.$confirm(
        `Jesteś pewnien, że chcesz odrzucić prośbę użytkownika ${email} o dostęp do systemu?`,
        'Potwierdzenie',
        {
          confirmButtonText: 'Tak',
          cancelButtonText: 'Nie',
          type: 'error'
        }
      ).then(() => {
        this.$store.dispatch('removeAdmin', email)
      })
    }
  }
})
</script>
