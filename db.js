import fs from 'fs';
import path from 'path';
import bcryptjs from 'bcryptjs';

const DB_FILE = path.resolve('db.json');

// Initial seed data representing Chandrabal's resume
const getInitialSeed = () => {
  const salt = bcryptjs.genSaltSync(10);
  const passwordHash = bcryptjs.hashSync('Chan@2104', salt);

  return {
    users: [
      {
        id: 1,
        email: 'chandrabal2104@gmail.com',
        password_hash: passwordHash,
        name: 'Chandrabal C',
        role: 'admin'
      }
    ],
    profile: {
      name: 'Chandrabal C',
      role: 'Embedded Systems Engineer',
      tagline: '',
      bio: 'Innovative Embedded Systems Engineer (2025 Graduate) with hands-on experience in ESP32, ATmega328p, and IoT development. Proficient in Embedded C and hardware design using KiCad. Proven ability to develop real-time firmware and design custom PCBs for industrial and IoT applications.',
      phone: '+91 - 9751720948',
      email: 'chandrabal2104@gmail.com',
      location: 'Tamil Nadu, India',
      linkedin: 'https://www.linkedin.com/in/chandrabal-c-053440387/',
      github: 'https://github.com/SEchandru'
    },
    experience: [
      {
        id: 1,
        company: 'Yalamanchili Software Exports',
        role: 'Embedded Trainee',
        duration: 'October 2025 - Present',
        responsibilities: [
          'Developing firmware for ESP32 and ATmega328p based smart applications.',
          'Designing hardware schematics and 2-layer PCB layouts using KiCad.',
          'Performing hardware-software integration, system test validations, and debugs using Multimeters and Logic Analyzers.'
        ],
        tags: ['ESP32', 'ATmega328p', 'Embedded C', 'KiCad', 'Logic Analyzers']
      }
    ],
    skills: [
      { id: 1, name: 'ESP32 / ESP8266', level: 92, category: 'microcontrollers' },
      { id: 2, name: 'ATmega328p (AVR)', level: 90, category: 'microcontrollers' },
      { id: 3, name: 'STM32 (Learning)', level: 55, category: 'microcontrollers' },
      { id: 4, name: 'Embedded C / C', level: 90, category: 'languages' },
      { id: 5, name: 'Python (Basics)', level: 65, category: 'languages' },
      { id: 6, name: 'I2C / SPI / UART', level: 88, category: 'protocols' },
      { id: 7, name: 'MQTT / HTTP (IoT Logs)', level: 85, category: 'protocols' },
      { id: 8, name: 'KiCad (PCB Layout)', level: 85, category: 'tools' },
      { id: 9, name: 'Arduino IDE / PlatformIO', level: 90, category: 'tools' },
      { id: 10, name: 'Circuit Debug / Soldering', level: 85, category: 'tools' }
    ],
    projects: [
      {
        id: 1,
        title: 'Smart Water Tank Monitoring System',
        image: '/assets/grid_watch.png',
        description: 'Automated water level detection system utilizing ESP32 and ultrasonic nodes, featuring deep-sleep battery optimizations and ThingSpeak cloud telemetry logging.',
        problem: 'Industrial and domestic water tanks suffer from manual inspection errors, leading to dry runs on pumps (causing mechanical damage) or overflows that waste water and power.',
        solution: 'Engineered an ESP32-based node driving an HC-SR04 ultrasonic sensor with optimized ping triggers. Formulated low-power deep sleep cycles to transmit level data only on threshold breaches or at hourly check-ins to save battery.',
        hardware: 'ESP32 MCU, HC-SR04 Sensor, Buck Converter',
        software: 'Embedded C, ThingSpeak API, HTTP/MQTT',
        results: 'Achieved liquid level distance monitoring with less than 2mm margins; reduced average system power consumption by 65%; 100% automated pump motor cut-off control.',
        github: 'https://github.com',
        demo: ''
      },
      {
        id: 2,
        title: 'Smart Vending Machine System',
        image: '/assets/aero_stream.png',
        description: 'Firmware architecture for automated product dispensing using PWM motor configurations, relays, LCD user feeds, and matrix keypad scan loops.',
        problem: 'Traditional vending platforms operate using legacy microcontrollers lacking standard interfaces, leading to dispensing errors, slow user responses, and complex maintenance.',
        solution: 'Designed robust firmware executing a keypad matrix scan loop, driving motor arrays via PWM relays, and providing character feedback on screen. Closed-loop inputs check if products are successfully dropped.',
        hardware: 'ESP32, 4x4 Keypad, 16x2 LCD, Relays',
        software: 'Embedded C, Keypad Scanner, PWM Drivers',
        results: 'Maintained zero failure rates in continuous dispensing test cycles; configured secure electrical isolation; attained responsive user interface speeds under 15ms.',
        github: 'https://github.com',
        demo: ''
      },
      {
        id: 3,
        title: 'Smart Parking System',
        image: '/assets/edge_pulse.png',
        description: 'Real-time parking slot management tracker utilizing IR presence detectors, optimized polling speed triggers, and a unified status terminal layout.',
        problem: 'Drivers waste time and fuel hunting for open parking spots inside garages. Manual monitoring is slow and scaling standard loop sensors is expensive.',
        solution: 'Built an array of low-power IR sensors configured to poll vehicle locations, optimizing sensor polling rates to save power, and designing an efficient serial communication bus to report open spots.',
        hardware: 'ATmega328p / ESP32 MCU, IR Sensors, LEDs',
        software: 'Embedded C, Polling Optimization, Low Power',
        results: 'Real-time slot tracking with response latency under 100ms; reduced average vehicle stall search time; minimized standby power drain.',
        github: 'https://github.com',
        demo: ''
      }
    ],
    certificates: [
      {
        id: 1,
        title: 'Custom PCB Design with KiCad',
        issuer: 'Yalamanchili Software Exports',
        verify_url: '#',
        verify_id: 'Training Completion',
        issue_date: '2025'
      },
      {
        id: 2,
        title: 'Microcontroller Firmware Architecture',
        issuer: 'PlatformIO Academy',
        verify_url: '#',
        verify_id: 'PLT-92810',
        issue_date: '2025'
      },
      {
        id: 3,
        title: 'IoT Protocols and Data Telemetry',
        issuer: 'Online ECE Certification',
        verify_url: '#',
        verify_id: 'IoT-83021',
        issue_date: '2025'
      }
    ],
    resumes: [
      {
        id: 1,
        filename: 'Chandrabal_C_Embedded_Systems_Engineer_Resume.pdf',
        file_path: '/assets/EDE_Resume_2026.pdf',
        version: '1.0 (PDF)',
        uploaded_at: new Date().toISOString(),
        active: true
      }
    ],
    contacts: [],
    analytics: {
      visitor_count: 0,
      resume_downloads: 0,
      project_views: 0,
      contact_submissions: 0
    }
  };
};

