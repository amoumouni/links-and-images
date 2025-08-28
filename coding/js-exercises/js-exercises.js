// ../js/coding-exercises.js
(function () {
  const grid = document.getElementById('js-exercises');
  if (!grid) return;

  // Adjust titles/paths to your actual pages & thumbs
  const items = [
    // Functions (you already uploaded function1.js..4.js)
    {
      title: 'Function 1: Sum',
      desc: 'Returns the sum of two numbers.',
      href: 'js-exercises/function1.html',
      thumb: '../img/thumb/thumb-function1.svg',
      alt: 'Thumbnail for Function 1: Sum'
    },
    {
      title: 'Function 2: Factorial',
      desc: 'Computes n! using a loop.',
      href: 'js-exercises/function2.html',
      thumb: '../img/thumb/thumb-function2.svg',
      alt: 'Thumbnail for Function 2: Factorial'
    },
    {
      title: 'Function 3: Capitalize',
      desc: 'Capitalizes the first letter of a string.',
      href: 'js-exercises/function3.html',
      thumb: '../img/thumb/thumb-function3.svg',
      alt: 'Thumbnail for Function 3: Capitalize'
    },
    {
      title: 'Function 4: Palindrome',
      desc: 'Checks if a word reads the same backwards.',
      href: 'js-exercises/function4.html',
      thumb: '../img/thumb/thumb-function4.svg',
      alt: 'Thumbnail for Function 4: Palindrome'
    },

    // Exercises (add as you go; start with Exercise 1)
    {
      title: 'JS Exercise 1',
      desc: 'Small vanilla JS exercise.',
      href: 'js-exercises/exercise1.html',
      thumb: '../img/thumb/thumb-exercise1.svg',
      alt: 'Thumbnail for JS Exercise 1'
    }
    // Add more: exercise2, exercise3...
  ];

  grid.innerHTML = items.map(item => `
    <article class="card">
      <a class="card-link" href="${item.href}">
        <img src="${item.thumb}" alt="${item.alt}">
        <div class="card-body">
          <h3>${item.title}</h3>
          <p>${item.desc}</p>
          <span class="more">View →</span>
        </div>
      </a>
    </article>
  `).join('');
})();