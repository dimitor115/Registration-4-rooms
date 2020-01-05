<template>
  <div class="wrapper">
    <spinner action="FETCH_ALL_ADMINS">
      <h2>Administratorzy</h2>
      <el-card>
        <template v-for="(admin, idx) in admins">
          <single-admin :admin="admin" :key="idx" @onAdminRemove="removeAdmin"></single-admin>
        </template>
      </el-card>
      <h2>Prośby o dołączenie</h2>
      <el-card>
        <template v-for="(admin, idx) in adminRequests">
          <single-admin
            :admin="admin"
            :key="idx"
            is-acceptable
            @onAdminAccept="acceptAdmin"
            @onAdminRemove="removeAdmin"
          ></single-admin>
        </template>
      </el-card>
    </spinner>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";

import { api } from "@/shared/api";
import { Actions } from "@/shared/Actions";
import { IRoom, IRoomForm } from "@/models/IRoom";

import RoomForm from "@/components/RoomForm.vue";
import SingleAdmin from "@/components/SingleAdmin.vue";
import RoomSimpleCard from "@/components/RoomSimpleCard.vue";
import ConfirmationDialog from "@/components/ConfirmationDialog.vue";
import Spinner from "@/components/Spinner.vue";
import { Admin } from "../../models/Admin";

export default Vue.extend({
  components: {
    RoomForm,
    SingleAdmin,
    RoomSimpleCard,
    ConfirmationDialog,
    Spinner
  },
  computed: {
    admins(): Admin[] {
      return this.$store.state.admins.filter(
        (it: Admin) => it.isAccepted === true
      );
    },
    adminRequests(): Admin[] {
      return this.$store.state.admins.filter(
        (it: Admin) => it.isAccepted === false
      );
    }
  },
  mounted() {
    this.$store.dispatch(Actions.FETCH_ALL_ADMINS);
  },
  methods: {
    async acceptAdmin(email: string) {
      this.$store.dispatch("acceptAdmin", email);
    },
    async removeAdmin(email: string) {
      this.$store.dispatch("removeAdmin", email);
    }
  }
});
</script>
