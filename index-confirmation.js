if(localStorage.getItem("userCart")){
	console.log("Le panier de l'utilisateur existe dans le localStorage");
}else{
	console.log("Le panier de l'utilisateur n'existe pas, il va être créé et envoyé dans le localStorage");
  	//Le panier est un tableau de products
  	let cartInit = [];
  	localStorage.setItem("userCart", JSON.stringify(cartInit));
  };

  	//Tableau et objet demandé par l'API pour la commande
  	let contact;
  	let products = [];

	//L'user a maintenant un panier
	let userCart = JSON.parse(localStorage.getItem("userCart"));

/*Affichage des informations sur la page de confirmation
**********************************************/
resultOrder = () =>{
	if(sessionStorage.getItem("order") != null){
    //Parse du session storage
    let order = JSON.parse(sessionStorage.getItem("order"));
    //Implatation de prénom et de id de commande dans le html sur la page de confirmation
    document.getElementById("lastName").innerHTML = order.contact.lastName
    document.getElementById("orderId").innerHTML = order.orderId
    
    //Suppression de la clé du sessionStorage pour renvoyer au else si actualisation de la page ou via url direct
    sessionStorage.removeItem("order");
}else{
  //avertissement et redirection vers l'accueil
  alert("Aucune commande passée, vous êtes arrivé ici par erreur");
  window.open("./index.html");
}
}