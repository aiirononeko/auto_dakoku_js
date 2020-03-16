<template>
  <v-app>
    <v-content>
      <v-app-bar
        flat
        dense
      >
      </v-app-bar>
      <v-container>
        <v-layout wrap>
          <v-flex xs12><h1 class="title">Auto Dakoku</h1></v-flex>
          <v-flex xs12><p class="time_title">現在時刻</p></v-flex>
          <v-flex xs12><p class="time">{{ getNow() }}</p></v-flex>
          <div class="button_box">
            <v-flex xs6>
              <div class="my-2 button">
                <v-btn depressed small color="light-blue" x-large @click="doDakokuStart">出勤</v-btn>
              </div>
            </v-flex>
            <v-flex xs6>
              <div class="my-2 button">
                <v-btn depressed small color="deep-orange lighten-1" x-large @click="doDakokuEnd">退勤</v-btn>
              </div>
            </v-flex>
          </div>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer>
      <v-col
        class="text-center"
        cols="12"
      >
        {{ new Date().getFullYear() }} — Ryota Katada
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
const axios = require('axios');

export default {
  methods: {
    getNow() {
      const now = new Date();
      const hour = now.getHours();
      const minutes = now.getMinutes();
      return `${hour}:${minutes}`
    },
    doDakokuStart() {
      axios.post('https://ruwygafdw2.execute-api.ap-northeast-1.amazonaws.com/production/dakokuapi', {
        body: {
          "key": true
        }
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    doDakokuEnd() {
      axios.post('https://ruwygafdw2.execute-api.ap-northeast-1.amazonaws.com/production/dakokuapi', {
        body: {
          "key": false
        }
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }
};
</script>

<style>
.title {
  text-align: center;
  margin-top: 120px;
  margin-bottom: 50px;
}

.time_title {
  text-align: center;
}

.time {
  text-align: center;
  margin-bottom: 50px;
}

.button_box {
  margin: auto;
}

button {
  margin-top: 20px;
}
</style>
