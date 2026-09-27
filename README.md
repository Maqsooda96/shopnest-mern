# 🛒 ShopNest – MERN E-Commerce Application

ShopNest is a full-stack e-commerce web application built using the MERN stack. It provides separate functionality for customers, sellers, and administrators, including product management, shopping cart, checkout, order management, and administrative controls.

## 🚀 Features

### 👤 Customer
- User registration and login
- JWT-based authentication
- Browse and search products
- Filter products by category
- Sort products by price
- View product details
- Add products to cart
- Update cart quantities
- Checkout and place orders
- View order history

### 🏪 Seller
- Seller dashboard
- Add new products
- Upload product images
- View seller's products
- Edit product information
- Delete products
- Search products

### 🛡️ Admin
- Admin dashboard
- View total products
- View total orders
- View total customers
- View total revenue
- Manage products
- View all customer orders
- Update order status

## 💻 Tech Stack

### Frontend
- React.js
- Vite
- React Router
- Axios
- Bootstrap
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- Multer

## 🔐 Authentication

ShopNest uses JSON Web Tokens (JWT) for authentication and role-based authorization.

Supported user roles:

- Customer
- Seller
- Admin

Protected routes ensure that users can access only the functionality available to their role.

## 📁 Project Structure

```text
shopnest-mern/
├── backend/
├── frontend/
├── .gitignore
└── README.md
