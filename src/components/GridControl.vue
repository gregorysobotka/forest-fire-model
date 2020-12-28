<template>
  <div class="footer-nav white">
    <v-card hover>
      
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
        <v-row class="pa-2" dense>
          <v-col>
            <p class="mb-1">Controls</p>
            <v-btn-toggle class="mr-5">
              <v-btn small @click="toggleActive" color="green" :disabled="!pause">START</v-btn>
              <v-btn small @click="toggleActive" color="red" :disabled="pause">Pause</v-btn>
              <!-- <v-btn @click="evaluateGrid" color="" :disabled="!pause">EVAL</v-btn> -->
              <v-btn small @click="resetForest">RESET</v-btn>
            </v-btn-toggle>
          </v-col>

          <v-col v-if="showDetails">
            <p class="mb-1">Speed Controls</p>
            <v-btn-toggle>
              <v-btn small @click="slowDown()">SLOWER</v-btn>
              <v-btn small @click="speedUp()">FASTER</v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col cols="1" align="right">  
              <v-btn
              @click="showDetails=!showDetails"
              icon
            >
              <v-icon v-if="showDetails" class="">mdi-close</v-icon>
              <v-icon v-else>mdi-cog</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      
    </v-card>
  </div>
</template>

<style lang="scss" scoped>

</style>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';

export default Vue.extend({
  name: 'GridControl',
  computed: {
    ...mapState({
      pause: state => state.pause
    }),
  },
  components: {},
  data: () => ({
    showDetails: false
  }),
  methods: {
    resetForest() {
      // td
    },
    toggleActive() {
      this.$store.dispatch('toggleActive');
    }
  }
});
</script>
