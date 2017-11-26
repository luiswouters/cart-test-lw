class CartModule {
	constructor(cart) {
		this.cart = cart;
	}

	openCloseCart() {
		this.cart.classList.toggle('closed');
	}

	loadProductsList() {
		console.log(this);
	}

	loadCartList() {
		console.log(this);
	}

	addProductsToCart() {
		console.log(this);
	}

	removeProductsOfTheCart() {
		console.log(this);
	}

	completePurchase() {
		console.log(this);
	}
}

// For test purposes:

const [cart] = document.getElementsByClassName('products-cart');

window.runCartModule = new CartModule(cart);