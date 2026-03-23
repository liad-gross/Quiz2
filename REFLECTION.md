# REFLECTION.md — QuizBlitz

---

## Q1 — Props

- A **prop** is a custom attribute you pass into a component from its parent. It is how a parent component sends data *down* to a child component.
- Data in Vue flows **one direction — downward** from parent to child. A child cannot modify a prop directly; it can only receive it and display it.
- In this project, `QuestionCard.vue` receives the current question object as a prop from `PlayScreen.vue`, which reads it from `useGameStore`.
- Even though `QuestionCard` *could* import `useGameStore` directly, using a prop is better for **presentational components** because it keeps the component decoupled from the store. A presentational component's only job is to display data — it should not care where that data comes from. This makes it easier to reuse, test, and reason about in isolation.

---

## Q2 — $emit

- `$emit` is how a child component sends an event **up** to its parent. It is the opposite direction of props — data goes up via events, down via props.
- In `QuestionCard.vue`, when the user clicks an answer button, the component calls `this.$emit('answer', isCorrect)`, which fires an `answer` event and passes a `true` or `false` value up.
- The parent (`PlayScreen.vue`) listens for this event using `@answer="handleAnswer"` on the `<QuestionCard />` element. When the event fires, `handleAnswer` is called with the emitted value.
- If the parent forgot to handle the emitted event — i.e. there was no `@answer` listener — nothing would break visually, but **the answer would be silently ignored**. The score would never update and the game would never advance to the next question. The app would appear frozen after the first click.

---

## Q3 — Pinia Store

- When `currentIndex`, `score`, and `gameState` all lived in `App.vue`, `App.vue` was the sole **owner** of that state — meaning it was responsible for storing it, updating it, and passing it down. For a small app this works, but as the component tree grows it causes **prop drilling**.
- **Prop drilling** is when you have to pass data through multiple layers of components just to get it to the component that actually needs it — even if the components in the middle don't use it at all. For example, `App.vue` would pass `score` to `PlayScreen`, which passes it to `ScoreBoard`, even though `PlayScreen` itself doesn't care about `score`.
- Moving state into a **Pinia store** (`useGameStore`) solves this by giving every component direct access to shared state without passing anything through the tree. `ScoreBoard`, `QuestionCard`, and `PlayScreen` can all read from and write to the store independently. No component needs to "own" the state — the store owns it.

---

## Q4 — Vue Router

- A **traditional multi-page website** loads a brand new HTML file from the server every time you navigate to a different page. Each click triggers a full page reload — the browser fetches a new document, re-parses everything, and re-renders from scratch.
- A **Single-Page Application (SPA)** like QuizBlitz loads **one HTML file once**. After that, JavaScript handles all navigation by swapping out what is rendered on screen without ever requesting a new page from the server.
- `<router-view>` is a placeholder component that Vue Router uses to render whichever component matches the current URL. When the URL is `/`, it renders `StartScreen.vue`. When it is `/play`, it renders `PlayScreen.vue`.
- Navigating between routes does **not reload the page** because Vue Router intercepts the navigation, updates the URL using the browser's History API (or hash), and re-renders only the `<router-view>` component. The rest of the app — including the store state — stays alive in memory.

---

## Q5 — v-if vs v-show

- `v-if` **completely adds or removes** an element from the DOM based on the condition. If the condition is false, the element does not exist in the DOM at all.
- `v-show` **always renders** the element in the DOM but toggles its CSS `display` property between `block` and `none`. The element is always there, just sometimes hidden.
- In QuizBlitz, `v-if` is the better choice for switching between screens (`playing` / `end`) because each screen is a completely different state of the app. There is no reason to keep the `QuestionCard` mounted and hidden in the DOM while the `ScoreBoard` is showing — it would waste memory and could cause stale component state.
- `v-show` is better suited for elements that toggle frequently and need to appear/disappear quickly (like a dropdown menu), because it avoids the cost of destroying and recreating DOM elements. For full screen transitions that happen only once or twice, `v-if` is the cleaner and more correct choice.