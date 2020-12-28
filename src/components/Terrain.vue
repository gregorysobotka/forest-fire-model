<template>
    <!-- <div> -->
        <!-- :class="emptyTerrainClasses" -->
        <div v-if="value === 0" class="grid-square d-flex align-stretch empty-terrain">
            <!-- <v-icon color="#A1887F">mdi-square</v-icon> -->
        </div>
        <div class="grid-square forest-terrain" v-else-if="value === 1">
            <v-icon color="light-green accent-3">mdi-pine-tree</v-icon>
        </div>
        <div class="grid-square fire-terrain" v-else-if="value === 2">
            <!-- <v-icon color="light-green accent-3">mdi-pine-tree</v-icon> -->
            <v-icon class="fire" color="orange accent-2">mdi-fire</v-icon>
        </div>
        <div class="grid-square grey rock" v-else>
            
        </div>
        <!-- mdi-flash -->
    <!-- </div> -->
</template>

<style lang="scss" scoped>
// .fire {
//     z-index: 1; 
//     bottom: 0;
//     left: 0;
//     position: absolute !important;
// }
.fire-terrain {
    background: #EF5350;
    position: relative !important;
    border-radius: .6em;
}
.forest-terrain {
    background: #33691E;
    border-radius: .4em;
}
.empty-terrain {
    // background: #A1887F;
    // border-radius:.3em;
    // width:100%;
    // height: 1em;
}
.rock {
    // border-radius: .4em;
}
.absolute {
    // position: absolute !important;
}
.grid-square {
    // width: 100%;
    // height: 100%;
    .v-icon {
        width: 100%;
        height: 100%;
        // max-height: 1em;
        // vertical-align: top;
    }
    // position: relative;
    // width: 1em;
    // height: 1em;
}

// tree fire

// .fire {
    // opacity: 0.85;
    // position: absolute !important;
// }


</style>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Terrain',
  props: {
    value: {
        type: Number,
        required: true
    },
    size: {
        type: String,
        default: '1em'
    }
  },
  computed: {
      color(): string {
          return "green"
      },
      icon(): string { 
          return "mdi-pine-tree"
      }
  },
  components: {},
  data: () => ({
      fireColor: 'orange darken-2'
  }),
});
</script>
