<template>
  <div class="scoreboard">
    <h2>Game Over!</h2>
    <p>You scored {{ store.score }} out of {{ store.questions.length }}</p>
    <button @click="playAgain">Play Again</button>
  </div>
</template>

<script>
import { useGameStore } from '../stores/useGameStore.js'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const store = useGameStore()
    const router = useRouter()

    function playAgain() {
      store.resetGame()
      router.push('/')
    }

    return { store, playAgain }
  }
}
</script>