import { initCircuitBackground } from './canvas-bg.js';

let loadedProjects = [];

document.addEventListener('DOMContentLoaded', () => {
  // Track page hit
  fetch('/api/analytics/hit', { method: 'POST' }).catch(err => console.error(err));

  initCircuitBackground();
  initMobileNav();
  
  // Load data from APIs
  loadPortfolioData();
  
  initContactForm();
});

/* ==========================================
   1. LOAD PORTFOLIO DATA FROM REST API
   ========================================== */
async function loadPortfolioData() {
  try {
    const profileRes = await fetch('/api/profile');
    const profile = await profileRes.json();
    hydrateProfile(profile);

    const expRes = await fetch('/api/experience');
    const experiences = await expRes.json();
    hydrateExperience(experiences);

    const skillsRes = await fetch('/api/skills');
    const skills = await skillsRes.json();
    hydrateSkills(skills);

    const projectsRes = await fetch('/api/projects');
    loadedProjects = await projectsRes.json();
    hydrateProjects(loadedProjects);

    const certsRes = await fetch('/api/certificates');
    const certificates = await certsRes.json();
    hydrateCertificates(certificates);

    initTypewriter(profile.role);
    initIntersectionObserver();
    initProjectModals();
    initResumeActions(profile);

  } catch (err) {
    console.error('Error hydrating portfolio dashboard:', err);
  }
}

function hydrateProfile(profile) {
  document.title = `${profile.name} | ${profile.role} Portfolio`;
  
  document.getElementById('logo-text').textContent = 'PORTFOLIO';
  document.getElementById('footer-logo-text').textContent = 'PORTFOLIO';
  document.getElementById('hero-name').textContent = profile.name;
  
  const taglineEl = document.getElementById('hero-tagline');
  if (taglineEl) {
    if (profile.tagline) {
      taglineEl.textContent = profile.tagline;
      taglineEl.style.display = 'inline-block';
    } else {
      taglineEl.style.display = 'none';
    }
  }
  
  document.getElementById('hero-bio').textContent = profile.bio;
  document.getElementById('footer-copy').innerHTML = `&copy; ${new Date().getFullYear()} ${profile.name}. All rights reserved.`;

  const socialsContainer = document.getElementById('hero-socials');
  socialsContainer.innerHTML = '';
  if (profile.github) {
    socialsContainer.innerHTML += `<a href="${profile.github}" target="_blank" rel="noopener noreferrer" aria-label="GitHub" class="social-icon"><i class="fa-brands fa-github"></i></a>`;
  }
  if (profile.linkedin) {
    socialsContainer.innerHTML += `<a href="${profile.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="social-icon"><i class="fa-brands fa-linkedin"></i></a>`;
  }
  socialsContainer.innerHTML += `<a href="mailto:${profile.email}" aria-label="Email" class="social-icon"><i class="fa-solid fa-envelope"></i></a>`;

  const bioContainer = document.getElementById('about-bio-container');
  bioContainer.innerHTML = `
    <p>${profile.bio.replace(/\. /g, '.</p><p>')}</p>
    <div class="highlight-box">
      "Fascinated by designing compact, low-power hardware configurations that solve real-world industrial and commercial challenges."
    </div>
  `;

  const metricsContainer = document.getElementById('about-metrics-container');
  metricsContainer.innerHTML = `
    <div class="glass-panel metric-card">
      <div class="metric-number">2025</div>
      <div class="metric-label">ECE Graduate</div>
    </div>
    <div class="glass-panel metric-card">
      <div class="metric-number">5+</div>
      <div class="metric-label">PCBs Designed</div>
    </div>
    <div class="glass-panel metric-card">
      <div class="metric-number">3+</div>
      <div class="metric-label">Core IoT Projects</div>
    </div>
    <div class="glass-panel metric-card">
      <div class="metric-number">7.3</div>
      <div class="metric-label">Anna University CGPA</div>
    </div>
  `;

  const contactList = document.getElementById('contact-details-list');
  contactList.innerHTML = `
    <a href="mailto:${profile.email}" class="contact-detail-item">
      <div class="contact-detail-icon"><i class="fa-solid fa-envelope"></i></div>
      <div class="contact-detail-content">
        <span class="contact-detail-label">Email</span>
        <span class="contact-detail-value">${profile.email}</span>
      </div>
    </a>
    <a href="tel:${profile.phone.replace(/\s+/g, '')}" class="contact-detail-item">
      <div class="contact-detail-icon"><i class="fa-solid fa-phone"></i></div>
      <div class="contact-detail-content">
        <span class="contact-detail-label">Phone</span>
        <span class="contact-detail-value">${profile.phone}</span>
      </div>
    </a>
    <div class="contact-detail-item">
      <div class="contact-detail-icon"><i class="fa-solid fa-location-dot"></i></div>
      <div class="contact-detail-content">
        <span class="contact-detail-label">Location</span>
        <span class="contact-detail-value">${profile.location}</span>
      </div>
    </div>
    <a href="${profile.linkedin}" target="_blank" rel="noopener noreferrer" class="contact-detail-item">
      <div class="contact-detail-icon"><i class="fa-brands fa-linkedin"></i></div>
      <div class="contact-detail-content">
        <span class="contact-detail-label">LinkedIn</span>
        <span class="contact-detail-value">${profile.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
      </div>
    </a>
  `;

  const preview = document.getElementById('resume-preview-card');
  preview.innerHTML = `
    <div class="resume-header">
      <div class="resume-info">
        <h3>${profile.name.toUpperCase()}</h3>
        <p>${profile.role}</p>
      </div>
      <div class="resume-contact-mini">
        <p>${profile.location} | <a href="mailto:${profile.email}" style="color:var(--accent-primary); text-decoration:underline;">${profile.email}</a></p>
        <p>${profile.phone} | <a href="${profile.linkedin}" target="_blank" rel="noopener noreferrer" style="color:var(--accent-primary); text-decoration:underline;">${profile.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</a></p>
      </div>
    </div>
    <div class="resume-summary-mini">
      ${profile.bio}
    </div>
    <div class="resume-section-mini">
      <h4>Technical Core Stack</h4>
      <div class="resume-row-mini">
        <div class="resume-row-left">Hardware & MCU</div>
        <div class="resume-row-right">ESP32, ESP8266, ATmega328p, KiCad (PCB Layout), Multimeters</div>
      </div>
      <div class="resume-row-mini">
        <div class="resume-row-left">Languages</div>
        <div class="resume-row-right">Embedded C, C, Python (Basics), Arduino IDE, PlatformIO</div>
      </div>
    </div>
  `;
}

