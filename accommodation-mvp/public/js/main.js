// Shared utilities used across pages
const API_BASE = 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('token');
}

function getUserName() {
  return localStorage.getItem('userName');
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  location.href = 'index.html';
}
