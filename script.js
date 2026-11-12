// Panier Padel Avenue.
// XAMPP : la commande est envoyée à php/save_order.php (MySQL).
// GitHub Pages (pas de PHP) : repli automatique sur localStorage.
(function () {
  var CART_KEY = 'padel_cart', ORDERS_KEY = 'padel_orders';
  var cart = load(CART_KEY, []);
  var $ = function (id) { return document.getElementById(id); };

  function load(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch (e) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function render() {
    var box = $('cart-items'), count = 0, total = 0;
    if (!cart.length) {
      box.textContent = 'Votre panier est vide.';
    } else {
      box.innerHTML = cart.map(function (it, i) {
        count += it.qty; total += it.qty * it.price;
        return '<div class="cart-line"><span>' + esc(it.name) + ' — ' + it.price + ' DT</span>' +
          '<span class="qty"><button data-act="minus" data-i="' + i + '" aria-label="Retirer une unité de ' + esc(it.name) + '">−</button>' +
          '<strong>' + it.qty + '</strong>' +
          '<button data-act="plus" data-i="' + i + '" aria-label="Ajouter une unité de ' + esc(it.name) + '">+</button>' +
          '<button class="remove-button" data-act="remove" data-i="' + i + '">Supprimer</button></span></div>';
      }).join('');
    }
    $('cart-count').textContent = count;
    $('total').textContent = total;
    $('checkout').disabled = !cart.length;
    save(CART_KEY, cart);
  }

  document.addEventListener('click', function (e) {
    var add = e.target.closest('.add-button');
    if (add) {
      var name = add.dataset.name, price = Number(add.dataset.price);
      var found = cart.filter(function (it) { return it.name === name; })[0];
      if (found) found.qty++; else cart.push({ name: name, price: price, qty: 1 });
      $('cart-message').textContent = name + ' ajouté au panier.';
      render();
      return;
    }
    var btn = e.target.closest('[data-act]');
    if (!btn) return;
    var i = Number(btn.dataset.i);
    if (btn.dataset.act === 'plus') cart[i].qty++;
    if (btn.dataset.act === 'minus' && --cart[i].qty <= 0) cart.splice(i, 1);
    if (btn.dataset.act === 'remove') cart.splice(i, 1);
    render();
  });

  function finish(id, total, where) {
    cart = [];
    render();
    $('cart-message').textContent = 'Commande n° ' + id + ' enregistrée ' + where + ' (simulation, total ' + total + ' DT). Aucun paiement réel.';
  }

  // Essaie d'abord PHP/MySQL (XAMPP). Sans serveur PHP (GitHub Pages), la commande reste dans le navigateur.
  $('checkout').addEventListener('click', function () {
    if (!cart.length) return;
    var btn = $('checkout');
    btn.disabled = true;
    fetch('php/save_order.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart })
    }).then(function (r) {
      return r.json().then(function (d) { return { ok: r.ok && d.ok, d: d }; });
    }).then(function (res) {
      if (!res.ok) throw new Error('php');
      finish(res.d.order_id, res.d.total, 'dans MySQL');
    }).catch(function () {
      var orders = load(ORDERS_KEY, []);
      var total = cart.reduce(function (s, it) { return s + it.qty * it.price; }, 0);
      var id = orders.length + 1;
      orders.push({ id: id, total: total, date: new Date().toISOString(), items: cart });
      save(ORDERS_KEY, orders);
      finish(id, total, 'dans le navigateur');
    });
  });

  render();
})();
