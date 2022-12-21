<script setup>
import { ref, computed } from "vue";
import GameButton from "./components/GameButton.vue";

const hpMe = ref(100);
const hpEnemy = ref(100);
const rounds = ref(0);
const logs = ref([]);
const status = ref("W trakcie");

const getRandomValue = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const checkStatus = () => {
  if (this.hpMe === 0) this.status = "Przegrałeś";
  else if (this.hpEnemy === 0) this.status = "Wygrałeś";
  else this.status = "W trakcie";
};

const addLogs = (enemyLost, meLost) => {
  this.logs.push(`Przeciwnik stracił: ${enemyLost}`);
  this.logs.push(`Ty straciłeś: ${meLost}`);
};

const fight = () => {
  if (status.value === "W trakcie") {
    const enemyLost = getRandomValue(1, 20);
    const meLost = getRandomValue(1, 20);

    hpEnemy.value = Math.max(hpEnemy.value - enemyLost);
    hpMe.value = Math.max(hpMe.value - meLost);

    addLogs(enemyLost, meLost);
    checkStatus();

    rounds.value++;
    console.log(hpMe);
  }
};

const megaFight = () => {
  if (rounds.value % 3 === 0 && status.value === "W trakcie") {
    const enemyLost = getRandomValue(5, 30);
    const meLost = getRandomValue(1, 20);

    hpEnemy.value = Math.max(hpEnemy.value - enemyLost, 0);
    hpMe.value = Math.max(hpMe.value - meLost, 0);

    addLogs(enemyLost, meLost);
    checkStatus();

    rounds.value++;
  }
};

const heal = () => {
  if (status.value === "W trakcie") {
    const meLost = getRandomValue(1, 20);
    const meHeal = getRandomValue(1, 20);
    hpMe.value = Math.max(hpMe.value - meLost, 0);
    hpMe.value = Math.min(hpMe.value + meHeal, 100);

    logs.value.push(`Ty straciłeś: ${meLost}`);
    logs.value.push(`Ty się uleczyłeś: ${meHeal}`);
    checkStatus();

    rounds.value++;
  }
};

const capitulation = () => {
  if (status.value === "W trakcie") {
    hpMe.value = 0;
    status.value = "Przegrałeś";
  }
};

const opponentBarStyles = computed(() => {
  return {
    width: hpEnemy.value + "%",
  };
});

const playerBarStyles = computed(() => {
  return {
    width: hpMe.value + "%",
  };
});
</script>

<template>
  <header>
    <h1>„Pojedynek na wietrze”</h1>
  </header>
  <div id="game">
    <section id="opponent" class="container">
      <h2>Przeciwnik</h2>
      <div class="healthbar">
        <div class="healthbar__value" :style="opponentBarStyles"></div>
      </div>
    </section>
    <section id="player" class="container">
      <h2>Gracz</h2>
      <div class="healthbar">
        <div class="healthbar__value" :style="playerBarStyles"></div>
      </div>
    </section>
    <section id="controls">
      <GameButton name="STARCIE" @click="fight" />
      <GameButton
        name="STARCIE++"
        @click="megaFight"
        disabled="rounds % 3 !== 0"
      />
      <GameButton name="ODZYSKANIE SIŁ" @click="heal" />
      <GameButton name="KAPITULACJA" @click="capitulation" />
    </section>
    <section class="container">
      <h2>Status Gry</h2>
      <h3>{{ status }}</h3>
    </section>
    <section id="log" class="container">
      <h2>Dziennik Pojedynku</h2>
      <ul>
        <li v-for="message in logs">
          {{ message }}
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

html {
  font-family: "Jost", sans-serif;
}

body {
  margin: 0;
  background-color: aliceblue;
}

header {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: 0.5rem;
  background-color: #5588a0;
  color: white;
  text-align: center;
  margin-bottom: 2rem;
}

section {
  width: 90%;
  max-width: 40rem;
  margin: auto;
}

.healthbar {
  width: 100%;
  height: 40px;
  border: 1px solid #575757;
  margin: 1rem 0;
  background: #d8d8d8;
}

.healthbar__value {
  background-color: #00a876;
  width: 100%;
  height: 100%;
}

.container {
  text-align: center;
  padding: 0.5rem;
  margin: 1rem auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  border-radius: 12px;
}

#opponent h2,
#player h2 {
  margin: 0.25rem;
}

#controls {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}

button {
  font: inherit;
  border: 1px solid #003488;
  background-color: #003488;
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  margin: 1rem;
  width: 12rem;
  cursor: pointer;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.26);
}

button:focus {
  outline: none;
}

button:hover,
button:active {
  background-color: #4923f1;
  border-color: #4923f1;
  box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.26);
}

button:disabled {
  background-color: #ccc;
  border-color: #ccc;
  box-shadow: none;
  color: #3f3f3f;
  cursor: not-allowed;
}

#log ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

#log li {
  margin: 0.5rem 0;
}

.log--player {
  color: #7700ff;
}

.log--opponent {
  color: #da8d00;
}

.log--damage {
  color: red;
}

.log--heal {
  color: green;
}
</style>