function hydrateExperience(experiences) {
  const container = document.getElementById('experience-timeline-container');
  container.innerHTML = '';

  experiences.forEach((exp) => {
    const listItems = exp.responsibilities.map(r => `<li>${r}</li>`).join('');
    const tags = exp.tags.map(t => `<span class="timeline-tag">${t}</span>`).join('');

    container.innerHTML += `
      <div class="timeline-item">
        <div class="timeline-badge"></div>
        <div class="glass-panel timeline-panel">
          <span class="timeline-duration">${exp.duration}</span>
          <h3 class="timeline-role">${exp.role}</h3>
          <span class="timeline-company">${exp.company}</span>
          <ul class="timeline-responsibilities">
            ${listItems}
          </ul>
          <div class="timeline-tags">
            ${tags}
          </div>
        </div>
      </div>
    `;
  });
}

function hydrateSkills(skills) {
  const container = document.getElementById('skills-grid-container');
  container.innerHTML = '';

  const categories = {
    microcontrollers: { title: 'Microcontrollers', icon: 'fa-microchip' },
    languages: { title: 'Programming', icon: 'fa-code' },
    protocols: { title: 'Protocols & IoT', icon: 'fa-network-wired' },
    tools: { title: 'Tools & Lab', icon: 'fa-screwdriver-wrench' }
  };

  Object.keys(categories).forEach(catKey => {
    const catSkills = skills.filter(s => s.category === catKey);
    if (catSkills.length === 0) return;

    const listHtml = catSkills.map(skill => `
      <div class="skill-item">
        <div class="skill-info">
          <span class="skill-name">${skill.name}</span>
          <span class="skill-level">${skill.level}%</span>
        </div>
        <div class="skill-bar-bg">
          <div class="skill-bar-fill" data-width="${skill.level}%"></div>
        </div>
      </div>
    `).join('');

    container.innerHTML += `
      <div class="glass-panel skills-category">
        <div class="skills-category-header">
          <i class="fa-solid ${categories[catKey].icon} skills-category-icon"></i>
          <h3 class="skills-category-title">${categories[catKey].title}</h3>
        </div>
        <div class="skills-list">
          ${listHtml}
        </div>
      </div>
    `;
  });
}

