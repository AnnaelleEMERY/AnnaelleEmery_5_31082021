fetch(('https://annaelle-orinoco-api.herokuapp.com/api/teddies'))
  .then(response => response.json())
  .then(data => {
    let teddiesList = document.querySelector('.card');


    for (let teddy of data) {
        let cardElt = document.createElement('article');
        let contentElt = document.createElement('div');
        let picElt = document.createElement('img');
        let nameElt = document.createElement('h3');
        let priceElt = document.createElement('p');
        let descriptionElt = document.createElement('p');
        let btnElt = document.createElement('a');

        picElt.src = teddy.imageUrl;
        nameElt.textContent = teddy.name;
        priceElt.textContent = teddy.price;
        descriptionElt.textContent = teddy.description;
        btnElt.textContent = "Acheter le produit";

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
        descriptionElt.add('teddy-card__description');
        priceElt.add('teddy-card__price')
        btnElt.classList.add('teddy-card__btn');

        btnElt.setAttribute('href', './pages/product.html?id=' + teddy._id);
    }
  });

  

