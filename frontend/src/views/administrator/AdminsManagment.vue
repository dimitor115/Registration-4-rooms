<template>
  <div class="wrapper">
    <spinner :is-loading="areAdminsFetching">
      <h2>Administratorzy</h2>
      <el-card>
        <template v-for="(admin, idx) in acceptedAdmins">
          <single-admin
            :key="idx"
            :admin="admin"
            :is-acceptable="false"
            @onAdminRemove="removeAdmin"
          />
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
import { computed, defineComponent, onMounted } from '@vue/composition-api'
import { acceptAdminAction, admins, fetchAllAction, removeAdminAction } from '@/actions/admin'
import { Admin } from '@/models/Admin'

import SingleAdmin from '@/components/SingleAdmin.vue'
import Spinner from '@/components/Spinner.vue'
import { MessageBox } from 'element-ui'

export default defineComponent({
  components: {
    SingleAdmin,
    Spinner
  },
  setup() {
    const { isProcessing: areAdminsFetching, fetchAll } = fetchAllAction
    const { remove } = removeAdminAction()
    const { accept } = acceptAdminAction()

    const acceptedAdmins = computed<Admin[]>(() => admins.value.filter(it => it.isAccepted))
    const adminRequests = computed<Admin[]>(() => admins.value.filter(it => !it.isAccepted))

    onMounted(() => fetchAll())

    const acceptAdmin = (email: string) => {
      MessageBox.confirm(
        `Jesteś pewnien, że chcesz zezwolić użytkownikowi ${email} na dostęp do systemu?`,
        'Potwierdzenie',
        {
          confirmButtonText: 'Tak',
          cancelButtonText: 'Nie',
          type: 'success'
        }
      ).then(() => accept(email))
    }

    const removeAdmin = (email: string) => {
      MessageBox.confirm(
        `Jesteś pewnien, że chcesz usunąć administratora ${email}?`,
        'Potwierdzenie',
        {
          confirmButtonText: 'Tak',
          cancelButtonText: 'Nie',
          type: 'error'
        }
      ).then(() => remove(email))
    }

    const rejectAdmin = (email: string) => {
      MessageBox.confirm(
        `Jesteś pewnien, że chcesz odrzucić prośbę użytkownika ${email} o dostęp do systemu?`,
        'Potwierdzenie',
        {
          confirmButtonText: 'Tak',
          cancelButtonText: 'Nie',
          type: 'error'
        }
      ).then(() => remove(email))
    }

    return {
      areAdminsFetching,
      acceptedAdmins,
      adminRequests,
      acceptAdmin,
      removeAdmin,
      rejectAdmin
    }
  }
})
</script>
