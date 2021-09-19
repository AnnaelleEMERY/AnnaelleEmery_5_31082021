const productSell = "teddies"  //Au choix entre : "cameras" - "furniture" - "teddies" : NOUS ON PREND TEDDIES
const APIURL = "https://annaelle-orinoco-api.herokuapp.com/api/" + productSell + "/";

//id du produit

let idProduct = "";

// local storage
if(localStorage.getItem("userCart")){
	console.log("Le panier de l'utilisateur existe dans le localStorage");
}else{
	console.log("Le panier de l'utilisateur n'existe pas, il va être créé et envoyé dans le localStorage");
  	//Le panier est un tableau de produits
  	let cartInit = [];
  	localStorage.setItem("userCart", JSON.stringify(cartInit));
  };

  	//Tableau et objet demandé par l'API pour la commande
  	let contact;
  	let products = [];

	//L'user a maintenant un panier
	let userCart = JSON.parse(localStorage.getItem("userCart"));


  // Appel de l'API
getProducts = () =>{
	return new Promise((resolve) =>{
		let request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if(this.readyState == XMLHttpRequest.DONE && this.status == 200) 
			{
				resolve(JSON.parse(this.responseText));
				console.log("Connection ok");

				//L'appel est réussi => suppression des message d'erreur
				error = document.getElementById("error");
				//On supprime le message d'erreur s'il existe
				if(error){
					error.remove();
				}
			}else{
				console.log("ERROR connection API");
			}
		}
		request.open("GET", APIURL + idProduct);
		request.send();
	});
};

// liste complète des produits
async function allProductsList(){
  const products = await getProducts();

// Choix de l'élément dans lequel nous intégrons ces données
    let teddiesList = document.querySelector('.card')
    
    // Intégration des blocs et des données qui seront dedans
      products.forEach((teddy) => {
        let cardElt = document.createElement('a');
        let contentElt = document.createElement('div');
        let picElt = document.createElement('img');
        let nameElt = document.createElement('h3');
        let priceElt = document.createElement('p');
        let descriptionElt = document.createElement('p');
        let btnElt = document.createElement('a');

        picElt.src = teddy.imageUrl;
        nameElt.textContent = teddy.name;
        priceElt.textContent = teddy.price / 100 + " €";
        descriptionElt.textContent = teddy.description;
        btnElt.textContent = "Voir le nounours";

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
        priceElt.classList.add('teddy-card__price')
        btnElt.classList.add('teddy-card__btn');

        cardElt.setAttribute('href', 'index-product.html?id=' + teddy._id);
      });
};
