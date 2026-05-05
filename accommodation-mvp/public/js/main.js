// Shared utilities used across pages
const API_BASE = 'https://accommodation-mvp.onrender.com/api';

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
