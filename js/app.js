/**
 * ConceptLab — Computer Science Concepts Playground
 * Main Application Orchestrator (js/app.js)
 * 
 * Central coordinator for ConceptLab:
 * - Collapsible sidebar & mobile navigation drawer
 * - Theme management (Dark / Light with persistence)
 * - Confirmation modal for destructive data resets
 * - High-priority pop-up notifications (Green = Success, Red = Not Success)
 * - Dashboard rendering of genuine saved progress and real recent activity
 * - Technical lab and utility module lifecycle orchestration
 */

var App = (() => {
  'use strict';

  // DOM Elements Cache
  let dom = {};

  function init() {
    cacheDom();
    initTheme();
    initSound();
    initXpListener();
    initSidebar();
    initMobileNav();
    initConfirmResetModal();
    initSubjectCardClicks();

    // Initialize Router & technical modules
    if (typeof Router !== 'undefined') Router.init();
    if (typeof DaaLab !== 'undefined') DaaLab.init();
    if (typeof CoaLab !== 'undefined') CoaLab.init();
    if (typeof FlatLab !== 'undefined') FlatLab.init();
    if (typeof QuizLab !== 'undefined') QuizLab.init();
    if (typeof PresentationMode !== 'undefined') PresentationMode.init();

    // Render dashboard telemetry data
    refreshDashboard();

    // Listen to storage changes to keep dashboard reactive
    window.addEventListener('conceptlab:storage:change', () => {
      refreshDashboard();
    });

    console.log('ConceptLab — Computer Science Concepts Playground initialized successfully.');
  }

  function cacheDom() {
    dom = {
      appRoot: document.getElementById('app-root'),
      sidebar: document.getElementById('sidebar'),
      sidebarToggleBtn: document.getElementById('sidebar-toggle-btn'),
      topbar: document.getElementById('topbar'),
      hamburgerBtn: document.getElementById('hamburger-btn'),
      mobileDrawer: document.getElementById('mobile-nav-drawer'),
      drawerBackdrop: document.getElementById('drawer-backdrop'),
      themeToggleBtn: document.getElementById('theme-toggle-btn'),
      themeIcon: document.getElementById('theme-icon'),
      // Topbar XP and Audio Controls
      topbarXpBadge: document.getElementById('topbar-xp-badge'),
      topbarXpVal: document.getElementById('topbar-xp-val'),
      floatingXpContainer: document.getElementById('floating-xp-container'),
      btnSoundToggle: document.getElementById('btn-sound-toggle'),
      soundIcon: document.getElementById('sound-icon'),
      btnResetAllProgress: document.getElementById('btn-reset-all-progress'),
      confirmResetModal: document.getElementById('confirm-reset-modal'),
      btnCancelReset: document.getElementById('btn-cancel-reset'),
      btnConfirmReset: document.getElementById('btn-confirm-reset'),
      popupContainer: document.getElementById('popup-notification-container'),
      toastContainer: document.getElementById('toast-container'),
      // Dashboard Telemetry DOM
      overviewXpCount: document.getElementById('overview-xp-count'),
      overviewChallengesCount: document.getElementById('overview-challenges-count'),
      overviewQuestionsCount: document.getElementById('overview-questions-count'),
      overviewCorrectCount: document.getElementById('overview-correct-count'),
      overviewAccuracyCount: document.getElementById('overview-accuracy-count'),
      overviewStreakVal: document.getElementById('overview-streak-val'),
      overviewProgressBar: document.getElementById('overview-progress-bar'),
      overviewEmptyState: document.getElementById('overview-empty-state'),
      dashSubjectDaa: document.getElementById('dash-subject-daa'),
      dashSubjectCoa: document.getElementById('dash-subject-coa'),
      dashSubjectFlat: document.getElementById('dash-subject-flat'),
      recentActivityContainer: document.getElementById('recent-activity-container')
    };
  }

  /* --- Theme Management (Dark / Light) --- */
  function initTheme() {
    const savedTheme = (typeof Storage !== 'undefined') ? Storage.get('theme', 'dark') : 'dark';
    applyTheme(savedTheme);

    if (dom.themeToggleBtn) {
      dom.themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
        if (typeof Storage !== 'undefined') {
          Storage.set('theme', nextTheme);
        }
        showPopup({
          type: 'info',
          title: 'Theme Switched',
          message: `Switched to ${nextTheme === 'dark' ? 'Dark Mode (Default)' : 'Light Mode'}.`,
          duration: 2500
        });
      });
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    if (dom.themeIcon) {
      if (theme === 'dark') {
        // Moon icon (click to switch to light)
        dom.themeIcon.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        `;
        if (dom.themeToggleBtn) dom.themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
      } else {
        // Sun icon (click to switch to dark)
        dom.themeIcon.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        `;
        if (dom.themeToggleBtn) dom.themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
      }
    }
  }

  /* --- Web Audio API Feedback Toggle (Off by default) --- */
  function initSound() {
    const isSound = (typeof Storage !== 'undefined') ? Storage.get('soundEnabled', false) : false;
    updateSoundUI(isSound);

    if (dom.btnSoundToggle) {
      dom.btnSoundToggle.addEventListener('click', () => {
        const current = (typeof Storage !== 'undefined') ? Storage.get('soundEnabled', false) : false;
        const next = !current;
        if (typeof Storage !== 'undefined') {
          Storage.set('soundEnabled', next);
          if (next) Storage.playSound('xp');
        }
        updateSoundUI(next);
        showToast(next ? 'Sound Feedback: Enabled (Web Audio API)' : 'Sound Feedback: Muted', 'info', 2200);
      });
    }
  }

  function updateSoundUI(enabled) {
    if (!dom.btnSoundToggle) return;
    if (enabled) {
      dom.btnSoundToggle.classList.add('is-active');
      dom.btnSoundToggle.setAttribute('title', 'Sound Feedback: On (Click to Mute)');
      dom.btnSoundToggle.setAttribute('aria-label', 'Sound Feedback: On. Click to Mute.');
    } else {
      dom.btnSoundToggle.classList.remove('is-active');
      dom.btnSoundToggle.setAttribute('title', 'Sound Feedback: Off (Click to Enable)');
      dom.btnSoundToggle.setAttribute('aria-label', 'Sound Feedback: Off. Click to Enable.');
    }
  }

  /* --- Floating XP Gain Listener --- */
  function initXpListener() {
    window.addEventListener('conceptlab:xp:awarded', (e) => {
      const detail = e.detail || {};
      const amount = detail.amount || 20;
      const totalXP = detail.totalXP || 0;

      // 1. Show animated floating badge pill
      if (dom.floatingXpContainer) {
        const pill = document.createElement('div');
        pill.className = 'floating-xp-pill';
        pill.innerHTML = `<span>⚡</span> <span>+${amount} XP</span>`;
        dom.floatingXpContainer.appendChild(pill);
        setTimeout(() => {
          if (pill.parentNode) pill.remove();
        }, 1600);
      }

      // 2. Animate topbar counter
      if (dom.topbarXpVal) {
        dom.topbarXpVal.textContent = String(totalXP);
        if (typeof Animations !== 'undefined') {
          Animations.pulseElement(dom.topbarXpVal);
        }
      }

      // 3. Keep telemetry in sync
      refreshDashboard();
    });
  }

  /* --- Collapsible Desktop Sidebar --- */
  function initSidebar() {
    const isCollapsed = (typeof Storage !== 'undefined') ? Storage.get('sidebarCollapsed', false) : false;
    if (isCollapsed && dom.appRoot) {
      dom.appRoot.classList.add('sidebar-collapsed');
    }

    if (dom.sidebarToggleBtn) {
      dom.sidebarToggleBtn.addEventListener('click', () => {
        if (!dom.appRoot) return;
        dom.appRoot.classList.toggle('sidebar-collapsed');
        const nowCollapsed = dom.appRoot.classList.contains('sidebar-collapsed');
        dom.sidebarToggleBtn.setAttribute('aria-expanded', String(!nowCollapsed));
        if (typeof Storage !== 'undefined') {
          Storage.set('sidebarCollapsed', nowCollapsed);
        }
      });
    }
  }

  /* --- Mobile Navigation Drawer --- */
  function initMobileNav() {
    if (!dom.hamburgerBtn || !dom.mobileDrawer) return;

    dom.hamburgerBtn.addEventListener('click', () => {
      const isOpen = dom.mobileDrawer.classList.contains('open');
      if (isOpen) {
        closeMobileDrawer();
      } else {
        openMobileDrawer();
      }
    });

    if (dom.drawerBackdrop) {
      dom.drawerBackdrop.addEventListener('click', closeMobileDrawer);
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dom.mobileDrawer && dom.mobileDrawer.classList.contains('open')) {
        closeMobileDrawer();
      }
    });
  }

  function openMobileDrawer() {
    if (dom.mobileDrawer) dom.mobileDrawer.classList.add('open');
    if (dom.drawerBackdrop) dom.drawerBackdrop.classList.add('open');
    if (dom.hamburgerBtn) dom.hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileDrawer() {
    if (dom.mobileDrawer) dom.mobileDrawer.classList.remove('open');
    if (dom.drawerBackdrop) dom.drawerBackdrop.classList.remove('open');
    if (dom.hamburgerBtn) dom.hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  /* --- Confirmation Dialog for Destructive Actions --- */
  function initConfirmResetModal() {
    if (dom.btnResetAllProgress) {
      dom.btnResetAllProgress.addEventListener('click', () => {
        openConfirmModal();
      });
    }

    if (dom.btnCancelReset) {
      dom.btnCancelReset.addEventListener('click', closeConfirmModal);
    }

    if (dom.btnConfirmReset) {
      dom.btnConfirmReset.addEventListener('click', () => {
        if (typeof Storage !== 'undefined') {
          Storage.resetAllProgress();
        }
        closeConfirmModal();
        refreshDashboard();
        showPopup({
          type: 'success',
          title: 'Progress Reset Complete ✓',
          message: 'All learning progress, XP events, and quiz attempts have been reset to default state. Theme and sound settings were preserved.',
          duration: 4000
        });
      });
    }

    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dom.confirmResetModal && dom.confirmResetModal.classList.contains('open')) {
        closeConfirmModal();
      }
    });
  }

  function openConfirmModal() {
    if (!dom.confirmResetModal) return;
    dom.confirmResetModal.classList.add('open');
    dom.confirmResetModal.setAttribute('aria-hidden', 'false');
    if (dom.btnCancelReset) dom.btnCancelReset.focus();
  }

  function closeConfirmModal() {
    if (!dom.confirmResetModal) return;
    dom.confirmResetModal.classList.remove('open');
    dom.confirmResetModal.setAttribute('aria-hidden', 'true');
    if (dom.btnResetAllProgress) dom.btnResetAllProgress.focus();
  }

  /* --- Subject Card Click Handlers --- */
  function initSubjectCardClicks() {
    const launchButtons = document.querySelectorAll('[data-target-lab]');
    launchButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = btn.getAttribute('data-target-lab');
        if (target && typeof Router !== 'undefined') {
          Router.navigate(target, true);
        }
      });
    });
  }

  /* --- Dashboard Genuine Data Refresh --- */
  function refreshDashboard() {
    if (typeof Storage === 'undefined') return;
    const stats = Storage.getDashboardStats();

    // 1. Sync Topbar XP Value
    if (dom.topbarXpVal) {
      dom.topbarXpVal.textContent = String(stats.totalXP);
    }

    // 2. First-Time Learner Honest State Toggle
    if (dom.overviewEmptyState) {
      dom.overviewEmptyState.style.display = stats.isNewUser ? 'flex' : 'none';
    }

    // 3. Update 6 Real Telemetry Counters
    if (dom.overviewXpCount) {
      dom.overviewXpCount.textContent = String(stats.totalXP);
    }
    if (dom.overviewChallengesCount) {
      dom.overviewChallengesCount.textContent = `${stats.completedChallengesCount} / 3`;
    }
    if (dom.overviewQuestionsCount) {
      dom.overviewQuestionsCount.textContent = String(stats.questionsAttempted);
    }
    if (dom.overviewCorrectCount) {
      dom.overviewCorrectCount.textContent = String(stats.correctAnswers);
    }
    if (dom.overviewAccuracyCount) {
      dom.overviewAccuracyCount.textContent = `${stats.accuracy}%`;
    }
    if (dom.overviewStreakVal) {
      dom.overviewStreakVal.textContent = String(stats.streak);
    }

    // 4. Update Subject Completion Status Pills
    if (dom.dashSubjectDaa) {
      if (stats.subjectStatus.daa) {
        dom.dashSubjectDaa.classList.add('is-complete');
        const stateEl = dom.dashSubjectDaa.querySelector('.pill-state');
        if (stateEl) stateEl.textContent = 'Completed ✓';
      } else {
        dom.dashSubjectDaa.classList.remove('is-complete');
        const stateEl = dom.dashSubjectDaa.querySelector('.pill-state');
        if (stateEl) stateEl.textContent = 'Not Started';
      }
    }
    if (dom.dashSubjectCoa) {
      if (stats.subjectStatus.coa) {
        dom.dashSubjectCoa.classList.add('is-complete');
        const stateEl = dom.dashSubjectCoa.querySelector('.pill-state');
        if (stateEl) stateEl.textContent = 'Completed ✓';
      } else {
        dom.dashSubjectCoa.classList.remove('is-complete');
        const stateEl = dom.dashSubjectCoa.querySelector('.pill-state');
        if (stateEl) stateEl.textContent = 'Not Started';
      }
    }
    if (dom.dashSubjectFlat) {
      if (stats.subjectStatus.flat) {
        dom.dashSubjectFlat.classList.add('is-complete');
        const stateEl = dom.dashSubjectFlat.querySelector('.pill-state');
        if (stateEl) stateEl.textContent = 'Completed ✓';
      } else {
        dom.dashSubjectFlat.classList.remove('is-complete');
        const stateEl = dom.dashSubjectFlat.querySelector('.pill-state');
        if (stateEl) stateEl.textContent = 'Not Started';
      }
    }

    // 5. Overall Workbench Coverage Progress Bar
    if (dom.overviewProgressBar) {
      const pct = Math.min(100, Math.round((stats.completedChallengesCount / 3) * 100));
      if (typeof Animations !== 'undefined') {
        Animations.animateProgressBar(dom.overviewProgressBar, pct);
      } else {
        dom.overviewProgressBar.style.width = `${pct}%`;
      }
    }

    // 6. Update Genuine Recent Activity Feed
    if (dom.recentActivityContainer) {
      const activities = Storage.getRecentActivity(6);
      if (activities.length === 0) {
        // Honest instructional empty state
        dom.recentActivityContainer.innerHTML = `
          <div class="empty-activity-card">
            <div class="empty-icon-pill" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h4 class="empty-activity-title">No Recent Activity Recorded</h4>
            <p class="empty-activity-desc">
              Your real learning history will appear here as you interact with the Algorithm Studio, Number Systems Lab, or Automata Playground.
            </p>
            <button class="btn btn-primary btn-sm" type="button" data-route="daa">
              <span>Start Learning in DAA Lab</span>
            </button>
          </div>
        `;
      } else {
        let html = '<ul class="recent-activity-list">';
        activities.forEach(act => {
          const dateStr = formatRelativeTime(act.timestamp);
          const icon = getActivityIcon(act.labId);
          html += `
            <li class="activity-item">
              <div class="activity-icon-badge ${act.labId}">${icon}</div>
              <div class="activity-details">
                <strong class="activity-title">${act.title}</strong>
                <span class="activity-time">${dateStr}</span>
              </div>
              <button class="btn btn-outline btn-xs activity-jump-btn" type="button" data-route="${act.labId}">
                <span>Launch</span>
              </button>
            </li>
          `;
        });
        html += '</ul>';
        dom.recentActivityContainer.innerHTML = html;
      }
    }
  }

  /* --- Achievements Section Refresh (Stub - slide removed) --- */
  function refreshAchievements() {
    // Achievements view removed by request
  }

  function getActivityIcon(labId) {
    if (labId === 'daa') {
      return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`;
    } else if (labId === 'coa') {
      return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect></svg>`;
    } else if (labId === 'flat') {
      return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="6" r="3"></circle><circle cx="18" cy="18" r="3"></circle></svg>`;
    } else if (labId === 'quiz') {
      return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>`;
    }
    return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`;
  }

  function formatRelativeTime(timestamp) {
    if (!timestamp) return 'Just now';
    const elapsedSeconds = Math.floor((Date.now() - timestamp) / 1000);
    if (elapsedSeconds < 60) return 'Just now';
    const minutes = Math.floor(elapsedSeconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }

  /* --- Global Pop-up Notification System ---
   * Displays modal-grade animated notification banners at top-center:
   * - GREEN indicates SUCCESS (e.g. Target Found, DFA Accepted, Valid Conversion)
   * - RED indicates NOT SUCCESS / ERROR (e.g. Target Absent, DFA Rejected, Unsorted Array)
   * Includes animated SVG icons, telemetry badges, and shrinking countdown progress bar.
   */
  function showPopup(options) {
    if (!options) return;
    const {
      type = 'success', // 'success' (green), 'error' (red), 'info'
      title = (type === 'success' ? 'Action Succeeded' : 'Action Failed'),
      message = '',
      badges = [],
      duration = 4500
    } = options;

    let container = document.getElementById('popup-notification-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'popup-notification-container';
      container.className = 'popup-notification-container';
      container.setAttribute('aria-live', 'assertive');
      container.setAttribute('role', 'region');
      document.body.prepend(container);
    }

    // Force top-right placement below navbar inline to override any stale browser caches
    container.style.position = 'fixed';
    container.style.top = '72px';
    container.style.right = '18px';
    container.style.left = 'auto';
    container.style.bottom = 'auto';
    container.style.transform = 'none';
    container.style.zIndex = '999999';
    container.style.maxWidth = '360px';
    container.style.minWidth = '280px';
    container.style.width = 'auto';
    container.style.pointerEvents = 'none';

    // Dismiss existing popup so they don't stack up awkwardly
    const existingPopups = container.querySelectorAll('.popup-notification');
    existingPopups.forEach(p => dismissPopup(p));

    const popup = document.createElement('div');
    popup.className = `popup-notification popup-${type}`;
    popup.setAttribute('role', type === 'error' ? 'alert' : 'status');
    popup.style.pointerEvents = 'auto';
    popup.style.maxWidth = '360px';
    popup.style.width = '100%';
    popup.style.boxSizing = 'border-box';

    // Icon generation with animations (compact 12x12 SVG)
    let iconHtml = '';
    if (type === 'success') {
      iconHtml = `
        <div class="popup-icon-wrapper success" aria-hidden="true">
          <svg class="popup-svg-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path class="circle-check-path" d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline class="check-tick-path" points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
      `;
    } else if (type === 'error') {
      iconHtml = `
        <div class="popup-icon-wrapper error" aria-hidden="true">
          <svg class="popup-svg-icon alert-shake" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
      `;
    } else {
      iconHtml = `
        <div class="popup-icon-wrapper info" aria-hidden="true">
          <svg class="popup-svg-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </div>
      `;
    }

    // Badges strip
    let badgesHtml = '';
    if (Array.isArray(badges) && badges.length > 0) {
      badgesHtml = `
        <div class="popup-badges-strip">
          ${badges.map(b => {
            if (typeof b === 'object' && b.label && b.value !== undefined) {
              return `<span class="popup-badge-item"><strong class="popup-badge-label">${b.label}:</strong> <span class="popup-badge-value">${b.value}</span></span>`;
            }
            return `<span class="popup-badge-item">${b}</span>`;
          }).join('')}
        </div>
      `;
    }

    popup.innerHTML = `
      <div class="popup-body">
        ${iconHtml}
        <div class="popup-content">
          <div class="popup-header-row">
            <h4 class="popup-title">${title}</h4>
            <button class="popup-close-btn" type="button" aria-label="Dismiss notification">&times;</button>
          </div>
          ${message ? `<p class="popup-message">${message}</p>` : ''}
          ${badgesHtml}
        </div>
      </div>
      <div class="popup-progress-track">
        <div class="popup-progress-fill" style="animation-duration: ${duration}ms;"></div>
      </div>
    `;

    container.appendChild(popup);

    // Close button click
    const closeBtn = popup.querySelector('.popup-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => dismissPopup(popup));
    }

    // Auto-dismiss countdown with pause on hover
    let remainingTime = duration;
    let startTime = Date.now();
    let dismissTimeout = setTimeout(() => dismissPopup(popup), duration);

    popup.addEventListener('mouseenter', () => {
      clearTimeout(dismissTimeout);
      remainingTime -= (Date.now() - startTime);
      const fillBar = popup.querySelector('.popup-progress-fill');
      if (fillBar) fillBar.style.animationPlayState = 'paused';
    });

    popup.addEventListener('mouseleave', () => {
      startTime = Date.now();
      const fillBar = popup.querySelector('.popup-progress-fill');
      if (fillBar) fillBar.style.animationPlayState = 'running';
      dismissTimeout = setTimeout(() => dismissPopup(popup), Math.max(remainingTime, 1000));
    });

    return popup;
  }

  function dismissPopup(popup) {
    if (!popup || !popup.parentNode) return;
    popup.classList.add('dismissing');
    popup.style.opacity = '0';
    popup.style.transform = 'translateY(-16px) scale(0.96)';
    popup.style.transition = 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)';
    setTimeout(() => {
      if (popup.parentNode) popup.remove();
    }, 250);
  }

  /* --- Global Toast Notifications (Secondary Lightweight) --- */
  function showToast(message, type = 'info', duration = 3000) {
    if (!dom.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg class="toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg class="toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    } else {
      iconSvg = `<svg class="toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    dom.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, duration);
  }

  // Self-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    init,
    showPopup,
    showToast,
    closeMobileDrawer,
    refreshDashboard,
    refreshAchievements
  };
})();
