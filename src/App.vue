<template>
  <div>
    <h1>QuizBlitz</h1>
    <QuestionCard :question="testQuestion" />
  </div>
</template>

<script>
import QuestionCard from './components/QuestionCard.vue'

export default {
  components: { QuestionCard },
  data() {
    return {
      testQuestion: {
        question: "What does CSS stand for?",
        answers: ["Cascading Style Sheets", "Computer Style System", "Creative Sheet Syntax", "Coded Style Script"],
        correct: 0
      }
    }
  }
}
</script>