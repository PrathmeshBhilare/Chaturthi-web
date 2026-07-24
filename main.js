import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis Smooth Scrolling
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Loader Animation
const initLoader = () => {
  const tl = gsap.timeline();

  // Prevent scrolling during load
  lenis.stop();

  tl.to('.loader-text', {
    y: 0,
    duration: 1.5,
    ease: 'power4.out',
    delay: 0.2
  })
  .to('.loader-subtext', {
    opacity: 1,
    duration: 1,
    ease: 'power2.out'
  }, '-=0.5')
  .to('.loader', {
    yPercent: -100,
    duration: 1.5,
    ease: 'expo.inOut',
    delay: 0.5,
    onComplete: () => {
      lenis.start();
      initHeroAnimations();
    }
  });
};

// Hero Animations (triggered after loader)
const initHeroAnimations = () => {
  const tl = gsap.timeline();
  
  tl.fromTo('.hero-video-wrapper', 
    { scale: 1.2 },
    { scale: 1, duration: 2, ease: 'power3.out' }
  )
  .fromTo('.hero-title .line',
    { y: 100, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power4.out' },
    '-=1.5'
  )
  .fromTo('.hero-ctas',
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
    '-=0.5'
  );
};

// Scroll Animations
const initScrollAnimations = () => {
  // Navbar blur on scroll
  ScrollTrigger.create({
    start: 'top -80',
    end: 99999,
    toggleClass: {className: 'scrolled', targets: '.navbar'}
  });

  // Parallax Images
  gsap.utils.toArray('.parallax-img').forEach(img => {
    const speed = img.dataset.speed || 0.1;
    gsap.to(img, {
      yPercent: 20 * speed * 10,
      ease: 'none',
      scrollTrigger: {
        trigger: img.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });

  // Text Reveals
  gsap.utils.toArray('.reveal-text').forEach(text => {
    gsap.fromTo(text, 
      { y: 50, opacity: 0, filter: 'blur(10px)' },
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: text,
          start: 'top 85%',
        }
      }
    );
  });

  // Image Reveals (Masking effect)
  gsap.utils.toArray('.reveal-image').forEach(wrapper => {
    // We can animate the wrapper itself or add a mask. Let's do a simple fade/slide up for now.
    gsap.fromTo(wrapper,
      { y: 100, opacity: 0, filter: 'blur(20px)', scale: 1.05 },
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        scale: 1,
        duration: 1.5,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: wrapper,
          start: 'top 85%',
        }
      }
    );
  });

  // Group Reveals (e.g. Menu items)
  gsap.utils.toArray('.reveal-group').forEach(group => {
    gsap.fromTo(group.children,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: group,
          start: 'top 85%',
        }
      }
    );
  });

  // Magnetic Buttons
  const magneticButtons = document.querySelectorAll('.magnetic');
  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.5,
        ease: 'power3.out'
      });
    });
    
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      });
    });
  });
};

// Initialize everything on load
window.addEventListener('load', () => {
  initLoader();
  initScrollAnimations();
});
