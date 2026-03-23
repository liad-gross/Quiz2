# Prompt Log — Part 1-1 (Project Setup)

**/claude-sonnet-4-6** Scaffold a Vite + Vue 3 project called QuizBlitz. Create package.json with vue, vue-router, pinia dependencies and @vitejs/plugin-vue devDependency. Include index.html, vite.config.js, src/main.js, src/style.css, src/questions.js with 10 web dev questions, empty component shells for QuestionCard.vue and ScoreBoard.vue, a minimal App.vue, and an empty store stub at src/stores/useGameStore.js.

# Prompt Log — Part 1-2 (QuestionCard renders)

**/claude-sonnet-4-6** Update App.vue to hardcode a single test question object in data() and pass it to QuestionCard as a prop. Update QuestionCard.vue to accept a question prop (Object, required), render the question text in a p tag, loop over question.answers with v-for to render a button for each answer, and on click call a handleClick(index) method that does console.log("clicked", index).

# Prompt Log — Part 2-1 (Game loop in App.vue)

**/claude-sonnet-4-6** Update App.vue to import all questions from questions.js and implement a full game loop using data() with: questions array, currentIndex (0), score (0), gameState ('start'). Use v-if to show a start screen when gameState is 'start', QuestionCard when gameState is 'playing', and ScoreBoard when gameState is 'end'. Add methods: startGame() resets state and sets gameState to 'playing', handleAnswer(isCorrect) increments score if correct then advances currentIndex or sets gameState to 'end' if on the last question, restartGame() calls startGame(). Update QuestionCard.vue to emit an 'answer' event with true or false based on whether the clicked index matches question.correct. Update ScoreBoard.vue to accept score and total as Number props and display both.

# Prompt Log — Part 2-2 (Vue Router)

**/claude-sonnet-4-6** Add Vue Router to the project. Create src/router/index.js with two routes: '/' maps to StartScreen.vue and '/play' maps to PlayScreen.vue, using createWebHashHistory. Update main.js to register the router. Simplify App.vue to just render a router-view. Create src/views/StartScreen.vue with a welcome message and a Play button that calls router.push('/play'). Create src/views/PlayScreen.vue that contains the full game loop (moved from App.vue) with gameState starting as 'playing', and a Play Again button that calls router.push('/').

# Prompt Log — Part 2-3 (Pinia store)

**/claude-sonnet-4-6** Migrate all game logic into useGameStore.js using Pinia's options store syntax. State: questions (array, loaded in startGame), currentIndex (0), score (0), gameState ('start'), selectedAnswer (null). Actions: startGame() loads questions from questions.js and resets all state to playing, submitAnswer(index) checks if index matches current question's correct value and increments score, then calls nextQuestion(), nextQuestion() advances currentIndex or sets gameState to 'end', resetGame() resets everything to defaults. Update PlayScreen.vue to call store.startGame() on setup and read gameState from the store. Update QuestionCard.vue to read currentQuestion from the store and call store.submitAnswer(index) on click — no props. Update ScoreBoard.vue to read score and questions.length from the store and have a Play Again button that calls store.resetGame() and router.push('/').