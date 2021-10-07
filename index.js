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


/**********************************************************************************************************/
/************************** Affichage du nombre d'articles à coté du lien panier **************************/
/**********************************************************************************************************/


function calculateHowManyItemsInCart() {

  let productsForLocalStorage = JSON.parse(localStorage.getItem('cartLocalStorage'));

  productsInCartQuantity = 0;

  //on pointe le span "itemsInCart" dans le HTML (header) pour y intégrer le résultat
  let itemsInCartSpan = document.getElementById("itemsInCart")

  if (productsForLocalStorage === null) {
    return itemsInCartSpan.innerText = productsInCartQuantity;
  } else {
    //calcul du total de toutes les quantités
    for (x = 0; x < productsForLocalStorage.length; x++) {
      var productsInCartQuantity = productsInCartQuantity + productsForLocalStorage[x].quantity;
    }
    return itemsInCartSpan.innerText = productsInCartQuantity;
  }
}




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

    //ajouter un produit selectionné dans le local storage
    const addProductInLocalStorage = () => {
      productsForLocalStorage.push(optionsTeddyLocalStorage);
      localStorage.setItem('cartLocalStorage', JSON.stringify(productsForLocalStorage));
    }

    //modifier un produit selectionné dans le local storage
    const refreshProductInLocalStorage = () => {
      productsForLocalStorage.push(quantityChanged);
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

//apparition du bouton supprimer quand le panier contient quelque chose
if (localStorage.length === 0) {
  document.getElementById("div__removeAll").remove();
  document.getElementById("envoiPost").remove();
  document.getElementById("form-div").remove();
}

addition = () => {

  // déclaration de la variable "productsForLocalStorage" dans laquelle on met les keys et les values qui sont dans le local storage
  let productsForLocalStorage = JSON.parse(localStorage.getItem('cartLocalStorage'));

  //Vérifie si un produit est dans le panier
  if (JSON.parse(localStorage.getItem("cartLocalStorage")).length > 0) {
    //S'il n'est pas vide on supprime le message et on créé le tableau récapitulatif
    document.getElementById("emptyCart").remove();

    //Création de la structure principale du tableau  
    let facture = document.createElement("table");
    facture.setAttribute("id", "cartTable");
    let lineArray = document.createElement("tr");
    lineArray.setAttribute("id", "lineTitles");

    let nameColumn = document.createElement("th");
    let colorColumn = document.createElement("th");
    let quantityColumn = document.createElement("th");
    let unitPriceColumn = document.createElement("th");

    let totalLine = document.createElement("tr");
    totalLine.setAttribute("id", "totalPriceLine");
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
    quantityColumn.textContent = "Qté";

    lineArray.appendChild(unitPriceColumn);
    unitPriceColumn.textContent = "Prix du nounours";


    //Pour chaque produit du panier, on créé une ligne avec le nom, le prix, etc

    //Init de l'incrémentation de l'id des lignes pour chaque produit
    let i = 1;

    JSON.parse(localStorage.getItem("cartLocalStorage")).forEach((productsForLocalStorage) => {
      //Création de la ligne
      let productLine = document.createElement("tr");
      let productName = document.createElement("td");
      let productColor = document.createElement("td")
      let productQuantity = document.createElement("input");
      productQuantity.type = "number";
      productQuantity.value = productsForLocalStorage.quantity;
      productQuantity.className = "inputCartQty";
      productQuantity.setAttribute("id", "inputCartQuantity");

      let productUnitPrice = document.createElement("td");
      let removeProduct = document.createElement("button");

      //Attribution des class pour le css
      productLine.setAttribute("id", "productLine_" + i++);


      //Insertion dans le HTML
      facture.appendChild(productLine);
      productLine.appendChild(productName);
      productLine.appendChild(productColor);
      productLine.appendChild(productQuantity);
      productLine.appendChild(productUnitPrice);

      //Contenu des lignes
      productName.innerHTML = productsForLocalStorage.selectedProductName;
      productColor.innerHTML = productsForLocalStorage.colorSelected;
      productUnitPrice.textContent = productsForLocalStorage.selectedProductPrice * productsForLocalStorage.quantity + " €";


      //Dernière ligne du tableau : Total
      facture.appendChild(totalLine);
      totalLine.appendChild(refTotalColumn);
      refTotalColumn.textContent = "Total à payer"
      totalLine.appendChild(priceColumn);
      priceColumn.setAttribute("id", "totalPrice")


      /**********************************************************************************************************/
      /*****************************************Vider le panier*****************************************/
      /**********************************************************************************************************/

      let btn_deleteCart = document.getElementById("removeAll");

      btn_deleteCart.addEventListener("click", function () {
        localStorage.clear();
        location.reload();
        console.log(localStorage);
      })
    });

    // Calcul du total de tous les articles
    var totalPrice = 0;

    for (p = 0; p < productsForLocalStorage.length; p++) {
      var totalPrice = totalPrice + productsForLocalStorage[p].subtotal;
    }


    //Affichage du prix total à payer dans l'addition
    /* console.log("Administration : " + totalPrice); */
    document.getElementById("totalPrice").textContent = totalPrice + " €";

  };
















  // Sélection du bouton addToCart
  const refreshCart = document.getElementById('refreshAll');

  // addEventListener - Ecouter le bouton et envoyer le panier
  refreshCart.addEventListener('click', function (ev) {
    ev.preventDefault();

    // Récupération des valeurs
    let quantityChanged = document.getElementById('inputCartQuantity').value;
    console.log("quantityChanged");
    console.log(quantityChanged);


    //Et après perdue O_o

  });







  /**********************************************************************************************************/
  /*************************************Formulaire et vérif etat panier**************************************/
  /**********************************************************************************************************/



  //addeventlistener bouton form
  const btnEnvoyerForm = document.getElementById('envoiPost');


  btnEnvoyerForm.addEventListener("click", (e) => {
    e.preventDefault();

    const contact = {
      firstName: document.getElementById('formPrenom').value,
      lastName: document.getElementById('formNom').value,
      email: document.getElementById('formMail').value,
      address: document.getElementById('formAdresse').value,
      city: document.getElementById('formVille').value
    }

    /********************************************************* Gestion validation du formulaire avant envoi au local Storage *********************************************************/
    //REGEX
    const regexNamesAndCity = (value) => {
      return /^[A-Za-zàáâäèéêëïùûÀÁÂÄÈÉÊËÏÙÛ-]{3,20}$/.test(value)
    };

    const regexMail = (value) => {
      return /^[\w-.]+@([\w-]+\.)+[\w-]{2,3}$/.test(value);
    };

    const regexAddress = (value) => {
      return /^[A-Za-z0-9àáâäèéêëïùûÀÁÂÄÈÉÊËÏÙÛ,\s]{5,50}$/.test(value);
    };


    //FONCTIONS DE CONTROLES
    function firstNameControl() {
      //contrôle de la validité du prénom
      const lePrenom = contact.firstName;
      if (regexNamesAndCity(lePrenom)) {
        document.getElementById('badPrenomInput').textContent = "";
        return true;
      } else {
        document.getElementById('badPrenomInput').textContent = "Veuillez bien renseigner votre prénom";
        return false;
      }
    };

    function lastNameControl() {
      //contrôle de la validité du nom
      const leNom = contact.lastName;
      if (regexNamesAndCity(leNom)) {
        document.getElementById('badNomInput').textContent = "";
        return true;
      } else {
        document.getElementById('badNomInput').textContent = "Veuillez bien renseigner votre nom";
        return false;
      }
    };

    function cityControl() {
      //contrôle de la validité du nom
      const laVille = contact.city;
      if (regexNamesAndCity(laVille)) {
        document.getElementById('badVilleInput').textContent = "";
        return true;
      } else {
        document.getElementById('badVilleInput').textContent = "Veuillez bien renseigner votre ville";
        return false;
      }
    };

    function mailControl() {
      //contrôle de la validité du prénom
      const leMail = contact.email;
      if (regexMail(leMail)) {
        document.getElementById('badMailInput').textContent = "";
        return true;
      } else {
        document.getElementById('badMailInput').textContent = "Veuillez bien renseigner votre mail";
        return false;
      }
    };

    function addressControl() {
      //contrôle de la validité du prénom
      const lAdresse = contact.address;
      if (regexAddress(lAdresse)) {
        document.getElementById('badAdressInput').textContent = "";
        return true;
      } else {
        document.getElementById('badAdressInput').textContent = "Veuillez bien renseigner votre adresse";
        return false;
      }
    };

    console.log("controle nom");
    console.log(lastNameControl());
    console.log("controle prénom");
    console.log(firstNameControl());
    console.log("controle ville");
    console.log(cityControl());
    console.log("controle mail");
    console.log(mailControl());
    console.log("controle adresse");
    console.log(addressControl());

    //mettre objet contact dans local storage
    localStorage.setItem("contact", JSON.stringify(contact));




    /**********************************************************************************************************/
    /******************************************Envoi VERS LE SERVEUR*******************************************/
    /**********************************************************************************************************/

    // Création d'une boucle pour récupérer les Id du panier
    let products = []

    function getCartIds() {
      for (let h = 0; h < productsForLocalStorage.length; h++) {
        let n = productsForLocalStorage[h].selectedProductId;
        products.push(n);
      }
      return products;
    }


    if (firstNameControl() && lastNameControl() && cityControl() && mailControl() && addressControl()) {

      //on récupère les id du panier 
      getCartIds();

      //mettre les values du form et mettre les id des produits selectionnés dans l'objet à envoyer VERS LE SERVEUR
      const aEnvoyer = {
        products,
        contact
      }
      console.log('aEnvoyer');
      console.log(aEnvoyer);


      async function sendPostInformations() {
        let answer = await fetch('https://annaelle-orinoco-api.herokuapp.com/api/teddies/order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          mode: 'cors',
          body: JSON.stringify(aEnvoyer)
        });
        console.log("answer");
        console.log(answer);


        let result = await answer.json();
        console.log("result");
        console.log(result);

        // Si le serveur répond favorablement à la requète, on stocke l'ID de commande dans le localStorage ainsi que le coût total
        // de la commande. Puis on redirige vers la page de confirmation de comma
        if (answer.status === 200 || answer.status === 201) {
          localStorage.setItem("orderId", result.orderId)
          localStorage.setItem("totalPrice", totalPrice)
          window.location.href = "/index-confirmation.html";
        }

      }

      sendPostInformations();

      //en revanche, si les informations saisies ne sont pas validées par les regex, on alerte l'utilisateu du problème


    } else {
      alert('Votre formulaire comporte une erreur, veuillez le vérifier svp')
      console.log('Mauvaise saisie');
    }
  });


  /**********************************************************************************************************/
  /**********************************Remplissage automatique du formulaire***********************************/
  /**********************************************************************************************************/

  //mettre automatiquement le contenu du local storage dans formulaire*********************************************************************
  //prendre la key contact du local Storage et la mettre dans une variable
  const dataFormStorage = localStorage.getItem("contact");
  console.log("dataFormStorage");
  console.log(dataFormStorage);

  // convertir la chaine de caractère en objet JS
  const dataFormStorageObjet = JSON.parse(dataFormStorage);
  console.log("dataFormStorageObjet");
  console.log(dataFormStorageObjet);

  document.getElementById('formNom').value = dataFormStorageObjet.lastName;
  document.getElementById('formPrenom').value = dataFormStorageObjet.firstName;
  document.getElementById('formMail').value = dataFormStorageObjet.email;
  document.getElementById('formAdresse').value = dataFormStorageObjet.address;
  document.getElementById('formVille').value = dataFormStorageObjet.city;
};


/**********************************************************************************************************/
/**************************Affichage des informations sur la page de confirmation**************************/
/**********************************************************************************************************/


//Affichage des informations sur la page de confirmation
resultOrder = () => {
  let firstNameOrder = JSON.parse(localStorage.getItem('contact')).firstName;
  console.log("firstNameOrder");
  console.log(firstNameOrder);

  //Implantation de prénom et de id de commande dans le html sur la page de confirmation
  document.getElementById("thankFirstName").innerHTML = firstNameOrder
  document.getElementById("thankOrderId").innerHTML = localStorage.orderId
  document.getElementById("orderTotalPrice").innerHTML = localStorage.totalPrice + " €"


  localStorage.clear();
  console.log(localStorage);
}
