/**
 * Vipress — Live Rock & Recording Studio Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Drawer Navigation
  const hamburger = document.querySelector('.hamburger-toggle');
  const drawer = document.querySelector('.mobile-drawer');

  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      drawer.classList.toggle('active');
      const isExpanded = drawer.classList.contains('active');
      hamburger.setAttribute('aria-expanded', isExpanded);
      hamburger.innerHTML = isExpanded 
        ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>'
        : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
    });

    // Close drawer when clicking a link
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('active');
        hamburger.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
      });
    });
  }

  // 2. Video Play/Pause Control
  const heroVideo = document.querySelector('.hero-video-bg');
  const videoBtn = document.querySelector('.video-control-btn');

  if (heroVideo && videoBtn) {
    videoBtn.addEventListener('click', () => {
      if (heroVideo.paused) {
        heroVideo.play();
        videoBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
        videoBtn.setAttribute('aria-label', 'Pause background video');
      } else {
        heroVideo.pause();
        videoBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
        videoBtn.setAttribute('aria-label', 'Play background video');
      }
    });
  }

  // 3. Glide-in Scroll Reveal (IntersectionObserver)
  const glideElements = document.querySelectorAll('.glide-in');
  if ('IntersectionObserver' in window) {
    const glideObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    glideElements.forEach(el => glideObserver.observe(el));
  } else {
    glideElements.forEach(el => el.classList.add('in-view'));
  }

  // 4. Dynamic Typewriter Headline
  const typewriterEl = document.querySelector('.dynamic-typewriter');
  if (typewriterEl) {
    const phrases = [
      'Raw Live Rock Energy.',
      'Progressive Alt-Rock Power.',
      'Explosive Stage Shows.',
      'Studio Production Mastery.'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function typeLoop() {
      const currentPhrase = phrases[phraseIndex];
      if (isDeleting) {
        typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 45;
      } else {
        typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 90;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typeSpeed = 2200;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 450;
      }

      setTimeout(typeLoop, typeSpeed);
    }

    typeLoop();
  }

  // 5. Telemetry Number Counters
  const counterElements = document.querySelectorAll('.stat-counter');
  let animated = false;

  function runCounters() {
    counterElements.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const duration = 1800;
      const startTime = performance.now();
      const isDecimal = target % 1 !== 0;

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = easeOut * target;

        counter.textContent = isDecimal ? currentVal.toFixed(1) : Math.floor(currentVal);

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = isDecimal ? target.toFixed(1) : target;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  const statContainer = document.querySelector('.telemetry-grid');
  if (statContainer && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          runCounters();
        }
      });
    }, { threshold: 0.2 });

    counterObserver.observe(statContainer);
  } else if (statContainer) {
    runCounters();
  }

  // 6. Interactive Live Gig & Tech Rider Estimator
  const gigEvent = document.getElementById('calc-event-type');
  const gigBandFormat = document.getElementById('calc-band-format');
  const gigBackline = document.getElementById('calc-backline');
  const resSetTime = document.getElementById('res-set-time');
  const resTechRider = document.getElementById('res-tech-rider');
  const resTravel = document.getElementById('res-travel-terms');
  const resTotal = document.getElementById('res-total-estimate');

  function calculateGigFee() {
    if (!gigEvent || !resTotal) return;

    const eventType = gigEvent.value; // 'college_fest', 'club_gig', 'festival_headline', 'corporate'
    const format = gigBandFormat.value; // 'full_6piece', 'acoustic_trio'
    const hasBackline = gigBackline ? gigBackline.checked : true;

    let baseFee = 65000;
    let setTime = '90 Min High-Energy Headline Set';
    let riderTier = 'Full Drum Kit + 2x Guitar Stacks + Bass Rig';

    if (eventType === 'college_fest') {
      baseFee = 85000;
      setTime = '105 Min Festival Headline (18 Songs)';
      riderTier = 'Front-of-House 32-Channel Digital Stage Box';
    } else if (eventType === 'festival_headline') {
      baseFee = 125000;
      setTime = '120 Min Arena Rock Set (Pyros/Visuals synced)';
      riderTier = 'Arena Tech Spec + In-Ear Monitoring (IEM)';
    } else if (eventType === 'corporate') {
      baseFee = 75000;
      setTime = '75 Min Premium Rock & Retro Fusion';
      riderTier = 'Standard Corporate Club Backline';
    }

    if (format === 'acoustic_trio') {
      baseFee = Math.round(baseFee * 0.65);
      setTime = '75 Min Unplugged Acoustic Rock & Harmonies';
      riderTier = 'Acoustic DI Boxes + Vocal Mics';
    }

    if (hasBackline) {
      baseFee += 18000;
      riderTier += ' (Band Provides Full Stage Gear)';
    }

    if (resSetTime) resSetTime.textContent = setTime;
    if (resTechRider) resTechRider.textContent = riderTier;
    if (resTravel) resTravel.textContent = 'Kolkata Direct (Outstation: Flights + Acc.)';
    if (resTotal) resTotal.textContent = `₹${baseFee.toLocaleString('en-IN')}`;
  }

  if (gigEvent) gigEvent.addEventListener('change', calculateGigFee);
  if (gigBandFormat) gigBandFormat.addEventListener('change', calculateGigFee);
  if (gigBackline) gigBackline.addEventListener('change', calculateGigFee);
  calculateGigFee();

  // 7. Gallery Filter Rail
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length > 0 && galleryItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterVal = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filterVal === 'all' || category === filterVal) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(15px)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // 8. Contact Form Direct WhatsApp Forwarding
  const contactForm = document.getElementById('band-booking-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const organizer = document.getElementById('form-name')?.value || 'Event Organizer';
      const phone = document.getElementById('form-phone')?.value || '';
      const eventName = document.getElementById('form-event')?.value || 'Live Concert';
      const eventDate = document.getElementById('form-date')?.value || 'Upcoming Date';
      const venue = document.getElementById('form-venue')?.value || 'Kolkata';

      const waMsg = `Hello Vipress! My name is ${organizer} (${phone}). We want to book Vipress for: ${eventName} on date: ${eventDate} at venue: ${venue}. Please share your tech rider and availability.`;
      const waUrl = `https://wa.me/917003823006?text=${encodeURIComponent(waMsg)}`;
      window.open(waUrl, '_blank');
    });
  }
});
