import { initCircuitBackground } from './canvas-bg.js';

// Global state
let currentToken = localStorage.getItem('portfolio_token');
let userObj = JSON.parse(localStorage.getItem('portfolio_user') || '{}');

document.addEventListener('DOMContentLoaded', () => {
  initCircuitBackground();
  
  if (!currentToken) {
    window.location.href = '/login.html';
    return;
  }

  // Display user details
  document.getElementById('user-display-name').textContent = userObj.name || 'Admin';

  // Initialize tabs & listeners
  initTabNavigation();
  initFormTriggers();
  
  // Load dashboard data
  loadAllAdminData();
  
  // Bind form submissions
  bindFormSubmissions();
  bindFileUploads();
});

/* ==========================================
   1. TAB SWITCHING SYSTEM
   ========================================== */
function initTabNavigation() {
  const tabs = document.querySelectorAll('.nav-tab-btn');
  const panels = document.querySelectorAll('.tab-panel');
  const title = document.getElementById('current-tab-title');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      
      tab.classList.add('active');
      document.getElementById(`tab-${target}`).classList.add('active');
      
      // Update Title
      title.textContent = tab.textContent.trim() + ' Dashboard';
      
      // Hide any active add forms
      const addForms = [
        'form-project-container',
        'form-experience-container',
        'form-skill-container',
        'form-certificate-container'
      ];
      addForms.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden-panel');
      });
    });
  });
}

function initFormTriggers() {
  // Show Add form
  document.querySelectorAll('.add-new-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const type = trigger.getAttribute('data-form');
      const formContainer = document.getElementById(`form-${type}-container`);
      
      // Reset target form
      const form = formContainer.querySelector('form');
      if (form) {
        form.reset();
        const idField = form.querySelector(`[id$="-id"]`);
        if (idField) idField.value = '';
      }
      
      // Update title text
      const title = document.getElementById(`${type}-form-title`);
      if (title) title.textContent = `Create ${type.charAt(0).toUpperCase() + type.slice(1)} Entry`;

      formContainer.classList.remove('hidden-panel');
      formContainer.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Hide Add form
  document.querySelectorAll('.cancel-form-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-form');
      document.getElementById(`form-${type}-container`).classList.add('hidden-panel');
    });
  });
}

/* ==========================================
   2. API DATA GET & HYDRATION
   ========================================== */
async function loadAllAdminData() {
  await fetchProfile();
  await fetchAnalytics();
  await fetchMessages();
  await fetchProjects();
  await fetchExperience();
  await fetchSkills();
  await fetchCertificates();
  await fetchResumes();
}

// Fetch Profile
async function fetchProfile() {
  try {
    const res = await fetch('/api/profile');
    const data = await res.json();
    
    document.getElementById('prof-name').value = data.name || '';
    document.getElementById('prof-role').value = data.role || '';
    document.getElementById('prof-tagline').value = data.tagline || '';
    document.getElementById('prof-bio').value = data.bio || '';
    document.getElementById('prof-email').value = data.email || '';
    document.getElementById('prof-phone').value = data.phone || '';
    document.getElementById('prof-location').value = data.location || '';
    document.getElementById('prof-linkedin').value = data.linkedin || '';
    document.getElementById('prof-github').value = data.github || '';
  } catch (err) {
    console.error(err);
  }
}

