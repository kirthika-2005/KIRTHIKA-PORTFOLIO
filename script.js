/* ==========================================================================
   INTERACTIVE DATA PORTFOLIO - JS SCRIPTS
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // State Variables
    let currentTheme = localStorage.getItem("theme") || "dark";
    let charts = {}; // Holds Chart.js instances

    // Set Initial Theme
    document.documentElement.setAttribute("data-theme", currentTheme);

    // ==========================================================================
    // 1. DYNAMIC SYSTEM BOOT PRELOADER
    // ==========================================================================
    const preloader = document.getElementById("loader");
    const progressBar = document.getElementById("loader-progress-bar");
    const percentageText = document.getElementById("loader-percentage");
    const statusText = document.getElementById("loader-status");

    const bootMessages = [
        { pct: 15, msg: "Connecting to database schemas (SQL)..." },
        { pct: 35, msg: "Importing Python libraries (Pandas, NumPy)..." },
        { pct: 55, msg: "Compiling neural network configurations (CNN)..." },
        { pct: 75, msg: "Building data pipelines & dashboards..." },
        { pct: 90, msg: "Optimizing interface metrics... Ready!" }
    ];

    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.floor(Math.random() * 4) + 1; // Randomized boot increments
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            
            progressBar.style.width = "100%";
            percentageText.textContent = "100%";
            statusText.textContent = "Workspace unlocked. Loading complete!";
            
            // Fade-out loading screen
            setTimeout(() => {
                preloader.classList.add("fade-out");
                // Trigger counters and gauges after loader closes
                setTimeout(() => {
                    initCounters();
                    initAOS();
                    animateProgressBars();
                }, 300);
            }, 600);
        } else {
            progressBar.style.width = `${progress}%`;
            percentageText.textContent = `${progress}%`;
            
            // Update boot status descriptions
            const statusUpdate = bootMessages.find(item => progress <= item.pct);
            if (statusUpdate) {
                statusText.textContent = statusUpdate.msg;
            }
        }
    }, 45);


    // ==========================================================================
    // 2. CANVAS DATA CONSTELLATION NETWORK
    // ==========================================================================
    const canvas = document.getElementById("particles-canvas");
    const ctx = canvas.getContext("2d");

    let particlesArray = [];
    let numberOfParticles = 70;
    let mouse = { x: null, y: null, radius: 100 };

    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particlesArray = [];
        initParticles();
    });

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener("mouseout", () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            // Bounce off edges
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // Move particle
            this.x += this.directionX;
            this.y += this.directionY;

            // Draw particle
            this.draw();
        }
    }

    function initParticles() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particlesArray = [];

        // Scale particle count based on screen size
        if (window.innerWidth < 768) {
            numberOfParticles = 30;
        } else {
            numberOfParticles = 70;
        }

        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            
            // Nodes are colored in cyan or purple shades
            let color = Math.random() > 0.5 ? "rgba(6, 182, 212, 0.4)" : "rgba(168, 85, 247, 0.3)";
            
            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function connectParticles() {
        let opacityValue = 1;
        const theme = document.documentElement.getAttribute("data-theme");
        const lineColor = theme === "dark" ? "6, 182, 212" : "8, 145, 178"; // Cyan lines

        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                    + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));

                // Constellation connections threshold
                if (distance < (canvas.width / 9) * (canvas.height / 9)) {
                    opacityValue = 1 - (distance / 16000);
                    if (opacityValue < 0) opacityValue = 0;
                    ctx.strokeStyle = `rgba(${lineColor}, ${opacityValue * 0.15})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }

            // Mouse interaction line connection
            if (mouse.x !== null && mouse.y !== null) {
                let distanceToMouse = ((particlesArray[a].x - mouse.x) * (particlesArray[a].x - mouse.x))
                    + ((particlesArray[a].y - mouse.y) * (particlesArray[a].y - mouse.y));
                
                if (distanceToMouse < mouse.radius * mouse.radius) {
                    let mouseOpacity = 1 - (distanceToMouse / (mouse.radius * mouse.radius));
                    ctx.strokeStyle = `rgba(${lineColor}, ${mouseOpacity * 0.25})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connectParticles();
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();


    // ==========================================================================
    // 3. TYPEWRITER EFFECT IN HERO
    // ==========================================================================
    const typewriterElement = document.getElementById("typewriter");
    const phrases = ["Aspiring Data Professional", "Python", "SQL", "Power BI", "Tableau"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function handleTypewriter() {
        const currentText = phrases[phraseIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Deletes faster than typing
        } else {
            typewriterElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120;
        }

        if (!isDeleting && charIndex === currentText.length) {
            // Wait at the end of word before deleting
            isDeleting = true;
            typingSpeed = 1500; 
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Delay before starting next word
        }

        setTimeout(handleTypewriter, typingSpeed);
    }

    // Begin typewriter sequence
    setTimeout(handleTypewriter, 1500);


    // ==========================================================================
    // 4. THEME-AWARE CHART.JS MANAGEMENT
    // ==========================================================================
    function getChartThemeColors(theme) {
        const isDark = theme === "dark";
        return {
            gridColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 23, 42, 0.06)",
            textColor: isDark ? "#94a3b8" : "#475569",
            radarBg: isDark ? "rgba(6, 182, 212, 0.15)" : "rgba(8, 145, 178, 0.1)",
            radarBorder: isDark ? "#06b6d4" : "#0891b2",
            radarPointColor: isDark ? "#a855f7" : "#8b5cf6",
            tooltipBg: isDark ? "#1e293b" : "#ffffff",
            tooltipBorder: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
            tooltipTextColor: isDark ? "#f8fafc" : "#0f172a"
        };
    }

    function destroyAllCharts() {
        Object.keys(charts).forEach(key => {
            if (charts[key] && typeof charts[key].destroy === "function") {
                charts[key].destroy();
            }
        });
        charts = {};
    }

    function buildAllCharts(theme) {
        destroyAllCharts();
        const colors = getChartThemeColors(theme);
        
        // Font setup
        Chart.defaults.font.family = "'Inter', sans-serif";
        Chart.defaults.font.size = 11;
        Chart.defaults.color = colors.textColor;

        // Custom tooltip options
        const tooltipConfig = {
            backgroundColor: colors.tooltipBg,
            titleColor: colors.tooltipTextColor,
            bodyColor: colors.textColor,
            borderColor: colors.tooltipBorder,
            borderWidth: 1,
            padding: 10,
            cornerRadius: 6,
            displayColors: true,
            usePointStyle: true
        };

        // --- CHART 1: Skills Radar Chart (Hero Dashboard) ---
        const radarCanvas = document.getElementById("skillsRadarChart");
        if (radarCanvas) {
            charts.radar = new Chart(radarCanvas, {
                type: "radar",
                data: {
                    labels: ["Python", "SQL", "Excel", "Power BI", "Tableau", "OOP"],
                    datasets: [{
                        label: "Skills",
                        data: [1, 1, 1, 1, 1, 1],
                        backgroundColor: colors.radarBg,
                        borderColor: colors.radarBorder,
                        borderWidth: 1.8,
                        pointBackgroundColor: colors.radarPointColor,
                        pointBorderColor: "#fff",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: colors.radarBorder,
                        pointRadius: 3.5
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: tooltipConfig
                    },
                    scales: {
                        r: {
                            angleLines: { color: colors.gridColor },
                            grid: { color: colors.gridColor },
                            pointLabels: {
                                font: { size: 10, weight: "500" },
                                color: colors.textColor
                            },
                            ticks: {
                                display: false,
                                maxTicksLimit: 4
                            },
                            suggestedMin: 50,
                            suggestedMax: 100
                        }
                    }
                }
            });
        }

        // --- CHART 3: Power BI Revenue Trend (Project 1 summary-view) ---
        const revenueCanvas = document.getElementById("pbiRevenueTrendChart");
        if (revenueCanvas) {
            const revGradient = revenueCanvas.getContext("2d").createLinearGradient(0, 0, 0, 150);
            revGradient.addColorStop(0, "rgba(242, 200, 17, 0.25)"); // Power BI Yellow
            revGradient.addColorStop(1, "rgba(242, 200, 17, 0.0)");

            charts.pbiLine = new Chart(revenueCanvas, {
                type: "line",
                data: {
                    labels: ["Q1", "Q2", "Q3", "Q4"],
                    datasets: [{
                        label: "Revenue ($)",
                        data: [480000, 590000, 680000, 700000],
                        borderColor: "#f2c811",
                        borderWidth: 2.5,
                        backgroundColor: revGradient,
                        fill: true,
                        tension: 0.35,
                        pointRadius: 4,
                        pointBackgroundColor: "#f2c811"
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: tooltipConfig
                    },
                    scales: {
                        x: { grid: { display: false }, ticks: { color: colors.textColor } },
                        y: { 
                            grid: { color: colors.gridColor }, 
                            ticks: { 
                                color: colors.textColor,
                                callback: value => `$${value / 1000}k`
                            } 
                        }
                    }
                }
            });
        }

        // --- CHART 4: Power BI Regional Distribution (Project 1 summary-view) ---
        const pieCanvas = document.getElementById("pbiRegionalPieChart");
        if (pieCanvas) {
            charts.pbiPie = new Chart(pieCanvas, {
                type: "doughnut",
                data: {
                    labels: ["North", "East", "South", "West"],
                    datasets: [{
                        data: [35, 20, 25, 20],
                        backgroundColor: [
                            "#06b6d4", // Cyan
                            "#a855f7", // Purple
                            "#f2c811", // Gold
                            "#10b981"  // Emerald
                        ],
                        borderWidth: theme === "dark" ? 2 : 1,
                        borderColor: theme === "dark" ? "#1e293b" : "#ffffff"
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: "bottom",
                            labels: {
                                boxWidth: 10,
                                padding: 10,
                                font: { size: 9 },
                                color: colors.textColor
                            }
                        },
                        tooltip: tooltipConfig
                    },
                    cutout: "60%"
                }
            });
        }

        // --- CHART 5: Power BI Customer Acquisition (Project 1 customers-view) ---
        const acquisitionCanvas = document.getElementById("pbiCustomerAcquisitionChart");
        if (acquisitionCanvas) {
            const acqGradient = acquisitionCanvas.getContext("2d").createLinearGradient(0, 0, 0, 220);
            acqGradient.addColorStop(0, "rgba(6, 182, 212, 0.2)");
            acqGradient.addColorStop(1, "rgba(168, 85, 247, 0.02)");

            charts.pbiArea = new Chart(acquisitionCanvas, {
                type: "line",
                data: {
                    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
                    datasets: [{
                        label: "Total Registrations",
                        data: [1100, 1400, 1780, 2200, 2650, 3100, 3750, 4200],
                        borderColor: "#06b6d4",
                        borderWidth: 2,
                        backgroundColor: acqGradient,
                        fill: true,
                        tension: 0.2,
                        pointRadius: 3,
                        pointBackgroundColor: "#a855f7"
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: tooltipConfig
                    },
                    scales: {
                        x: { grid: { display: false }, ticks: { color: colors.textColor } },
                        y: { grid: { color: colors.gridColor }, ticks: { color: colors.textColor } }
                    }
                }
            });
        }
    }

    // Initialize all Charts on startup
    buildAllCharts(currentTheme);


    // ==========================================================================
    // 5. ANIMATED METRICS COUNTERS
    // ==========================================================================
    function initCounters() {
        const counters = document.querySelectorAll(".counter");
        
        counters.forEach(counter => {
            const target = +counter.getAttribute("data-target");
            const duration = 1500; // Animation duration in milliseconds
            const startVal = 0;
            let startTime = null;

            function updateCounter(currentTime) {
                if (!startTime) startTime = currentTime;
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease out cubic multiplier
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                const currentVal = Math.floor(easeProgress * (target - startVal) + startVal);
                
                // Formatting specific variables
                if (counter.parentElement.classList.contains("metric-value-container") && counter.getAttribute("data-target") === "872") {
                    // Render CGPA as float (872 -> 8.72)
                    counter.textContent = (currentVal / 100).toFixed(2);
                } else {
                    counter.textContent = currentVal;
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }


    // ==========================================================================
    // 6. DETAILED PROGRESS GAUGES IN SKILLS SECTION
    // ==========================================================================
    function animateCircularGauges() {
        const gauges = document.querySelectorAll(".circular-progress-wrap");
        
        gauges.forEach(gauge => {
            const targetValue = +gauge.getAttribute("data-value");
            const color = gauge.getAttribute("data-color");
            const fgCircle = gauge.querySelector(".gauge-fg-circle");
            
            fgCircle.style.stroke = color;
            
            // stroke-dasharray = 314.16. Calculate offset
            const circumference = 314.16;
            const offset = circumference - (targetValue / 100) * circumference;
            
            // Apply transition with delay
            fgCircle.style.strokeDashoffset = offset;
        });
    }


    // ==========================================================================
    // 7. INTERACTIVE SKILL PROGRESS BARS (ON SCROLL / HOVER DECK)
    // ==========================================================================
    function animateProgressBars() {
        const skillCards = document.querySelectorAll(".skill-mini-card");
        
        skillCards.forEach(card => {
            const pct = card.getAttribute("data-skill-percentage");
            const bar = card.querySelector(".skill-bar-inner");
            if (bar) {
                bar.style.width = `${pct}%`;
            }
        });
    }


    // ==========================================================================
    // 8. DYNAMIC TABS AND SWITCHES
    // ==========================================================================
    // B) Power BI Project Dashboard Sidebar Tabs
    const pbiTabBtns = document.querySelectorAll(".pbi-side-item");
    const pbiTabPanels = document.querySelectorAll(".pbi-panel");

    pbiTabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            pbiTabBtns.forEach(b => b.classList.remove("active"));
            pbiTabPanels.forEach(p => p.classList.remove("active"));

            btn.classList.add("active");
            const targetPanel = document.getElementById(btn.getAttribute("data-tab"));
            if (targetPanel) {
                targetPanel.classList.add("active");
            }
        });
    });


    // ==========================================================================
    // 9. STICKY NAV ACTIONS & RESPONSIVE TOGGLES
    // ==========================================================================
    // A) Mobile Navigation Sidebar Menu
    const mobileNavToggle = document.getElementById("mobile-nav-toggle");
    const mobileNavbar = document.getElementById("mobile-navbar");
    const mobileLinks = document.querySelectorAll(".mobile-nav-link");

    function toggleMobileNav() {
        mobileNavToggle.classList.toggle("open");
        mobileNavbar.classList.toggle("open");
        document.body.classList.toggle("overflow-hidden"); // Stop background scrolling
    }

    mobileNavToggle.addEventListener("click", toggleMobileNav);

    mobileLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (mobileNavbar.classList.contains("open")) {
                toggleMobileNav();
            }
        });
    });

    // B) Dynamic Active Section Navigation Highlighter
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", () => {
        let currentSection = "";

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                currentSection = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href").substring(1) === currentSection) {
                link.classList.add("active");
            }
        });

        // C) Show / Hide Scroll to Top Button
        const scrollTopBtn = document.getElementById("scroll-top-btn");
        if (window.scrollY > 400) {
            scrollTopBtn.classList.add("show");
        } else {
            scrollTopBtn.classList.remove("show");
        }
    });

    // Scroll to Top Button Execution
    const scrollTopBtn = document.getElementById("scroll-top-btn");
    scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });


    // ==========================================================================
    // 10. DARK / LIGHT THEME TOGGLER
    // ==========================================================================
    const themeToggleBtn = document.getElementById("theme-toggle");

    themeToggleBtn.addEventListener("click", () => {
        currentTheme = currentTheme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", currentTheme);
        localStorage.setItem("theme", currentTheme);
        
        // Redraw and scale Chart.js configurations with new theme colors
        buildAllCharts(currentTheme);
        
        // Refresh circular gauge color schemes
        animateCircularGauges();

        // Print active node updates in hero dashboard console log
        const consoleLogBox = document.getElementById("console-logs");
        if (consoleLogBox) {
            const newLog = document.createElement("div");
            newLog.className = "log-line text-cyan";
            newLog.textContent = `> theme_manager: switched interface to ${currentTheme} mode... ok`;
            consoleLogBox.appendChild(newLog);
            consoleLogBox.scrollTop = consoleLogBox.scrollHeight;
        }
    });


    // ==========================================================================
    // 11. FORM VALIDATION & PACKET TRANSMISSION SIMULATION
    // ==========================================================================
    const form = document.getElementById("contact-form");
    const nameInput = document.getElementById("form-name");
    const emailInput = document.getElementById("form-email");
    const messageInput = document.getElementById("form-message");
    const responseBox = document.getElementById("form-response");

    // Clear error tags on input typing
    [nameInput, emailInput, messageInput].forEach(input => {
        input.addEventListener("input", () => {
            const errorSpan = document.getElementById(`${input.id}-error`);
            if (errorSpan) {
                errorSpan.style.display = "none";
            }
        });
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let isValid = true;

        // Name verification
        if (!nameInput.value.trim()) {
            document.getElementById("name-error").style.display = "block";
            isValid = false;
        }

        // Email regex verification
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
            document.getElementById("email-error").style.display = "block";
            isValid = false;
        }

        // Message verification
        if (!messageInput.value.trim()) {
            document.getElementById("message-error").style.display = "block";
            isValid = false;
        }

        if (isValid) {
            // Disable button, simulate network transmission delay
            const submitBtn = form.querySelector(".submit-btn");
            const originalBtnContent = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Encrypting Payload...';

            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fa-solid fa-signal"></i> Transmitting Packet...';
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnContent;
                    submitBtn.disabled = false;
                    
                    // Show success alert
                    responseBox.style.display = "flex";
                    
                    // Reset fields
                    form.reset();
                    
                    // Hide success message after 4 seconds
                    setTimeout(() => {
                        responseBox.style.opacity = "0";
                        setTimeout(() => {
                            responseBox.style.display = "none";
                            responseBox.style.opacity = "1";
                        }, 500);
                    }, 4000);
                }, 1200);
            }, 1000);
        }
    });

    // ==========================================================================
    // 12. AOS ANIMATION INITIALIZER
    // ==========================================================================
    function initAOS() {
        AOS.init({
            duration: 900, // Speed up animation response
            once: true,    // Run animations once when scroll loads them
            easing: "ease-out-quad",
            mirror: false
        });
    }
});
