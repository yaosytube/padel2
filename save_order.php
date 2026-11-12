<?php
// Enregistre une commande de démonstration dans MySQL (base padel_avenue).
header('Content-Type: application/json; charset=utf-8');

// --- Réglages XAMPP par défaut (modifie $password si ton root a un mot de passe) ---
$host = 'localhost';
$db = 'padel_avenue';
$user = 'root';
$password = '';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Méthode non autorisée.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data) || empty($data['items']) || !is_array($data['items'])) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Panier invalide.']);
    exit;
}

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);

    // Les prix viennent de la table products : le navigateur ne peut pas les modifier.
    $find = $pdo->prepare('SELECT name, price FROM products WHERE name = ?');
    $lines = [];
    $total = 0;
    foreach ($data['items'] as $item) {
        $qty = max(1, min(20, (int)($item['qty'] ?? 1)));
        $find->execute([(string)($item['name'] ?? '')]);
        $product = $find->fetch(PDO::FETCH_ASSOC);
        if (!$product) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'error' => 'Produit inconnu.']);
            exit;
        }
        for ($i = 0; $i < $qty; $i++) {
            $lines[] = $product;
            $total += (float)$product['price'];
        }
    }

    $pdo->beginTransaction();
    $pdo->prepare('INSERT INTO orders (total) VALUES (?)')->execute([$total]);
    $orderId = (int)$pdo->lastInsertId();
    $insert = $pdo->prepare('INSERT INTO order_items (order_id, product_name, unit_price) VALUES (?, ?, ?)');
    foreach ($lines as $line) {
        $insert->execute([$orderId, $line['name'], $line['price']]);
    }
    $pdo->commit();

    echo json_encode(['ok' => true, 'order_id' => $orderId, 'total' => $total]);
} catch (PDOException $e) {
    if (isset($pdo) && $pdo->inTransaction()) { $pdo->rollBack(); }
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Erreur base de données. Vérifie que MySQL est démarré et que database.sql est importé.']);
}
