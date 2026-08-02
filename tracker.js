/* ===== LEOPARD SECURITY FORCE — VISITOR TRACKER, REVIEW POPUP, FLOATING CTA & AI ASSISTANT ===== */

(function () {
  'use strict';

  /* ========================================
     CONFIGURATION
     ======================================== */
  const CONFIG = {
    // googleReviewURL: Change this to your Google Business Review link
    googleReviewURL: 'https://search.google.com/local/writereview?placeid=YOUR_GOOGLE_PLACE_ID',

    // Popup delay (in seconds)
    reviewPopupDelay: 5.0,

    // Admin password
    adminPassword: 'leopard@2026',

    // Cooldown days (set to 0 for instant testing popup)
    popupCooldownDays: 7,

    // Contact link info
    phoneNumber: '+918657260511',
    whatsappNumber: '+918657260511',

    // Storage keys
    VISITORS_KEY: 'lsf_visitors',
    REVIEWS_KEY: 'lsf_reviews',
    POPUP_DISMISSED_KEY: 'lsf_popup_dismissed'
  };

  /* ========================================
     1. VISITORS LOGGER
     ======================================== */
  async function trackVisitor() {
    const visitorData = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      localTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      page: window.location.href,
      referrer: document.referrer || 'Direct',
      userAgent: navigator.userAgent,
      browser: detectBrowser(),
      os: detectOS(),
      device: detectDevice(),
      screenResolution: `${screen.width}x${screen.height}`,
      windowSize: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language,
      cookiesEnabled: navigator.cookieEnabled,
      platform: navigator.platform,
      ip: 'Fetching...',
      city: '',
      region: '',
      country: '',
      isp: ''
    };

    try {
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        const geo = await response.json();
        visitorData.ip = geo.ip || 'Unknown';
        visitorData.city = geo.city || '';
        visitorData.region = geo.region || '';
        visitorData.country = geo.country_name || '';
        visitorData.isp = geo.org || '';
      }
    } catch (err) {
      visitorData.ip = 'Unavailable';
    }

    const visitors = getStoredData(CONFIG.VISITORS_KEY);
    visitors.push(visitorData);
    localStorage.setItem(CONFIG.VISITORS_KEY, JSON.stringify(visitors));
  }

  /* ========================================
     2. REVIEW / RATING POPUP (NO EMOJIS OR TEXT SYMBOLS)
     ======================================== */
  function initReviewPopup() {
    return; // Disabled automatic popup
  }

  function showReviewPopup() {
    if (document.getElementById('lsf-review-popup')) return;

    const overlay = document.createElement('div');
    overlay.id = 'lsf-review-popup';
    overlay.innerHTML = `
      <div class="lsf-popup-overlay">
        <div class="lsf-popup-card">
          <button class="lsf-popup-close" id="lsfPopupClose" aria-label="Close">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          
          <div class="lsf-popup-header">
            <img src="images/logo.png" alt="Leopard Security Logo" style="height: 55px; width: auto; object-fit: contain; margin-bottom: 12px; display: block; margin-left: auto; margin-right: auto;">
            <h3>Rate Our Security Service</h3>
            <p>Please share your rating to automatically update our Google Review profile</p>
          </div>

          <form id="lsfReviewForm" class="lsf-popup-form">
            <!-- SVG Star Rating -->
            <div class="lsf-stars-container">
              <div class="lsf-stars" id="lsfStars">
                <!-- Star 1 -->
                <span class="lsf-star" data-rating="1">
                  <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                </span>
                <!-- Star 2 -->
                <span class="lsf-star" data-rating="2">
                  <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                </span>
                <!-- Star 3 -->
                <span class="lsf-star" data-rating="3">
                  <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                </span>
                <!-- Star 4 -->
                <span class="lsf-star" data-rating="4">
                  <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                </span>
                <!-- Star 5 -->
                <span class="lsf-star" data-rating="5">
                  <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                </span>
              </div>
              <p class="lsf-rating-text" id="lsfRatingText">Tap stars to add your rating</p>
            </div>

            <input type="hidden" id="lsfRating" value="0">

            <div class="lsf-form-row">
              <input type="text" id="lsfName" placeholder="Your Name" required>
              <input type="tel" id="lsfPhone" placeholder="Phone Number" required>
            </div>
            <input type="email" id="lsfEmail" placeholder="Email Address (Optional)">
            <textarea id="lsfComment" placeholder="Detailed feedback (Optional)" rows="2"></textarea>

            <div class="lsf-popup-buttons">
              <button type="submit" class="lsf-btn-submit" id="lsfSubmitReview">
                Submit Review
              </button>
            </div>
          </form>

          <!-- Success State -->
          <div class="lsf-popup-success" id="lsfPopupSuccess" style="display:none;">
            <div class="lsf-success-icon" style="color: #4CAF50;">
              <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto 12px; display: block;"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3>Thank You</h3>
            <p>Your rating has been saved. We are forwarding you to Google reviews to instantly update the profile...</p>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.querySelector('.lsf-popup-overlay').classList.add('active');
    });

    setupPopupEvents(overlay);
  }

  function setupPopupEvents(overlay) {
    const stars = overlay.querySelectorAll('.lsf-star');
    const ratingText = document.getElementById('lsfRatingText');
    const ratingTexts = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

    stars.forEach(star => {
      star.addEventListener('mouseenter', () => {
        const val = parseInt(star.dataset.rating);
        highlightStars(stars, val);
      });

      star.addEventListener('click', () => {
        const val = parseInt(star.dataset.rating);
        document.getElementById('lsfRating').value = val;
        highlightStars(stars, val);
        ratingText.textContent = ratingTexts[val];
        ratingText.style.color = val >= 4 ? '#4CAF50' : val >= 3 ? '#FFC107' : '#e60012';

        // Auto actions on clicking rating
        if (val >= 4) {
          // Immediately show a prompt or just let them complete details.
          // To auto update Google, let's keep details available, or let submit button auto-trigger.
        }
      });
    });

    const starsContainer = document.getElementById('lsfStars');
    starsContainer.addEventListener('mouseleave', () => {
      const current = parseInt(document.getElementById('lsfRating').value);
      highlightStars(stars, current);
    });

    document.getElementById('lsfPopupClose').addEventListener('click', () => {
      closePopup(overlay);
    });

    overlay.querySelector('.lsf-popup-overlay').addEventListener('click', (e) => {
      if (e.target.classList.contains('lsf-popup-overlay')) {
        closePopup(overlay);
      }
    });

    document.getElementById('lsfReviewForm').addEventListener('submit', (e) => {
      e.preventDefault();
      submitReview(overlay);
    });
  }

  function highlightStars(stars, count) {
    stars.forEach(star => {
      const val = parseInt(star.dataset.rating);
      star.classList.toggle('active', val <= count);
    });
  }

  function submitReview(overlay) {
    const rating = parseInt(document.getElementById('lsfRating').value);
    const name = document.getElementById('lsfName').value.trim();
    const phone = document.getElementById('lsfPhone').value.trim();
    const email = document.getElementById('lsfEmail').value.trim();
    const comment = document.getElementById('lsfComment').value.trim();

    if (rating === 0) {
      document.getElementById('lsfRatingText').textContent = 'Please choose a rating level first';
      document.getElementById('lsfRatingText').style.color = '#e60012';
      return;
    }

    const review = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      localTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      rating,
      name,
      phone,
      email,
      comment
    };

    const reviews = getStoredData(CONFIG.REVIEWS_KEY);
    reviews.push(review);
    localStorage.setItem(CONFIG.REVIEWS_KEY, JSON.stringify(reviews));

    // Show success view
    document.getElementById('lsfReviewForm').style.display = 'none';
    document.getElementById('lsfPopupSuccess').style.display = 'block';

    // Auto-redirect to Google Reviews after 1.5 seconds to finalize rating
    setTimeout(() => {
      window.open(CONFIG.googleReviewURL, '_blank');
      closePopup(overlay);
    }, 1500);
  }

  function closePopup(overlay) {
    overlay.querySelector('.lsf-popup-overlay').classList.remove('active');
    localStorage.setItem(CONFIG.POPUP_DISMISSED_KEY, new Date().toISOString());
    setTimeout(() => overlay.remove(), 400);
  }



  function setupChatEvents() {
    const aiBtn = document.getElementById('lsfAiBtn');
    const chatWindow = document.getElementById('lsfChatWindow');
    const chatClose = document.getElementById('lsfChatClose');
    const chatOptions = document.getElementById('lsfChatOptions');
    const inputForm = document.getElementById('lsfChatInputForm');
    const inputField = document.getElementById('lsfChatInput');
    const messagesContainer = document.getElementById('lsfChatMessages');

    // Toggle chat window
    aiBtn.addEventListener('click', () => {
      chatWindow.classList.add('active');
      aiBtn.classList.add('hidden');
    });

    chatClose.addEventListener('click', () => {
      chatWindow.classList.remove('active');
      aiBtn.classList.remove('hidden');
    });

    // Handle Quick Options
    chatOptions.addEventListener('click', (e) => {
      if (e.target.classList.contains('lsf-chat-opt')) {
        const action = e.target.dataset.action;
        const text = e.target.textContent;

        appendMessage('user', text);
        chatOptions.style.display = 'none';

        showTypingIndicator();

        setTimeout(() => {
          removeTypingIndicator();
          let reply = '';
          if (action === 'quote') {
            reply = 'We provide custom quotes for commercial, event, residential, and VIP protection. Please let me know your required guard type, quantity, and shifts. You can also submit this in our main form at the bottom of the page.';
          } else if (action === 'armed') {
            reply = 'Our armed protection agents are high-grade tactical officers for critical security needs. To deploy them instantly, dial +91 86572 60511.';
          } else if (action === 'emergency') {
            reply = 'Red Alert emergency response teams are available 24/7. Call our emergency direct link +91 86572 60511 immediately. Dispatch will respond in minutes.';
          } else if (action === 'service') {
            reply = 'Leopard Security specializes in: 1. Armed guards, 2. CCTV monitoring rooms, 3. Event group patrol, and 4. Personal VIP bodyguards. Contact us for details.';
          }
          appendMessage('bot', reply);
          appendOptions();
        }, 1000);
      }
    });

    // Custom text submit
    inputForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = inputField.value.trim();
      if (!val) return;

      appendMessage('user', val);
      inputField.value = '';
      chatOptions.style.display = 'none';

      showTypingIndicator();

      setTimeout(() => {
        removeTypingIndicator();
        const reply = getAIResponse(val);
        appendMessage('bot', reply);
        appendOptions();
      }, 1000);
    });

    function appendMessage(sender, text) {
      const msg = document.createElement('div');
      msg.className = `lsf-chat-msg ${sender}`;
      msg.innerHTML = `<div class="lsf-msg-bubble">${escapeHTML(text)}</div>`;
      messagesContainer.appendChild(msg);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function showTypingIndicator() {
      const indicator = document.createElement('div');
      indicator.className = 'lsf-chat-msg bot lsf-typing-indicator';
      indicator.id = 'lsfTyping';
      indicator.innerHTML = `
        <div class="lsf-msg-bubble" style="padding: 10px 14px;">
          <div class="lsf-typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      `;
      messagesContainer.appendChild(indicator);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function removeTypingIndicator() {
      const indicator = document.getElementById('lsfTyping');
      if (indicator) indicator.remove();
    }

    function appendOptions() {
      // Remove old choices if any
      const existingOptions = document.getElementById('lsfChatOptions');
      if (existingOptions) existingOptions.remove();

      const optionsDiv = document.createElement('div');
      optionsDiv.className = 'lsf-chat-options';
      optionsDiv.id = 'lsfChatOptions';
      optionsDiv.innerHTML = `
        <button class="lsf-chat-opt" data-action="quote">Get Instant Quote</button>
        <button class="lsf-chat-opt" data-action="armed">Armed Security Info</button>
        <button class="lsf-chat-opt" data-action="emergency">Emergency Hotline</button>
        <button class="lsf-chat-opt" data-action="service">Standard Services</button>
      `;
      messagesContainer.appendChild(optionsDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  function getAIResponse(query) {
    const q = query.toLowerCase();

    if (q.includes('quote') || q.includes('price') || q.includes('cost') || q.includes('rate')) {
      return 'To design an accurate pricing layout, please state the site location, duration, and number of security guards you require. We can draft an offer shortly.';
    }
    if (q.includes('armed') || q.includes('gun') || q.includes('weapon') || q.includes('protection')) {
      return 'Our armed units are fully certified defense experts. They handle cash transport, executive safety, and critical facility assets. Call +91 86572 60511 for deployment.';
    }
    if (q.includes('job') || q.includes('hiring') || q.includes('join') || q.includes('career')) {
      return 'We are actively expanding our security squads. If you are qualified, please email your profile to careers@leopardsecurity.com.';
    }
    if (q.includes('emergency') || q.includes('danger') || q.includes('help')) {
      return 'For immediate security breaches, call our Red Alert response desk at +91 86572 60511. Our emergency units are standing by.';
    }
    if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
      return 'Hello! I am ready to details your security requirements. What safety queries can I assist you with today?';
    }

    return 'Thank you. The safety of your assets is our prime objective. You can leave your contact info in our form below or speak to our desk directly at +91 86572 60511 for prompt assistance.';
  }

  /* ========================================
     4. ADMIN CONTROL CODES (CTRL+SHIFT+L)
     ======================================== */
  function initAdminShortcut() {
    let keys = {};
    document.addEventListener('keydown', (e) => {
      keys[e.key] = true;
      if (keys['Control'] && keys['Shift'] && (keys['L'] || keys['l'])) {
        e.preventDefault();
        promptAdminLogin();
        keys = {};
      }
    });
    document.addEventListener('keyup', (e) => {
      delete keys[e.key];
    });
  }

  function promptAdminLogin() {
    const pwd = prompt('Enter Admin Password:');
    if (pwd === CONFIG.adminPassword) {
      showAdminPanel();
    } else if (pwd !== null) {
      alert('Incorrect password');
    }
  }

  function showAdminPanel() {
    const existing = document.getElementById('lsf-admin-panel');
    if (existing) existing.remove();

    const visitors = getStoredData(CONFIG.VISITORS_KEY);
    const reviews = getStoredData(CONFIG.REVIEWS_KEY);

    const avgRating = reviews.length ?
      (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '0';

    const panel = document.createElement('div');
    panel.id = 'lsf-admin-panel';
    panel.innerHTML = `
      <div class="lsf-admin-overlay">
        <div class="lsf-admin-container">
          <div class="lsf-admin-header">
            <div>
              <h2>LEOPARD ADMIN PANEL</h2>
              <p>Visitor and Review Management Console</p>
            </div>
            <button class="lsf-admin-close" id="lsfAdminClose" aria-label="Close">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <!-- Number Stats Dashboard -->
          <div class="lsf-admin-stats">
            <div class="lsf-stat-card">
              <h3>${visitors.length}</h3>
              <p>Total Visitors</p>
            </div>
            <div class="lsf-stat-card">
              <h3>${reviews.length}</h3>
              <p>Reviews Captured</p>
            </div>
            <div class="lsf-stat-card">
              <h3>${avgRating} Stars</h3>
              <p>Average Score</p>
            </div>
            <div class="lsf-stat-card">
              <h3>${reviews.filter(r => r.rating >= 4).length}</h3>
              <p>Happy Clients</p>
            </div>
          </div>

          <!-- View Switch Tabs -->
          <div class="lsf-admin-tabs">
            <button class="lsf-tab active" data-tab="visitors">Visitors List (${visitors.length})</button>
            <button class="lsf-tab" data-tab="reviews">Reviews List (${reviews.length})</button>
          </div>

          <!-- Visitor Contents -->
          <div class="lsf-tab-content active" id="tab-visitors">
            <div class="lsf-admin-actions">
              <input type="text" class="lsf-search" id="lsfSearchVisitors" placeholder="Search visitors...">
              <button class="lsf-export-btn" id="lsfExportVisitors">Export CSV</button>
              <button class="lsf-clear-btn" id="lsfClearVisitors">Clear All</button>
            </div>
            <div class="lsf-table-wrap">
              <table class="lsf-table" id="lsfVisitorTable">
                <thead>
                  <tr>
                    <th>Num</th>
                    <th>Date Time</th>
                    <th>IP String</th>
                    <th>Location Details</th>
                    <th>Device</th>
                    <th>Browser</th>
                    <th>OS</th>
                    <th>Screen</th>
                  </tr>
                </thead>
                <tbody>
                  ${visitors.length === 0 ? '<tr><td colspan="8" style="text-align:center;padding:30px;color:#888;">No visitors tracked</td></tr>' : ''}
                  ${visitors.slice().reverse().map((v, i) => `
                    <tr>
                      <td>${visitors.length - i}</td>
                      <td>${v.localTime || new Date(v.timestamp).toLocaleString()}</td>
                      <td><code>${v.ip}</code></td>
                      <td>${[v.city, v.region, v.country].filter(Boolean).join(', ') || 'Unknown'}</td>
                      <td>${v.device || 'Unknown'}</td>
                      <td>${v.browser || 'Unknown'}</td>
                      <td>${v.os || 'Unknown'}</td>
                      <td>${v.screenResolution || ''}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Review Contents -->
          <div class="lsf-tab-content" id="tab-reviews">
            <div class="lsf-admin-actions">
              <input type="text" class="lsf-search" id="lsfSearchReviews" placeholder="Search reviews...">
              <button class="lsf-export-btn" id="lsfExportReviews">Export CSV</button>
              <button class="lsf-clear-btn" id="lsfClearReviews">Clear All</button>
            </div>
            <div class="lsf-table-wrap">
              <table class="lsf-table" id="lsfReviewTable">
                <thead>
                  <tr>
                    <th>Num</th>
                    <th>Date Time</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Score</th>
                    <th>Feedback Text</th>
                  </tr>
                </thead>
                <tbody>
                  ${reviews.length === 0 ? '<tr><td colspan="7" style="text-align:center;padding:30px;color:#888;">No reviews yet</td></tr>' : ''}
                  ${reviews.slice().reverse().map((r, i) => `
                    <tr>
                      <td>${reviews.length - i}</td>
                      <td>${r.localTime || new Date(r.timestamp).toLocaleString()}</td>
                      <td><strong>${escapeHTML(r.name)}</strong></td>
                      <td>${escapeHTML(r.phone)}</td>
                      <td>${escapeHTML(r.email || 'None')}</td>
                      <td>${r.rating} Stars</td>
                      <td style="max-width:250px;">${escapeHTML(r.comment || 'None')}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(panel);
    requestAnimationFrame(() => {
      panel.querySelector('.lsf-admin-overlay').classList.add('active');
    });

    setupAdminEvents(panel);
  }

  function setupAdminEvents(panel) {
    document.getElementById('lsfAdminClose').addEventListener('click', () => {
      panel.querySelector('.lsf-admin-overlay').classList.remove('active');
      setTimeout(() => panel.remove(), 400);
    });

    panel.querySelectorAll('.lsf-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        panel.querySelectorAll('.lsf-tab').forEach(t => t.classList.remove('active'));
        panel.querySelectorAll('.lsf-tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
      });
    });

    document.getElementById('lsfSearchVisitors').addEventListener('input', (e) => {
      searchTable('lsfVisitorTable', e.target.value);
    });

    document.getElementById('lsfSearchReviews').addEventListener('input', (e) => {
      searchTable('lsfReviewTable', e.target.value);
    });

    document.getElementById('lsfExportVisitors').addEventListener('click', () => {
      const visitors = getStoredData(CONFIG.VISITORS_KEY);
      const headers = ['Number', 'Timestamp', 'IP', 'City', 'Region', 'Country', 'ISP', 'Device', 'Browser', 'OS', 'Screen', 'Referrer'];
      const rows = visitors.map((v, i) => [
        i + 1, v.localTime || v.timestamp, v.ip, v.city, v.region, v.country, v.isp, v.device, v.browser, v.os, v.screenResolution, v.referrer
      ]);
      downloadCSV('leopard_visitors.csv', headers, rows);
    });

    document.getElementById('lsfExportReviews').addEventListener('click', () => {
      const reviews = getStoredData(CONFIG.REVIEWS_KEY);
      const headers = ['Number', 'Timestamp', 'Name', 'Phone', 'Email', 'Rating', 'Comment'];
      const rows = reviews.map((r, i) => [
        i + 1, r.localTime || r.timestamp, r.name, r.phone, r.email, r.rating, r.comment
      ]);
      downloadCSV('leopard_reviews.csv', headers, rows);
    });

    document.getElementById('lsfClearVisitors').addEventListener('click', () => {
      if (confirm('Delete all visitor records?')) {
        localStorage.removeItem(CONFIG.VISITORS_KEY);
        showAdminPanel();
      }
    });

    document.getElementById('lsfClearReviews').addEventListener('click', () => {
      if (confirm('Delete all review records?')) {
        localStorage.removeItem(CONFIG.REVIEWS_KEY);
        showAdminPanel();
      }
    });
  }

  /* ========================================
     HELPERS
     ======================================== */
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
  }

  function getStoredData(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch { return []; }
  }

  function detectBrowser() {
    const ua = navigator.userAgent;
    if (ua.includes('Edg/')) return 'Edge';
    if (ua.includes('OPR/') || ua.includes('Opera')) return 'Opera';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    return 'Browser';
  }

  function detectOS() {
    const ua = navigator.userAgent;
    if (ua.includes('Windows NT 10')) return 'Windows 10/11';
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac OS')) return 'macOS';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
    if (ua.includes('Linux')) return 'Linux';
    return 'OS';
  }

  function detectDevice() {
    const ua = navigator.userAgent;
    if (/Mobi|Android|iPhone|iPad/i.test(ua)) {
      if (/iPad|Tablet/i.test(ua)) return 'Tablet';
      return 'Mobile';
    }
    return 'Desktop';
  }

  function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function searchTable(tableId, query) {
    const rows = document.querySelectorAll(`#${tableId} tbody tr`);
    const q = query.toLowerCase();
    rows.forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  }

  function downloadCSV(filename, headers, rows) {
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(',') + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  /* ========================================
     BOOTSTRAP
     ======================================== */
  document.addEventListener('DOMContentLoaded', () => {
    trackVisitor();
    initReviewPopup();
    setupChatEvents();
    initAdminShortcut();
  });

})();


function initFooterInteractions() {
  const backToTopBtn = document.getElementById('backToTop');
  const footerSubscribeForm = document.getElementById('footerSubscribeForm');
  const footerMobileNumber = document.getElementById('footerMobileNumber');
  const footerSuccessMessage = document.getElementById('footerSuccessMessage');

  function updateBackToTopVisibility() {
    if (!backToTopBtn) return;
    if (window.scrollY > 320) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  if (backToTopBtn) {
    window.addEventListener('scroll', updateBackToTopVisibility);
    updateBackToTopVisibility();

    backToTopBtn.addEventListener('click', (event) => {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  if (footerSubscribeForm && footerMobileNumber && footerSuccessMessage) {
    footerSubscribeForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const mobileValue = footerMobileNumber.value.trim();
      const mobilePattern = /^[6-9][0-9]{9}$/;

      if (!mobilePattern.test(mobileValue)) {
        footerMobileNumber.setCustomValidity('Please enter a valid 10-digit Indian mobile number.');
        footerMobileNumber.reportValidity();
        return;
      }

      footerMobileNumber.setCustomValidity('');
      footerSubscribeForm.reset();
      footerSuccessMessage.style.display = 'block';

      setTimeout(() => {
        footerSuccessMessage.style.display = 'none';
      }, 5000);
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFooterInteractions);
} else {
  initFooterInteractions();
}



// Clean star animations managed via CSS and Canvas