/**
 * ConceptLab — Computer Science Concepts Playground
 * Animation Foundation (js/animations.js)
 * 
 * Centralized, performant, reduced-motion-aware animation utilities.
 * Provides rAF loop management, element microinteractions, numeric counter
 * easing, and teardown lifecycle hooks for section transitions.
 */

var Animations = (() => {
  'use strict';

  // Section cleanup registry: Map of sectionId -> Set of cleanup functions
  const cleanups = new Map();

  /**
   * Determine if user prefers reduced motion
   */
  function isReducedMotion() {
    try {
      return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  /**
   * Register a teardown function for when leaving a specific section
   */
  function registerCleanup(sectionId, cleanupFn) {
    if (typeof cleanupFn !== 'function') return;
    if (!cleanups.has(sectionId)) {
      cleanups.set(sectionId, new Set());
    }
    cleanups.get(sectionId).add(cleanupFn);
  }

  /**
   * Execute and clear all cleanups for a section
   */
  function runCleanups(sectionId) {
    if (cleanups.has(sectionId)) {
      const fns = cleanups.get(sectionId);
      fns.forEach(fn => {
        try {
          fn();
        } catch (err) {
          console.warn(`Error running cleanup for section "${sectionId}":`, err);
        }
      });
      fns.clear();
    }
  }

  /**
   * Safe requestAnimationFrame loop wrapper with explicit stop()
   */
  function requestLoop(stepFn) {
    let handle = null;
    let isRunning = true;

    function loop(timestamp) {
      if (!isRunning) return;
      const shouldContinue = stepFn(timestamp);
      if (shouldContinue !== false && isRunning) {
        handle = window.requestAnimationFrame(loop);
      } else {
        isRunning = false;
      }
    }

    handle = window.requestAnimationFrame(loop);

    return {
      stop() {
        isRunning = false;
        if (handle !== null) {
          window.cancelAnimationFrame(handle);
          handle = null;
        }
      },
      isRunning() {
        return isRunning;
      }
    };
  }

  /**
   * Pulse glow microinteraction on an element
   */
  function pulseGlow(element, glowColor = 'rgba(99, 102, 241, 0.6)', duration = 700) {
    if (!element) return;
    if (isReducedMotion()) return;

    element.style.transition = `box-shadow ${duration / 2}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    element.style.boxShadow = `0 0 25px ${glowColor}`;

    setTimeout(() => {
      element.style.boxShadow = '';
      setTimeout(() => {
        element.style.transition = '';
      }, duration / 2);
    }, duration / 2);
  }

  /**
   * Subtle shake animation for invalid inputs / rejections
   */
  function shake(element, duration = 400) {
    if (!element) return;
    if (isReducedMotion()) return;

    element.classList.add('anim-shake');
    setTimeout(() => {
      element.classList.remove('anim-shake');
    }, duration);
  }

  /**
   * Smooth numeric counter animation with easing
   */
  function animateNumber(element, start, end, duration = 600, formatter = (v) => Math.round(v)) {
    if (!element) return;

    if (isReducedMotion() || duration <= 0) {
      element.textContent = formatter(end);
      return;
    }

    const startTime = performance.now();
    const diff = end - start;

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentVal = start + diff * ease;

      element.textContent = formatter(currentVal);

      if (progress < 1) {
        window.requestAnimationFrame(update);
      } else {
        element.textContent = formatter(end);
      }
    }

    window.requestAnimationFrame(update);
  }

  /**
   * Animate a progress bar width
   */
  function animateProgressBar(barElement, targetPercent, duration = 400) {
    if (!barElement) return;
    const clamped = Math.max(0, Math.min(100, targetPercent));
    if (isReducedMotion()) {
      barElement.style.width = `${clamped}%`;
      return;
    }
    barElement.style.transition = `width ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`;
    barElement.style.width = `${clamped}%`;
  }

  return {
    isReducedMotion,
    registerCleanup,
    runCleanups,
    requestLoop,
    pulseGlow,
    shake,
    animateNumber,
    animateProgressBar
  };
})();