// Database utility class
class Database {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    try {
      if (!fs.existsSync(DB_FILE)) {
        this.data = getInitialSeed();
        this.save();
        console.log('Database file created and pre-seeded.');
      } else {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(raw);
      }
    } catch (err) {
      console.error('Error initializing database:', err);
      this.data = getInitialSeed();
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Error saving database:', err);
    }
  }

  // Get entire table or database
  query(table) {
    this.init(); // Reload latest
    if (!table) return this.data;
    return this.data[table] || [];
  }

  // Get profile (object, not array)
  getProfile() {
    this.init();
    return this.data.profile;
  }

  updateProfile(updatedFields) {
    this.data.profile = { ...this.data.profile, ...updatedFields };
    this.save();
    return this.data.profile;
  }

  // Generic CRUD
  insert(table, row) {
    const list = this.query(table);
    const newId = list.length > 0 ? Math.max(...list.map(r => r.id || 0)) + 1 : 1;
    const newRow = { id: newId, ...row };
    
    this.data[table].push(newRow);
    this.save();
    return newRow;
  }

  update(table, id, updatedFields) {
    const list = this.query(table);
    const idx = list.findIndex(r => r.id === parseInt(id));
    if (idx === -1) return null;

    // Do not overwrite ID
    const updatedRow = { ...list[idx], ...updatedFields, id: parseInt(id) };
    this.data[table][idx] = updatedRow;
    this.save();
    return updatedRow;
  }

  delete(table, id) {
    const list = this.query(table);
    const idx = list.findIndex(r => r.id === parseInt(id));
    if (idx === -1) return false;

    this.data[table].splice(idx, 1);
    this.save();
    return true;
  }

  // Analytics helper
  incrementAnalytic(key) {
    this.init();
    if (this.data.analytics && typeof this.data.analytics[key] !== 'undefined') {
      this.data.analytics[key]++;
      this.save();
      return this.data.analytics[key];
    }
    return 0;
  }

  getAnalytics() {
    this.init();
    return this.data.analytics || {};
  }
}

const db = new Database();
export default db;
