function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

document.getElementById('logoutBtn').onclick = () => {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
};

function getVideoEmbedHTML(videoUrl) {
  if (!videoUrl) return '';
  if (videoUrl.includes('youtube.com/watch?v=')) {
    const embedUrl = videoUrl.replace('watch?v=','embed/').split('&')[0];
    return `<iframe width="320" height="180" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`;
  }
  const youtuMatch = videoUrl.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (youtuMatch) {
    return `<iframe width="320" height="180" src="<https://www.youtube.com/embed/${youtuMatch>[1]}" frameborder="0" allowfullscreen></iframe>`;
  }
  if (videoUrl.endsWith('.mp4')) {
    return `<video width="320" height="180" controls src="${videoUrl}"></video>`;
  }
  return `<iframe width="320" height="180" src="${videoUrl}" frameborder="0" allowfullscreen></iframe>`;
}

async function loadCourse() {
  const courseId = getQueryParam('courseId');
  const token = localStorage.getItem('token');
  document.getElementById('courseDetail').innerHTML = `<p>Loading course (${courseId}) ...</p>`;
  if (!courseId || !token) {
    document.getElementById('courseDetail').innerHTML = '<p>Course not found (missing ID or token).</p>';
    return;
  }
  try {
    const res = await fetch(`http://localhost:5000/api/courses/${courseId}`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const course = await res.json();
    if (!course.title) throw new Error('Course not found in response');
    let paragraphsHtml = '';
    if (Array.isArray(course.paragraphs)) {
      course.paragraphs.forEach((p) => { paragraphsHtml += `<p>${p}</p>`; });
    }
    document.getElementById('courseDetail').innerHTML =
      `<h2>${course.title}</h2><p>${course.description}</p>${getVideoEmbedHTML(course.videoUrl)}${paragraphsHtml}`;
  } catch (err) {
    document.getElementById('courseDetail').innerHTML = `<p>Error: ${err.message}</p>`;
  }
}

window.onload = loadCourse;