// Fetch Analytics
async function fetchAnalytics() {
  try {
    const res = await fetch('/api/analytics', {
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    const data = await res.json();
    
    document.getElementById('val-visitors').textContent = data.visitor_count || 0;
    document.getElementById('val-downloads').textContent = data.resume_downloads || 0;
    document.getElementById('val-project-views').textContent = data.project_views || 0;
    document.getElementById('val-messages').textContent = data.contact_submissions || 0;
  } catch (err) {
    console.error(err);
  }
}

// Fetch Contact Messages
async function fetchMessages() {
  try {
    const res = await fetch('/api/contact/messages', {
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    const data = await res.json();
    
    // Update Badge
    document.getElementById('message-badge').textContent = data.length;
    
    // Populate Recent Table
    const recentList = document.getElementById('recent-messages-list');
    recentList.innerHTML = '';
    
    // Populate Full Table
    const fullList = document.getElementById('messages-ledgers-list');
    fullList.innerHTML = '';

    if (data.length === 0) {
      recentList.innerHTML = `<tr><td colspan="4" style="text-align: center;">No transmissions logged.</td></tr>`;
      fullList.innerHTML = `<tr><td colspan="6" style="text-align: center;">No transmissions logged.</td></tr>`;
      return;
    }

    // Populate overview
    data.slice(0, 5).forEach(msg => {
      const date = new Date(msg.submitted_at).toLocaleDateString();
      recentList.innerHTML += `
        <tr>
          <td><strong>${msg.name}</strong></td>
          <td>${msg.email}</td>
          <td>${msg.subject}</td>
          <td>${date}</td>
        </tr>
      `;
    });

    // Populate main ledger
    data.forEach(msg => {
      const date = new Date(msg.submitted_at).toLocaleString();
      fullList.innerHTML += `
        <tr>
          <td><strong>${msg.name}</strong></td>
          <td>
            <a href="mailto:${msg.email}" class="cert-verify" style="display:block; margin-bottom:0.25rem;">${msg.email}</a>
            <span style="font-size:0.75rem; color:var(--text-muted);">${msg.phone || 'No phone'}</span>
          </td>
          <td>${msg.subject}</td>
          <td><div style="max-width:300px; font-size:0.85rem; color:var(--text-secondary); white-space:pre-wrap;">${msg.message}</div></td>
          <td><span style="font-family:var(--font-mono); font-size:0.8rem;">${date}</span></td>
          <td>
            <button class="btn btn-secondary btn-sm delete-msg-btn" data-id="${msg.id}" style="border-color:#EF4444; color:#EF4444; padding:0.25rem 0.5rem;"><i class="fa-solid fa-trash"></i> Delete</button>
          </td>
        </tr>
      `;
    });

    // Bind deletes
    document.querySelectorAll('.delete-msg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        deleteMessage(btn.getAttribute('data-id'));
      });
    });

  } catch (err) {
    console.error(err);
  }
}

// Fetch Projects
async function fetchProjects() {
  try {
    const res = await fetch('/api/projects');
    const data = await res.json();
    
    const container = document.getElementById('admin-projects-list');
    container.innerHTML = '';
    
    if (data.length === 0) {
      container.innerHTML = `<p style="text-align: center; color:var(--text-muted); padding:2rem;">No projects logged.</p>`;
      return;
    }

    data.forEach(proj => {
      container.innerHTML += `
        <div class="admin-item-row glass-panel">
          <img src="${proj.image}" alt="${proj.title}" class="admin-item-img">
          <div class="admin-item-details">
            <h4>${proj.title}</h4>
            <p>${proj.description}</p>
            <div class="admin-item-meta">
              <span>HW: <strong>${proj.hardware}</strong></span>
              <span>SW: <strong>${proj.software}</strong></span>
            </div>
          </div>
          <div class="admin-item-actions">
            <button class="btn btn-secondary btn-sm edit-proj-btn" data-id="${proj.id}"><i class="fa-solid fa-edit"></i> Edit</button>
            <button class="btn btn-secondary btn-sm delete-proj-btn" data-id="${proj.id}" style="border-color:#EF4444; color:#EF4444;"><i class="fa-solid fa-trash"></i> Delete</button>
          </div>
        </div>
      `;
    });

    // Bind Edit/Deletes
    document.querySelectorAll('.edit-proj-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const proj = data.find(p => p.id === parseInt(id));
        if (proj) editProject(proj);
      });
    });

    document.querySelectorAll('.delete-proj-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        deleteProject(btn.getAttribute('data-id'));
      });
    });

  } catch (err) {
    console.error(err);
  }
}

