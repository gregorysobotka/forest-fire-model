<template>
  <v-container fluid>
    <div :style="gridContainerStyles" class="mx-auto">
      <div class="grid-container pa-4">
        <v-row v-for="(tRow, r) in grid" :key="'row-'+r" no-gutters>
          <Terrain cols="1" v-for="(tSquare, c) in tRow" :key="'ti-'+r+'-'+c" :value="tSquare" :row="r" :col="c" />
        </v-row>
      </div>
    </div>
    <v-container>
    <v-row class="mt-10" justify="center">
      
        <v-btn small @click="startLifecycle" :disabled="!pause">START</v-btn>
        <v-btn small @click="stopLifecycle" :disabled="pause">STOP</v-btn>
    </v-row>
    <v-row class="mt-10" justify="center">
      <v-btn small @click="timeOut=timeOut+200">SLOWER</v-btn>
      <v-btn small @click="timeOut>50 ? timeOut=timeOut-50 : timeOut=timeOut">FASTER</v-btn>
      <v-btn small @click="evaluateGrid">EVAL</v-btn>
      <v-btn small @click="stopLifecycle">RESET</v-btn>
    </v-row>
    <v-row class="mt-10" justify="center">
      <v-col cols="12" v-if="!pause" class="text-center">
        <p>Running</p>
        {{timeOut}}
      </v-col>
    </v-row>
    </v-container>
  </v-container>
</template>

<style lang="scss" scoped>
.grid-container {
  overflow: hidden;
  background: #A1887F;
}
</style>

<script lang="ts">
import Vue from 'vue';
// import workerpool from 'workerpool';
// import chance from 'chance';
import Terrain from '@/components/Terrain.vue';

import { MediumGrid as grid } from '@/forest-data';
import { EMPTY, TREE, FIRE, ROCK } from '@/forest-types';

// const Chance = new chance();

function randn(n: number) {
  const num = Math.floor(Math.random() * 1000) + 1;
  return n >= num;
}
function randnf(n: number) {
  const num = Math.floor(Math.random() * 10000) + 1;
  return n >= num;
}
// const pool = workerpool.pool();

export default Vue.extend({
  name: 'Home',
  components: {
    Terrain
  },
  computed: {
    gridContainerStyles(): string {
      const containerWidth = this.grid[0].length + 2;
      return `width: ${containerWidth}em;`;
    },
    // hashTable() {
    //   const table: { [key: string]: number } = {};
    //   this.grid.forEach((row, r) => {
    //     row.forEach((col: number, c) => {
    //       const hashKey = `r${r}c${c}`;
    //       table[hashKey] = col;
    //     });
    //   });
    //   return table;
    // }
  },
  methods:{
    evaluateGrid() {
      // this.transformGrid = JSON.parse(JSON.stringify(this.grid));
      // this.transformGrid = {};
      
      const updatedGrid = this.grid.map((row, r) => {
        return row.map((terrain, c) => {
          return this.terrainTransform(r, c, terrain);
        });
      });

      this.grid = updatedGrid;
      this.transformGrid = {};

      if(!this.pause) {
        setTimeout(() => this.evaluateGrid(), this.timeOut);
      } else if(this.resetCycle) {
        this.grid = grid;
      }
    },
    terrainTransform(r: number, c: number, value: number): number {
      let returnValue = value;
      if(value ===0) {
        // empty
        returnValue = this.evalEmpty(r, c);
      } else if(value === 1) {
        // tree
        // add logic, burn if neighbor burning
        returnValue = this.evaluateTree(r, c);
      } else if(value===2) {
        return 0;
      }
      return returnValue;
    },
    evalEmpty(r: number, c: number): number {
      
      const neighborsOnFire = 0;
      const neighborTrees = 0;

      let probNewTree = 40;
      if(neighborsOnFire > 0){
        probNewTree = 0;
      } else if(neighborTrees > 0) {
        probNewTree = probNewTree + (neighborTrees * 150);
      }
      // console.log(coords);
      // console.log(neighborsOnFire, neighborTrees, probNewTree);
      return randn(probNewTree) && randn(probNewTree) ? 1 : 0;
    },
    neighbors(r: number, c: number) {

      const coords = [];

      const gridRowsLength = grid.length - 1;
      const gridColsLength = grid[0].length - 1;

      let treesOnFire = 0;
      let trees = 0;

      if(r > 0){
        if(c > 0) coords.push({ r: r-1, c: c-1 }); // upper left col
        coords.push({ r: r-1, c }); // top center
        if(r < gridRowsLength) coords.push({ r: r-1, c: c+1 }); // upper right
      }
      if(c < gridColsLength) coords.push({ r, c: c+1 }); // right col
      if(r > 1 && r < gridRowsLength-1) coords.push({ r: r+1, c: c+1 }); // lower right col
      if(r < gridRowsLength) coords.push({ r: r+1, c }); // bottom center
      if(c > 0 && r < gridRowsLength) coords.push({ r: r+1, c: c-1 }); // bottom left
      if(c > 0) coords.push({ r, c: c-1 }); // left col
      
      const neighbors = coords.forEach(coord => {
        // const kn = `r${coord.r}c${coord.c}`;
        // if(typeof this.transformGrid[kn] !== 'undefined'){
        //   return this.transformGrid[kn];
        // }
        const gridValue = this.grid[coord.r][coord.c];
        // this.transformGrid[kn] = gridValue;
        if(gridValue === TREE) trees++;
        if(gridValue === FIRE) treesOnFire++;
        return gridValue;
      });
      
      return {
        neighbors: coords.length,
        treesOnFire,
        trees
      }
    },
    evaluateTree(r: number, c: number): number {

      const neighbors = 0;
      if(neighbors > 0) {
        // Neighbor on fire, tree ignites
        return 2;
      } else {
        return randnf(30) && randnf(40) ? 2 : 1;
      }
    },
    startLifecycle() {
      this.pause = false;
      this.evaluateGrid();
    },
    stopLifecycle() {
      this.pause = true;
    }
  },
  data: () => ({
    grid: grid,
    transformGrid: {} as any,
    timeOut: 10,
    resetCycle: false,
    pause: true,
    square: {
      width: 2.5,
      height: 2.5
    }
  }),
});
</script>
