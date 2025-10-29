document.addEventListener('DOMContentLoaded', function() {

    // --- LÓGICA DEL MODAL DE PRODUCTO (SIN CAMBIOS) ---
    const productModal = document.getElementById('product-modal');
    if (productModal) {
        // ... (el código del modal de producto que ya tienes está bien) ...
        const addToCartBtn = productModal.querySelector('.add-to-cart-btn');
        const closeProductButton = productModal.querySelector('.close-button');

        window.openModal = function(cardElement) {
            const name = cardElement.getAttribute('data-name');
            const price = parseFloat(cardElement.getAttribute('data-price').replace('S/ ', ''));
            const img = cardElement.getAttribute('data-img');
            const desc = cardElement.getAttribute('data-desc');
            const type = cardElement.getAttribute('data-type');
            const size = cardElement.getAttribute('data-size');
            
            document.getElementById('modal-name').textContent = name;
            document.getElementById('modal-price').textContent = `S/ ${price.toFixed(2)}`;
            document.getElementById('modal-img').src = img;
            document.getElementById('modal-desc').textContent = desc;
            document.getElementById('modal-type').innerHTML = `<strong>Tipo:</strong> ${type}`;
            document.getElementById('modal-size').innerHTML = `<strong>Tamaño:</strong> ${size}`;
            
            addToCartBtn.setAttribute('data-name', name);
            addToCartBtn.setAttribute('data-price', price);
            addToCartBtn.setAttribute('data-img', img);
            
            productModal.style.display = "block";
        }
        
        function closeProductModal() { productModal.style.display = "none"; }
        
        closeProductButton.onclick = closeProductModal;
        addToCartBtn.onclick = function() {
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            const img = this.getAttribute('data-img');
            
            addItemToCart({ name, price, img });
            closeProductModal();
        };
    }

    // --- LÓGICA DEL CARRITO DE COMPRAS (ACTUALIZADA) ---
    const cartModal = document.getElementById('cart-modal');
    const cartIcon = document.querySelector('.cart-icon-container');
    const closeCartButton = document.querySelector('.close-cart-button');
    const cartCounter = document.getElementById('cart-counter');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalPriceEl = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    let cart = [];

    // === NUEVAS FUNCIONES PARA AJUSTAR CANTIDAD ===
    window.increaseQuantity = function(productName) {
        const product = cart.find(item => item.name === productName);
        if (product) {
            product.quantity++;
            updateCart();
        }
    }
    
    window.decreaseQuantity = function(productName) {
        const product = cart.find(item => item.name === productName);
        if (product) {
            product.quantity--;
            if (product.quantity <= 0) {
                // Si la cantidad llega a 0, eliminamos el producto
                removeItemFromCart(productName);
            } else {
                updateCart();
            }
        }
    }
    // ===============================================

    function addItemToCart(product) {
        const existingProduct = cart.find(item => item.name === product.name);
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCart();
    }
    
    function removeItemFromCart(productName) {
        cart = cart.filter(item => item.name !== productName);
        updateCart();
    }

    function updateCart() {
        renderCartItems();
        updateCartCounter();
        updateCartTotal();
        updateCheckoutLink();
    }
    
    function renderCartItems() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="cart-empty-message">Tu carrito está vacío.</p>';
            return;
        }

        // === HTML DEL CARRITO ACTUALIZADO CON CONTROLES DE CANTIDAD ===
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}">
                <div class="cart-item-info">
                    <p class="cart-item-name">${item.name}</p>
                    <p class="cart-item-price">S/ ${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-quantity-controls">
                    <button class="quantity-btn" onclick="decreaseQuantity('${item.name}')">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="increaseQuantity('${item.name}')">+</button>
                </div>
            </div>
        `).join('');
        // =============================================================
    }

    function updateCartCounter() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCounter.textContent = totalItems;
        cartCounter.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    function updateCartTotal() {
        const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartTotalPriceEl.textContent = `S/ ${totalPrice.toFixed(2)}`;
    }

    function updateCheckoutLink() {
        if (cart.length === 0) {
            checkoutBtn.classList.add('disabled');
            return;
        }
        checkoutBtn.classList.remove('disabled');
        const phoneNumber = "51986510573";
        let message = "Hola Dunes Parfums, quisiera hacer el siguiente pedido:\n\n";
        cart.forEach(item => {
            message += `*Perfume:* ${item.name}\n`;
            message += `*Cantidad:* ${item.quantity}\n`;
            message += `*Subtotal:* S/ ${(item.price * item.quantity).toFixed(2)}\n\n`;
        });
        const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        message += `*TOTAL DEL PEDIDO:* S/ ${totalPrice.toFixed(2)}\n\n`;
        message += "Quedo a la espera de su confirmación. ¡Gracias!";
        checkoutBtn.href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    }

    // Lógica para abrir/cerrar modales
    function openCartModal() { if (cartModal) cartModal.style.display = 'block'; }
    function closeCartModal() { if (cartModal) cartModal.style.display = 'none'; }
    cartIcon.onclick = openCartModal;
    if (closeCartButton) closeCartButton.onclick = closeCartModal;
    window.onclick = function(event) {
        if (event.target == productModal) productModal.style.display = "none";
        if (event.target == cartModal) cartModal.style.display = "none";
    }

    updateCart();
});
