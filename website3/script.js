(function() {
  'use strict';

  // == Scroll Reveal Animations ==
  const revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var delay = entry.target.getAttribute('data-delay');
        if (delay) {
          entry.target.style.transitionDelay = delay + 'ms';
        }
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  document.querySelectorAll('.reveal').forEach(function(el) {
    revealObserver.observe(el);
  });

  // == Active Navigation Highlighting ==
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-links a');

  var sectionObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var id = entry.target.id;
        navLinks.forEach(function(link) {
          var href = link.getAttribute('href');
          if (href === '#' + id) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    threshold: 0.35,
    rootMargin: '-80px 0px -50% 0px'
  });

  sections.forEach(function(section) {
    sectionObserver.observe(section);
  });

  // == Smooth Scroll for Nav Links ==
  document.querySelectorAll('nav a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      var targetId = this.getAttribute('href');
      var target = document.querySelector(targetId);
      if (target) {
        var navHeight = document.getElementById('navbar').offsetHeight;
        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
      // Close mobile menu if open
      closeMobileMenu();
    });
  });

  // == Scroll Indicator Fade ==
  var scrollIndicator = document.getElementById('scroll-indicator');
  var faded = false;

  window.addEventListener('scroll', function() {
    if (!faded && window.scrollY > 100) {
      scrollIndicator.classList.add('fade-out');
      faded = true;
    }
  }, { passive: true });

  // == Gallery Carousel ==
  var gallery = document.getElementById('gallery-scroll');
  var prevBtn = document.querySelector('.gallery-prev');
  var nextBtn = document.querySelector('.gallery-next');
  var counter = document.getElementById('gallery-counter');

  if (gallery && prevBtn && nextBtn && counter) {
    var itemWidth = gallery.querySelector('.gallery-item').offsetWidth + 16;

    prevBtn.addEventListener('click', function() {
      gallery.scrollBy({ left: -itemWidth, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', function() {
      gallery.scrollBy({ left: itemWidth, behavior: 'smooth' });
    });

    var updateCounter = (function() {
      var ticking = false;
      return function() {
        if (!ticking) {
          requestAnimationFrame(function() {
            var current = Math.round(gallery.scrollLeft / itemWidth) + 1;
            var total = gallery.children.length;
            if (current < 1) current = 1;
            if (current > total) current = total;
            counter.textContent = current + ' / ' + total;
            ticking = false;
          });
          ticking = true;
        }
      };
    })();

    gallery.addEventListener('scroll', updateCounter, { passive: true });

    // Initial counter set
    updateCounter();
  }

  // == Mobile Menu Toggle ==
  var navToggle = document.querySelector('.nav-toggle');
  var navLinksContainer = document.querySelector('.nav-links');

  if (navToggle && navLinksContainer) {
    navToggle.addEventListener('click', function() {
      var isOpen = navLinksContainer.classList.toggle('open');
      navToggle.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    function closeMobileMenu() {
      navLinksContainer.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  }

})();
