<template>
  <div>
    <!-- {{grid}} -->
    <div v-if="gridReady" :style="gridContainerStyles" class="region">
      <div v-for="(tRow, r) in grid" :key="'row-'+r" class="d-flex justify-center terrain-row">
        <div 
          v-for="(cellValue, c) in tRow" 
          :key="'ti-'+r+'-'+c"
          :style="gridStyles"
          class="gridSquare"
        >
          <Empty v-show="cellValue==0" />
          <Tree v-show="cellValue==1" />
          <Fire v-show="cellValue==2" />
        </div>
      </div>
  
      <!-- <v-overlay v-if="pause" style="position: absolute;" opacity="0.75">
        <p class="text-h4">Paused</p>
      </v-overlay> -->
    </div>
    <div v-else class="text-center">
      <v-progress-circular
        indeterminate
        color="primary"
        size="50"
      />
    </div>
    <!-- <v-btn @click="evaluateGrid">EVAL</v-btn> {{evalActive}} -->
    <!-- <v-btn @click="toggleCell(0, 0, 1)">EVAL</v-btn> -->
    {{probabilityMultiplier}}
  </div>
</template>

<style lang="scss" scoped>
.region {
  margin: 0 auto;
  background: #6D4C41;
  position: relative;
}
.gridSquare {
  overflow: hidden;
}
</style>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import { createGrid, gridType, gridDefault } from '@/forest-data';
// import workerpool from 'workerpool';
// import chance from 'chance';
// import Terrain from '@/components/Terrain.vue';

import Fire from '@/components/Fire.vue';
import Tree from '@/components/Tree.vue';
import Empty from '@/components/Empty.vue';

import { EMPTY, TREE, FIRE, ROCK } from '@/forest-types';

const strikeLimit = 5;
// const baseGrid = createGrid(30,80);
// console.log(JSON.stringify(baseGrid))
// const Chance = new chance();

// const pool = workerpool.pool();

