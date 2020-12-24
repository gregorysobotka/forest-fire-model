<template>
    <!-- <div> -->
        <!-- :class="emptyTerrainClasses" -->
        <div v-if="value === 0" class="grid-square mx-auto text-center empty-terrain" tile hover>
            <!-- <v-icon class="" size="1em" color="brown lighten-1">mdi-dots-grid</v-icon> -->
        </div>
        <div class="grid-square forest-terrain" v-else-if="value === 1">
            <v-icon color="light-green accent-3" size="1em">mdi-pine-tree</v-icon>
        </div>
        <div class="grid-square fire-terrain" v-else-if="value === 2">
            <v-icon size="1em" color="light-green accent-3">mdi-pine-tree</v-icon>
            <!-- <v-icon size=".6em" class="fire" style="z-index: 3; bottom: .25em; left: .1em; width" color="yellow darken-1" >mdi-fire</v-icon> -->
            <v-icon size=".7em" class="fire" style="z-index: 1; bottom: .1em; right: 0.2em; width" color="orange accent-2">mdi-fire</v-icon>
            <!-- <v-icon size=".6em" class="fire" style="z-index: 3; bottom: .25em; right: .1em; width" color="orange">mdi-fire</v-icon> -->
        </div>
        <div class="grid-square grey rock" v-else>
            
        </div>
        <!-- mdi-flash -->
    <!-- </div> -->
</template>

<style lang="scss" scoped>
.fire-terrain {
    background: #EF5350;
    position: relative !important;
    border-radius: .5em;
}
.forest-terrain {
    background: #33691E;
    border-radius: .3em;
}
.empty-terrain {
    background: #616161;
    border-radius:.3em;
}
.empty-terrain-even {
    border-top-right-radius: .5em;
    border-bottom-left-radius: .5em;
}
.empty-terrain-odd {
    border-top-left-radius: .5em;
    border-bottom-right-radius: .5em;
}
.rock {
    // border-radius: .4em;
}
.absolute {
    position: absolute !important;
}
.grid-square {
    .v-icon {
        // max-width: 1em;
        // max-height: 1em;
        vertical-align: top;
    }
    position: relative;
    width: 1em;
    height: 1em;
}

// tree fire

.fire {
    // opacity: 0.85;
    position: absolute !important;
}


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
    row: {
          type: Number,
          required: true
    },
    col: {
        type: Number,
        required: true
    }
  },
  computed: {
    //   emptyTerrainClasses(): string {
    //       let emptyTerrainCLass = "empty-terrain-odd";
    //       if(this.row % 2 == 0) emptyTerrainCLass = "empty-terrain-even";
    //       return emptyTerrainCLass;
    //   },
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
