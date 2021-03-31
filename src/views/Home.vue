<template>
  <v-container class="pa-0" fluid>
    <div class="mx-auto">
      <Region
        :rows="rows"
        :cols="cols"
      />  
    </div>
    <!-- <div v-if="!ready" class="text-center">
      <v-progress-circular
        indeterminate
        color="primary"
        size="50"
      />
    </div> -->
    <GridControl />
  </v-container>
</template>

<style lang="scss" scoped>

</style>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';

import GridControl from '@/components/GridControl.vue';
import Region from '@/components/Region.vue';

// const pool = workerpool.pool();

export default Vue.extend({
  name: 'Home',
  components: {
    GridControl,
    Region
  },
  data: () => ({
    rows: 50,
    cols: 100
  }),
  // mounted() {

  // },
  methods: {

  },
  computed: {
    // ...mapState({

    // })
  }
});
</script>
