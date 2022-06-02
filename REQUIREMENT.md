# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

- Index `/products` [GET]
- Create `/products/create` [POST] [token required]
- Read `/products/:id` [GET]
- Update `/products/:id` [PUT] [token required]
- Delete `/products/:id` [DELETE] [token required]

#### Users

- Index `/users` [GET] [token required]
- Create `/users/create` [POST]
- Read `/users/:id` [GET] [token required]
- Update `/users/:id` [PUT] [token required]
- Delete `/users/:id` [DELETE] [token required]
- Auth `/users/auth` [POST]

#### Orders

- Index `/orders` [GET] [token required]
- Create `/orders/create` [POST] [token required]
- Read `/orders/:id` [GET] [token required]
- Update `/orders/:id` [PUT] [token required]
- Delete `/orders/:id` [DELETE] [token required]

## Database Schema

#### Product

CREATE TABLE products (
id SERIAL PRIMARY KEY,
name VARCHAR(250) NOT NULL,
price INTEGER NOT NULL
);

#### User

CREATE TABLE users (
id SERIAL PRIMARY KEY,
username VARCHAR(250) NOT NULL,
firstname VARCHAR(250) NOT NULL,
lastname VARCHAR(250) NOT NULL,
password_digest VARCHAR(250) NOT NULL
);

#### Orders

CREATE TABLE orders (
id SERIAL PRIMARY KEY,
user_id INTEGER NOT NULL REFERENCES users (id),
status BOOLEAN NOT NULL
);

#### order_products

CREATE TABLE order_products (
order_id INTEGER NOT NULL REFERENCES orders (id),
product_id INTEGER NOT NULL REFERENCES products (id),
quantity INTEGER NOT NULL
);

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

- Index
- Show (args: product id)
- Create (args: Product)[token required]
- Delete (args: product id) [token required]

#### Users

- Index [token required]
- Show (args: id)[token required]
- Create (args: User)[token required]

#### Orders

- Index
- Show (args: user id)
- Create order (args: status, user id) [token required]
- Delete (args: order id) [token required]
- Create order with product quantity and product id (args: quantity, order id, product id) [token required]
- Delete order product (args: order product id) [token required]

## Data Shapes

#### Product

- id: number
- name: string
- price: number

#### User

- id: number
- firstname: string
- lastname: string
- password: string

#### Orders

- id: number
- id of each product in the order: number
- quantity of each product in the order: number
- user_id: number
- status of order (active or complete): boolean

## Database Schema

Table "products"
Column | Type | Collation | Nullable | Default  
--------+------------------------+-----------+----------+--------------------------------------
id | integer | | not null | nextval('products_id_seq'::regclass)
name | character varying(250) | | not null |
price | integer | | not null |
Indexes:
"products_pkey" PRIMARY KEY, btree (id)

Table "users"

Column | Type | Collation | Nullable | Default  
----------+-------------------------+-----------+----------+-----------------------------------
id | integer | | not null | nextval('users_id_seq'::regclass)
firstname | character varying(250) | | |
lastname | character varying(250) | | |
username | character varying(250) | | |
password | character varying(250) | | |
Indexes:
"users_pkey" PRIMARY KEY, btree (id)
Referenced by:
TABLE "orders" CONSTRAINT "orders_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)

Table "orders"

Column | Type | Collation | Nullable | Default  
--------+------------------------+-----------+----------+--------------------------------------
id | integer | | not null | nextval('orders_id_seq'::regclass)
status | character varying(100) | | |
user_id | bigint | | |
Indexes:
"orders_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
"orders_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)

Table "order_products"

Column | Type | Collation | Nullable | Default  
-----------+---------+-----------+----------+--------------------------------------------------
id | integer | | not null | nextval('order_products_id_seq'::regclass)
quantity | integer | | |
order_id | bigint | | |
product_id | bigint | | |
Indexes:
"order_products_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
"order_products_order_id_fkey" FOREIGN KEY (order_id) REFERENCES orders(id)
"order_products_product_id_fkey" FOREIGN KEY (product_id) REFERENCES products(id)