export default Vue.extend({
  props: {
    rows: {
      type: Number,
      required: true
    },
    cols: {
      type: Number,
      required: true
    }
  },
  name: 'Region',
  components: {
    Fire,
    Tree,
    Empty
  },
  data: () => ({
    windowWidth: window.innerWidth,
    resetCycle: false,
    evalActive: false,
    neighborsMap: {},
    gridHashMap: {},
    probabilityMultiplier: 1,
    gridCount: 0,
    grid: gridDefault,
    lighteningStrikes: 0,
    cycles: 0,
    prob:{
      grow: 10,
      extendedBurnRadius: 2,
      burn: 90,
      lightening: 1
    }
  }),
  mounted() {
    this.load();
  },
  updated() {
    // if(!this.pause) {
    //   setTimeout(() => {
    //     this.evaluateGrid();
    //   }, this.delay);
    // } 
  },
  methods:{
    // toggleCell(r: number, c: number, cellValue: number){
    // },
    randomNumber(min: number, max: number) {
      return Math.random() * (max - min) + min;
    },
    randn(n: number) {
      // const probThreshold = this.probabilityMultiplier * n;
      const probThreshold = n;
      // const num = Math.floor(Math.random() * this.gridCount * 50) + 1;
      const num = this.randomNumber(0, this.gridCount * 10);
      return probThreshold > num;
    },
    lighteningProb(n: number) {
      const probThreshold = this.probabilityMultiplier * n;
      const num = Math.floor(Math.random() * (this.gridCount * 10)) + 1;
      return num <= probThreshold;
    },
    load() {
      
      this.grid.forEach((row, r) => {
        row.forEach((terrain, c) => this.determineNeighbors(r, c));
      });

      this.gridCount = this.rows * this.cols;
      // this.probabilityMultiplier = this.gridCount / 1000;

    },
    reloadGrid() {
      this.resetCycle = false;
      // this.grid = grid;
    },
    evaluateGrid() {
    
      this.evalActive = true;
      
      const updatedGrid = this.grid.map((row, r) => {
        const updatedRow = row.map((terrain, c) => {
          const newGridVal = this.terrainTransform(r, c, terrain);
          return newGridVal;
        });
        return updatedRow;
      });

      this.$set(this, 'grid', updatedGrid);

      this.cycles++;
      this.evalActive = false;

      if(this.lighteningStrikes >= strikeLimit && this.cycles % 20 === 0) {
        this.lighteningStrikes = 0;
      }

      this.gridHashMap = {}

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
        // { r: r-2, c }, // top center
        // { r, c: c+2 }, // center right
        // { r: r+2, c }, // bottom center
        // { r, c: c-2 }, // center left
        
        // { r: r-2, c: c-1 }, // top center left
        // { r: r-2, c: c+1 }, // top center right
        // { r: r+2, c: c-1 }, //bottom center left
        // { r: r+2, c: c+1 }, // bottom center right
        // { r: r-1, c: c-2 }, // center left top
        // { r: r+1, c: c-2 }, // center left
        // { r: r-1, c: c+2 }, // center right
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
      
      const { n, en } = allValidRelationships;
      const neighborCoords = n;
      const extendedNeighborCoords = en;
      
      let treesOnFire = 0;
      let trees = 0;

      let extendedTreesOnFire = 0;
      let extendedTrees = 0;

      neighborCoords.forEach(coord => {
        const gridValue = this.gridValueAtLocation(coord);
        if(gridValue === TREE) trees++;
        if(gridValue === FIRE) treesOnFire++;
      });

      extendedNeighborCoords.forEach(coord => {
        const gridValue = this.gridValueAtLocation(coord);
        if(gridValue === TREE) extendedTrees++;
        if(gridValue === FIRE) extendedTreesOnFire++;
      });

      const neighbors = {
        grids: neighborCoords.length,
        treesOnFire,
        trees
      };

      const extendedNeighbors = {
        grids: extendedNeighborCoords.length,
        treesOnFire: extendedTreesOnFire,
        trees: extendedTrees
      };
      
      return {
        neighbors,
        extendedNeighbors
      };
    },
    evalEmpty(region): number {
      const { neighbors, extendedNeighbors } = region;
      let probNewTree = this.prob.grow;
      if(neighbors.treesOnFire > 0 || extendedNeighbors.treesOnFire > 0){
        probNewTree = 0;
      } else if(neighbors.trees > 0 || extendedNeighbors.trees > 0) {
        probNewTree = probNewTree + (neighbors.trees * 10) + (extendedNeighbors.trees * 5);
      }
      return this.randn(probNewTree) ? TREE : EMPTY;
    },
    evaluateTree(region): number {
      
      const { neighbors, extendedNeighbors } = region;

      let newTreeValue = TREE;
      
      if(neighbors.treesOnFire > 0) {
        // Neighbor on fire, tree ignites
        newTreeValue = FIRE;
      } else if(extendedNeighbors.treesOnFire > 0) {
        const treeIgnitesProb = neighbors.treesOnFire * this.prob.extendedBurnRadius * 100;
        // console.log(treeIgnitesProb);
        newTreeValue = this.randn(treeIgnitesProb) ? FIRE : TREE;
      } else if(this.lighteningStrikes < strikeLimit) {
        newTreeValue = this.lighteningProb(this.prob.lightening) ? FIRE : TREE;
        if(newTreeValue === FIRE) this.lighteningStrikes++;
      }

      return newTreeValue;
      
    },
    gridValueAtLocation(coords: {r: number;c: number}): number {
      const { r, c } = coords;
      const cellKey = `r${r}c${c}`;
      if(typeof this.gridHashMap[cellKey] !== 'undefined'){
        return this.gridHashMap[cellKey];
      }
      const gridValue = this.grid[r][c];
      this.gridHashMap[cellKey] = gridValue;
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
  },
   computed: {
    ...mapState({
      delay: state => state.delay,
      pause: state => state.pause,
      // rows: state => state.rows,
      // cols: state => state.cols
    }),
    gridReady() {
      return this.probabilityMultiplier > 0 && this.gridCount > 0;
    },
    cellSize(){
      let gsize = Math.round(this.windowWidth / this.cols);
      if(gsize > 40) gsize = 40;

      return gsize;
    },
    gridStyles(){
      let gsize = Math.round(this.windowWidth / this.cols);
      if(gsize > 40) gsize = 40;

      return `width: ${this.cellSize}px; height: ${this.cellSize}px`;
    },
    gridContainerStyles(): string {
      return `width: ${this.cellSize * this.cols}px; height: ${this.cellSize * this.rows}px`;
    },
    rowMax(): number {
      return this.rows - 1;
    },
    colMax(): number {
      return this.cols - 1;
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
    },
    grid(newGrid) {
      if(!this.pause) {
        setTimeout(() => {
          this.evaluateGrid();
        }, this.delay);
      } 
    }
  },
});
</script>
