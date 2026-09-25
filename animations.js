/**
 * NEXORA Animations Module
 * Section-specific animations, counters, fragment animations
 */
(function() {
  'use strict';

  window.NEXORA = window.NEXORA || {};

  // Problem section fragment animation
  function initProblemAnimation() {
    const fragments = document.querySelectorAll('.fragment-card');
    const observer  = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          fragments.forEach((card, i) => {
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, +card.dataset.delay || i * 80);
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });

    const problemSection = document.getElementById('problem');
    if (problemSection) observer.observe(problemSection);

    // Initial state
    fragments.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
    });
  }

  // Insight cards stagger
  function initInsightCards() {
    const grid = document.getElementById('insights-grid');
    if (!grid) return;

    grid.classList.add('stagger-children');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    observer.observe(grid);
  }

  // Hero CTA pulse after delay
  function initHeroPulse() {
    const cta = document.getElementById('hero-cta-primary');
    if (!cta) return;

    setTimeout(() => {
      cta.classList.add('glow-pulse');
    }, 3000);
  }

  // Problem solution card entrance
  function initSolutionCard() {
    const card = document.getElementById('problem-solution');
    if (!card) return;

    card.style.opacity = '0';
    card.style.transform = 'scale(0.94)';
    card.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
          observer.unobserve(card);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(card);
  }

  // Intelligence metrics animation
  function initMetricCards() {
    const cards    = document.querySelectorAll('.metric-card');
    const observer = new IntersectionObserver(entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, i * 100);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    cards.forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = `opacity 0.5s ease-out ${i * 0.08}s, transform 0.5s ease-out ${i * 0.08}s`;
      observer.observe(card);
    });
  }

  // Budget section animation
  function initBudgetAnimation() {
    const budgetSection = document.getElementById('budget');
    if (!budgetSection) return;

    const cards    = budgetSection.querySelectorAll('.budget-visual-card, .budget-breakdown-card');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          cards.forEach((c, i) => {
            setTimeout(() => {
              c.style.opacity = '1';
              c.style.transform = 'translateY(0)';
            }, i * 150);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    cards.forEach(c => {
      c.style.opacity = '0';
      c.style.transform = 'translateY(30px)';
      c.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });

    observer.observe(budgetSection);
  }

  // Reduced motion: skip all extra animations
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.addEventListener('DOMContentLoaded', () => {
      initProblemAnimation();
      initInsightCards();
      initHeroPulse();
      initSolutionCard();
    });

    // These require journey to be visible
    document.getElementById('journey-dashboard')?.addEventListener('transitionend', () => {
      initMetricCards();
      initBudgetAnimation();
    });
  }

})();
