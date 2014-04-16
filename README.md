# “Amazon Store” to demonstrate RESTful Services using NodeJS

##Introduction

Developed a prototype of Amazon Online store called as 'Junior Amazon'. This includes a
client and a server and provides below functionality.

1. User login (Authentication)
2. User can sign up
3. Browse through product depending on the category selected by the user
4. Add/Remove product to/from shopping cart.
5. Shopping cart checkout on making the payment which includes entering a sixteen digit card number.
6. Admin can add new category.
7. Admin can add new products in the category
8. Uses connection pooling for maintaining database connections and better performance.
9. Uses data caching for better response time.

It uses NodeJS framework and demonstrates RESTFul web services while communicating with the server. The application also used front-end framework called Bootstrap and JavaScript library jQuery. The application also uses a JADE templating engine which provides more systematic way to create HTML pages which also helps in avoiding human error like missing end tags.


## System Design
This project mocks the basic functionalities demonstrated by Amazon website listed
above.

###Operating Environment
This project uses node.js platform for it's development and uses express framework
for working with different functionalities provided by node.js. Also, it uses restful calls for
client-server interaction.

###Files and Database Design
The project maintains a separate router and view files for all of its modules at
application level for e.g. signIn, signUp, catalog, shoppingCart etc. For an instance lets
consider catalog module this will contain a catalog.jade for it's view and catalog.js file as
it's router. There is a common.js file which is used by the client for all it's validations and
making ajax calls to the user. MysqlController.js performs connection pooling and
execution of the query.

Database Design : Database contains four tables as USER, CATEGORY, PRODUCT
and SHOPPING_CART. They share references to each other accordingly.

###Human-Machine Interfaces

As the user signIn into the application he is redirected to catalog page. Catalog page
fetch all the product by default and shows all the items to the user. User can choose to
browse through this list of all categories or can select the desired category from the
dropdown provided in the menu bar.
User can add/remove items from the catalog to/from the shopping cart. He can also
choose the quantity of the item he wants to buy. He can proceed to checkout by clicking on
the checkout button provided in the menu bar. Shopping cart page displays all the items
added by the user to the shopping cart, its quantity and total cost of the all products that
need to be paid by the user. He can enter his 16 digit credit card number in the textbox
provided on the right hand side on the shopping cart page. Upon clicking on make
payment button the user will receive a success notification.
A different type of user called Admin can add new products and new categories to the
system. Once they are added they will be reflected to the normal user signing in into the
system.

###Processing Logic :
All communication between the client and server takes place using restful calls. When
the server starts it fetches all the data related to products and categories from the
database and stores it into cache. So, when the user sign in and he is redirected to catalog
page it fetches the list of categories and products from this cache and displays it to the
user. Also, when the admin user add a new product or category it is inserted into the
database and also they are updated in cache.
When user add the item to the shopping cart it makes an request to the server for
adding it to the shopping cart. Server takes the product details and execute a SQL query
to insert it into the database. All the data related to shopping cart is maintained in database
and every time any operation happens on this data the values are updated in database.



### Tools

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   



Nodeclipse is free open-source project that grows with your contributions.
