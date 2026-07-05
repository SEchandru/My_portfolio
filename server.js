import express from 'express';
import path from 'path';
import fs from 'fs';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import db from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'PORTFOLIO_CMS_JWT_SECRET_KEY_2026';

// ----------------------------------------------------
// 1. INITIALIZE DIRECTORIES & ASSETS
// ----------------------------------------------------
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const defaultResumePath = path.resolve('uploads', 'Chandrabal_C_Resume_Default.txt');
if (!fs.existsSync(defaultResumePath)) {
  const resumeText = `
CHANDRABAL C
Embedded Systems Engineer
Chennai, India | chandrabal2104@gmail.com | +91 - 9751720948
https://linkedin.com/in/chandrabal | https://github.com

==================================================
SUMMARY
==================================================
Innovative Embedded Systems Engineer (2025 Graduate) with hands-on experience in ESP32,
ATmega328p, and IoT development. Proficient in Embedded C and hardware design using KiCad.
Proven ability to develop real-time firmware and design custom PCBs for industrial and IoT applications.

==================================================
TECHNICAL SKILLS
==================================================
- Microcontrollers: ESP32, ESP8266, ATmega328p, STM32 (Learning)
- Languages: C, Embedded C, Python (Basics)
- Communication Protocols: I2C, SPI, UART, MQTT, HTTP
- Software Tools: KiCad (PCB Design), Arduino IDE, VS Code (PlatformIO)
- Hardware Skills: Circuit Debugging, Sensor Interfacing, Soldering

==================================================
WORK EXPERIENCE
==================================================
Yalamanchili Software Exports
Embedded Trainee (October 2025 - Present)
- Developing firmware for ESP32 and ATmega328p based applications.
- Designing hardware schematics and 2-layer PCB layouts using KiCad.
- Performing hardware-software integration and debugging using Multimeters and Logic Analyzers.

==================================================
PROJECTS
==================================================
Smart Water Tank Monitoring System (ESP32, IoT)
- Developed an automated system using ESP32 and Ultrasonic sensors for high-accuracy level detection.
- Integrated ThingSpeak cloud via HTTP/MQTT for real-time remote data logging.
- Implemented low-power firmware to optimize battery efficiency for IoT deployment.

Smart Vending Machine System (ESP32, Embedded System)
- Engineered firmware for automated dispensing using PWM motor control and Relays.
- Built a user interface with 4x4 Keypad and 16x2 LCD for seamless interaction.
- Integrated feedback loops for error handling and precise product dispensing.

Smart Parking System (Embedded System)
- Developed a real-time parking slot management system using IR sensors.
- Optimized sensor polling rates to ensure high responsiveness and low power usage.
- Designed a central interface to display real-time slot availability for users.

==================================================
EDUCATION
==================================================
B.E - Electronics and Communication Engineering
University College of Engineering, Anna University (2021 - 2025)
CGPA: 7.3
  `;
  fs.writeFileSync(defaultResumePath, resumeText.trim(), 'utf8');
}

// ----------------------------------------------------
// 2. MIDDLEWARES & STATIC FILES
// ----------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend assets
app.use(express.static(path.resolve('public')));
app.use('/assets', express.static(path.resolve('assets')));
app.use('/uploads', express.static(path.resolve('uploads')));

// ----------------------------------------------------
// 3. AUTHENTICATION MIDDLEWARE
// ----------------------------------------------------
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(403).json({ success: false, message: 'Access denied: No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(403).json({ success: false, message: 'Access denied: Bad token format.' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired authentication session.' });
  }
};

// Multer Storage for Media Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

