const productSell = "teddies"  //Au choix entre : "cameras" - "furniture" - "teddies" : NOUS ON PREND TEDDIES
const APIURL = "https://annaelle-orinoco-api.herokuapp.com/api/" + productSell + "/";

//id du produit

let idProduct = "";

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




/**********************************************************************************************************/
/********************************************* Page d'accueil *********************************************/
/**********************************************************************************************************/
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






async function productDetailsAndAddToCart(){
  
/**********************************************************************************************************/
/****************************************Page du produit sélectionné***************************************/
/**********************************************************************************************************/

    //Collecter l'URL après le ?id= pour le récupérer uniquement sur l'API
    idProduct = location.search.substring(4);
    const selectedTeddy = await getProducts();


    console.log("Ceci est la page du produit id_" + selectedTeddy._id);

    //Faire apparaitre la fiche produit initialement en display none
    let section = document.getElementById("main");
    section.style.display = "flex";
    
    //Remplissage de la fiche produit
    document.getElementById("one-teddy_img").setAttribute("src", selectedTeddy.imageUrl);
    document.getElementById("one-teddy_name").innerHTML = selectedTeddy.name;
    document.getElementById("one-teddy_description").innerHTML = selectedTeddy.description;
    document.getElementById("one-teddy_price").innerHTML = selectedTeddy.price / 100 + " €";

    // Selection de l'input quantité et ajout d'un EventListener (change)
    let quantityInput = document.getElementById('quantitySelector')
    quantityInput.addEventListener('change', quantityChanged)

    // Init de getVal en cas de non-modification de l'input puis récupération de l'input de quantité
    // pour l'ajout au panier, en empèchant une valeur négative ou un NaaaaN


/**********************************************************************************************************/
/*********************************************Ajouter au panier********************************************/
/**********************************************************************************************************/
  //QUANTITE
    // Selection de la valeur quantité pour le local storage
    let getVal = 1 ;

     function quantityChanged(event) {
        var input = event.target
        if (isNaN(input.value) || input.value <= 0) {
            input.value = 1
        }
        getVal = input.value
        console.log(getVal)
        return getVal;
    }

  //COULEURS
   //Création et affichage des options de couleur
   selectedTeddy.colors.forEach((teddy)=>{
    let colorTeddy = document.createElement("option");
    document.getElementById("optionSelect").appendChild(colorTeddy).innerHTML = teddy;
  });

    // Selection du select color et ajout d'un EventListener (change)
    let colorInput = document.getElementById('optionSelect')

    colorInput.addEventListener('change', colorChoice)

    // Initialisation de getColor en cas de non-modification puis récupération du choix de lentilles 

    let getColor = colorInput.value;

    function colorChoice(event) {
        var input = event.target
        getColor = input.value
        console.log(getColor)
        return getColor;
    }  


  // Sélection du bouton addToCart
  const addToCart = document.getElementById('btn-addToCart');

  // addEventListener - Ecouter le bouton et envoyer le panier
    addToCart.addEventListener('click', function(event) {
    event.preventDefault();

  // Récupération des valeurs
    let optionsTeddyLocalStorage = {
      selectedProductName: selectedTeddy.name,
      selectedProductId: selectedTeddy._id,
      colorSelected: getColor,
      quantity: parseInt(getVal),
      selectedProductPrice: selectedTeddy.price / 100,
      subtotal: parseInt(selectedTeddy.price / 100 * getVal),
    };

    console.log(optionsTeddyLocalStorage);




  /**********************************************************************************************************/
  /*********************************************Le local storage*********************************************/
  /**********************************************************************************************************/

  // déclaration de la variable "productsForLocalStorage" dans laquelle on met les keys et les values qui sont dans le local storage
  let productsForLocalStorage = JSON.parse(localStorage.getItem('localStorage'));
  console.log(productsForLocalStorage);

  //fonction fenêtre popup
  const popupConfirmation = () => {
    window.confirm(`Votre ourson a bien été ajouté au panier`)
  };

  //ajouter un produit selectionné dasn le local storage
  const addProductInLocalStorage = () => {
    productsForLocalStorage.push(optionsTeddyLocalStorage);
    localStorage.setItem('localStorage', JSON.stringify(productsForLocalStorage));
  }

  // AJOUT D'UN PRODUIT
  //s'il y a déjà des produits dans le local storage
  if(productsForLocalStorage) {
    addProductInLocalStorage();

    popupConfirmation();
  }
  //s'il n'y a PAS de produit dans le local storage
  else {
    productsForLocalStorage = [];
    addProductInLocalStorage();

    popupConfirmation();
  }
  });
};




