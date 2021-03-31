<template>
  <v-app>
    <v-app-bar
      app
      dark
      dense
      flat
    >
      <!-- <div class="d-flex align-center">
        <v-btn
          to="/"
          text
        >
          Forest Fire model
        </v-btn>
      </div> -->

      <v-spacer></v-spacer>

      <v-btn
        to="/about"
        text
      >
        <span class="mr-2">About</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>

    <!-- <v-bottom-sheet
      v-model="sheet"
      inset
    >
      <template v-slot:activator="{ on, attrs }">
        <div class="text-center mb-2">
          <v-btn
            v-bind="attrs"
            v-on="on"
            color="grey darken-1"
            text
          >
            <v-icon class="pr-2">mdi-cog</v-icon>
            Settings
          </v-btn>
        </div>
      </template>
      <v-sheet
        height="10em"
      >
        <v-row>
          <v-col>
            
          </v-col>
          <v-col align="right">
            <v-btn
              icon
              @click="sheet = !sheet"
            >
              <v-icon class="">mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-sheet>
    </v-bottom-sheet> -->

  </v-app>
</template>

<style lang="scss">
html {
  overflow-x: visible;
}
</style>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App',

  components: {

  },

  data: () => ({
    sheet: false,
  }),
});
</script>
