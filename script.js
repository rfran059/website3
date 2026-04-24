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
    var firstItem = gallery.querySelector('.gallery-item');
    var itemWidth = firstItem.offsetWidth + 16;

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
            counter.textContent = 'Showing ' + current + '–' + Math.min(current + 2, total) + ' of ' + total;
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

  // == Project Modal ==
  var modal = document.getElementById('project-modal');
  var modalBackdrop = modal ? modal.querySelector('.project-modal-backdrop') : null;
  var modalClose = modal ? modal.querySelector('.project-modal-close') : null;
  var modalTitle = modal ? modal.querySelector('.project-modal-title') : null;
  var modalDesc = modal ? modal.querySelector('.project-modal-desc') : null;
  var modalTags = modal ? modal.querySelector('.project-modal-tags') : null;
  var modalImage = modal ? modal.querySelector('.project-modal-image') : null;

  if (modal) {
    var openModal = function(card) {
      var full = card.getAttribute('data-full');
      var tagsStr = card.getAttribute('data-tags');
      var title = card.querySelector('.project-title').textContent;
      var imgEl = card.querySelector('.project-image');
      var imgClass = imgEl ? imgEl.className.match(/project-img-\w+/) : null;

      if (modalTitle) modalTitle.textContent = title;
      if (modalDesc) modalDesc.textContent = full;
      if (modalImage) {
        modalImage.className = 'project-modal-image';
        if (imgClass && imgClass[0]) {
          modalImage.classList.add(imgClass[0]);
        }
      }
      if (modalTags) {
        while (modalTags.firstChild) {
          modalTags.removeChild(modalTags.firstChild);
        }
        if (tagsStr) {
          tagsStr.split('|').forEach(function(tag) {
            var span = document.createElement('span');
            span.className = 'tag';
            span.textContent = tag;
            modalTags.appendChild(span);
          });
        }
      }
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    var closeModal = function() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    };

    document.querySelectorAll('.project-card').forEach(function(card) {
      card.addEventListener('click', function() {
        openModal(card);
      });
    });

    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
    if (modalClose) modalClose.addEventListener('click', closeModal);

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
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