/**********************************************************************************************************/
/***********************************************Page Panier************************************************/
/**********************************************************************************************************/

addition = () => {

  // déclaration de la variable "productsForLocalStorage" dans laquelle on met les keys et les values qui sont dans le local storage
  let productsForLocalStorage = JSON.parse(localStorage.getItem('localStorage'));
  console.log(productsForLocalStorage);
  

  //Vérifie si un produit est dans le panier
  if(JSON.parse(localStorage.getItem("localStorage")).length > 0){
    //S'il n'est pas vide on supprime le message et on créé le tableau récapitulatif
    document.getElementById("emptyCart").remove();

    //Création de la structure principale du tableau  
    let facture = document.createElement("table");
    let lineArray = document.createElement("tr");

    let nameColumn = document.createElement("th");
    let colorColumn = document.createElement("th");
    let quantityColumn = document.createElement("th");
    let unitPriceColumn = document.createElement("th");
    let removeColumn = document.createElement("th");

    let totalLine = document.createElement("tr");
    let refTotalColumn = document.createElement("th");
    let priceColumn = document.createElement("td");

    //Placement de la structure dans la page et du contenu des entêtes
    let factureSection = document.getElementById("basket-resume");
    factureSection.appendChild(facture);
    facture.appendChild(lineArray);

    lineArray.appendChild(nameColumn);
    nameColumn.textContent = "Nom du nounours";

    lineArray.appendChild(colorColumn);
    colorColumn.textContent = "Couleur";

    lineArray.appendChild(quantityColumn);
    quantityColumn.textContent = "Quantité";

    lineArray.appendChild(unitPriceColumn);
    unitPriceColumn.textContent = "Prix du nounours";

     /* lineArray.appendChild(removeColumn);
    removeColumn.textContent = "Annuler un produit"; */
   

    //Pour chaque produit du panier, on créé une ligne avec le nom, le prix, etc
    
    //Init de l'incrémentation de l'id des lignes pour chaque produit
    let i = 0;
    
    JSON.parse(localStorage.getItem("localStorage")).forEach((productsForLocalStorage) => {
      //Création de la ligne
      let productLine = document.createElement("tr");
      let productName = document.createElement("td");
      let productColor = document.createElement("td")
      let productQuantity = document.createElement("td");
      let productUnitPrice = document.createElement("td");
      let removeProduct = document.createElement("i");

      //Attribution des class pour le css
      productLine.setAttribute("id", "productLines" + i);
      removeProduct.setAttribute("id", "removeLine" + i);
      removeProduct.setAttribute('class', "fas fa-trash-alt productAnnulation");
      //Pour chaque produit on créé un event sur l'icone de la corbeille pour annuler ce produit
      //bind permet de garder l'incrementation du i qui représente l'index du panier au moment de la création de l'event
      //productAnnulation L233
      removeProduct.addEventListener('click', productAnnulation.bind(i));
      i++;

      //Insertion dans le HTML
      facture.appendChild(productLine);
      productLine.appendChild(productName);
      productLine.appendChild(productColor);
      productLine.appendChild(productQuantity);
      productLine.appendChild(productUnitPrice);
      productLine.appendChild(removeProduct);

      //Contenu des lignes
      productName.innerHTML = productsForLocalStorage.selectedProductName;
      productColor.innerHTML = productsForLocalStorage.colorSelected;
      productQuantity.innerHTML = productsForLocalStorage.quantity;
      productUnitPrice.textContent = productsForLocalStorage.selectedProductPrice * productsForLocalStorage.quantity + " €";
  

    //Dernière ligne du tableau : Total
    facture.appendChild(totalLine);
    totalLine.appendChild(refTotalColumn);
    refTotalColumn.textContent = "Total à payer"
    totalLine.appendChild(priceColumn);
    priceColumn.setAttribute("id", "totalPrice")


    






    //Calcul de l'addition total---------------------------------------------------------------------------------------------------------------------------------
    let totalPrice = [];
    let allPrices = productsForLocalStorage.selectedProductPrice * productsForLocalStorage.quantity;
    console.log(totalPrice);
// ce code ------------------------------------------------------------------------------------------------------------------------------------------------------
    function calculateTotalPrice(){
      for(let i = 0; i < productsForLocalStorage.length; ++i) {
          let j = Object.values(productsForLocalStorage[i])
          totalPrice += (j[7]/100);
      }
  }
  // ou ce code--------------------------------------------------------------------------------------------------------------------------------------------------
    for(p = 0; p < productsForLocalStorage.length; p++){
      
      totalPrice.push(allPrices);
      
      console.log(totalPrice);
    }


// JE NE SAIS PAS




    //Affichage du prix total à payer dans l'addition
    /* console.log("Administration : " + totalPrice); */
    document.getElementById("totalPrice").textContent = totalPrice + " €";
  });
};
} 

