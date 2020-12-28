<template>
  <v-container class="pa-0" fluid>
    <div class="mx-auto grid-container pt-2">
      <div :style="gridContainerStyles" class="region">
        <div v-for="(tRow, r) in grid" :key="'row-'+r" class="d-flex justify-center terrain-row" no-gutters>
          
          <div 
            v-for="(tSquare, c) in tRow" 
            :key="'ti-'+r+'-'+c"
            :style="gridSize2"
            class="gridSquare"
          >
            <Empty v-if="tSquare==0" />
            <Tree v-if="tSquare==1" />
            <Fire v-if="tSquare==2" />
          </div>

        </div>
        <v-overlay v-if="pause=='test'" style="position: absolute;" opacity="0.75">
          <p class="text-h4">Paused</p>
        </v-overlay>
      </div>
    </div>
    {{pause}} - {{this.delay}}
    <GridControl />
    <!-- {{neighborsMap}} -->
  </v-container>
</template>

<style lang="scss" scoped>
.footer-nav {
  position: fixed;
  bottom: 0;
  width: 100%;
  // opacity: 0.5;
}
.region {
  margin: 0 auto;
}
.terrain-row {
  // height: 2em;
}
.grid-container {
  background: #A1887F;
  // position: relative;
}
.gridSquare {
  overflow: hidden;
}
</style>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
// import workerpool from 'workerpool';
// import chance from 'chance';
// import Terrain from '@/components/Terrain.vue';

import GridControl from '@/components/GridControl';

import Fire from '@/components/Fire.vue';
import Tree from '@/components/Tree.vue';
import Empty from '@/components/Empty.vue';

import { MediumGrid as grid } from '@/forest-data';
import { EMPTY, TREE, FIRE, ROCK } from '@/forest-types';

// const Chance = new chance();

function randn(n: number) {
  const num = Math.floor(Math.random() * 10000) + 1;
  return n >= num;
}
// const pool = workerpool.pool();

