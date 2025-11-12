document.getElementById('logoutBtn').onclick = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('name');
  window.location.href = 'login.html';
};

async function loadDashboard() {
  const token = localStorage.getItem('token');
  if (!token) { window.location.href = 'login.html'; return; }
  try {
    const res = await fetch('http://localhost:5000/api/users/profile', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const contentType = res.headers.get("content-type");
    if (!res.ok || !contentType || !contentType.includes("application/json")) {
      throw new Error('Failed to fetch profile (auth rejected or not JSON)');
    }
    const user = await res.json();
    document.getElementById('userWelcome').innerHTML = `<h3>Hello, ${user.name} (${user.role})</h3>`;
    if (user.role === 'admin') {
      document.getElementById('adminPanel').style.display = '';
      document.getElementById('myCoursesSection').style.display = 'none';
      document.getElementById('dashboardAnnouncements').style.display = 'none';
      document.getElementById('dashboardQuizzes').style.display = 'none';
    } else {
      document.getElementById('adminPanel').style.display = 'none';
      document.getElementById('myCoursesSection').style.display = '';
      const myCoursesList = document.getElementById('myCoursesList');
      myCoursesList.innerHTML = '';
      if (!user.courses || user.courses.length === 0) {
        myCoursesList.innerHTML = '<li>No courses enrolled.</li>';
      } else {
        user.courses.forEach(course => {
          if (course._id && course.title) {
            myCoursesList.innerHTML += `<li>
              <strong>${course.title}</strong>
              <p>${course.description}</p>
              <a class="button" href="course_detail.html?courseId=${course._id}">Open Course</a>
            </li>`;
          } else {
            myCoursesList.innerHTML += `<li>Invalid course data</li>`;
          }
        });
      }
      await loadAnnouncements();
      await loadQuizzes();
    }
  } catch (err) {
    alert(err.message);
    window.location.href = 'login.html';
  }
}

async function loadAnnouncements() {
  const res = await fetch('http://localhost:5000/api/announcements');
  const data = await res.json();
  const announcementsList = document.getElementById('dashboardAnnouncements');
  announcementsList.innerHTML = '';
  if(Array.isArray(data) && data.length) {
    data.forEach(a => {
      announcementsList.innerHTML += `<li><strong>${a.title}</strong>: ${a.description}</li>`;
    });
  } else {
    announcementsList.innerHTML = '<li>No announcements.</li>';
  }
}

async function loadQuizzes() {
  const res = await fetch('http://localhost:5000/api/quizzes');
  const data = await res.json();
  const quizzesList = document.getElementById('dashboardQuizzes');
  quizzesList.innerHTML = '';
  if(Array.isArray(data) && data.length) {
    data.forEach(q => {
      quizzesList.innerHTML += `<li><strong>Quiz</strong> for course: ${q.course}<br>${q.questions.map((ques, idx) => `Q${idx+1}: ${ques.text}`).join('<br>')}</li>`;
    });
  } else {
    quizzesList.innerHTML = '<li>No quizzes.</li>';
  }
}

window.onload = loadDashboard;
