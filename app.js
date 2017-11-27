import "babel-polyfill";
require('es6-promise').polyfill();
import "isomorphic-fetch";

class CartModule {
	constructor(cart, list, el, iclass) {
		this.cart = cart;
		this.cartList = new Set();
		this.productsList = {};
		this.productsListElement = el;

		this.loadProductsList(list);
	}

	openCloseCart() {
		const _this = this;
		_this.loadCartList();
		_this.cart.classList.toggle('closed');
		console.log(_this.cartList.size);

		const el = document.querySelector('.cart-info-products-added');
		el.innerHTML = _this.cartList.size;

		let cartItensHTML = '';
		let total = 0;
		for (const product of _this.cartList) {

			const [productInfo] = _this.productsList.filter((item) => item.sku == product);
			console.log(productInfo);
			cartItensHTML += `<div class="cart-list-item">`;
			cartItensHTML += `	<div class="item-image">`;
			cartItensHTML += `		<img src="mock-assets/img/produts-list/miniatures/876661122392077.jpg" alt="Foto do produto ${productInfo.title}" />`;
			cartItensHTML += `	</div>`;
			cartItensHTML += `	<div class="item-info">`;
			cartItensHTML += `		<div class="info-title">${productInfo.title}</div>`;
			cartItensHTML += `		<div class="info-description-line-1">GGG | ${productInfo.style}</div>`;
			cartItensHTML += `		<div class="info-description-line-2">Quantidade: 1</div>`;
			cartItensHTML += `		<div class="info-price">${productInfo.currencyFormat}<span class="value">${productInfo.price}</span></div>`;
			cartItensHTML += `		<a href="#" class="cart-item-exclude-button" data-product-id="${productInfo.sku}">Excluir</a>`;
			cartItensHTML += `	</div>`;
			cartItensHTML += `</div>`;

			total += productInfo.price;
		}

		const cart = document.querySelector('.cart-itens-list');
		cart.innerHTML = cartItensHTML;

		const cartInfoTotal = document.querySelector('.cart-info-total');
		cartInfoTotal.innerHTML = total.toFixed(2);

		const cartInfoTotalInstallments = document.querySelector('.cart-info-total-installments');
		cartInfoTotalInstallments.innerHTML = (total / 10).toFixed(2);

		const cartLoadedExcludeButtons = document.getElementsByClassName('cart-item-exclude-button');

		for (const button of cartLoadedExcludeButtons) {
			button.addEventListener('click', function(evt) {
				_this.cartList.delete(button.dataset.productId);
				_this.openCloseCart();
				evt.preventDefault();
				console.log(_this.cartList);
			});
		}
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
			productsHtml += `		<p class="info-installments">ou ${product.installments} x de ${product.currencyFormat}${installments.toFixed(2)}</p>`;
			productsHtml += `	</div>`;
			productsHtml += `</div>`;
		}
		const el = _this.productsListElement;
		el.innerHTML = productsHtml;

		const productsLoaded = document.getElementsByClassName('products-list-item');

		for (const product of productsLoaded) {
			product.addEventListener('click', function(evt) {
				_this.cartList.add(product.dataset.productId);
				_this.openCloseCart();
				evt.preventDefault();
				console.log(_this.cartList);
			});
		}
	}

	loadCartList() {
		console.log(this.cartList);
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
const list = '/data/products.json';
const listElement = document.querySelector('.products-list');

window.runCartModule = new CartModule(cart, list, listElement);