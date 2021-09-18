/*Génération de l'URL de l'API selon le choix de produit à vendre
**********************************************/

const productSell = "teddies"  //Au choix entre : "cameras" - "furniture" - "teddies"
const APIURL = "https://annaelle-orinoco-api.herokuapp.com/api/" + productSell + "/";

//id du produit pour permettre un tri dans l'API

let idProduct = "";

/*Préparation des requis pour le script
**********************************************/

/*L'utilisateur à besoin d'un panier dans le localStorage de son navigateur
Vérifier si le panier existe dans le localStorage, sinon le créer et l'envoyer dans le localStorage au premier chargement du site quelque soit la page*/

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

/*Appel de l'API
**********************************************/

getProducts = () =>{
	return new Promise((resolve) =>{
		let request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if(this.readyState == XMLHttpRequest.DONE && this.status == 200) 
			{
				resolve(JSON.parse(this.responseText));
				console.log("Administration : connection ok");

				//L'appel est réussi => suppression des message d'erreur
				error = document.getElementById("error");
				//On supprime le message d'erreur s'il existe
				if(error){
					error.remove();
				}
			}else{
				console.log("Administration : ERROR connection API");
			}
		}
		request.open("GET", APIURL + idProduct);
		request.send();
	});
};

/*Page panier
**********************************************/

addition = () =>{
  //Vérifie si un prduit est dans le panier
  if(JSON.parse(localStorage.getItem("userCart")).length > 0){
    //S'il n'est pas vide on supprime le message et on créé le tableau récapitulatif
    document.getElementById("emptyCart").remove();

    //Création de la structure principale du tableau  
    let facture = document.createElement("table");
    let lineArray = document.createElement("tr");
    let nameColumn = document.createElement("th");
    let unitPriceColumn = document.createElement("th");
    let removeColumn = document.createElement("th");
    let totalLine = document.createElement("tr");
    let refTotalColumn = document.createElement("th");
    let priceColumn = document.createElement("td");

    //Placement de la structure dans la page et du contenu des entetes
    let factureSection = document.getElementById("basket-resume");
    factureSection.appendChild(facture);
    facture.appendChild(lineArray);
    lineArray.appendChild(nameColumn);
    nameColumn.textContent = "Nom du produit";
    lineArray.appendChild(unitPriceColumn);
    unitPriceColumn.textContent = "Prix du produit";
    /*lineArray.appendChild(removeColumn);
    removeColumn.textContent = "Annuler un produit";************************************************************************************************************************************
    */

    //Pour chaque produit du panier, on créé une ligne avec le nom, le prix
    
    //Init de l'incrémentation de l'id des lignes pour chaque produit
    let i = 0;
    
    JSON.parse(localStorage.getItem("userCart")).forEach((product)=>{
      //Création de la ligne
      let productLine = document.createElement("tr");
      let productName = document.createElement("td");
      let productUnitPrice = document.createElement("td");
      let removeProduct = document.createElement("i");

      //Attribution des class pour le css
      productLine.setAttribute("id", "product"+i);
      removeProduct.setAttribute("id", "remove"+i);
      removeProduct.setAttribute('class', "fas fa-trash-alt productAnnulation");
      //Pour chaque produit on créer un event sur l'icone de la corbeille pour annuler ce produit
      //bind permet de garder l'incrementation du i qui représente l'index tu panier au moment de la création de l'event
      //productAnnulation L233
      removeProduct.addEventListener('click', productAnnulation.bind(i));
      i++;

      //Insertion dans le HTML
      facture.appendChild(productLine);
      productLine.appendChild(productName);
      productLine.appendChild(productUnitPrice);
      productLine.appendChild(removeProduct);

      //Contenu des lignes
      productName.innerHTML = product.name;
      productUnitPrice.textContent = product.price / 100 + " €";
  });

    //Dernière ligne du tableau : Total
    facture.appendChild(totalLine);
    totalLine.appendChild(refTotalColumn);
    refTotalColumn.textContent = "Total à payer"
    totalLine.appendChild(priceColumn);
    priceColumn.setAttribute("id", "totalPrice")

    //Calcule de l'addition total
    let totalPrice = 0;
    JSON.parse(localStorage.getItem("userCart")).forEach((product)=>{
      totalPrice += product.price / 100;
    });

    //Affichage du prix total à payer dans l'addition
    console.log("Administration : " + totalPrice);
    document.getElementById("totalPrice").textContent = totalPrice + " €";
};
}

//Supprimer un produit du panier
productAnnulation = (i) =>{
  console.log("Enlever le produit à l'index " + i);
    //recupérer le array
    userCart.splice(i, 1); 
    console.log("Administration : " + userCart);
    //vide le localstorage
    localStorage.clear();
    console.log("localStorage vidé");
    // mettre à jour le localStorage avec le nouveau panier
    localStorage.setItem('userCart', JSON.stringify(userCart));
    console.log("localStorage mis à jour");
    //relancer la création de l'addition
    window.location.reload();
};

/*Formulaire et vérif etat panier
**********************************************/

