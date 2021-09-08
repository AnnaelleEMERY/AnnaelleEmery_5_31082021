// js
fetch('https://annaelle-orinoco-api.herokuapp.com/api/teddies')
  .then(response => response.json())
  .then(data => {
      const articlesContainer = document.getElementById('articles');
      for (let article of data) {
          articlesContainer.innerHTML += `${article.name} ${article.price}<br>`;
      }
  });



