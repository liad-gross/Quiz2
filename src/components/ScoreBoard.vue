<template>
  <div class="scoreboard">
    <h2>Game Over!</h2>
    <p>You scored {{ score }} out of {{ total }}</p>
  </div>
</template>

<script>
export default {
  props: {
    score: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  }
}
</script>