const quizzesList = document.getElementById('quizzesList');

async function fetchQuizzes() {
  try {
    const response = await fetch('http://localhost:5000/api/quizzes');
    const data = await response.json();
    displayQuizzes(data);
  } catch (err) {
    quizzesList.innerHTML = '<li>Failed to load quizzes</li>';
  }
}

function displayQuizzes(quizzes) {
  quizzesList.innerHTML = '';
  if (!quizzes.length) {
    quizzesList.innerHTML = '<li>No quizzes available.</li>';
    return;
  }
  quizzes.forEach((quiz) => {
    const li = document.createElement('li');
    li.innerHTML = `<h3>Quiz for course ${quiz.course}</h3>`;
    quiz.questions.forEach((q, i) => {
      li.innerHTML += `<p>${i + 1}. ${q.text}</p>`;
    });
    quizzesList.appendChild(li);
  });
}

fetchQuizzes();
