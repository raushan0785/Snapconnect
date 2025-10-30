# SnapConnect - A Social Networking Web Application
SnapConnect is a dynamic social networking platform built with Node.js, Express, MongoDB, and Passport.js. It offers a seamless experience for users to sign up, log in, create posts, interact with friends, and share content within a responsive and interactive user interface.

# Features
## 1. User Authentication:
Secure sign-up and login using Passport.js, with email/password authentication.

## 2. Post Creation:
Users can create, view, and delete posts.

## 3. Friends List:
Users can view their friends and interact with them via links to their profiles.

## 4. Profile Picture Management: 
Users can upload and update their profile pictures using Multer for file handling.

## 5. Flash Messages:
Success and error messages displayed with Noty.js.

## 6. Responsive Design:
The user interface adjusts to various screen sizes and devices.

## 7. Real-time Interaction:
Users can engage with posts and friends in real-time.

# Installation
## Prerequisites
Make sure you have the following installed:
* Node.js — JavaScript runtime (download from nodejs.org)
* MongoDB — Database management system (download from mongodb.com)

# Project Structure
* `config/`: Configuration files for Passport.js authentication strategy.
* `controllers/`: Contains logic for handling requests related to users, posts, etc.
* `models/`: Mongoose models for interacting with MongoDB (e.g., User, Post).
* `public/`: Static files such as images, CSS, and client-side JavaScript.
* `views/`: EJS templates for rendering dynamic HTML content.
* `routes/`: Define the routes for user actions such as login, posts, etc.
* `assets/`: Contains SCSS for styling and compiled CSS files.

# Technologies Used
### Node.js: 
JavaScript runtime to run server-side code.

### Express: 
Web framework for Node.js to handle HTTP requests.

### MongoDB: 
NoSQL database to store user data, posts, etc.

### Passport.js: 
Middleware to manage user authentication.

### EJS: 
Templating engine for rendering dynamic HTML views.

### Noty.js: 
A lightweight JavaScript library to show notification messages.

### SCSS: 
Sassy CSS for more advanced styling options.

### Multer: 
Middleware for handling file uploads (e.g., profile pictures).

### Flash Messages: 
Display success or error messages after actions (login, registration, etc.).

### HTML, CSS, JavaScript:
Used for creating UI/UX.
