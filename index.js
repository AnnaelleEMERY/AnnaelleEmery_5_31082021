// js
fetch('http://localhost:3000/api/teddies')
.then(response => response.json())
.then(data => {
    const articlesContainer = document.getElementById('articles');
    for (let article of data) {
        articlesContainer.innerHTML += article.name;
    }
});
