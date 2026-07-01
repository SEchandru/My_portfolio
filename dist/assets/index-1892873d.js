(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const n of e)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function o(e){const n={};return e.integrity&&(n.integrity=e.integrity),e.referrerPolicy&&(n.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?n.credentials="include":e.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(e){if(e.ep)return;e.ep=!0;const n=o(e);fetch(e.href,n)}})();document.addEventListener("DOMContentLoaded",()=>{y(),v(),w(),b(),E(),S(),P(),L(),T()});function y(){const i=document.getElementById("scroll-bar");window.addEventListener("scroll",()=>{const t=document.documentElement.scrollHeight-window.innerHeight;if(t>0){const o=window.pageYOffset/t*100;i.style.width=o+"%"}})}function v(){const i=document.getElementById("header");window.addEventListener("scroll",()=>{window.scrollY>50?i.classList.add("scrolled"):i.classList.remove("scrolled")})}function w(){const i=document.getElementById("hamburger"),t=document.getElementById("nav-menu"),o=document.querySelectorAll(".nav-link");i.addEventListener("click",()=>{t.classList.toggle("active"),i.querySelector("i").classList.toggle("fa-bars"),i.querySelector("i").classList.toggle("fa-xmark")}),o.forEach(s=>{s.addEventListener("click",e=>{t.classList.remove("active"),i.querySelector("i").classList.add("fa-bars"),i.querySelector("i").classList.remove("fa-xmark"),o.forEach(n=>n.classList.remove("active")),s.classList.add("active")})})}function b(){const i=document.getElementById("typewriter-role"),t=["Embedded Systems Engineer","IoT Systems Developer","Firmware Developer","PCB Hardware Designer"];let o=0,s=0,e=!1,n=100;function r(){const a=t[o];e?(i.textContent=a.substring(0,s-1),s--,n=50):(i.textContent=a.substring(0,s+1),s++,n=100),!e&&s===a.length?(e=!0,n=2e3):e&&s===0&&(e=!1,o=(o+1)%t.length,n=500),setTimeout(r,n)}r()}function E(){const i=document.getElementById("circuit-canvas");if(!i)return;const t=i.getContext("2d");let o=i.width=window.innerWidth,s=i.height=window.innerHeight,e=[];const n=120,r={x:null,y:null,radius:150},a=Math.min(Math.floor(o*s/18e3),100);class l{constructor(){this.x=Math.random()*o,this.y=Math.random()*s,this.vx=(Math.random()-.5)*.4,this.vy=(Math.random()-.5)*.4,this.radius=Math.random()*2+1}draw(){t.beginPath(),t.arc(this.x,this.y,this.radius,0,Math.PI*2),t.fillStyle="#00E5FF",t.shadowBlur=4,t.shadowColor="#00E5FF",t.fill(),t.shadowBlur=0}update(){if((this.x<0||this.x>o)&&(this.vx*=-1),(this.y<0||this.y>s)&&(this.vy*=-1),this.x+=this.vx,this.y+=this.vy,r.x!==null&&r.y!==null){const c=r.x-this.x,m=r.y-this.y,u=Math.sqrt(c*c+m*m);if(u<r.radius){const g=(r.radius-u)/r.radius;this.x-=c*g*.02,this.y-=m*g*.02}}}}function p(){e=[];for(let d=0;d<a;d++)e.push(new l)}function h(){t.clearRect(0,0,o,s);for(let d=0;d<e.length;d++){e[d].update(),e[d].draw();for(let c=d+1;c<e.length;c++){const m=e[d].x-e[c].x,u=e[d].y-e[c].y,g=Math.sqrt(m*m+u*u);if(g<n){t.beginPath(),t.moveTo(e[d].x,e[d].y),t.lineTo(e[c].x,e[c].y);const f=(1-g/n)*.15;t.strokeStyle=`rgba(108, 99, 255, ${f})`,t.lineWidth=.8,t.stroke()}}}requestAnimationFrame(h)}window.addEventListener("resize",()=>{o=i.width=window.innerWidth,s=i.height=window.innerHeight,p()}),window.addEventListener("mousemove",d=>{r.x=d.clientX,r.y=d.clientY}),window.addEventListener("mouseout",()=>{r.x=null,r.y=null}),p(),h()}function S(){const i=document.querySelectorAll(".reveal");document.querySelectorAll(".skill-bar-fill");const t={root:null,rootMargin:"0px",threshold:.15},o=new IntersectionObserver((s,e)=>{s.forEach(n=>{if(n.isIntersecting){n.target.classList.add("revealed");const r=n.target.querySelectorAll(".skill-bar-fill");r.length>0&&r.forEach(a=>{const l=a.getAttribute("data-width");a.style.width=l}),e.unobserve(n.target)}})},t);i.forEach(s=>{o.observe(s)})}const C={water_tank:{title:"Smart Water Tank Monitoring System",image:"assets/grid_watch.png",overview:"An automated IoT sensor system designed using an ESP32 microcontroller and ultrasonic sensors to provide real-time water level measurement, pump control triggers, and cloud logging integration.",problem:"Industrial and domestic water tanks suffer from manual inspection errors, leading to dry runs on pumps (causing mechanical damage) or overflows that waste water and power.",solution:"Engineered an ESP32-based node driving an HC-SR04 ultrasonic sensor with optimized ping triggers. Formulated low-power deep sleep cycles to transmit level data only on threshold breaches or at hourly check-ins to save battery.",hardware:["ESP32 microcontroller node (WiFi + BLE capabilities)","HC-SR04 ultrasonic level sensor operating via GPIO triggers","Buck converter power regulator node supporting LiPo batteries","Solid-state relay switch modules to control AC/DC pump operations"],software:["Arduino core framework written in Embedded C++","ThingSpeak Cloud API integration utilizing HTTP POST/GET streams","Low-power deep-sleep optimization routines (reduced standby current to 15µA)","Median filter algorithm implemented in firmware to eliminate noise from moving waves"],results:["Achieved liquid level distance monitoring with less than 2mm margins.","Reduced average system power consumption by 65%, extending battery life.","100% automated pump motor cut-off control on low/overflow tank limits."]},vending_machine:{title:"Smart Vending Machine System",image:"assets/aero_stream.png",overview:"A smart embedded vending machine dispensing platform controlled by an ESP32, integrating mechanical motor relays, keypad interfaces, and user feedback structures.",problem:"Traditional vending platforms operate using legacy microcontrollers lacking standard interfaces, leading to dispensing errors, slow user responses, and complex maintenance.",solution:"Designed robust firmware executing a keypad matrix scan loop, driving motor arrays via PWM relays, and providing character feedback on screen. Closed-loop inputs check if products are successfully dropped.",hardware:["ESP32 Microcontroller Core (Xtensa Dual-core architecture)","4x4 Matrix Keypad interface (direct GPIO scanning)","16x2 character alphanumeric Liquid Crystal Display (LCD)","12V DC Gear motors and multi-channel opto-isolated Relay boards"],software:["Structured Embedded C firmware built under PlatformIO VS Code environment","Keypad matrix debouncing scanner algorithms to capture crisp user commands","PWM driver controls to regulate motor spin speeds for precise product dispensing","Closed-loop opto-sensor feedback checks to alert users of inventory jams"],results:["Maintained zero failure rates in continuous dispensing test cycles.","Configured secure electrical isolation preventing high-current feedback into the MCU.","Attained responsive user interface speeds with less than 15ms command lags."]},parking_system:{title:"Smart Parking System",image:"assets/edge_pulse.png",overview:"An embedded slot management system that tracks individual parking stall occupancies using infrared (IR) presence arrays, reporting status parameters directly to a central monitor.",problem:"Drivers waste time and fuel hunting for open parking spots inside garages. Manual monitoring is slow and scaling standard loop sensors is expensive.",solution:"Built an array of low-power IR sensors configured to poll vehicle locations, optimizing sensor polling rates to save power, and designing an efficient serial communication bus to report open spots.",hardware:["ESP32 / ATmega328p MCU development boards","High-reliability IR sensor modules with adjusted detection range comparators","Bright status indication LEDs (Green: Open, Red: Occupied)","74HC595 Shift Registers for multiplexed inputs scaling sensor counts"],software:["Bare-metal style C code optimized for low-footprint operations","Sensor polling rate optimizations dynamically active on slot state changes","Interrupt-driven edge detectors to register vehicle entries/exits instantly","Serial payload compiler sending slot array metrics via SPI/UART"],results:["Real-time slot tracking with response latency under 100ms.","Reduced average vehicle stall search time during testing protocols.","Minimised MCU wake times, keeping standby power drain exceptionally low."]}};function P(){const i=document.getElementById("project-modal"),t=document.getElementById("modal-close-btn"),o=document.getElementById("modal-content"),s=document.querySelectorAll(".project-card");function e(r){const a=C[r];a&&(o.innerHTML=`
      <div class="modal-banner">
        <img src="${a.image}" alt="${a.title}">
      </div>
      <div class="modal-body">
        <div class="modal-header-meta">
          <h3 class="modal-title">${a.title}</h3>
        </div>
        
        <h4>Project Overview</h4>
        <p>${a.overview}</p>
        
        <div class="modal-section-grid">
          <div>
            <h4>Problem Statement</h4>
            <p>${a.problem}</p>
          </div>
          <div>
            <h4>Solution & Approach</h4>
            <p>${a.solution}</p>
          </div>
        </div>

        <div class="modal-section-grid">
          <div>
            <h4>Hardware Stack</h4>
            <ul class="modal-list-custom">
              ${a.hardware.map(l=>`<li>${l}</li>`).join("")}
            </ul>
          </div>
          <div>
            <h4>Software & Firmware Stack</h4>
            <ul class="modal-list-custom">
              ${a.software.map(l=>`<li>${l}</li>`).join("")}
            </ul>
          </div>
        </div>

        <h4>Key Results & Performance Metrics</h4>
        <ul class="modal-list-custom">
          ${a.results.map(l=>`<li>${l}</li>`).join("")}
        </ul>
      </div>
    `,i.classList.add("active"),document.body.style.overflow="hidden")}function n(){i.classList.remove("active"),document.body.style.overflow="auto"}s.forEach(r=>{const a=r.querySelector(".open-details-btn"),l=r.getAttribute("data-project");a.addEventListener("click",()=>e(l))}),t.addEventListener("click",n),i.addEventListener("click",r=>{r.target===i&&n()}),document.addEventListener("keydown",r=>{r.key==="Escape"&&i.classList.contains("active")&&n()})}function L(){const i=document.getElementById("contact-form"),t=document.getElementById("form-status"),o=document.getElementById("form-submit-btn");i.addEventListener("submit",s=>{s.preventDefault(),t.className="form-status",t.style.display="none",o.disabled=!0,o.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Transmitting Package...',setTimeout(()=>{const e=Math.random()<.98;o.disabled=!1,o.innerHTML='<i class="fa-solid fa-paper-plane"></i> Transmit Message',e?(t.classList.add("success"),t.innerHTML=`
          <strong>[OK] Connection Established</strong><br>
          Packet successfully routed to <code>chandrabal2104@gmail.com</code>.<br>
          I will respond to your transmission as soon as my interrupt queue clears.
        `,i.reset()):(t.classList.add("error"),t.innerHTML=`
          <strong>[ERR] Connection Timeout</strong><br>
          Network buffer overflow. Please check transmission logs or write directly to <code>chandrabal2104@gmail.com</code>.
        `)},1500)})}function T(){const i=document.getElementById("download-resume-btn"),t=document.getElementById("view-resume-btn");i.addEventListener("click",()=>{const o=`
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
    `,s=new Blob([o],{type:"text/plain"}),e=URL.createObjectURL(s),n=document.createElement("a");n.href=e,n.download="Chandrabal_C_Embedded_Systems_Engineer_Resume.txt",document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(e)}),t.addEventListener("click",()=>{const o=window.open("","_blank");o.document.write(`
      <html>
        <head>
          <title>Chandrabal C - Curriculum Vitae</title>
          <style>
            body {
              font-family: monospace;
              background-color: #0b0f19;
              color: #00E5FF;
              padding: 40px;
              white-space: pre-wrap;
              font-size: 14px;
              line-height: 1.5;
            }
          </style>
        </head>
        <body>
          <h2 style="color: #FFFFFF; border-bottom: 1px solid #00E5FF; padding-bottom: 10px;">CURRICULUM VITAE</h2>
          Close tab or press Ctrl+P to save as PDF.
          <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 20px 0;">
          
          CHANDRABAL C - Embedded Systems Engineer
          --------------------------------------------------
          Email: chandrabal2104@gmail.com
          Phone: +91 - 9751720948
          LinkedIn: linkedin.com/in/chandrabal
          
          ABOUT ME
          --------------------------------------------------
          Innovative Embedded Systems Engineer (2025 Graduate) with hands-on experience in ESP32,
          ATmega328p, and IoT development. Proficient in Embedded C and hardware design using KiCad.
          Proven ability to develop real-time firmware and design custom PCBs for industrial and IoT applications.

          CORE EXPERIENCE
          --------------------------------------------------
          Yalamanchili Software Exports (Oct 2025 - Present)
          Role: Embedded Trainee
          * Developing firmware for ESP32 and ATmega328p applications.
          * Designing hardware schematics and 2-layer PCB layouts using KiCad.
          * Debugging using Multimeters and Logic Analyzers.
          
          KEY PROJECTS
          --------------------------------------------------
          * Smart Water Tank Monitoring System (ESP32, IoT)
          * Smart Vending Machine System (ESP32, Embedded)
          * Smart Parking System (Embedded System)
          
          TECHNICAL SKILLS
          --------------------------------------------------
          * Microcontrollers: ESP32, ESP8266, ATmega328p, STM32 (Learning)
          * Languages: C, Embedded C, Python (Basics)
          * Protocols: I2C, SPI, UART, MQTT, HTTP
          * Tools: KiCad (PCB Layout), Arduino IDE, VS Code (PlatformIO)
          
          EDUCATION
          --------------------------------------------------
          University College of Engineering, Anna University
          B.E - Electronics and Communication Engineering (2021 - 2025)
          CGPA: 7.3
        </body>
      </html>
    `),o.document.close()})}
