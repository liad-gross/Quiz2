<template>
  <div class="question-card">
    <p>{{ question.question }}</p>
    <button
      v-for="(answer, index) in question.answers"
      :key="index"
      @click="handleClick(index)"
    >
      {{ answer }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    question: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleClick(index) {
      console.log("clicked", index)
    }
  }
}
</script>