// ----------------------------------------------------
// 4. AUTHENTICATION ENDPOINTS
// ----------------------------------------------------
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password.' });
  }

  const users = db.query('users');
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid authentication credentials.' });
  }

  const validPass = bcryptjs.compareSync(password, user.password_hash);
  if (!validPass) {
    return res.status(401).json({ success: false, message: 'Invalid authentication credentials.' });
  }

  // Generate Session Token
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '12h' });
  res.json({
    success: true,
    token,
    user: {
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

app.get('/api/auth/check', verifyToken, (req, res) => {
  res.json({ success: true, user: req.user });
});

// ----------------------------------------------------
// 5. PUBLIC PORTFOLIO DATA ENDPOINTS
// ----------------------------------------------------
app.get('/api/profile', (req, res) => {
  res.json(db.getProfile());
});

app.get('/api/experience', (req, res) => {
  const list = db.query('experience');
  res.json(list);
});

app.get('/api/skills', (req, res) => {
  const list = db.query('skills');
  res.json(list);
});

app.get('/api/projects', (req, res) => {
  const list = db.query('projects');
  res.json(list);
});

app.get('/api/certificates', (req, res) => {
  const list = db.query('certificates');
  res.json(list);
});

// Submit Contact Form
app.post('/api/contact/submit', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'All message parameters are required.' });
  }

  const newMessage = db.insert('contacts', {
    name,
    email,
    subject,
    message,
    status: 'unread',
    submitted_at: new Date().toISOString()
  });

  db.incrementAnalytic('contact_submissions');
  res.json({ success: true, message: 'Transmission logged successfully.', data: newMessage });
});

