# Padel Avenue

Projet académique fictif : HTML, CSS, JavaScript, PHP, MySQL.
Le même code fonctionne de deux façons :
- **XAMPP (PHP + MySQL)** : la commande est enregistrée dans la base `padel_avenue`.
- **GitHub Pages (sans PHP)** : la commande est gardée dans le navigateur (localStorage).

## Option 1 : XAMPP
1. Copie le dossier dans `C:\xampp\htdocs\` (résultat : `C:\xampp\htdocs\padel-avenue\`).
2. Démarre **Apache** et **MySQL** dans XAMPP.
3. Ouvre `http://localhost/phpmyadmin` > **Importer** > choisis `database.sql` > **Exécuter**.
4. Ouvre `http://localhost/padel-avenue/`.
5. Ajoute des articles, clique sur "Enregistrer la commande". Vérifie dans phpMyAdmin > `padel_avenue` > `orders` et `order_items`.

Si ton MySQL root a un mot de passe, modifie `$password` dans `php/save_order.php`.
Ne double-clique pas sur `index.html` : utilise l'adresse `localhost`.

## Option 2 : GitHub Pages
1. Envoie tous les fichiers à la racine d'un dépôt GitHub.
2. Settings > Pages > Deploy from a branch > `main` > `/ (root)` > Save.
3. Le site est en ligne sur `https://TON-PSEUDO.github.io/NOM-DU-DEPOT/`.

## Structure
`index.html`, `style.css`, `script.js` · `php/save_order.php` · `database.sql` · `assets/` (images SVG)
