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

    if (filter === 'jam') {
      products.forEach((product) => { product.hidden = false; });
      filterStatus.textContent = 'Jam assortment shown below.';
      document.querySelector('#jam-shelf').scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    products.forEach((product) => {
      const isVisible = filter === 'all' || product.dataset.category === filter;
      product.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    filterStatus.textContent = `${visibleCount} menu ${visibleCount === 1 ? 'item' : 'items'} shown.`;
  });
});

const recipeModal = document.querySelector('#recipe-modal');
const recipeModalImage = recipeModal.querySelector('.recipe-modal__image');
const recipeModalTitle = recipeModal.querySelector('#recipe-modal-title');
const recipeModalIntro = recipeModal.querySelector('.recipe-modal__intro');
const recipeModalRecipe = recipeModal.querySelector('.recipe-modal__recipe');
const recipeModalSource = recipeModal.querySelector('.recipe-modal__source');
const recipeModalCloseButtons = recipeModal.querySelectorAll('[data-modal-close]');
const productImages = document.querySelectorAll('.product__image-wrap img');
let lastFocusedElement;

const recipeDetails = {
  'Cloud-top latte': {
    intro: 'Velvety steamed milk, a double shot and a little leaf drawn on top.',
    recipe: 'Double espresso, steamed milk and a thin layer of foam. Finish with a simple leaf in the crema.',
    source: 'https://savaryislandpiecompany.ca/pages/west-vancouver-bakery',
  },
  'Fresh pies, many flavours': {
    intro: 'The bakery offers a changing assortment of fresh pies, served by the slice or with a scoop.',
    recipe: '4 featured pies found on the official site: Apple Pie, Lemon Buttermilk Berries, Pumpkin Pie and Chicken Pot Pie. Availability can change with the season.',
    source: 'https://savaryislandpiecompany.ca/products/lemon-buttermilk-pie-with-berries',
  },
  'Fruit Sorbets': {
    intro: 'Bright fruit, cool scoops and a little taste of summer.',
    recipe: 'Blend ripe fruit with sugar and a squeeze of lemon, churn until silky, then freeze until scoopable.',
    source: 'https://savaryislandpiecompany.ca/pages/west-vancouver-bakery',
  },
  'Rosetta cappuccino': {
    intro: 'Rich espresso, silky foam and a little flourish in every cup.',
    recipe: 'Pull a double espresso, texture cold milk into glossy microfoam and pour slowly to draw the rosetta.',
    source: 'https://savaryislandpiecompany.ca/pages/west-vancouver-bakery',
  },
  'Slice of fresh pie with ice cream': {
    intro: 'A fresh berry pie slice served with a generous scoop of vanilla ice cream.',
    recipe: 'Inspired notes: buttery pastry, seasonal berries, sugar and a little lemon, baked until bubbling. Serve warm with vanilla ice cream.',
    source: 'https://savaryislandpiecompany.ca/pages/west-vancouver-bakery',
  },
  'Slice of pumpkin pie': {
    intro: 'The official bakery describes it as creamy with just the perfect level of spice. The exact recipe is proprietary.',
    recipe: 'Inspired notes: pumpkin puree, eggs, cream, brown sugar, cinnamon, ginger and nutmeg in a flaky pastry shell. Bake gently until the centre is just set, then chill before slicing.',
    source: 'https://savaryislandpiecompany.ca/products/pumpkin-pie',
  },
};

function closeRecipeModal() {
  recipeModal.hidden = true;
  document.body.classList.remove('modal-open');
  lastFocusedElement?.focus();
}

function openRecipeModal(image) {
  const product = image.closest('.product');
  const title = product.querySelector('h3').textContent.trim();
  const details = recipeDetails[title] || {
    intro: product.querySelector(':scope > p').textContent.trim(),
    recipe: 'Ask the counter team about today\'s ingredients and seasonal preparation.',
    source: 'https://savaryislandpiecompany.ca/pages/west-vancouver-bakery',
  };

  lastFocusedElement = document.activeElement;
  recipeModalImage.src = image.currentSrc || image.src;
  recipeModalImage.alt = image.alt;
  recipeModalTitle.textContent = title;
  recipeModalIntro.textContent = details.intro;
  recipeModalRecipe.textContent = details.recipe;
  recipeModalSource.href = details.source;
  recipeModal.hidden = false;
  document.body.classList.add('modal-open');
  recipeModal.querySelector('.recipe-modal__close').focus();
}

productImages.forEach((image) => {
  image.tabIndex = 0;
  image.setAttribute('role', 'button');
  image.setAttribute('aria-label', `Open recipe for ${image.closest('.product').querySelector('h3').textContent.trim()}`);
  image.addEventListener('click', () => openRecipeModal(image));
  image.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openRecipeModal(image);
    }
  });
});

recipeModalCloseButtons.forEach((button) => button.addEventListener('click', closeRecipeModal));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !recipeModal.hidden) closeRecipeModal();
});

const seasonGuide = document.querySelector('#season-guide');
const seasonGuideTrigger = document.querySelector('#season-guide-trigger');
const seasonGuideCloseButtons = seasonGuide.querySelectorAll('[data-season-close]');
let lastSeasonGuideFocus;

function closeSeasonGuide() {
  seasonGuide.hidden = true;
  document.body.classList.remove('modal-open');
  lastSeasonGuideFocus?.focus();
}

function openSeasonGuide() {
  lastSeasonGuideFocus = document.activeElement;
  seasonGuide.hidden = false;
  document.body.classList.add('modal-open');
  seasonGuide.querySelector('.season-guide__close').focus();
}

seasonGuideTrigger.addEventListener('click', openSeasonGuide);
seasonGuideCloseButtons.forEach((button) => button.addEventListener('click', closeSeasonGuide));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !seasonGuide.hidden) closeSeasonGuide();
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