/*Supprimer un produit du panier************************************************************************/
productAnnulation = (i) =>{
  console.log("Enlever le produit à l'index " + i);
    //recupérer le array
    localStorage.splice(i, 1); 
    console.log("Administration : " + localStorage);
    //vide le localstorage
    localStorage.clear();
    console.log("localStorage vidé");
    // mettre à jour le localStorage avec le nouveau panier
    localStorage.setItem('localStorage', JSON.stringify(localStorage));
    console.log("localStorage mis à jour");
    //relancer la création de l'addition
    window.location.reload();
}; 




/**********************************************************************************************************/
/*************************************Formulaire et vérif etat panier**************************************/
/**********************************************************************************************************/

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
      //Test du mail
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
checkCart = () =>{
//Vérifier qu'il y ait au moins un produit dans le panier
let etatPanier = JSON.parse(localStorage.getItem("localStorage"));
//Si le panier est vide ou null (suppression localStorage par)=>alerte
if(etatPanier == null){
//Si l'utilisateur a supprimé son localStorage etatPanier et qu'il continue le process de commande
alert("Il y a eu un problème avec votre panier, une action non autorisée a été faite. Veuillez recharger la page pour la corriger");
return false
} else if (etatPanier.length < 1 || etatPanier == null){
console.log("ERROR => le localStorage ne contient pas de panier")
alert("Votre panier est vide");
return false;
} else {
console.log("Le panier n'est pas vide")

  //Si le panier n'est pas vide on remplit le produit envoyé à l'API
  JSON.parse(localStorage.getItem("localStorage")).forEach((productsForLocalStorage) =>{
    productsForLocalStorage.push(optionsTeddyLocalStorage);
  });
  console.log("Ce tableau sera envoyé à l'API : " + products)
  return true;
}
};




/**********************************************************************************************************/
/******************************************Envoi du formulaire*********************************************/
/**********************************************************************************************************/

//Fonction request post de l'API
sendData = (objetRequest) => {
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
    if(checkCart() == true && checkInput() != null){
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
   sendData(objetRequest);

   //Une fois la commande faite retour à l'état initial des tableaux/objet/localStorage
   contact = {};
   products = [];
   localStorage.clear();
}else{
 console.log("Administration : ERROR");
};
});
};




/**********************************************************************************************************/
/**************************Affichage des informations sur la page de confirmation**************************/
/**********************************************************************************************************/


//Affichage des informations sur la page de confirmation
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
  window.open("index.html");
}
}