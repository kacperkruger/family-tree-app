const getRandomValue = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
};

const app = Vue.createApp({
    data() {
        return {
            hpEnemy: 100,
            hpMe: 100,
            rounds: 0,
            logs: [],
            status: 'W trakcie',
        }
    },

    computed: {
        opponentBarStyles () {
            return {
                width: this.hpEnemy + "%"
            }
        },
        playerBarStyles() {
            return {
                width: this.hpMe + "%"
            }
        }
    },

    methods: {

        checkStatus() {
            if (this.hpMe === 0) this.status = 'Przegrałeś'
            else if (this.hpEnemy === 0) this.status = 'Wygrałeś'
            else this.status = 'W trakcie'
        },

        addLogs(enemyLost, meLost) {
            this.logs.push(`Przeciwnik stracił: ${enemyLost}`)
            this.logs.push(`Ty straciłeś: ${meLost}`)
        },

        fight() {
            if (this.status === 'W trakcie') {
                const enemyLost = getRandomValue(1, 20)
                const meLost = getRandomValue(1, 20)

                this.hpEnemy = Math.max(this.hpEnemy - enemyLost)
                this.hpMe = Math.max(this.hpMe - meLost)

                this.addLogs(enemyLost, meLost)
                this.checkStatus()

                this.rounds++
            }
        },

        megaFight() {
            if (this.rounds % 3 === 0 && this.status === 'W trakcie') {
                const enemyLost = getRandomValue(5, 30)
                const meLost = getRandomValue(1, 20)

                this.hpEnemy = Math.max(this.hpEnemy - enemyLost, 0)
                this.hpMe = Math.max(this.hpMe - meLost, 0)

                this.addLogs(enemyLost, meLost)
                this.checkStatus()

                this.rounds++
            }
        },

        heal() {
            if (this.status === 'W trakcie') {
                const meLost = getRandomValue(1, 20)
                const meHeal = getRandomValue(1, 20)
                this.hpMe = Math.max(this.hpMe - meLost, 0)
                this.hpMe = Math.min(this.hpMe + meHeal, 100)

                this.logs.push(`Ty straciłeś: ${meLost}`)
                this.logs.push(`Ty się uleczyłeś: ${meHeal}`)
                this.checkStatus()

                this.rounds++
            }
        },

        capitulation() {
            if (this.status === 'W trakcie') {
                this.hpMe = 0
                this.status = 'Przegrałeś'
            }
        }
    }
});

app.mount("#game");