// Download Active Resume
app.get('/api/resume/download', (req, res) => {
  const resumes = db.query('resumes');
  const activeResume = resumes.find(r => r.active === true) || resumes[0];

  if (!activeResume) {
    return res.status(404).send('No resume registered on server endpoint.');
  }

  const filePath = path.resolve(activeResume.file_path.replace(/^\//, ''));
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Physical resume document not found.');
  }

  db.incrementAnalytic('resume_downloads');
  res.download(filePath, activeResume.filename);
});

// View Active Resume Inline
app.get('/api/resume/view', (req, res) => {
  const resumes = db.query('resumes');
  const activeResume = resumes.find(r => r.active === true) || resumes[0];

  if (!activeResume) {
    return res.status(404).send('No resume registered on server endpoint.');
  }

  const filePath = path.resolve(activeResume.file_path.replace(/^\//, ''));
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Physical resume document not found.');
  }

  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.pdf') {
    res.contentType("application/pdf");
  } else if (ext === '.txt') {
    res.contentType("text/plain");
  }
  
  res.sendFile(filePath);
});

// Analytics View triggers
app.post('/api/analytics/hit', (req, res) => {
  const count = db.incrementAnalytic('visitor_count');
  res.json({ success: true, visitor_count: count });
});

app.post('/api/analytics/view-project', (req, res) => {
  const count = db.incrementAnalytic('project_views');
  res.json({ success: true, project_views: count });
});

// ----------------------------------------------------
// 6. PROTECTED ADMINISTRATIVE CRUD ENDPOINTS
// ----------------------------------------------------

// Analytics read (dashboard)
app.get('/api/analytics', verifyToken, (req, res) => {
  res.json(db.getAnalytics());
});

// Messages read / delete
app.get('/api/contact/messages', verifyToken, (req, res) => {
  const list = db.query('contacts');
  // Sort messages descending by time
  list.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
  res.json(list);
});

app.delete('/api/contact/messages/:id', verifyToken, (req, res) => {
  const id = req.params.id;
  const deleted = db.delete('contacts', id);
  if (deleted) {
    res.json({ success: true, message: 'Message record removed from ledger.' });
  } else {
    res.status(404).json({ success: false, message: 'Message ID not found.' });
  }
});

// Profile Manager
app.put('/api/profile', verifyToken, (req, res) => {
  const updated = db.updateProfile(req.body);
  res.json({ success: true, message: 'Profile config updated.', data: updated });
});

// Experience Manager
app.post('/api/experience', verifyToken, (req, res) => {
  const { company, role, duration, responsibilities, tags } = req.body;
  const newRow = db.insert('experience', { company, role, duration, responsibilities, tags });
  res.json({ success: true, message: 'Experience logged.', data: newRow });
});

app.put('/api/experience/:id', verifyToken, (req, res) => {
  const id = req.params.id;
  const updated = db.update('experience', id, req.body);
  if (updated) {
    res.json({ success: true, message: 'Experience updated.', data: updated });
  } else {
    res.status(404).json({ success: false, message: 'Experience ID not found.' });
  }
});

app.delete('/api/experience/:id', verifyToken, (req, res) => {
  const id = req.params.id;
  const deleted = db.delete('experience', id);
  if (deleted) {
    res.json({ success: true, message: 'Experience deleted.' });
  } else {
    res.status(404).json({ success: false, message: 'Experience ID not found.' });
  }
});

// Skills Manager
app.post('/api/skills', verifyToken, (req, res) => {
  const { name, level, category } = req.body;
  const newRow = db.insert('skills', { name, level: parseInt(level), category });
  res.json({ success: true, message: 'Skill entry created.', data: newRow });
});

app.put('/api/skills/:id', verifyToken, (req, res) => {
  const id = req.params.id;
  const updated = db.update('skills', id, { ...req.body, level: parseInt(req.body.level) });
  if (updated) {
    res.json({ success: true, message: 'Skill updated.', data: updated });
  } else {
    res.status(404).json({ success: false, message: 'Skill ID not found.' });
  }
});

app.delete('/api/skills/:id', verifyToken, (req, res) => {
  const id = req.params.id;
  const deleted = db.delete('skills', id);
  if (deleted) {
    res.json({ success: true, message: 'Skill deleted.' });
  } else {
    res.status(404).json({ success: false, message: 'Skill ID not found.' });
  }
});

// Projects Manager
app.post('/api/projects', verifyToken, (req, res) => {
  const newRow = db.insert('projects', req.body);
  res.json({ success: true, message: 'Project entry created.', data: newRow });
});

app.put('/api/projects/:id', verifyToken, (req, res) => {
  const id = req.params.id;
  const updated = db.update('projects', id, req.body);
  if (updated) {
    res.json({ success: true, message: 'Project updated.', data: updated });
  } else {
    res.status(404).json({ success: false, message: 'Project ID not found.' });
  }
});

app.delete('/api/projects/:id', verifyToken, (req, res) => {
  const id = req.params.id;
  const deleted = db.delete('projects', id);
  if (deleted) {
    res.json({ success: true, message: 'Project deleted.' });
  } else {
    res.status(404).json({ success: false, message: 'Project ID not found.' });
  }
});

// Certificate Manager
app.post('/api/certificates', verifyToken, (req, res) => {
  const newRow = db.insert('certificates', req.body);
  res.json({ success: true, message: 'Certificate logged.', data: newRow });
});

app.put('/api/certificates/:id', verifyToken, (req, res) => {
  const id = req.params.id;
  const updated = db.update('certificates', id, req.body);
  if (updated) {
    res.json({ success: true, message: 'Certificate updated.', data: updated });
  } else {
    res.status(404).json({ success: false, message: 'Certificate ID not found.' });
  }
});

app.delete('/api/certificates/:id', verifyToken, (req, res) => {
  const id = req.params.id;
  const deleted = db.delete('certificates', id);
  if (deleted) {
    res.json({ success: true, message: 'Certificate removed.' });
  } else {
    res.status(404).json({ success: false, message: 'Certificate ID not found.' });
  }
});

// Resume Manager
app.get('/api/resumes', verifyToken, (req, res) => {
  res.json(db.query('resumes'));
});

app.post('/api/resumes/upload', verifyToken, upload.single('resume'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }

  // Deactivate all previous resumes
  const resumes = db.query('resumes');
  resumes.forEach(r => {
    db.update('resumes', r.id, { active: false });
  });

  const version = req.body.version || `${resumes.length + 1}.0`;

  const newResume = db.insert('resumes', {
    filename: req.file.originalname,
    file_path: `/uploads/${req.file.filename}`,
    version,
    uploaded_at: new Date().toISOString(),
    active: true
  });

  res.json({ success: true, message: 'Resume uploaded and set active.', data: newResume });
});

// Upload media image
app.post('/api/media/upload', verifyToken, upload.single('media'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }
  res.json({
    success: true,
    message: 'Media file uploaded successfully.',
    url: `/uploads/${req.file.filename}`,
    filename: req.file.originalname
  });
});

// Fallback: serve public index.html for undefined routes
app.get('*', (req, res) => {
  res.sendFile(path.resolve('public', 'index.html'));
});

if (process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Portfolio CMS Server running on http://localhost:${PORT}`);
  });
}

export default app;
