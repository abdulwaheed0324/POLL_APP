const $ = (s) => document.querySelector(s);
const progressBar = $(".progress-bar"), progressText = $(".progress-text");
const startBtn = $(".start"), numQuestions = $("#num-questions"),
  category = $("#category"), difficulty = $("#difficulty"),
  timePerQuestion = $("#time"), quiz = $(".quiz"),
  startScreen = $(".start-screen"), submitBtn = $(".submit"),
  nextBtn = $(".next"), endScreen = $(".end-screen"),
  finalScore = $(".final-score"), totalScore = $(".total-score"),
  restartBtn = $(".restart");

let questions = [], time = 30, score = 0, currentQuestion, timer;

const progress = (val) => {
  const pct = (val / time) * 100;
  progressBar.style.width = `${pct}%`;
  progressText.innerHTML = `${val}`;
};

const loadingAnimation = () => {
  startBtn.innerHTML = "Loading";
  const int = setInterval(() => startBtn.innerHTML.length === 10 ? startBtn.innerHTML = "Loading" : startBtn.innerHTML += ".", 500);
};

const playAudio = (src) => new Audio(src).play();

const startQuiz = () => {
  const url = `https://opentdb.com/api.php?amount=${numQuestions.value}&category=${category.value}&difficulty=${difficulty.value}&type=multiple`;
  loadingAnimation();
  fetch(url).then(res => res.json()).then(data => {
    questions = data.results;
    setTimeout(() => {
      startScreen.classList.add("hide");
      quiz.classList.remove("hide");
      currentQuestion = 1;
      showQuestion(questions[0]);
    }, 1000);
  });
};

const showQuestion = (q) => {
  const questionText = $(".question"), answersWrapper = $(".answer-wrapper"),
    questionNumber = $(".number");
  questionText.innerHTML = q.question;
  const answers = [...q.incorrect_answers, q.correct_answer.toString()].sort(() => Math.random() - 0.5);
  answersWrapper.innerHTML = "";
  answers.forEach((a) => answersWrapper.innerHTML += `
    <div class="answer"><span class="text">${a}</span><span class="checkbox"><i class="fas fa-check"></i></span></div>`);
  questionNumber.innerHTML = `Question <span class="current">${questions.indexOf(q) + 1}</span><span class="total">/${questions.length}</span>`;
  document.querySelectorAll(".answer").forEach((a) => {
    a.addEventListener("click", () => {
      if (!a.classList.contains("checked")) {
        document.querySelectorAll(".answer").forEach((x) => x.classList.remove("selected"));
        a.classList.add("selected");
        submitBtn.disabled = false;
      }
    });
  });
  time = timePerQuestion.value;
  startTimer(time);
};

const startTimer = (t) => {
  timer = setInterval(() => {
    if (t === 3) playAudio("countdown.mp3");
    if (t >= 0) {
      progress(t);
      t--;
    } else checkAnswer();
  }, 1000);
};

const checkAnswer = () => {
  clearInterval(timer);
  const selected = $(".answer.selected");
  const correct = questions[currentQuestion - 1].correct_answer;
  if (selected) {
    const answer = selected.querySelector(".text").innerHTML;
    answer === correct ? (score++, selected.classList.add("correct")) : (selected.classList.add("wrong"));
  }
  document.querySelectorAll(".answer").forEach((a) => {
    if (a.querySelector(".text").innerHTML === correct) a.classList.add("correct");
    a.classList.add("checked");
  });
  submitBtn.style.display = "none";
  nextBtn.style.display = "block";
};

const nextQuestion = () => currentQuestion < questions.length ? showQuestion(questions[currentQuestion++]) : showScore();

const showScore = () => {
  endScreen.classList.remove("hide");
  quiz.classList.add("hide");
  finalScore.innerHTML = score;
  totalScore.innerHTML = `/ ${questions.length}`;
};

const defineProperty = () => {
  const osccred = document.createElement("div");
  osccred.innerHTML = "A Project By TALHA JAWAID AND ABDUL WAHEED";
  Object.assign(osccred.style, {
    position: "absolute", bottom: "0", right: "0", fontSize: "10px",
    color: "#ccc", fontFamily: "sans-serif", padding: "5px", background: "#fff",
    borderTopLeftRadius: "5px", borderBottomRightRadius: "5px", boxShadow: "0 0 5px #ccc"
  });
  document.body.appendChild(osccred);
};

startBtn.addEventListener("click", startQuiz);
submitBtn.addEventListener("click", checkAnswer);
nextBtn.addEventListener("click", () => {
  nextQuestion();
  submitBtn.style.display = "block";
  nextBtn.style.display = "none";
});
restartBtn.addEventListener("click", () => window.location.reload());
defineProperty();
