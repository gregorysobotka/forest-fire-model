<template>
  <div class="grid-square fire-terrain">
      <!-- <v-icon color="light-green accent-3">mdi-pine-tree</v-icon> -->
      <v-icon class="fire" color="red accent-3">mdi-fire</v-icon>
  </div>
</template>

<style lang="scss" scoped>
// .fire {
//     z-index: 1; 
//     bottom: 0;
//     left: 0;
//     position: absolute !important;
// }
.fire-terrain {
    background: #EF9A9A;
    // position: relative !important;
    // border-radius: 2em;
}
.grid-square {
    // .v-icon {
    //     width: 100%;
    //     height: 100%;
    // }
}

</style>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Fire',
  computed: {

  },
  data: () => ({}),
});
</script>
