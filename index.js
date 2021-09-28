const productSell = "teddies"  //Au choix entre : "cameras" - "furniture" - "teddies" : NOUS ON PREND TEDDIES
const APIURL = "https://annaelle-orinoco-api.herokuapp.com/api/" + productSell + "/";

//id du produit

let idProduct = "";

// Appel de l'API
getProducts = () => {
  return new Promise((resolve) => {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        resolve(JSON.parse(this.responseText));
        console.log("Connection ok");

        //L'appel est réussi => suppression des message d'erreur
        error = document.getElementById("error");
        //On supprime le message d'erreur s'il existe
        if (error) {
          error.remove();
        }
      } else {
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
async function allProductsList() {
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






async function productDetailsAndAddToCart() {

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
  let getVal = 1;

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
  selectedTeddy.colors.forEach((teddy) => {
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
  addToCart.addEventListener('click', function (event) {
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
    let productsForLocalStorage = JSON.parse(localStorage.getItem('cartLocalStorage'));
    console.log(productsForLocalStorage);

    //fonction fenêtre popup
    const popupConfirmation = () => {
      window.confirm(`Votre ourson a bien été ajouté au panier`)
    };

    //ajouter un produit selectionné dasn le local storage
    const addProductInLocalStorage = () => {
      productsForLocalStorage.push(optionsTeddyLocalStorage);
      localStorage.setItem('cartLocalStorage', JSON.stringify(productsForLocalStorage));
    }

    // AJOUT D'UN PRODUIT
    //s'il y a déjà des produits dans le local storage
    if (productsForLocalStorage) {
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
  let productsForLocalStorage = JSON.parse(localStorage.getItem('cartLocalStorage'));
  console.log(productsForLocalStorage);


  //Vérifie si un produit est dans le panier
  if (JSON.parse(localStorage.getItem("cartLocalStorage")).length > 0) {
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
    unitPriceColumn.textContent = "Prix total du nounours";

    /* lineArray.appendChild(removeColumn);
   removeColumn.textContent = "Supprimer un produit"; */


    //Pour chaque produit du panier, on créé une ligne avec le nom, le prix, etc

    //Init de l'incrémentation de l'id des lignes pour chaque produit
    let i = 0;

    JSON.parse(localStorage.getItem("cartLocalStorage")).forEach((productsForLocalStorage) => {
      //Création de la ligne
      let productLine = document.createElement("tr");
      let productName = document.createElement("td");
      let productColor = document.createElement("td")
      let productQuantity = document.createElement("td");
      let productUnitPrice = document.createElement("td");
      let removeProduct = document.createElement("button");

      //Attribution des class pour le css
      productLine.setAttribute("id", "productLines" + i);
      removeProduct.setAttribute("id", "removeLine" + i);
      removeProduct.setAttribute('class', "fas fa-trash-alt productAnnulation");
      //Pour chaque produit on créé un event sur l'icone de la corbeille pour annuler ce produit
      //bind permet de garder l'incrementation du i qui représente l'index du panier au moment de la création de l'event
      //productAnnulation L233


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

    });

    // Calcul du total de tous les articles
    var totalPrice = 0;

    for (p = 0; p < productsForLocalStorage.length; p++) {
      var totalPrice = totalPrice + productsForLocalStorage[p].subtotal;
    }


    //Affichage du prix total à payer dans l'addition
    /* console.log("Administration : " + totalPrice); */
    document.getElementById("totalPrice").textContent = totalPrice + " €";














    //********************************************************************************************************************************************************************************************************/
    /*Supprimer un produit du panier**************************************************************************************************************************************************************************/
    //********************************************************************************************************************************************************************************************************/

    let btn_removeProduct = document.getElementsByClassName('productAnnulation');

    for (let i = 0; i < btn_removeProduct.length; i++) {
      btn_removeProduct[i].addEventListener("click", (event) => {
        event.preventDefault();

        let id_selectioned_remove = productsForLocalStorage[i].selectedProductId;
        console.log(id_selectioned_remove);

        //faire avec la methode filter je selectionne les éléments à garder et je supprime l'élément qui appartient au bouton "supprimer" cliqué
        productsForLocalStorage = productsForLocalStorage.filter(el => el.selectedProductId !== id_selectioned_remove);
        console.log(productsForLocalStorage);

        //l'information changée dans le array productsForLocalStorage est envoyée dans le local storage
        localStorage.setItem('cartLocalStorage', JSON.stringify(productsForLocalStorage));
        window.location = window.location;
      });
    };
  };







  /**********************************************************************************************************/
  /*************************************Formulaire et vérif etat panier**************************************/
  /**********************************************************************************************************/



  //addeventlistener bouton form
  const btnEnvoyerForm = document.getElementById('envoiPost');


  btnEnvoyerForm.addEventListener("click", (e) => {
    e.preventDefault();

    const formObject = {
      nom: document.getElementById('formNom').value,
      prenom: document.getElementById('formPrenom').value,
      mail: document.getElementById('formMail').value,
      adresse: document.getElementById('formAdresse').value,
      ville: document.getElementById('formVille').value
    }

    /********************************************************* Gestion validation du formulaire avant envoi au local Storage *********************************************************/
    //REGEX
    const regexPrenomNomVille = (value) => {
      return /^[A-Za-zàáâäèéêëïùûÀÁÂÄÈÉÊËÏÙÛ]{3,20}$/.test(value)
    };

    const regexMail = (value) => {
      return /^[\w-.]+@([\w-]+\.)+[\w-]{2,3}$/.test(value);
    };

    const regexAdresse = (value) => {
      return /^[A-Za-z0-9àáâäèéêëïùûÀÁÂÄÈÉÊËÏÙÛ,\s]{5,50}$/.test(value);
    };


    //FONCTIONS DE CONTROLES
    function controlePrenom() {
      //contrôle de la validité du prénom
      const lePrenom = formObject.prenom;
      if (regexPrenomNomVille(lePrenom)) {
        document.getElementById('badPrenomInput').textContent = "";
        return true;
      } else {
        document.getElementById('badPrenomInput').textContent = "Veuillez bien renseigner votre prénom";
        return false;
      }
    };

    function controleNom() {
      //contrôle de la validité du nom
      const leNom = formObject.nom;
      if (regexPrenomNomVille(leNom)) {
        document.getElementById('badNomInput').textContent = "";
        return true;
      } else {
        document.getElementById('badNomInput').textContent = "Veuillez bien renseigner votre nom";
        return false;
      }
    };

    function controleVille() {
      //contrôle de la validité du nom
      const laVille = formObject.ville;
      if (regexPrenomNomVille(laVille)) {
        document.getElementById('badVilleInput').textContent = "";
        return true;
      } else {
        document.getElementById('badVilleInput').textContent = "Veuillez bien renseigner votre ville";
        return false;
      }
    };

    function controleMail() {
      //contrôle de la validité du prénom
      const leMail = formObject.mail;
      if (regexMail(leMail)) {
        document.getElementById('badMailInput').textContent = "";
        return true;
      } else {
        document.getElementById('badMailInput').textContent = "Veuillez bien renseigner votre mail";
        return false;
      }
    };

    function controleAdresse() {
      //contrôle de la validité du prénom
      const lAdresse = formObject.adresse;
      if (regexAdresse(lAdresse)) {
        document.getElementById('badAdressInput').textContent = "";
        return true;
      } else {
        document.getElementById('badAdressInput').textContent = "Veuillez bien renseigner votre adresse";
        return false;
      }
    };

    console.log("controle nom");
    console.log(controleNom());
    console.log("controle prénom");
    console.log(controlePrenom());
    console.log("controle ville");
    console.log(controleVille());
    console.log("controle mail");
    console.log(controleMail());
    console.log("controle adresse");
    console.log(controleAdresse());

    if (controlePrenom() && controleNom() && controleVille() && controleMail() && controleAdresse()) {
      //mettre objet formObject dans local storage
      localStorage.setItem("formObject", JSON.stringify(formObject));
    } else {
      alert('Votre formulaire comporte une erreur, veuillez le vérifier svp')
    }


    //mettre les values du form et mettre les produits selectionnés dans l'objet à envoyer vers le serveur
    const aEnvoyer = {
      productsForLocalStorage,
      formObject
    }
    console.log('aEnvoyer');
    console.log(aEnvoyer);
  });

  //mettre contenu du local storage dans formulaire
  //prendre la key formObject du local Storage et la mettre dans une variable
  const dataFormStorage = localStorage.getItem("formObject");
  // convertir la chaine de caractère en objet js
  const dataFormStorageObjet = JSON.parse(dataFormStorage);

  document.getElementById('formNom').value = dataFormStorageObjet.nom;
  document.getElementById('formPrenom').value = dataFormStorageObjet.prenom;
  document.getElementById('formMail').value = dataFormStorageObjet.mail;
  document.getElementById('formAdresse').value = dataFormStorageObjet.adresse;
  document.getElementById('formVille').value = dataFormStorageObjet.ville;


};







/**********************************************************************************************************/
/******************************************Envoi du formulaire*********************************************/
/**********************************************************************************************************/


/*
//Fonction request post de l'API
sendData = (objetRequest) => {
  return new Promise((resolve) => {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (this.readyState == XMLHttpRequest.DONE && this.status == 201) {
        //Sauvegarde du retour de l'API dans la sessionStorage pour affichage dans order-confirm.html
        sessionStorage.setItem("order", this.responseText);

        //Chargement de la page de confirmation
        document.forms["form-panier"].action = '/index-confirmation.html';
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
validForm = () => {
  //Ecoute de l'event click du formulaire
  let btnForm = document.getElementById("envoiPost");
  btnForm.addEventListener("click", function () {
    //Lancement des verifications du panier et du form => si Ok envoi
    if (checkCart() == true && checkInput() != null) {
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
    } else {
      console.log("Administration : ERROR");
    };
  });
};

*/


/**********************************************************************************************************/
/**************************Affichage des informations sur la page de confirmation**************************/
/**********************************************************************************************************/

/*
//Affichage des informations sur la page de confirmation
resultOrder = () => {
  if (sessionStorage.getItem("order") != null) {
    //Parse du session storage
    let order = JSON.parse(sessionStorage.getItem("order"));
    //Implatation de prénom et de id de commande dans le html sur la page de confirmation
    document.getElementById("lastName").innerHTML = order.contact.lastName
    document.getElementById("orderId").innerHTML = order.orderId

    //Suppression de la clé du sessionStorage pour renvoyer au else si actualisation de la page ou via url direct
    sessionStorage.removeItem("order");
  } else {
    //avertissement et redirection vers l'accueil
    alert("Aucune commande passée, vous êtes arrivé ici par erreur");
    window.open("index.html");
  }
}
*/
