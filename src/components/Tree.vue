<template>
  <div class="grid-square forest-terrain">
    <v-icon color="light-green accent-3">mdi-pine-tree</v-icon>
  </div>
</template>

<style lang="scss" scoped>
.forest-terrain {
    background: #33691E;
    width: 100%;
    height: 100%;
    // border-radius: 25%;
    .v-icon {
        width: 100%;
        height: 100%;
    }
}
</style>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Tree',
  props: {
   
  },
  computed: {

  },
  components: {},
  data: () => ({
      fireColor: 'orange darken-2'
  }),
});
</script>
