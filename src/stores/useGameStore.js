// src/stores/useGameStore.js
import { defineStore } from 'pinia'
import { questions } from '../questions.js'

export const useGameStore = defineStore('game', {
  state: () => ({
    questions: [],
    currentIndex: 0,
    score: 0,
    gameState: 'start',   // 'start' | 'playing' | 'end'
    selectedAnswer: null
  }),

  actions: {
    startGame() {
      this.questions = questions
      this.currentIndex = 0
      this.score = 0
      this.gameState = 'playing'
      this.selectedAnswer = null
    },

    submitAnswer(index) {
      this.selectedAnswer = index
      const correct = this.questions[this.currentIndex].correct === index
      if (correct) this.score++
      this.nextQuestion()
    },

    nextQuestion() {
      if (this.currentIndex < this.questions.length - 1) {
        this.currentIndex++
        this.selectedAnswer = null
      } else {
        this.gameState = 'end'
      }
    },

    resetGame() {
      this.questions = []
      this.currentIndex = 0
      this.score = 0
      this.gameState = 'start'
      this.selectedAnswer = null
    }
  }
})