function hydrateProjects(projects) {
  const container = document.getElementById('projects-grid-container');
  container.innerHTML = '';

  projects.forEach((proj) => {
    container.innerHTML += `
      <div class="glass-panel project-card" data-project-id="${proj.id}">
        <div class="project-image-wrap">
          <img src="${proj.image}" alt="${proj.title}" class="project-image">
          <div class="project-image-overlay"></div>
        </div>
        <div class="project-body">
          <div class="project-tags">
            ${proj.software.split(',').slice(0, 3).map(tag => `<span class="timeline-tag">${tag.trim()}</span>`).join('')}
          </div>
          <h3 class="project-title">${proj.title}</h3>
          <p class="project-desc">${proj.description}</p>
          <div class="project-meta">
            <span><strong>Hardware Stack:</strong> ${proj.hardware}</span>
            <span><strong>Firmware Stack:</strong> ${proj.software}</span>
          </div>
          <div class="project-actions">
            <button class="btn btn-primary btn-sm open-details-btn">View Case Study</button>
            <div class="project-link-group">
              ${proj.github ? `<a href="${proj.github}" target="_blank" class="project-link" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>` : ''}
              ${proj.demo ? `<a href="${proj.demo}" target="_blank" class="project-link" aria-label="Live Demo"><i class="fa-solid fa-square-rss"></i></a>` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  });
}

function hydrateCertificates(certificates) {
  const container = document.getElementById('certificates-grid-container');
  container.innerHTML = '';

  certificates.forEach(cert => {
    container.innerHTML += `
      <div class="glass-panel cert-card">
        <i class="fa-solid fa-certificate cert-icon"></i>
        <h3 class="cert-title">${cert.title}</h3>
        <span class="cert-issuer">${cert.issuer}</span>
        <div class="cert-meta">
          <span class="cert-date">${cert.verify_id || 'Certificate Node'}</span>
          ${cert.verify_url && cert.verify_url !== '#' ? `<a href="${cert.verify_url}" target="_blank" class="cert-verify">Verify <i class="fa-solid fa-up-right-from-square"></i></a>` : '<span class="cert-verify">Verified</span>'}
        </div>
      </div>
    `;
  });
}

function initScrollTracker() {
  const scrollBar = document.getElementById('scroll-bar');
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const percentage = (window.pageYOffset / totalHeight) * 100;
      scrollBar.style.width = percentage + '%';
    }
  });
}

function initMobileNav() {
  initScrollTracker();
  
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.querySelector('i').classList.toggle('fa-bars');
    hamburger.querySelector('i').classList.toggle('fa-xmark');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      hamburger.querySelector('i').classList.add('fa-bars');
      hamburger.querySelector('i').classList.remove('fa-xmark');
      
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
}

function initTypewriter(baseRole) {
  const typewriter = document.getElementById('typewriter-role');
  const roles = [
    baseRole,
    'Embedded Systems Engineer',
    'IoT Systems Developer',
    'Firmware Developer',
    'PCB Hardware Designer'
  ];
  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentRole = roles[roleIdx];
    
    if (isDeleting) {
      typewriter.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 50;
    } else {
      typewriter.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      isDeleting = true;
      typingSpeed = 2000;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 500;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

function initIntersectionObserver() {
  const reveals = document.querySelectorAll('.reveal');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        
        const bars = entry.target.querySelectorAll('.skill-bar-fill');
        if (bars.length > 0) {
          bars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width;
          });
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(reveal => {
    revealObserver.observe(reveal);
  });
}

function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const modalContent = document.getElementById('modal-content');

  function openModal(projectId) {
    const data = loadedProjects.find(p => p.id === parseInt(projectId));
    if (!data) return;

    fetch('/api/analytics/view-project', { method: 'POST' }).catch(err => console.error(err));

    modalContent.innerHTML = `
      <div class="modal-banner">
        <img src="${data.image}" alt="${data.title}">
      </div>
      <div class="modal-body">
        <div class="modal-header-meta">
          <h3 class="modal-title">${data.title}</h3>
        </div>
        
        <h4>Project Overview</h4>
        <p>${data.description}</p>
        
        <div class="modal-section-grid">
          <div>
            <h4>Problem Statement</h4>
            <p>${data.problem || 'Standard product operation constraints.'}</p>
          </div>
          <div>
            <h4>Solution & Approach</h4>
            <p>${data.solution || 'Engineered low-power modular microcontroller architectures.'}</p>
          </div>
        </div>

        <div class="modal-section-grid">
          <div>
            <h4>Hardware Stack</h4>
            <p class="timeline-tag" style="display:inline-block; font-size:0.9rem; padding:0.5rem 1rem;">${data.hardware}</p>
          </div>
          <div>
            <h4>Software & Firmware Stack</h4>
            <p class="timeline-tag" style="display:inline-block; font-size:0.9rem; padding:0.5rem 1rem;">${data.software}</p>
          </div>
        </div>

        <h4>Key Results & Performance Metrics</h4>
        <p>${data.results || 'Dispensing margins and stability levels compiled successfully.'}</p>
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  document.getElementById('projects-grid-container').addEventListener('click', (e) => {
    const card = e.target.closest('.project-card');
    if (!card) return;

    const isBtn = e.target.classList.contains('open-details-btn');
    if (isBtn) {
      const projectId = card.getAttribute('data-project-id');
      openModal(projectId);
    }
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const submitBtn = document.getElementById('form-submit-btn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    status.className = 'form-status';
    status.style.display = 'none';
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Transmitting Package...';

    const payload = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value
    };

    fetch('/api/contact/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Transmit Message';

      if (data.success) {
        status.classList.add('success');
        status.innerHTML = `
          <strong>[OK] Connection Established</strong><br>
          Message routed successfully. I will respond to your transmission shortly.
        `;
        form.reset();
      } else {
        status.classList.add('error');
        status.innerHTML = `
          <strong>[ERR] Transmission Failed</strong><br>
          ${data.message || 'Unknown network collision error.'}
        `;
      }
    })
    .catch(err => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Transmit Message';
      status.classList.add('error');
      status.innerHTML = `
        <strong>[ERR] Serial Port Offline</strong><br>
        Could not connect to database endpoint.
      `;
      console.error(err);
    });
  });
}

function initResumeActions(profile) {
  const viewBtn = document.getElementById('view-resume-btn');
  viewBtn.addEventListener('click', () => {
    window.open('/api/resume/view', '_blank');
  });
}
