# Quiz 2 Answers

**Name:** Liad Gross
**Date:** 23 March 2026

## Q1

D

## Q2

To support a green or red flash after each answer, the minimal additions to the store are adding `lastAnswerCorrect` to state and updating it inside `submitAnswer`:
```js
state: () => ({
  // ...existing state
  lastAnswerCorrect: null
}),

actions: {
  submitAnswer(index) {
    const correct = index === this.questions[this.currentIndex].correct;
    this.lastAnswerCorrect = correct;
    if (correct) this.score++;
    this.nextQuestion();
  }
}
```

`QuestionCard` should read `lastAnswerCorrect` directly from the store rather than receive it as a prop from `App.vue` because passing it as a prop would require `App.vue` to act as a middleman — threading a value it does not use down through the component tree purely to get it to `QuestionCard`. This is prop drilling. Since `QuestionCard` already has access to `useGameStore`, reading `lastAnswerCorrect` directly from the store keeps `App.vue` clean and the component decoupled from its position in the tree.

## Q3

C

## Q4

**Part A:** The mistake is that the `App.vue` template is manually rendering `<GameView>` using a `v-if` condition instead of using `<router-view />`. Even though the router is correctly configured with routes for `/` and `/play`, Vue Router needs a `<router-view />` in the template to know where to render the matched component. Without it, the router processes the URL and matches a route, but has nowhere in the DOM to actually mount the component — so the screen stays blank regardless of which route is active.

**Part B:** The corrected `App.vue` template is:
```html
<template>
  <div>
    <h1>QuizBlitz</h1>
    <router-view />
  </div>
</template>
```

`<router-view />` is a placeholder component provided by Vue Router. When the URL changes, Vue Router looks up the matching route and renders the associated component in place of `<router-view />`. Navigating between routes does not reload the page because Vue Router intercepts the navigation, updates the URL using the browser's History API, and swaps the component rendered inside `<router-view />` — all without ever making a new request to the server.

## Q5

B

## Q6

The error occurs because after the last question is answered, `nextQuestion()` sets `currentIndex` to `state.questions.length`. Since JavaScript arrays are zero-indexed, the valid indices run from `0` to `state.questions.length - 1`. Accessing `state.questions[state.questions.length]` returns `undefined`, and then the template tries to access `.text` on `undefined`, which throws a TypeError.

The better location for the fix is in the `nextQuestion()` action, because the root cause is that `currentIndex` is being set to an invalid value. The getter should not have to defend against bad state — it is cleaner to prevent the invalid state from being set in the first place:
```js
nextQuestion() {
  if (this.currentIndex < this.questions.length - 1) {
    this.currentIndex++;
  } else {
    this.gameState = 'end';
  }
}
```

By checking the boundary in `nextQuestion()` and setting `gameState` to `'end'` instead of incrementing past the last index, `currentIndex` always points to a valid question and the getter never receives an out-of-bounds index.

## Q7

B

## Q8

**Local file approach**

Advantage: The questions are available instantly with no network dependency. When `startGame()` is called, `this.questions` is populated synchronously from the import, so `gameState` can be set to `'playing'` immediately without needing to handle loading states or wait for a response.

Disadvantage: The question set is hardcoded into the app bundle. Updating, randomising, or expanding the questions requires a code change and a new deployment — it is impossible to serve different questions to different users or rotate the pool without modifying `questions.js` directly.

**Remote API approach**

Advantage: Questions can be updated, randomised, or expanded on the server without touching the app's code. A different set of questions can be served on each game session, which improves replayability and means the quiz content is managed independently of the codebase.

Disadvantage: The async nature of `fetch` introduces complexity throughout the store. `startGame()` must become an `async` action, and the app needs to handle failure states — if the request fails or is slow, `this.questions` will be empty and `gameState` could be set to `'playing'` before any questions have loaded, breaking `currentQuestion` and `submitAnswer`.

**My choice and reasoning:** For the current stage of the project I would keep the local file approach. The app is in early development and the priority is getting the core game loop — `startGame()`, `submitAnswer()`, and `nextQuestion()` — working reliably. Introducing async data fetching adds error handling and loading state complexity that is unnecessary right now. The local file is a stable foundation to build on, and switching to an API can be done later as a single targeted change to `startGame()` once the rest of the app is solid.

## Q9

B

## Q10

**`useGameStore.js` changes:**

Add `timeLeft` to state and a `tick()` action. Store the interval reference so it can be cleared when needed. Call `clearInterval` at the start of each new question and when the game ends, and reset `timeLeft` to 15 on each new question:
```js
state: () => ({
  // ...existing state
  timeLeft: 15,
  _timer: null
}),

actions: {
  startGame() {
    this.questions = questions;
    this.currentIndex = 0;
    this.score = 0;
    this.gameState = 'playing';
    this.selectedAnswer = null;
    this._startTimer();
  },

  _startTimer() {
    clearInterval(this._timer);
    this.timeLeft = 15;
    this._timer = setInterval(() => {
      this.tick();
    }, 1000);
  },

  tick() {
    this.timeLeft--;
    if (this.timeLeft <= 0) {
      this.nextQuestion();
    }
  },

  nextQuestion() {
    clearInterval(this._timer);
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.selectedAnswer = null;
      this._startTimer();
    } else {
      this.gameState = 'end';
    }
  },

  submitAnswer(index) {
    clearInterval(this._timer);
    const correct = index === this.questions[this.currentIndex].correct;
    this.lastAnswerCorrect = correct;
    if (correct) this.score++;
    this.nextQuestion();
  }
}
```

**`QuestionCard.vue` template changes:**

Add a display for `timeLeft` read directly from the store:
```html
<template>
  <div class="question-card">
    <p>Time left: {{ store.timeLeft }}s</p>
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
```

**Why the timer logic belongs in the store, not the component:**

The timer logic belongs in the store because it directly controls shared game state — specifically `timeLeft`, `currentIndex`, and `gameState`. If the timer lived inside `QuestionCard`, it would be tied to that component's lifecycle, meaning the interval would be created and destroyed with the component. Every time Vue unmounts and remounts `QuestionCard` on a new question, the timer would need to be manually restarted, creating risk of multiple intervals running simultaneously. More importantly, when the timer expires it needs to call `nextQuestion()` and update `currentIndex` — state that belongs to the store. Putting the timer in the store means any component that needs to react to `timeLeft` — whether that is `QuestionCard` displaying a countdown or a progress bar in `PlayScreen` — can simply read it reactively from the store without any additional prop passing or event coordination.