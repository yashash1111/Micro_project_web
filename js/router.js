/**
 * ConceptLab — Computer Science Concepts Playground
 * Client-Side Router (js/router.js)
 * 
 * Manages hash-based routing (#home, #daa, #coa, #flat, #quiz, #achievements, #presentation),
 * browser history back/forward events, active link indicators, topbar breadcrumbs,
 * section teardown/cleanup hooks, and activity logging.
 */

var Router = (() => {
  'use strict';

  const VALID_ROUTES = {
    'home': {
      title: 'Home Dashboard',
      subtitle: 'Overview & Learning Hub',
      breadcrumb: 'Dashboard'
    },
    'daa': {
      title: 'Algorithm Studio (DAA)',
      subtitle: 'Binary Search Visualizer',
      breadcrumb: 'DAA Lab'
    },
    'coa': {
      title: 'Number Systems Lab (COA)',
      subtitle: 'Radix & Machine Representation',
      breadcrumb: 'COA Lab'
    },
    'flat': {
      title: 'Automata Playground (FLAT)',
      subtitle: 'DFA String Validator',
      breadcrumb: 'FLAT Lab'
    },
    'quiz': {
      title: 'Practice Arena',
      subtitle: 'Concept Knowledge Quizzes',
      breadcrumb: 'Practice Arena'
    },
    'presentation': {
      title: 'Presentation Mode',
      subtitle: 'Classroom & Viva Deck',
      breadcrumb: 'Presentation Mode'
    }
  };

  let currentRoute = null;
  let previousRoute = null;

  function init() {
    window.addEventListener('hashchange', handleHashChange);
    
    // Process initial route on load
    const hash = window.location.hash.replace('#', '').trim().toLowerCase();
    const initialRoute = VALID_ROUTES[hash] ? hash : 'home';
    navigate(initialRoute, false);

    // Global click delegate for elements with data-route
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-route]');
      if (link) {
        e.preventDefault();
        const targetRoute = link.getAttribute('data-route');
        if (targetRoute) {
          navigate(targetRoute, true);
        }
      }
    });
  }

  function handleHashChange() {
    const hash = window.location.hash.replace('#', '').trim().toLowerCase();
    const route = VALID_ROUTES[hash] ? hash : 'home';
    if (route !== currentRoute) {
      navigate(route, false);
    }
  }

  /**
   * Navigate to a designated route
   */
  function navigate(route, updateHash = true) {
    if (!VALID_ROUTES[route]) {
      route = 'home';
    }

    if (currentRoute === route) {
      return;
    }

    previousRoute = currentRoute;
    currentRoute = route;

    // Run cleanups on the route being left
    if (previousRoute && typeof Animations !== 'undefined') {
      Animations.runCleanups(previousRoute);
    }

    // Update URL hash if requested
    if (updateHash && window.location.hash !== `#${route}`) {
      window.location.hash = `#${route}`;
    }

    // Toggle active section visibility
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(sec => {
      if (sec.id === route) {
        sec.classList.add('active');
        sec.removeAttribute('hidden');
      } else {
        sec.classList.remove('active');
        sec.setAttribute('hidden', 'true');
      }
    });

    // Update active nav links across sidebar and mobile drawer
    const navLinks = document.querySelectorAll('[data-route]');
    navLinks.forEach(link => {
      const linkRoute = link.getAttribute('data-route');
      if (linkRoute === route) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });

    // Update Topbar Breadcrumb
    const breadcrumbEl = document.getElementById('topbar-breadcrumb');
    if (breadcrumbEl) {
      const info = VALID_ROUTES[route];
      breadcrumbEl.innerHTML = `
        <span class="breadcrumb-root">ConceptLab</span>
        <span class="breadcrumb-separator" aria-hidden="true">/</span>
        <span class="breadcrumb-current">${info.breadcrumb}</span>
      `;
    }

    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Close mobile drawer if open
    if (typeof App !== 'undefined' && App.closeMobileDrawer) {
      App.closeMobileDrawer();
    }

    // Record user activity in Storage (only for labs & practice to keep history genuine)
    if (typeof Storage !== 'undefined' && ['daa', 'coa', 'flat', 'quiz', 'presentation'].includes(route)) {
      const labTitles = {
        'daa': 'Algorithm Studio (DAA)',
        'coa': 'Number Systems Lab (COA)',
        'flat': 'Automata Playground (FLAT)',
        'quiz': 'Practice Arena Quizzes',
        'presentation': 'Presentation Mode'
      };
      Storage.recordActivity(route, labTitles[route] || route, 'visit');
    }

    // Notify modules of enter lifecycle hook
    notifyModuleEnter(route);

    // Refresh dashboard stats if navigating home
    if (route === 'home' && typeof App !== 'undefined' && App.refreshDashboard) {
      App.refreshDashboard();
    }
  }

  function notifyModuleEnter(route) {
    if (route === 'daa' && typeof DaaLab !== 'undefined' && DaaLab.onEnter) {
      DaaLab.onEnter();
    } else if (route === 'coa' && typeof CoaLab !== 'undefined' && CoaLab.onEnter) {
      CoaLab.onEnter();
    } else if (route === 'flat' && typeof FlatLab !== 'undefined' && FlatLab.onEnter) {
      FlatLab.onEnter();
    } else if (route === 'quiz' && typeof QuizLab !== 'undefined' && QuizLab.onEnter) {
      QuizLab.onEnter();
    } else if (route === 'presentation' && typeof PresentationMode !== 'undefined' && PresentationMode.onEnter) {
      PresentationMode.onEnter();
    }
  }

  function getCurrentRoute() {
    return currentRoute || 'home';
  }

  function getRouteInfo(route) {
    return VALID_ROUTES[route] || null;
  }

  return {
    init,
    navigate,
    getCurrentRoute,
    getRouteInfo,
    VALID_ROUTES
  };
})();
