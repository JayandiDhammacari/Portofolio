const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav a");
const menuIcon = document.getElementById("menu-icon");
const nav = document.querySelector("nav");

function activateLinkById(id) {
  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${id}`) {
      link.classList.add("active");
    }
  });
}

const options = {
  root: null,
  rootMargin: "0px",
  threshold: 0.6
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      activateLinkById(entry.target.id);
    }
  });
}, options);

sections.forEach(section => observer.observe(section));

menuIcon.addEventListener("click", (e) => {
  e.stopPropagation();
  menuIcon.classList.toggle("active");
  nav.classList.toggle("active");
});

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("active");
    menuIcon.classList.remove("active");
  });
});

document.addEventListener("click", (e) => {
  if (!nav.contains(e.target) && e.target !== menuIcon) {
    nav.classList.remove("active");
    menuIcon.classList.remove("active");
  }
});

/* Carousel functionality for project section */
(function(){
  const track = document.querySelector('.carousel-track');
  if(!track) return; // no carousel on page
  const slides = Array.from(track.children);
  const nextButton = document.querySelector('.carousel-btn.next');
  const prevButton = document.querySelector('.carousel-btn.prev');
  const indicatorsNav = document.querySelector('.carousel-nav');

  // generate indicators to match slides (avoid mismatch in markup)
  if (indicatorsNav) {
    indicatorsNav.innerHTML = '';
    slides.forEach((_, idx) => {
      const btn = document.createElement('button');
      btn.className = 'carousel-indicator';
      if (idx === 0) btn.classList.add('current');
      indicatorsNav.appendChild(btn);
    });
  }
  const dots = indicatorsNav ? Array.from(indicatorsNav.children) : [];
  let currentIndex = 0;

  const updateSlidePosition = () => {
    const slideWidth = slides[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    dots.forEach((d, i) => d.classList.toggle('current', i === currentIndex));
  };

  window.addEventListener('resize', updateSlidePosition);

  const moveTo = (index) => {
    if(index < 0) index = slides.length -1;
    if(index >= slides.length) index = 0;
    currentIndex = index;
    updateSlidePosition();
  };

  if (nextButton) nextButton.addEventListener('click', () => moveTo(currentIndex +1));
  if (prevButton) prevButton.addEventListener('click', () => moveTo(currentIndex -1));

  dots.forEach((dot, idx) => dot.addEventListener('click', () => moveTo(idx)));

  // Auto-play (advance every 3 seconds)
  let autoplay = setInterval(() => moveTo(currentIndex+1), 3000);
  const carouselContainer = document.querySelector('.project-carousel');
  carouselContainer.addEventListener('mouseenter', () => clearInterval(autoplay));
  carouselContainer.addEventListener('mouseleave', () => { autoplay = setInterval(() => moveTo(currentIndex+1), 3000); });

  // Initialize positions
  updateSlidePosition();
})();