// Fetch Experience
async function fetchExperience() {
  try {
    const res = await fetch('/api/experience');
    const data = await res.json();
    
    const container = document.getElementById('admin-experience-list');
    container.innerHTML = '';

    if (data.length === 0) {
      container.innerHTML = `<p style="text-align: center; color:var(--text-muted); padding:2rem;">No experience entries logged.</p>`;
      return;
    }

    data.forEach(exp => {
      container.innerHTML += `
        <div class="admin-item-row glass-panel">
          <div class="admin-item-details">
            <h4>${exp.role} @ ${exp.company}</h4>
            <span class="timeline-duration" style="margin-bottom:0.5rem; display:block;">${exp.duration}</span>
            <ul class="timeline-responsibilities" style="text-align:left; align-items:flex-start; margin-bottom:0.5rem;">
              ${exp.responsibilities.map(r => `<li style="padding-left:1.2rem; font-size:0.85rem;">${r}</li>`).join('')}
            </ul>
            <div class="timeline-tags">
              ${exp.tags.map(t => `<span class="timeline-tag">${t}</span>`).join('')}
            </div>
          </div>
          <div class="admin-item-actions">
            <button class="btn btn-secondary btn-sm edit-exp-btn" data-id="${exp.id}"><i class="fa-solid fa-edit"></i> Edit</button>
            <button class="btn btn-secondary btn-sm delete-exp-btn" data-id="${exp.id}" style="border-color:#EF4444; color:#EF4444;"><i class="fa-solid fa-trash"></i> Delete</button>
          </div>
        </div>
      `;
    });

    // Bind Edit/Deletes
    document.querySelectorAll('.edit-exp-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const exp = data.find(e => e.id === parseInt(id));
        if (exp) editExperience(exp);
      });
    });

    document.querySelectorAll('.delete-exp-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        deleteExperience(btn.getAttribute('data-id'));
      });
    });
  } catch (err) {
    console.error(err);
  }
}

// Fetch Skills
async function fetchSkills() {
  try {
    const res = await fetch('/api/skills');
    const data = await res.json();
    
    const container = document.getElementById('admin-skills-list');
    container.innerHTML = '';

    if (data.length === 0) {
      container.innerHTML = `<p style="text-align: center; color:var(--text-muted); padding:2rem; width:100%;">No skill entries logged.</p>`;
      return;
    }

    data.forEach(skill => {
      container.innerHTML += `
        <div class="admin-skill-chip glass-panel">
          <div>
            <strong>${skill.name}</strong> 
            <span style="font-family:var(--font-mono); font-size:0.8rem; color:var(--accent-primary); margin-left:0.5rem;">${skill.level}%</span>
            <div style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase;">${skill.category}</div>
          </div>
          <div class="chip-actions">
            <button class="edit-skill-btn" data-id="${skill.id}"><i class="fa-solid fa-edit"></i></button>
            <button class="delete-skill-btn" data-id="${skill.id}" style="color:#EF4444;"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      `;
    });

    // Bind Edit/Deletes
    document.querySelectorAll('.edit-skill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const skill = data.find(s => s.id === parseInt(id));
        if (skill) editSkill(skill);
      });
    });

    document.querySelectorAll('.delete-skill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        deleteSkill(btn.getAttribute('data-id'));
      });
    });
  } catch (err) {
    console.error(err);
  }
}

