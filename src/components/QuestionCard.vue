<template>
  <div class="question-card">
    <p>{{ currentQuestion.question }}</p>
    <button
      v-for="(answer, index) in currentQuestion.answers"
      :key="index"
      @click="store.submitAnswer(index)"
    >
      {{ answer }}
    </button>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useGameStore } from '../stores/useGameStore.js'

export default {
  setup() {
    const store = useGameStore()
    const currentQuestion = computed(() => store.questions[store.currentIndex])
    return { store, currentQuestion }
  }
}
</script>