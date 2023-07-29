//make the login functionality  
const loginButton = document.getElementById('loginButton');
loginButton.addEventListener('click', (e) => {
  e.preventDefault();
  window.location.pathname = "/timeline.html";
})