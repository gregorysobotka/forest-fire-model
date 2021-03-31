<template>
  <v-card color="pa-2" tile flat>
    <v-container>
    
      <!-- <v-row v-if="showDetails">
        <v-col cols="4">
          <v-text-field label="neighbor burn probability" v-model="this.prob.burn" disabled/>
        </v-col>
        <v-col cols="4">
          <v-text-field label="extended burn probability" v-model="this.prob.extendedBurnRadius" disabled/>
        </v-col>
        <v-col cols="4">
          <v-text-field label="Tree regrow probability" v-model="this.prob.regrow" disabled/>
        </v-col>
        <v-col cols="12" class="text-center">
          <p class="text-h5 green--text" v-if="!pause">Running</p>
        </v-col>
      </v-row> -->
      <v-row>
        <v-col cols="4">
          <div class="mb-5">
            <p class="mb-1">Controls</p>
            <v-btn-toggle class="mr-5">
              <v-btn @click="toggleActive" color="green" :disabled="!pause">START</v-btn>
              <v-btn @click="toggleActive" color="red" :disabled="pause">STOP</v-btn>
              <!-- <v-btn @click="evaluateGrid" color="" :disabled="!pause">EVAL</v-btn> -->
            </v-btn-toggle>
            <v-btn-toggle class="">
            <v-btn @click="resetForest">STEP</v-btn>
            <v-btn @click="resetForest">RESET</v-btn>
            </v-btn-toggle>
          </div>
          <div>
            <p class="mb-1">Speed ({{delayModel / 1000 * 100}}%)</p>
            <!-- <v-btn-toggle>
              <v-btn small @click="slowDown()">SLOWER</v-btn>
              <v-btn small @click="speedUp()">FASTER</v-btn> 
            </v-btn-toggle>-->
              <v-slider
                v-model="delayModel"
                color="grey"
                track-color="light-grey"
                track-fill-color="grey darken-1"
                thumb-color="grey darken-1"
                step="20"
                min="20"
                max="500"
              />
          </div>
        </v-col>
        
        <v-col cols="8">
          <p class="mb-1">Probabilities</p>
          <v-slider
            v-model="growProb"
            label="new tree growth"
            thumb-color="green"
            track-color="green lighten-4"
            color="green"
          ></v-slider>
          <v-slider
            v-model="growProb"
            label="neighbor burn"
            thumb-color="red accent-2"
            track-color="red lighten-4"
            color="red accent-2"
          ></v-slider>
        </v-col>
      </v-row>

      <v-row dense>
        <v-col align="end">
          <v-btn
            @click="showDetails=!showDetails"
            icon
          >
            <v-icon>{{(showDetails) ? 'mdi-close' : 'mdi-cog'}}</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-if="!showDetails" class="grey lighten-4">
        <v-col>          
          <!-- <p>rows: {{rows}}</p>
          <p>cols {{cols}}</p> -->
          <p>paused: {{pause}}</p>
          <p>ready: {{ready}}</p>
          <p>delay: {{delay}}</p>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<style lang="scss" scoped>

</style>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';

export default Vue.extend({
  name: 'GridControl',
  computed: {
    delay(): number {
      return this.$store.getters.delay;
    },
    pause(): boolean {
      return this.$store.getters.pause;
    },
  },
  data: () => ({
    showDetails: false,
    growProb: 5,
    burnProb: 5,
    extendedBurnProb: 5,
    delayModel: 80
  }),
  mounted() {
    this.delayModel = this.delay;
  },
  watch: {
    delayModel(newVal) {
      this.$store.commit('delay', newVal);
    }
  },
  methods: {
    slowDown() {
      this.$store.dispatch('increaseCycleDuration');
    },
    speedUp() {
      this.$store.dispatch('decreaseCycleDuration');
    },
    resetForest() {
      // td
    },
    toggleActive() {
      this.$store.dispatch('toggleActive');
    }
  }
});
</script>
