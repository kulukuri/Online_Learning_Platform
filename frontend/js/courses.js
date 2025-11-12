document.getElementById('logoutBtn').onclick = () => {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
};

const coursesList = document.getElementById('coursesList');
const searchInput = document.getElementById('searchInput');
const token = localStorage.getItem('token');

// Video embed helper: supports YouTube (regular/short), .mp4, fallback
function getVideoEmbedHTML(videoUrl) {
  if (!videoUrl) return '';
  // youtube.com/watch?v=xxxx
  if (videoUrl.includes('youtube.com/watch?v=')) {
    const embedUrl = videoUrl.replace('watch?v=','embed/').split('&')[0];
    return `<iframe width="320" height="180" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`;
  }
  // youtu.be/xxxx
  const youtuMatch = videoUrl.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if(youtuMatch) {
    return `<iframe width="320" height="180" src="<https://www.youtube.com/embed/${youtuMatch>[1]}" frameborder="0" allowfullscreen></iframe>`;
  }
  // .mp4
  if (videoUrl.endsWith('.mp4')) {
    return `<video width="320" height="180" controls src="${videoUrl}"></video>`;
  }
  return `<iframe width="320" height="180" src="${videoUrl}" frameborder="0" allowfullscreen></iframe>`;
}

async function fetchCourses(search = '') {
  const params = new URLSearchParams();
  if (search) params.append('search', search);

  try {
    const response = await fetch(`http://localhost:5000/api/courses?${params.toString()}`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await response.json();
    displayCourses(data);
  } catch (err) {
    coursesList.innerHTML = '<li>Error loading courses</li>';
  }
}

function displayCourses(courses) {
  coursesList.innerHTML = '';
  if (!courses.length) {
    coursesList.innerHTML = '<li>No courses found.</li>';
    return;
  }
  courses.forEach(course => {
    const videoEmbed = getVideoEmbedHTML(course.videoUrl);
    const li = document.createElement('li');
    li.innerHTML = `<h3 style="color:#2f80ed;">${course.title}</h3>
      <p>${course.description}</p>
      ${videoEmbed}
      <button onclick="addCourse('${course._id}')" class="button">Add to My Courses</button>`;
    coursesList.appendChild(li);
  });
}

async function addCourse(courseId) {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('You must be logged in to enroll!');
    window.location.href = 'login.html';
    return;
  }
  const res = await fetch(`http://localhost:5000/api/users/enroll/${courseId}`, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token }
  });
  const data = await res.json();
  if(res.ok)
    alert(data.msg || 'Course added!');
  else
    alert(data.msg || 'Failed to add course: ' + (data.msg || res.status));
}

searchInput.addEventListener('input', () => {
  fetchCourses(searchInput.value.trim());
});

window.onload = () => fetchCourses();
