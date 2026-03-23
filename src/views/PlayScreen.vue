<template>
  <div>
    <!-- Playing -->
    <div v-if="store.gameState === 'playing'">
      <p>Question {{ store.currentIndex + 1 }} of {{ store.questions.length }}</p>
      <QuestionCard />
    </div>

    <!-- End -->
    <div v-else-if="store.gameState === 'end'">
      <ScoreBoard />
    </div>
  </div>
</template>

<script>
import { useGameStore } from '../stores/useGameStore.js'
import QuestionCard from '../components/QuestionCard.vue'
import ScoreBoard from '../components/ScoreBoard.vue'

export default {
  components: { QuestionCard, ScoreBoard },
  setup() {
    const store = useGameStore()
    store.startGame()
    return { store }
  }
}
</script>