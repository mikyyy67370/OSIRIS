// Mapping des produits et leurs prix
const productData = {
    'ANUBIS': { price: 299.00, image: 'images/collection1.jpg' },
    'BASTET': { price: 289.00, image: 'images/collection6.jpg' },
    'HATHOR': { price: 289.00, image: 'images/collection5.jpg' },
    'HORUS': { price: 280.00, image: 'images/parfum3.jpg' },
    'ISIS': { price: 269.00, image: 'images/collection4.jpg' },
    'NEFERTITI': { price: 289.00, image: 'images/collection8.jpg' },
    'OSIRIS ROYAL': { price: 399.00, image: 'images/collection2.jpg' },
    'SEKHMET': { price: 279.00, image: 'images/collection3.jpg' },
    'THOT': { price: 299.00, image: 'images/collection7.jpg' }
};

document.addEventListener('DOMContentLoaded', function() {
    // Gestion des sélecteurs de volume
    const volumeButtons = document.querySelectorAll('.option-buttons .option-btn');
    let selectedVolume = '100ml'; // Volume par défaut

    volumeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Retirer la classe active de tous les boutons
            volumeButtons.forEach(btn => btn.classList.remove('active'));
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            selectedVolume = this.textContent;
            updatePrice();
        });
    });

    // Gestion de la quantité
    const quantityInput = document.getElementById('quantity');
    const minusBtn = document.querySelector('.qty-btn.minus');
    const plusBtn = document.querySelector('.qty-btn.plus');

    if (minusBtn) {
        minusBtn.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
    }

    if (plusBtn) {
        plusBtn.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue < 10) {
                quantityInput.value = currentValue + 1;
            }
        });
    }

    // Gestion des miniatures de la galerie
    const thumbnails = document.querySelectorAll('.gallery-thumbnails img');
    const mainImage = document.querySelector('.main-image');

    if (thumbnails.length && mainImage) {
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                // Mettre à jour l'image principale
                mainImage.src = this.src;
                mainImage.alt = this.alt;
                
                // Mettre à jour la classe active
                thumbnails.forEach(thumb => thumb.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    // Gérer l'ajout au panier
    const addToCartBtn = document.querySelector('.add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const productName = document.querySelector('.product-header h1').textContent;
            const quantity = parseInt(quantityInput.value);
            
            if (productData[productName]) {
                const { price, image } = productData[productName];
                addToCart(productName, price, image, selectedVolume, quantity);
            }
        });
    }
});

// Mettre à jour l'affichage du prix en fonction du volume
function updatePrice() {
    const priceElement = document.querySelector('.price');
    const productName = document.querySelector('.product-header h1').textContent;
    
    if (priceElement && productData[productName]) {
        let basePrice = productData[productName].price;
        let finalPrice = basePrice;

        // Ajuster le prix en fonction du volume
        const selectedVolume = document.querySelector('.option-buttons .option-btn.active').textContent;
        switch (selectedVolume) {
            case '50ml':
                finalPrice = basePrice * 0.7;
                break;
            case '150ml':
                finalPrice = basePrice * 1.4;
                break;
            // 100ml utilise le prix de base
        }

        priceElement.textContent = `${finalPrice.toFixed(2)}€`;
    }
}

// Fonction d'ajout au panier
function addToCart(productName, basePrice, image, volume, quantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Ajuster le prix en fonction du volume
    let price = basePrice;
    switch (volume) {
        case '50ml':
            price = basePrice * 0.7;
            break;
        case '150ml':
            price = basePrice * 1.4;
            break;
        // 100ml utilise le prix de base
    }

    // Vérifier si le produit existe déjà dans le panier avec le même volume
    const existingItemIndex = cart.findIndex(item => 
        item.name === productName && item.volume === volume
    );

    if (existingItemIndex !== -1) {
        // Mettre à jour la quantité si le total ne dépasse pas 10
        const newQuantity = cart[existingItemIndex].quantity + quantity;
        if (newQuantity <= 10) {
            cart[existingItemIndex].quantity = newQuantity;
        }
    } else {
        // Ajouter un nouvel article
        cart.push({
            name: productName,
            price: price,
            image: image,
            volume: volume,
            quantity: quantity
        });
    }

    // Sauvegarder le panier
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Mettre à jour le compteur du panier
    updateCartCount();
}

// Mettre à jour le compteur du panier
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    
    const cartCounts = document.querySelectorAll('.cart-count');
    cartCounts.forEach(count => {
        count.textContent = totalItems;
    });
}

// Initialiser le compteur au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    updatePrice();
});
