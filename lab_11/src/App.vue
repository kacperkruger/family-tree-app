<script setup>
import { ref } from "vue";
import GameButton from "./components/GameButton.vue";

const hpMe = ref(100);
const hpEnemy = ref(100);
const rounds = ref(0);
const logs = ref([]);
const satus = ref("W trakcie");

const fight = () => {
  if (status === "W trakcie") {
    const enemyLost = getRandomValue(1, 20);
    const meLost = getRandomValue(1, 20);

    hpEnemy = Math.max(hpEnemy - enemyLost);
    hpMe = Math.max(hpMe - meLost);

    addLogs(enemyLost, meLost);
    checkStatus();

    rounds++;
    console.log(hpMe);
  }
};

const megaFight = () => {
  if (rounds % 3 === 0 && status === "W trakcie") {
    const enemyLost = getRandomValue(5, 30);
    const meLost = getRandomValue(1, 20);

    hpEnemy = Math.max(hpEnemy - enemyLost, 0);
    hpMe = Math.max(hpMe - meLost, 0);

    addLogs(enemyLost, meLost);
    checkStatus();

    rounds++;
  }
};

const heal = () => {
  if (status === "W trakcie") {
    const meLost = getRandomValue(1, 20);
    const meHeal = getRandomValue(1, 20);
    hpMe = Math.max(hpMe - meLost, 0);
    hpMe = Math.min(hpMe + meHeal, 100);

    logs.push(`Ty straciłeś: ${meLost}`);
    logs.push(`Ty się uleczyłeś: ${meHeal}`);
    checkStatus();

    rounds++;
  }
};

const capitulation = () => {
  if (status === "W trakcie") {
    hpMe = 0;
    status = "Przegrałeś";
  }
};
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
      <GameButton name="STARCIE" fun="fight" />
      <GameButton
        name="STARCIE++"
        function="megaFight"
        disabled="rounds % 3 !== 0"
      />
      <GameButton name="ODZYSKANIE SIŁ" function="heal" />
      <GameButton name="KAPITULACJA" function="capitulation" />
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
