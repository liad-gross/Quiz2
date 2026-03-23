<template>
  <div>
    <h1>QuizBlitz</h1>

    <!-- Start screen -->
    <div v-if="gameState === 'start'">
      <p>Ready to play?</p>
      <button @click="startGame">Start Game</button>
    </div>

    <!-- Playing screen -->
    <div v-else-if="gameState === 'playing'">
      <p>Question {{ currentIndex + 1 }} of {{ questions.length }}</p>
      <QuestionCard
        :question="questions[currentIndex]"
        @answer="handleAnswer"
      />
    </div>

    <!-- End screen -->
    <div v-else-if="gameState === 'end'">
      <ScoreBoard :score="score" :total="questions.length" />
      <button @click="restartGame">Play Again</button>
    </div>
  </div>
</template>

<script>
import { questions } from './questions.js'
import QuestionCard from './components/QuestionCard.vue'
import ScoreBoard from './components/ScoreBoard.vue'

export default {
  components: { QuestionCard, ScoreBoard },
  data() {
    return {
      questions,
      currentIndex: 0,
      score: 0,
      gameState: 'start'
    }
  },
  methods: {
    startGame() {
      this.currentIndex = 0
      this.score = 0
      this.gameState = 'playing'
    },
    handleAnswer(isCorrect) {
      if (isCorrect) this.score++

      if (this.currentIndex < this.questions.length - 1) {
        this.currentIndex++
      } else {
        this.gameState = 'end'
      }
    },
    restartGame() {
      this.startGame()
    }
  }
}
</script>