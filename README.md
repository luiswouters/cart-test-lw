# Cart Test resolution

## About the resolution

To resolve this test, it was created a NPM project, with:

* Webpack, to develop with JS modules and generate a pack to the browser;
* ESlint, to ensure best practices in ES code;
* SASSlint, to ensure best practices in SASS code;
* UglifyJS, to deliver a lighter version of the JS file for the browser;
* Babel, to allow coding with ES6 and newer patterns of coding, without losing retro-compatibility;

Then, it was programmed:

* An HTML products list module;
* An HTML cart module;
* The style for these modules;
* A class that loads products from a json in the products list module and apply functionality in the cart module, allowing to add products from the products list module;

The modules were tested in the latest versions of Crome, Firefox, Safari, Edge and IE 11.

The programmed modules may be viewed and tested in a browser following the steps bellow;

## Running the project

In the Terminal/Bash:

1. Clone the repository;
2. Enter the local folder;
3. Run `npm install`, to install dependencies;
4. Run `npm run server`, to compile code and build a local server;
5. Open http://localhost:9000 in the browsers, to view the programmed components;

## How to test

* In the first load of the page, it will be loaded a list of products, from the json provided;
* Clicking in any of the products, the product clicked will be added to the cart, and the cart will show;
* With the cart open, clicking in the "X", beside each product, will exclude the product from the cart and update the cart info;
* With the cart open, clicking outside the cart will close it;
* The icon in the title of the cart shows the total number of itens in the cart;
* Clicking in another product in the product list will add the product in the cart and open the cart again;
* If the product was clicked already, and the product is in the cart yet, only the quantity will update in the cart list;
* If the user refresh the browser, the products in the cart remain;

## Notes

* As there wasn't an input for size, the size was fixed in 'GGG', but the function waits for a size;
* Jasmine was added to the project, for testing purpose, but no rules were written because of the short time;
* Next steps are refactoring the code and adding Jasmine to the flow;