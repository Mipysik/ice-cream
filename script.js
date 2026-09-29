const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
const navigationLinks = navigation.querySelectorAll('a');

function closeNavigation() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  navigation.classList.remove('is-open');
}

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  navigation.classList.toggle('is-open', !isOpen);
});

navigationLinks.forEach((link) => link.addEventListener('click', closeNavigation));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeNavigation();
});

const filterButtons = document.querySelectorAll('.filter-button');
const products = document.querySelectorAll('.product');
const filterStatus = document.querySelector('#filter-status');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    let visibleCount = 0;

    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-pressed', String(isActive));
    });

    products.forEach((product) => {
      const isVisible = filter === 'all' || product.dataset.category === filter;
      product.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    filterStatus.textContent = `${visibleCount} menu ${visibleCount === 1 ? 'item' : 'items'} shown.`;
  });
});

const revealItems = document.querySelectorAll('.reveal:not(.product)');
const parallaxImages = document.querySelectorAll('.pairing__image img, .coffee-section__photo img, .visit-section__photo img');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  import('https://esm.sh/animejs')
    .then(({ animate, onScroll }) => {
      revealItems.forEach((item, index) => {
        const startX = index % 2 === 0 ? '-2rem' : '2rem';

        animate(item, {
          x: [startX, '0rem'],
          y: ['1.5rem', '0rem'],
          scale: [0.985, 1],
          ease: 'linear',
          autoplay: onScroll({
            target: item,
            enter: 'bottom 92%',
            leave: 'top 8%',
            sync: true,
          }),
        });
      });

      products.forEach((product, index) => {
        const startRotation = index % 2 === 0 ? '-0.6deg' : '0.6deg';

        animate(product, {
          y: ['1.25rem', '0rem'],
          scale: [0.985, 1],
          rotate: [startRotation, '0deg'],
          delay: (index % 3) * 25,
          ease: 'linear',
          autoplay: onScroll({
            target: product,
            enter: 'bottom 96%',
            leave: 'top 48%',
            sync: true,
          }),
        });
      });

      parallaxImages.forEach((image) => {
        animate(image, {
          y: ['-1rem', '1rem'],
          scale: [1.025, 1],
          ease: 'linear',
          autoplay: onScroll({
            target: image,
            enter: 'bottom 90%',
            leave: 'top 65%',
            sync: true,
          }),
        });
      });
    })
    .catch(() => {});
}