export default Vue.extend({
  name: 'Home',
  components: {
    GridControl,
    Fire,
    Tree,
    Empty
  },
  data: () => ({
    windowWidth: window.innerWidth,
    grid: grid,
    transformGrid: {} as any,
    resetCycle: false,
    evalActive: false,
    neighborsMap: {},
    prob:{
      regrow: 60,
      extendedBurnRadius: 1000,
      burn: 8000,
      lightening: 2
    }
  }),
  mounted() {
    this.load();
  },
  computed: {
    ...mapState({
      delay: state => state.delay,
      pause: state => state.pause
    }),
    width(){
      return window.innerWidth - 40;
    },
    gridSize(){
      let gsize = Math.round(this.width / this.cols);
      if(gsize > 40) gsize = 40;

      return gsize;
    },
    gridSize2(){
      let gsize = Math.round(this.width / this.cols);
      if(gsize > 40) gsize = 40;

      return `width: ${this.gridSize}px; height: ${this.gridSize}px`;
    },
    gridContainerStyles(): string {
      return `width: ${this.gridSize * this.cols}px; height: ${this.gridSize * this.rows}px`;
    },
    rows(){
      return this.grid.length ;
    },
    cols(): number {
      return this.grid[0].length;
    },
    rowMax(): number {
      return this.grid.length - 1;
    },
    colMax(): number {
      return this.grid[0].length - 1;
    }
  },
  watch: {
    resetCycle(updatedResetCycle) {
      if(updatedResetCycle && !this.evalActive) this.reloadGrid();
    },
    evalActive(updatedEvalActive) {
      if(!updatedEvalActive && this.resetCycle) this.reloadGrid();
    },
    pause(pauseLifeCycle) {
      if(!pauseLifeCycle) this.evaluateGrid();
    }
  },
  methods:{
    reloadGrid() {
      this.resetCycle = false;
      this.grid = grid;
    },
    evaluateGrid() {
    
      this.evalActive = true;
      
      const updatedGrid = this.grid.map((row, r) => {
        return row.map((terrain, c) => {
          return this.terrainTransform(r, c, terrain);
        });
      });

      this.grid = updatedGrid;
      this.transformGrid = {};
  
        setTimeout(() => {
          if(!this.pause) {
            this.evaluateGrid();
          } else {
            this.evalActive = false;
          }
        }, this.delay);
    },
    terrainTransform(r: number, c: number, value: number): number {

      if(value === FIRE) return EMPTY;
      
      let returnValue = value;

      const allNeighbors = this.allNeighbors(r, c);

      if(value === TREE) {
        returnValue = this.evaluateTree(allNeighbors);
      } else if(value === EMPTY) {
        returnValue = this.evalEmpty(allNeighbors);
      }

      return returnValue;

    },
    isAGoodNeigbhor(coords: {r: number;c: number}): boolean {
      const rowMin = 0;
      const colMin = 0;
      const { r, c } = coords;
      if(r < rowMin || r > this.rowMax) return false;
      if(c < colMin || c > this.colMax) return false;
      return true;
    },
    load() {
       this.grid.forEach((row, r) => {
        row.forEach((terrain, c) => this.determineNeighbors(r, c));
      });
    },
    determineNeighbors(r: number, c: number) {
      
      const cellKey = `r${r}c${c}`;
      // n = neighbors 
      // en = extended neigbhors 

      const n = [
        { r: r-1, c: c-1 }, // upper left
        { r: r-1, c }, // top center
        { r: r-1, c: c+1 }, // upper right
        { r, c: c+1 }, // right col
        { r: r+1, c: c+1 }, // lower right col
        { r: r+1, c }, // bottom center
        { r: r+1, c: c-1 }, // bottom left
        { r, c: c-1 } // left col
      ].filter(
        (coord) => this.isAGoodNeigbhor(coord)
      );

      const en = [
        // { r: r-2, c: c-1 }, // top center left
        { r: r-2, c }, // top center
        // { r: r-2, c: c+1 }, // top center right
        // { r: r+2, c: c-1 }, //bottom center left
        { r: r+2, c }, // bottom center
        // { r: r+2, c: c+1 }, // bottom center right
        // { r: r-1, c: c-2 }, // center left top
        { r, c: c-2 }, // center left
        // { r: r+1, c: c-2 }, // center left
        // { r: r-1, c: c+2 }, // center right
        { r, c: c+2 }, // center right
        // { r: r+1, c: c+2 } // center right
      ].filter(
        (coord) => this.isAGoodNeigbhor(coord)
      );

      const cell = {
        n,
        en
      };

      // this.neighborsMap[cellKey] = cell;

      this.$set(this.neighborsMap, cellKey, cell);

    },
    allNeighbors(r: number, c: number) {
      
      const cellKey = `r${r}c${c}`;
      
      const allValidRelationships = this.neighborsMap[cellKey];
      // console.log(allValidRelationships);
      const { n, en } = allValidRelationships;
      const neighborCoords = n;
      const extendedNeighborCoords = en;
      
      let treesOnFire = 0;
      let trees = 0;

      neighborCoords.forEach(coord => {
        const gridValue = this.gridValueAtLocation(coord);
        if(gridValue === TREE) trees++;
        if(gridValue === FIRE) treesOnFire++;
      });

      const neighbors = {
        grids: neighborCoords.length,
        treesOnFire,
        trees
      };

      let extendedTreesOnFire = 0;
      let extendedTrees = 0;

      extendedNeighborCoords.forEach(coord => {
        const gridValue = this.gridValueAtLocation(coord);
        if(gridValue === TREE) extendedTrees++;
        if(gridValue === FIRE) extendedTreesOnFire++;
      });

      const extendedNeighbors = {
        grids: extendedNeighborCoords.length,
        extendedTreesOnFire,
        extendedTrees
      };
      
      return {
        neighbors,
        extendedNeighbors
      };
    },
    extendedNeighbors(r: number, c: number) {
      // const cellKey = `r${r}c${c}`;
      const extendedCoords = [];

      let treesOnFire = 0;
      let trees = 0;

      extendedCoords.forEach(coord => {
        const gridValue = this.gridValueAtLocation(coord);
        if(gridValue === TREE) trees++;
        if(gridValue === FIRE) treesOnFire++;
      });
      
      return {
        grids: extendedCoords.length,
        treesOnFire,
        trees
      }
    },
    evalEmpty(region): number {
      
      const { neighbors, extendedNeighbors } = region;

      let probNewTree = this.prob.regrow;

      if(neighbors.treesOnFire > 0 || extendedNeighbors.treesOnFire > 0){
        probNewTree = 0;
      } else if(neighbors.trees > 0 || extendedNeighbors.trees > 0) {
        probNewTree = (this.prob.regrow * neighbors.trees * 12) + (this.prob.regrow * extendedNeighbors.trees * 3);
      }
      return randn(probNewTree) && randn(probNewTree) ? TREE : EMPTY;
    },
    evaluateTree(region): number {
      // console.log(region);
      const { neighbors, extendedNeighbors } = region;
      
      if(neighbors.treesOnFire > 0) {
        // Neighbor on fire, tree ignites
        // const treeIgnitesProb = neighbors.treesOnFire * this.prob.burn;
        return randn(this.prob.burn) ? FIRE : TREE;
      } else if(extendedNeighbors.treesOnFire > 0) {
        const treeIgnitesProb = extendedNeighbors.treesOnFire * this.prob.extendedBurnRadius;
        return randn(treeIgnitesProb) ? FIRE : TREE;
      }
      // return TREE;
      return randn(this.prob.lightening) ? FIRE : TREE;
      
    },
    gridValueAtLocation(coords: {r: number;c: number}): number {
      const { r, c } = coords;
      // const cellKey = `r${r}c${c}`;
      // const kn = `r${r}c${c}`;
      // if(typeof this.transformGrid[kn] !== 'undefined'){
      //   return this.transformGrid[kn];
      // }
      const gridValue = this.grid[r][c];
      // this.transformGrid[kn] = gridValue;
      return gridValue;
    },
    startLifecycle() {
      this.pause = false;
      this.evaluateGrid();
    },
    stopLifecycle() {
      this.pause = true;
    },
    resetForest() {
      this.resetCycle = true;
      this.pause = true;
    }
  }
});
</script>
