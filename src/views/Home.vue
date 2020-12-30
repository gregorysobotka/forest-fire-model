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

import { createGrid, gridType } from '@/forest-data';

import GridControl from '@/components/GridControl';
import Region from '@/components/Region';

// const pool = workerpool.pool();

export default Vue.extend({
  name: 'Home',
  components: {
    GridControl,
    Region
  },
  data: () => ({
    rows: 10,
    cols: 10
  }),
  // mounted() {

  // },
  methods: {

  },
  computed: {
    // ...mapState({

    // }),
    // grid() {
    //   return createGrid(this.rows, this.cols);
    // },
    // ready() {
    //   return this.grid.length > 0;
    // }
  }
});
</script>
