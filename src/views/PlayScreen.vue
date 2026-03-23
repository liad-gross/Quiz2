<template>
  <div>
    <!-- Playing -->
    <div v-if="gameState === 'playing'">
      <p>Question {{ currentIndex + 1 }} of {{ questions.length }}</p>
      <QuestionCard
        :question="questions[currentIndex]"
        @answer="handleAnswer"
      />
    </div>

    <!-- End -->
    <div v-else-if="gameState === 'end'">
      <ScoreBoard :score="score" :total="questions.length" />
      <button @click="playAgain">Play Again</button>
    </div>
  </div>
</template>

<script>
import { questions } from '../questions.js'
import QuestionCard from '../components/QuestionCard.vue'
import ScoreBoard from '../components/ScoreBoard.vue'

export default {
  components: { QuestionCard, ScoreBoard },
  data() {
    return {
      questions,
      currentIndex: 0,
      score: 0,
      gameState: 'playing'
    }
  },
  methods: {
    handleAnswer(isCorrect) {
      if (isCorrect) this.score++

      if (this.currentIndex < this.questions.length - 1) {
        this.currentIndex++
      } else {
        this.gameState = 'end'
      }
    },
    playAgain() {
      this.$router.push('/')
    }
  }
}
</script>