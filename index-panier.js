  // méthodes pour gérer son panier
  localStorage.setItem(JSON.stringify(['valeur1', 'valeur2'])); // "[\"valeur1\",\"valeur2\"]"); // AJoute la donnée azerty dans monSuperItem
  const monSuperItem = localStorage.getItem(JSON.parse("[\"valeur1\",\"valeur2\"]")); // ['valeur1', 'valeur2']); // Récupère la valeur de "monSuperItem" (azerty dans notre cas)
  localStorage.removeItem('monSuperItem'); // Supprime l'entrée monSuperItem
  localStorage.clear(); // Efface tout !

