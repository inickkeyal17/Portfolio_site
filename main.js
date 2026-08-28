/**
 * INICKKEYAL PON RAJ - SOCIAL MEDIA EXECUTIVE PORTFOLIO
 * Interactive JavaScript for Navigation, Animated 3D Slider Carousel, Filtering, and Forms
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Mobile Navigation Toggle ---
  const mobileToggle = document.getElementById('mobileToggle');
  const navWrapper = document.querySelector('.nav-wrapper');
  const navLinks = document.querySelectorAll('.nav-menu a');

  if (mobileToggle && navWrapper) {
    mobileToggle.addEventListener('click', () => {
      navWrapper.classList.toggle('mobile-open');
      const isExpanded = navWrapper.classList.contains('mobile-open');
      mobileToggle.innerHTML = isExpanded ? '✕' : '☰';
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navWrapper.classList.remove('mobile-open');
        mobileToggle.innerHTML = '☰';
      });
    });
  }

  // --- 2. Active Scroll Spy Navigation ---
  const sections = document.querySelectorAll('section[id]');
  
  const scrollSpy = () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-menu a[href*="${sectionId}"]`);

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        if (navLink) navLink.classList.add('active');
      } else {
        if (navLink) navLink.classList.remove('active');
      }
    });
  };

  window.addEventListener('scroll', scrollSpy);

  // --- 3. Animated 3D Slider Carousel (6 Pillars of Expertise) ---
  const initPillarsCarousel = () => {
    const carouselWrap = document.getElementById('pillarsCarouselWrap');
    const track = document.getElementById('pillarsTrack');
    const cards = document.querySelectorAll('.carousel-pillar-card');
    const prevBtn = document.getElementById('deckPrevBtn');
    const nextBtn = document.getElementById('deckNextBtn');
    const counterNum = document.getElementById('deckActiveNum');
    const dots = document.querySelectorAll('.deck-dot');
    const progressFill = document.getElementById('carouselProgressFill');

    if (!track || cards.length === 0) return;

    let currentIndex = 0;
    const totalCards = cards.length;
    const autoPlayDuration = 4500; // 4.5 seconds per slide
    let progressStartTime = Date.now();
    let isPaused = false;
    let autoPlayAnimId = null;

    // Center active slide in the viewport
    const updateCarouselPosition = () => {
      const viewport = track.parentElement;
      const viewportWidth = viewport.offsetWidth;
      const activeCard = cards[currentIndex];
      const cardWidth = activeCard.offsetWidth;
      const gap = 32; // 2rem gap

      const offset = (viewportWidth / 2) - (cardWidth / 2) - (currentIndex * (cardWidth + gap));
      track.style.transform = `translateX(${offset}px)`;

      // Update active classes
      cards.forEach((card, i) => {
        if (i === currentIndex) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });

      // Update counter
      if (counterNum) {
        const displayNum = (currentIndex + 1).toString().padStart(2, '0');
        counterNum.textContent = displayNum;
      }

      // Update dots
      dots.forEach((dot, i) => {
        if (i === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });

      // Reset progress timer
      progressStartTime = Date.now();
      if (progressFill) progressFill.style.width = '0%';
    };

    const goToSlide = (index) => {
      currentIndex = (index + totalCards) % totalCards;
      updateCarouselPosition();
    };

    const nextSlide = () => goToSlide(currentIndex + 1);
    const prevSlide = () => goToSlide(currentIndex - 1);

    // Button controls
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Clicking an adjacent card slides it directly into center
    cards.forEach((card, i) => {
      card.addEventListener('click', () => {
        if (i !== currentIndex) {
          goToSlide(i);
        }
      });
    });

    // Dots click navigation
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const targetIndex = parseInt(dot.getAttribute('data-dot'), 10);
        if (!isNaN(targetIndex)) {
          goToSlide(targetIndex);
        }
      });
    });

    // Touch Swipe Support
    let startX = 0;
    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isPaused = true;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;
      if (diffX > 45) {
        nextSlide();
      } else if (diffX < -45) {
        prevSlide();
      }
      isPaused = false;
      progressStartTime = Date.now();
    }, { passive: true });

    // Pause on Hover
    if (carouselWrap) {
      carouselWrap.addEventListener('mouseenter', () => { isPaused = true; });
      carouselWrap.addEventListener('mouseleave', () => { 
        isPaused = false; 
        progressStartTime = Date.now();
      });
    }

    // Auto-Play & Progress Bar Animation Loop
    const runAutoPlayLoop = () => {
      if (!isPaused) {
        const elapsed = Date.now() - progressStartTime;
        const progressPercent = Math.min((elapsed / autoPlayDuration) * 100, 100);

        if (progressFill) {
          progressFill.style.width = `${progressPercent}%`;
        }

        if (elapsed >= autoPlayDuration) {
          nextSlide();
        }
      }
      autoPlayAnimId = requestAnimationFrame(runAutoPlayLoop);
    };

    // Recalculate on window resize
    window.addEventListener('resize', updateCarouselPosition);

    // Initialize
    updateCarouselPosition();
    runAutoPlayLoop();
  };

  initPillarsCarousel();

  // --- 4. Filterable Case Studies Tabs ---
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  const caseCards = document.querySelectorAll('.case-study-glass-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      caseCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category') || '';
        const categories = cardCategory.split(' ');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // --- 5. Toast Notification Utility ---
  const toast = document.getElementById('toast');
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  };

  // --- 6. Copy Email to Clipboard ---
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = copyEmailBtn.getAttribute('data-email') || 'inickkeyalponraj@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast(`✨ Email copied to clipboard: ${email}`);
      }).catch(() => {
        showToast(`📧 Contact Email: ${email}`);
      });
    });
  }

  // --- 7. Contact Form Interactive Handler ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('senderName')?.value || 'Friend';
      showToast(`✨ Thank you, ${name}! Your message has been received.`);
      contactForm.reset();
    });
  }

  // --- 8. Interactive Career Timeline (Click & Scroll Activation) ---
  const timelineWrap = document.getElementById('interactiveTimeline');
  if (timelineWrap) {
    const timelineItems = timelineWrap.querySelectorAll('.timeline-glass-item');
    const timelineNodes = timelineWrap.querySelectorAll('.timeline-node-glow');

    const setTimelineStep = (step) => {
      timelineWrap.classList.remove('step-1', 'step-2');
      timelineWrap.classList.add(`step-${step}`);
      
      timelineItems.forEach(item => {
        const itemStep = parseInt(item.getAttribute('data-step') || '1', 10);
        if (itemStep === step) {
          item.classList.add('active-step');
        } else {
          item.classList.remove('active-step');
        }
      });
    };

    // Default start on Step 1
    setTimelineStep(1);

    // Click on Card or Node to lock beam to that point
    timelineItems.forEach(item => {
      item.addEventListener('click', () => {
        const step = parseInt(item.getAttribute('data-step') || '1', 10);
        setTimelineStep(step);
      });
    });

    timelineNodes.forEach(node => {
      node.addEventListener('click', (e) => {
        e.stopPropagation();
        const step = parseInt(node.getAttribute('data-step') || '1', 10);
        setTimelineStep(step);
      });
    });

    // Scroll trigger: charge to node 2 when scrolled down to item 2
    const observerOptions = {
      root: null,
      threshold: 0.5
    };

    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const step = parseInt(entry.target.getAttribute('data-step') || '1', 10);
          setTimelineStep(step);
        }
      });
    }, observerOptions);

    timelineItems.forEach(item => timelineObserver.observe(item));
  }
});
