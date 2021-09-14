// Allons chercher les données !!
fetch(('https://annaelle-orinoco-api.herokuapp.com/api/teddies'))
  .then(response => response.json())
  .then(data => {

    // Choix de l'élément dans lequel nous intégrons ces données
    let teddiesList = document.querySelector('.card');

    // Intégration des blocs et des données qui seront dedans
    for (let teddy of data) {
        let cardElt = document.createElement('a');
        let contentElt = document.createElement('div');
        let picElt = document.createElement('img');
        let nameElt = document.createElement('h3');
        let priceElt = document.createElement('p');
        let descriptionElt = document.createElement('p');
        let btnElt = document.createElement('a');

        picElt.src = teddy.imageUrl;
        nameElt.textContent = teddy.name;
        priceElt.textContent = teddy.price + "€";
        descriptionElt.textContent = teddy.description;
        btnElt.textContent = "Ajouter au panier";

        teddiesList.appendChild(cardElt);

        cardElt.appendChild(picElt);
        cardElt.appendChild(contentElt)

        contentElt.appendChild(nameElt);
        contentElt.appendChild(priceElt);
        contentElt.appendChild(descriptionElt);
        contentElt.appendChild(btnElt);

        cardElt.classList.add('teddy-card');
        contentElt.classList.add('teddy-card__content');
        picElt.classList.add('teddy-card__pic');
        descriptionElt.classList.add('teddy-card__description');
        priceElt.classList.add('teddy-card__price')
        btnElt.classList.add('teddy-card__btn');

        cardElt.setAttribute('href', './pages/product.html?id=' + teddy._id);
    }
});