// Fetch Certificates
async function fetchCertificates() {
  try {
    const res = await fetch('/api/certificates');
    const data = await res.json();
    
    const container = document.getElementById('admin-certificates-list');
    container.innerHTML = '';

    if (data.length === 0) {
      container.innerHTML = `<p style="text-align: center; color:var(--text-muted); padding:2rem;">No credentials logged.</p>`;
      return;
    }

    data.forEach(cert => {
      container.innerHTML += `
        <div class="admin-item-row glass-panel">
          <div class="admin-item-details">
            <h4>${cert.title}</h4>
            <p>Issuer: <strong>${cert.issuer}</strong> | Date: <strong>${cert.issue_date}</strong></p>
            <div class="admin-item-meta">
              <span>ID: ${cert.verify_id || 'N/A'}</span>
              ${cert.verify_url && cert.verify_url !== '#' ? `<span>Link: <a href="${cert.verify_url}" target="_blank" class="cert-verify">${cert.verify_url}</a></span>` : ''}
            </div>
          </div>
          <div class="admin-item-actions">
            <button class="btn btn-secondary btn-sm edit-cert-btn" data-id="${cert.id}"><i class="fa-solid fa-edit"></i> Edit</button>
            <button class="btn btn-secondary btn-sm delete-cert-btn" data-id="${cert.id}" style="border-color:#EF4444; color:#EF4444;"><i class="fa-solid fa-trash"></i> Delete</button>
          </div>
        </div>
      `;
    });

    // Bind Edit/Deletes
    document.querySelectorAll('.edit-cert-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const cert = data.find(c => c.id === parseInt(id));
        if (cert) editCertificate(cert);
      });
    });

    document.querySelectorAll('.delete-cert-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        deleteCertificate(btn.getAttribute('data-id'));
      });
    });
  } catch (err) {
    console.error(err);
  }
}