//vérifie les inputs du formulaire
checkInput = () =>{
  //Controle Regex
  let checkString = /[a-zA-Z]/;
  let checkNumber = /[0-9]/;
  //Source pour vérification email => emailregex.com
  let checkMail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/y;
  let checkSpecialCharacter = /[§!@#$%^&*(),.?":{}|<>]/;

  //message fin de controle
  let checkMessage = "";

  //Récupération des inputs
  let formNom = document.getElementById("formNom").value;
  let formPrenom = document.getElementById("formPrenom").value;
  let formMail = document.getElementById("formMail").value;
  let formAdresse = document.getElementById("formAdresse").value;
  let formVille = document.getElementById("formVille").value;


    //tests des différents input du formulaire
      //Test du nom => aucun chiffre ou charactère spécial permis
      if(checkNumber.test(formNom) == true || checkSpecialCharacter.test(formNom) == true || formNom == ""){
        checkMessage = "Vérifier/renseigner votre nom";
      }else{
        console.log("Nom ok");
      };
      //Test du nom => aucun chiffre ou charactère spécial permis
      if(checkNumber.test(formPrenom) == true || checkSpecialCharacter.test(formPrenom) == true || formPrenom == ""){
        checkMessage = checkMessage + "\n" + "Vérifier/renseigner votre prénom";
      }else{
        console.log("Prénom ok");
      };
      //Test du mail selon le regex de la source L256
      if(checkMail.test(formMail) == false){
        checkMessage = checkMessage + "\n" + "Vérifier/renseigner votre email";
      }else{
        console.log("Adresse mail ok");
      };
      //Test de l'adresse => l'adresse ne contient pas obligatoirement un numéro de rue mais n'a pas de characteres spéciaux
      if(checkSpecialCharacter.test(formAdresse) == true || formAdresse == ""){
        checkMessage = checkMessage + "\n" + "Vérifier/renseigner votre adresse";
      }else{
        console.log("Adresse ok");
      };
      //Test de la ville => aucune ville en France ne comporte de chiffre ou charactères spéciaux
      if(checkSpecialCharacter.test(formVille) == true && checkNumber.test(formVille) == true || formVille == ""){
        checkMessage = checkMessage + "\n" + "Vérifiez/renseignez votre ville"
      }else{
        console.log("Ville ok")
      };
      //Si un des champs n'est pas bon => message d'alert avec la raison
      if(checkMessage != ""){
        alert("Il est nécessaire de :" + "\n" + checkMessage);
      }
      //Si tout est ok construction de l'objet contact => a revoir
      else{
        contact = {
          firstName : formNom,
          lastName : formPrenom,
          address : formAdresse,
          city : formVille,
          email : formMail
        };
        return contact;
      };
  };

//Vérification du panier
checkPanier = () =>{
//Vérifier qu'il y ai au moins un product dans le panier
let etatPanier = JSON.parse(localStorage.getItem("userCart"));
//Si le panier est vide ou null (suppression localStorage par)=>alerte
if(etatPanier == null){
//Si l'utilisateur à supprimer son localStorage etatPanier sur la page basket.html et qu'il continue le process de commande
alert("Il y a eu un problème avec votre panier, une action non autorisée a été faite. Veuillez recharger la page pour la corriger");
return false
}else if(etatPanier.length < 1 || etatPanier == null){
console.log("Administration: ERROR =>le localStorage ne contient pas de panier")
alert("Votre panier est vide");
return false;
}else{
console.log("Administration : Le panier n'est pas vide")
  //Si le panier n'est pas vide on rempli le products envoyé à l'API
  JSON.parse(localStorage.getItem("userCart")).forEach((product) =>{
    products.push(product._id);
  });
  console.log("Administration : Ce tableau sera envoyé à l'API : " + products)
  return true;
}
};

/*Envoi du formulaire
**********************************************/

//Fonction requet post de l'API
envoiDonnees = (objetRequest) => {
  return new Promise((resolve)=>{
    let request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if(this.readyState == XMLHttpRequest.DONE && this.status == 201) 
      {
        //Sauvegarde du retour de l'API dans la sessionStorage pour affichage dans order-confirm.html
        sessionStorage.setItem("order", this.responseText);

        //Chargement de la page de confirmation
        document.forms["form-panier"].action = './order-confirm.html';
        document.forms["form-panier"].submit();

        resolve(JSON.parse(this.responseText));
    }
};
request.open("POST", APIURL + "order");
request.setRequestHeader("Content-Type", "application/json");
request.send(objetRequest);
});
};

//Au click sur le btn de validation du formulaire
validForm = () =>{
  //Ecoute de l'event click du formulaire
  let btnForm = document.getElementById("envoiPost");
  btnForm.addEventListener("click", function(){
    //Lancement des verifications du panier et du form => si Ok envoi
    if(checkPanier() == true && checkInput() != null){
      console.log("Administration : L'envoi peut etre fait");
    //Création de l'objet à envoyer
    let objet = {
      contact,
      products
    };
    console.log("Administration : " + objet);
   //Conversion en JSON
   let objetRequest = JSON.stringify(objet);
   console.log("Administration : " + objetRequest);
   //Envoi de l'objet via la function
   envoiDonnees(objetRequest);

   //Une fois la commande faite retour à l'état initial des tableaux/objet/localStorage
   contact = {};
   products = [];
   localStorage.clear();
}else{
 console.log("Administration : ERROR");
};
});
};