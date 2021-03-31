<template>
  <div>
    <!-- {{grid}} -->
    <div v-if="gridReady" :style="gridContainerStyles" class="region">
      <div class="justify-center">
        <div
          v-for="cellKey in cellKeys"
          :key="cellKey"
          :style="gridStyles"
          class="gridSquare float-left"
        >
          <Empty v-show="gridMap[cellKey]==0" />
          <Tree v-show="gridMap[cellKey]==1" />
          <Fire v-show="gridMap[cellKey]==2" />
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
// import { createGrid, gridType, gridDefault } from '@/forest-data';
// import workerpool from 'workerpool';
// import chance from 'chance';
// import Terrain from '@/components/Terrain.vue';

import Fire from '@/components/Fire.vue';
import Tree from '@/components/Tree.vue';
import Empty from '@/components/Empty.vue';

import { EMPTY, TREE, FIRE, ROCK } from '@/forest-types';

const strikeLimit = 5;

// const pool = workerpool.pool();


import { GridEcosystem } from '@/helpers';

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
    probabilityMultiplier: 1,
    gridCount: 0,
    grid: [[]],
    gridMap: {},
    displayGridMap: {},
    neighborsMap: {},
    gridHashMap: {},
    cellKeys: [],
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
    const FullGridEcosystem = new GridEcosystem(this.rows, this.cols);
    this.cellKeys = FullGridEcosystem.cellKeys;
    this.gridMap = FullGridEcosystem.grid;
    this.displayGridMap = FullGridEcosystem.grid;
    this.neighborsMap = FullGridEcosystem.neighbors;
    this.extendedNeighborsMap = FullGridEcosystem.extendedNeighbors;
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
      this.gridCount = this.rows * this.cols;
      // this.probabilityMultiplier = this.gridCount / 1000;
    },
    evaluateGrid() {
    
      this.evalActive = true;
      const gridTransformed = {};

      this.cellKeys.forEach((cellKey) => { 
        const cellUpdated = this.cellTransform(cellKey);
        gridTransformed[cellKey] = cellUpdated;
        this.displayGridMap[cellKey] = cellUpdated;
      });

      this.cycles++;
      this.evalActive = false;

      if(this.lighteningStrikes >= strikeLimit && this.cycles % 20 === 0) {
        this.lighteningStrikes = 0;
      }

      this.gridMap = gridTransformed;

    },
    cellTransform(cellKey: string): number {

      const value = this.gridMap[cellKey];
      let returnValue = value;

      if(value === FIRE) {
        returnValue = EMPTY;
      } else {
        const allNeighbors = this.allNeighbors(cellKey);
        if(value === TREE) {
          returnValue = this.evaluateTree(allNeighbors);
        } else if(value === EMPTY) {
          returnValue = this.evalEmpty(allNeighbors);
        }
      }
      return returnValue;
    },
    
    allNeighbors(cellKey: string) {
      const neighborCoords = this.neighborsMap[cellKey];
      const extendedNeighborCoords = this.extendedNeighborsMap[cellKey];
      
      let treesOnFire = 0;
      let trees = 0;

      let extendedTreesOnFire = 0;
      let extendedTrees = 0;

      neighborCoords.forEach(neighborCellkey => {
        const gridValue = this.gridMap[neighborCellkey];
        if(gridValue === TREE) trees++;
        if(gridValue === FIRE) treesOnFire++;
      });

      extendedNeighborCoords.forEach(exNeighborCellkey => {
        const gridValue = this.gridMap[exNeighborCellkey];
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
        probNewTree = probNewTree + (neighbors.trees * 50) + (extendedNeighbors.trees * 10);
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
    delay(): number {
      return this.$store.getters.delay;
    },
    pause(): boolean {
      return this.$store.getters.pause;
    },
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
    pause(pauseLifeCycle) {
      if(!pauseLifeCycle) this.evaluateGrid();
    },
    gridMap() {
      if(!this.pause) {
        setTimeout(() => {
          this.evaluateGrid();
        }, this.delay);
      } 
    }
  },
});
</script>
