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

/*Build de la page du produit sélectionné
**********************************************/

async function productDetails(){
    //Collecter l'URL après le ?id= pour le récupérer uniquement sur l'API
    idProduct = location.search.substring(4);
    const selectedProduct = await getProducts();
    console.log("Ceci est la page du produit id_" + selectedProduct._id);

    //Faire apparaitre la fiche produit initialement en display none
    let section = document.getElementById("main");
    section.style.display = "flex";
    
    //Remplissage de la fiche produit
    document.getElementById("one-teddy_img").setAttribute("src", selectedProduct.imageUrl);
    document.getElementById("one-teddy_name").innerHTML = selectedProduct.name;
    document.getElementById("one-teddy_description").innerHTML = selectedProduct.description;
    document.getElementById("one-teddy_price").innerHTML = selectedProduct.price / 100 + " €";

    
    //Selon le type de produit (ligne 3) création des options
    switch(productSell){
    	case "cameras":
    	selectedProduct.lenses.forEach((product)=>{
    		let optionProduit = document.createElement("option");
    		document.getElementById("optionSelect").appendChild(optionProduit).innerHTML = product;
    	});
    	break;
    	case "furniture":
    	selectedProduct.varnish.forEach((product)=>{
    		let optionProduit = document.createElement("option");
    		document.getElementById("optionSelect").appendChild(optionProduit).innerHTML = product;
    	});
    	break;
    	case "teddies":
    	selectedProduct.colors.forEach((product)=>{
    		let optionProduit = document.createElement("option");
    		document.getElementById("optionSelect").appendChild(optionProduit).innerHTML = product;
    	});
    	break;
    	default:
    	console.log("Renseignez la variable productSell (ligne 2)");
    }
};

/*Fonction ajouter le produit au panier de l'utilisateur
 **********************************************/
addPanier = () =>{
	//Au clic de l'user pour mettre le produit dans le panier
	let inputBuy = document.getElementById("ajouterProduitPanier");
	inputBuy.addEventListener("click", async function() {
		const products = await getProducts();
	//Récupération du panier dans le localStorage et ajout du produit dans le panier avant revoit dans le localStorage
	userCart.push(products);
	localStorage.setItem("userCart", JSON.stringify(userCart));
	console.log("Le produit a été ajouté au panier");
	alert("Le produit a été ajouté dans votre panier")
});
};