// Fetch Resumes
async function fetchResumes() {
  try {
    const res = await fetch('/api/resumes', {
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    const data = await res.json();
    
    const container = document.getElementById('resumes-version-list');
    container.innerHTML = '';

    if (data.length === 0) {
      container.innerHTML = `<tr><td colspan="4" style="text-align: center;">No resumes cataloged.</td></tr>`;
      return;
    }

    data.forEach(r => {
      const date = new Date(r.uploaded_at).toLocaleDateString();
      container.innerHTML += `
        <tr>
          <td><strong>${r.filename}</strong></td>
          <td><span style="font-family:var(--font-mono);">${r.version}</span></td>
          <td>${date}</td>
          <td>
            ${r.active ? '<span class="timeline-tag" style="background:rgba(0, 229, 255, 0.1); border-color:var(--accent-primary); color:var(--accent-primary);">Deployed</span>' : '<span style="color:var(--text-muted)">Inactive</span>'}
          </td>
        </tr>
      `;
    });
  } catch (err) {
    console.error(err);
  }
}

/* ==========================================
   3. EDIT PANEL TRIGGER WRAPPERS
   ========================================== */
function editProject(proj) {
  document.getElementById('project-form-title').textContent = 'Modify Project Entry';
  document.getElementById('proj-id').value = proj.id;
  document.getElementById('proj-title').value = proj.title;
  document.getElementById('proj-image').value = proj.image;
  document.getElementById('proj-description').value = proj.description;
  document.getElementById('proj-problem').value = proj.problem || '';
  document.getElementById('proj-solution').value = proj.solution || '';
  document.getElementById('proj-hardware').value = proj.hardware || '';
  document.getElementById('proj-software').value = proj.software || '';
  document.getElementById('proj-results').value = proj.results || '';
  document.getElementById('proj-github').value = proj.github || '';
  document.getElementById('proj-demo').value = proj.demo || '';

  const container = document.getElementById('form-project-container');
  container.classList.remove('hidden-panel');
  container.scrollIntoView({ behavior: 'smooth' });
}

function editExperience(exp) {
  document.getElementById('experience-form-title').textContent = 'Modify History Entry';
  document.getElementById('exp-id').value = exp.id;
  document.getElementById('exp-company').value = exp.company;
  document.getElementById('exp-role').value = exp.role;
  document.getElementById('exp-duration').value = exp.duration;
  document.getElementById('exp-responsibilities').value = exp.responsibilities.join('\n');
  document.getElementById('exp-tags').value = exp.tags.join(', ');

  const container = document.getElementById('form-experience-container');
  container.classList.remove('hidden-panel');
  container.scrollIntoView({ behavior: 'smooth' });
}

function editSkill(skill) {
  document.getElementById('skill-form-title').textContent = 'Modify Skill Entry';
  document.getElementById('skill-id').value = skill.id;
  document.getElementById('skill-name').value = skill.name;
  document.getElementById('skill-level').value = skill.level;
  document.getElementById('skill-category').value = skill.category;

  const container = document.getElementById('form-skill-container');
  container.classList.remove('hidden-panel');
  container.scrollIntoView({ behavior: 'smooth' });
}

function editCertificate(cert) {
  document.getElementById('certificate-form-title').textContent = 'Modify Certificate Entry';
  document.getElementById('cert-id').value = cert.id;
  document.getElementById('cert-title').value = cert.title;
  document.getElementById('cert-issuer').value = cert.issuer;
  document.getElementById('cert-verify-id').value = cert.verify_id || '';
  document.getElementById('cert-verify-url').value = cert.verify_url || '';
  document.getElementById('cert-date').value = cert.issue_date;

  const container = document.getElementById('form-certificate-container');
  container.classList.remove('hidden-panel');
  container.scrollIntoView({ behavior: 'smooth' });
}

/* ==========================================
   4. DELETE ACTIONS
   ========================================== */
async function deleteMessage(id) {
  if (!confirm('Are you sure you want to delete this transmission record?')) return;
  try {
    const res = await fetch(`/api/contact/messages/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    const data = await res.json();
    if (data.success) {
      fetchMessages();
      fetchAnalytics();
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
  }
}

async function deleteProject(id) {
  if (!confirm('Are you sure you want to delete this project?')) return;
  try {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    const data = await res.json();
    if (data.success) {
      fetchProjects();
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
  }
}

async function deleteExperience(id) {
  if (!confirm('Are you sure you want to delete this experience timeline?')) return;
  try {
    const res = await fetch(`/api/experience/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    const data = await res.json();
    if (data.success) {
      fetchExperience();
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
  }
}

async function deleteSkill(id) {
  if (!confirm('Are you sure you want to delete this skill chip?')) return;
  try {
    const res = await fetch(`/api/skills/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    const data = await res.json();
    if (data.success) {
      fetchSkills();
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
  }
}

async function deleteCertificate(id) {
  if (!confirm('Are you sure you want to delete this certificate record?')) return;
  try {
    const res = await fetch(`/api/certificates/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    const data = await res.json();
    if (data.success) {
      fetchCertificates();
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
  }
}

/* ==========================================
   5. BIND SUBMISSION FORM API CALLS
   ========================================== */
function bindFormSubmissions() {
  // 1. Profile Save
  document.getElementById('profile-mgr-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      name: document.getElementById('prof-name').value,
      role: document.getElementById('prof-role').value,
      tagline: document.getElementById('prof-tagline').value,
      bio: document.getElementById('prof-bio').value,
      email: document.getElementById('prof-email').value,
      phone: document.getElementById('prof-phone').value,
      location: document.getElementById('prof-location').value,
      linkedin: document.getElementById('prof-linkedin').value,
      github: document.getElementById('prof-github').value
    };

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        alert('Profile configuration saved.');
        fetchProfile();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  });

  // 2. Project Save (Create/Update)
  document.getElementById('project-mgr-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('proj-id').value;
    const isEdit = id !== '';
    
    const payload = {
      title: document.getElementById('proj-title').value,
      image: document.getElementById('proj-image').value,
      description: document.getElementById('proj-description').value,
      problem: document.getElementById('proj-problem').value,
      solution: document.getElementById('proj-solution').value,
      hardware: document.getElementById('proj-hardware').value,
      software: document.getElementById('proj-software').value,
      results: document.getElementById('proj-results').value,
      github: document.getElementById('proj-github').value,
      demo: document.getElementById('proj-demo').value
    };

    const url = isEdit ? `/api/projects/${id}` : '/api/projects';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        document.getElementById('form-project-container').classList.add('hidden-panel');
        fetchProjects();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  });

  // 3. Experience Save
  document.getElementById('experience-mgr-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('exp-id').value;
    const isEdit = id !== '';

    // Convert newlines to array
    const responsibilities = document.getElementById('exp-responsibilities').value
      .split('\n')
      .map(r => r.trim())
      .filter(r => r !== '');

    // Convert comma-separated string to array
    const tags = document.getElementById('exp-tags').value
      .split(',')
      .map(t => t.trim())
      .filter(t => t !== '');

    const payload = {
      company: document.getElementById('exp-company').value,
      role: document.getElementById('exp-role').value,
      duration: document.getElementById('exp-duration').value,
      responsibilities,
      tags
    };

    const url = isEdit ? `/api/experience/${id}` : '/api/experience';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        document.getElementById('form-experience-container').classList.add('hidden-panel');
        fetchExperience();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  });

  // 4. Skill Save
  document.getElementById('skill-mgr-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('skill-id').value;
    const isEdit = id !== '';

    const payload = {
      name: document.getElementById('skill-name').value,
      level: document.getElementById('skill-level').value,
      category: document.getElementById('skill-category').value
    };

    const url = isEdit ? `/api/skills/${id}` : '/api/skills';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        document.getElementById('form-skill-container').classList.add('hidden-panel');
        fetchSkills();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  });

  // 5. Certificate Save
  document.getElementById('certificate-mgr-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('cert-id').value;
    const isEdit = id !== '';

    const payload = {
      title: document.getElementById('cert-title').value,
      issuer: document.getElementById('cert-issuer').value,
      verify_id: document.getElementById('cert-verify-id').value,
      verify_url: document.getElementById('cert-verify-url').value,
      issue_date: document.getElementById('cert-date').value
    };

    const url = isEdit ? `/api/certificates/${id}` : '/api/certificates';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        document.getElementById('form-certificate-container').classList.add('hidden-panel');
        fetchCertificates();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  });

  // 6. Resume Upload & Save
  document.getElementById('resume-upload-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('resume-file');
    const versionInput = document.getElementById('resume-version');
    const progress = document.getElementById('resume-upload-progress');

    if (fileInput.files.length === 0) return;

    progress.style.display = 'block';
    progress.textContent = 'Transmitting resume buffer...';

    const formData = new FormData();
    formData.append('resume', fileInput.files[0]);
    formData.append('version', versionInput.value);

    try {
      const res = await fetch('/api/resumes/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${currentToken}` },
        body: formData
      });
      const data = await res.json();
      
      progress.style.display = 'none';

      if (data.success) {
        alert('Resume uploaded and set as active.');
        document.getElementById('resume-upload-form').reset();
        fetchResumes();
        fetchAnalytics();
      } else {
        alert(data.message);
      }
    } catch (err) {
      progress.style.display = 'none';
      console.error(err);
    }
  });
}

/* ==========================================
   6. FILE UPLOAD EVENT LISTENERS
   ========================================= */
function bindFileUploads() {
  const imageInput = document.getElementById('proj-image-file');
  const imageText = document.getElementById('proj-image');
  const imageProgress = document.getElementById('proj-upload-progress');

  // Trigger project image upload dynamically on change
  imageInput.addEventListener('change', async () => {
    if (imageInput.files.length === 0) return;

    imageProgress.style.display = 'block';
    imageProgress.textContent = 'Uploading project asset...';

    const formData = new FormData();
    formData.append('media', imageInput.files[0]);

    try {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${currentToken}` },
        body: formData
      });
      const data = await res.json();
      
      imageProgress.style.display = 'none';
      
      if (data.success) {
        imageText.value = data.url;
        alert('Cover asset uploaded: URL mapped to path.');
      } else {
        alert(data.message);
      }
    } catch (err) {
      imageProgress.style.display = 'none';
      console.error(err);
    }
  });
}
