import "babel-polyfill";
require('es6-promise').polyfill();
import "isomorphic-fetch";
import "dom-shims/shim/Element.closest";
import "dom-shims/shim/Element.matches";
import "dom-shims/shim/Element.mutation";

function helloWorld() {
	return 'Hello world!';
}

class CartModule {
	constructor(cart, list, el, cb) {
		this.cart = cart;
		this.cartList = new Set();
		this.cartListOb = [];
		this.cartOpen = false;
		this.productsList = {};
		this.productsListElement = el;
		this.closeCartButton = cb;
		this.loadProductsList(list);
		this.initCart();
		this.loadProductsLocal();
	}

	openCloseCart() {
		const _this = this;
		_this.cart.classList.toggle('closed');
		_this.loadCartList();
		_this.cartOpen = true;
	}

	loadProductsList(list) {
		const _class = this;
		const productsPromisse = fetch(list);
		productsPromisse
			.then((response) => response.json()
				.then((data) => ({
					data,
					status: response.status
				})))
			.then((res) => {
				_class.productsList = res.data.products;
				window.products = _class.productsList;
				_class.loadProductsListInComponent();
			})
			.catch((err) => {
				console.error(err);
			});
	}

	loadProductsListInComponent() {
		const _this = this;
		// Code const html = `<ul><ul>`;
		let productsHtml = '';
		for (const product of _this.productsList) {
			let installments = product.price / product.installments;
			productsHtml += `<div class="products-list-item" data-product-id="${product.sku}">`;
			productsHtml += `	<div class="item-image">`;
			productsHtml += `		<img src="mock-assets/img/produts-list/10547961582846888.jpg" alt="Foto do produto ${product.title}" />`;
			productsHtml += `	</div>`;
			productsHtml += `	<div class="item-info">`;
			productsHtml += `		<p class="info-title">${product.title}</p>`;
			productsHtml += `		<p class="info-price"><span class="currency">${product.currencyFormat}</span>${product.price.toFixed(2)}</p>`;
			if (product.installments > 1) {
				productsHtml += `		<p class="info-installments">ou ${product.installments} x de ${product.currencyFormat}${installments.toFixed(2)}</p>`;
			}
			productsHtml += `	</div>`;
			productsHtml += `</div>`;
		}
		const el = _this.productsListElement;
		el.innerHTML = productsHtml;

		const productsLoaded = document.getElementsByClassName('products-list-item');

		for (const product of productsLoaded) {
			product.addEventListener('click', function(evt) {
				if (_this.cartOpen === false) {
					_this.cartList.add(product.dataset.productId);
					_this.addProductsToCart(product.dataset.productId, 'GGG');
					_this.openCloseCart();
				}
				evt.preventDefault();
			});
		}
	}

	loadCartList() {
		var _this = this;
		window.teste = _this.cartListOb;

		let cartItensHTML = '';
		_this.cartListOb.forEach((product) => {
			const [productInfo] = _this.productsList.filter((item) => item.sku == product.sku);
			cartItensHTML += `<div class="cart-list-item">`;
			cartItensHTML += `	<div class="item-image">`;
			cartItensHTML += `		<img src="mock-assets/img/produts-list/miniatures/876661122392077.jpg" alt="Foto do produto ${productInfo.title}" />`;
			cartItensHTML += `	</div>`;
			cartItensHTML += `	<div class="item-info">`;
			cartItensHTML += `		<div class="info-title">${productInfo.title}</div>`;
			cartItensHTML += `		<div class="info-description-line-1">GGG | ${productInfo.style}</div>`;
			cartItensHTML += `		<div class="info-description-line-2">Quantidade: ${product.quantity}</div>`;
			cartItensHTML += `		<div class="info-price">${productInfo.currencyFormat}<span class="value">${productInfo.price.toFixed(2)}</span></div>`;
			cartItensHTML += `		<a href="#" class="cart-item-exclude-button" data-product-id="${product.id}">Excluir</a>`;
			cartItensHTML += `	</div>`;
			cartItensHTML += `</div>`;
		});
		const cart = document.querySelector('.cart-itens-list');
		cart.innerHTML = cartItensHTML;

		_this.cartCounterAndPriceUpdate();

		const cartLoadedExcludeButtons = document.getElementsByClassName('cart-item-exclude-button');

		for (const button of cartLoadedExcludeButtons) {
			button.addEventListener('click', function(evt) {
				_this.cartList.delete(button.dataset.productId);
				const findProduct = _this.cartListOb.findIndex((product) => product.id == button.dataset.productId);
				_this.cartListOb.splice(findProduct, 1);
				button.closest('.cart-list-item').classList.add('excluded');
				setTimeout(function() {
					button.closest('.cart-list-item').remove();
				}, 500);
				_this.storeProductsLocal();
				_this.cartCounterAndPriceUpdate();
				evt.preventDefault();
			});
		}
	}

	initCart() {
		const _this = this;
		window.button = _this.closeCartButton;
		_this.closeCartButton.addEventListener('click', function(evt) {
			if (_this.cartOpen === true) {
				_this.openCloseCart();
				_this.cartOpen = false;
			}
			evt.preventDefault();
		});
	}

	addProductsToCart(sku, size) {
		const _this = this;
		let quantity = 1;
		const findProduct = _this.cartListOb.filter((item) => item.sku == sku && item.size == size);
		if (findProduct.length > 0) {
			quantity = findProduct[0].quantity + 1;
			findProduct[0].quantity = quantity;
		} else {
			_this.cartListOb.push({
				id: _this.cartListOb.length + 1,
				sku,
				quantity,
				size,
			});
		}
		_this.storeProductsLocal();
	}

	cartCounterAndPriceUpdate () {
		var _this = this;
		let total = 0;
		let itens = 0;
		let installments = 1;
		_this.cartListOb.forEach((product) => {
			const [productInfo] = _this.productsList.filter((item) => item.sku == product.sku);
			if (productInfo.installments > installments) {
				installments = Number(productInfo.installments);
			}
			itens += product.quantity;
			total += productInfo.price * product.quantity;
		});

		const el = document.querySelector('.cart-info-products-added');
		if (itens > 9) {
			itens = '9+';
		}
		el.innerHTML = itens;


		const cartInfoTotal = document.querySelector('.cart-info-total');
		cartInfoTotal.innerHTML = total.toFixed(2);

		const cartInfoTotalInstallmentsPrice = document.querySelector('.cart-info-total-installments-price');
		cartInfoTotalInstallmentsPrice.innerHTML = (total / installments).toFixed(2);

		const cartInfoTotalInstallments = document.querySelector('.cart-info-total-installments');
		cartInfoTotalInstallments.innerHTML = installments;
	}

	completePurchase() {
		console.log(this);
	}

	storeProductsLocal() {
		const _this = this;
		const cartListJson = JSON.stringify(_this.cartListOb);
		localStorage.setItem('cartListJson', cartListJson);
	}

	loadProductsLocal() {
		const _this = this;
		const cartListJsonStored = localStorage.getItem('cartListJson');
		if (cartListJsonStored) {
			_this.cartListOb = JSON.parse(cartListJsonStored);
		}
	}
}

// For test purposes:


const [cart] = document.getElementsByClassName('products-cart');
const list = '/data/products.json';
const listElement = document.querySelector('.products-list');
const closeButton = document.querySelector('.cart-close');

window.runCartModule = new CartModule(cart, list, listElement, closeButton);