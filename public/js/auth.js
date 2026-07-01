/**
 * Authentication Helper & Session Router Lock
 */

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  // Handle Login Page Logic
  if (path.includes('login.html')) {
    const loginForm = document.getElementById('login-form');
    const status = document.getElementById('login-status');
    const loginBtn = document.getElementById('login-btn');

    // If already logged in, redirect to admin
    const token = localStorage.getItem('portfolio_token');
    if (token) {
      window.location.href = '/admin.html';
      return;
    }

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      status.style.display = 'none';
      status.className = 'form-status';
      
      loginBtn.disabled = true;
      loginBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...';

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      .then(res => res.json())
      .then(data => {
        loginBtn.disabled = false;
        loginBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Authenticate';

        if (data.success) {
          localStorage.setItem('portfolio_token', data.token);
          localStorage.setItem('portfolio_user', JSON.stringify(data.user));
          window.location.href = '/admin.html';
        } else {
          status.classList.add('error');
          status.textContent = data.message || 'Authentication failed.';
          status.style.display = 'block';
        }
      })
      .catch(err => {
        loginBtn.disabled = false;
        loginBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Authenticate';
        status.classList.add('error');
        status.textContent = 'Serial link timeout: Could not connect to API server.';
        status.style.display = 'block';
        console.error(err);
      });
    });
  }

  // Handle Admin Dashboard Route Guards
  if (path.includes('admin.html')) {
    checkAdminAccess();
  }
});

// Guard admin.html routes
async function checkAdminAccess() {
  const token = localStorage.getItem('portfolio_token');
  if (!token) {
    logout();
    return;
  }

  try {
    const res = await fetch('/api/auth/check', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await res.json();
    if (!data.success) {
      logout();
    }
  } catch (err) {
    console.error('Session verification link broken:', err);
    logout();
  }
}

// Global logout
export function logout() {
  localStorage.removeItem('portfolio_token');
  localStorage.removeItem('portfolio_user');
  window.location.href = '/login.html';
}

// Bind to window for HTML buttons onclick
window.logout = logout;
