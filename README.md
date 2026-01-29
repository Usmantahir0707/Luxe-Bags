
# Luxe Bags API

This project is a Node.js backend server for the Luxe Bags e-commerce platform, built using Express and MongoDB. It provides a complete RESTful API for managing users, orders, products, and uploads, including both public endpoints (accessible by customers) and admin-only endpoints for store management.

The API is designed to be modular and scalable, with separate routes, controllers, and models, making it easy to extend or integrate with any frontend application. All routes follow standard REST conventions, and protected routes use JWT authentication for secure access.

## Features

- ✅ User authentication with email verification
- ✅ Password reset functionality
- ✅ Social login (Google & Facebook) - *optional, server works without it*
- ✅ Product management (CRUD operations)
- ✅ Order management with status tracking
- ✅ File uploads via Cloudinary
- ✅ Admin panel functionality
- ✅ Email notifications with beautiful templates

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)
- Gmail account (for email functionality)
- Cloudinary account (for image uploads)
- Twilio account (for WhatsApp messaging)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd luxe-bags-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**

   Create a `.env` file in the root directory with the following variables:

   ```env
   # Database
   MONGO_URI=mongodb+srv://your-mongodb-connection-string

   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key

   # Cloudinary (for image uploads)
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret

   # Email Configuration (for verification emails)
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-gmail-app-password

   # URLs
   BACKEND_URL=https://your-backend-url.com
   FRONTEND_URL=https://your-frontend-url.com

   # Social Auth (Optional - server works without these)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   FACEBOOK_APP_ID=your-facebook-app-id
   FACEBOOK_APP_SECRET=your-facebook-app-secret

   # WhatsApp Configuration (Twilio)
   TWILIO_ACCOUNT_SID=your-twilio-account-sid
   TWILIO_AUTH_TOKEN=your-twilio-auth-token
   TWILIO_WHATSAPP_NUMBER=your-twilio-whatsapp-number
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

### Email Setup

The server uses Gmail to send verification and password reset emails. To set this up:

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password: Go to Google Account → Security → 2-Step Verification → App passwords
3. Use this app password (not your regular password) for `EMAIL_PASS`

### WhatsApp Setup (Twilio)

The server uses Twilio to send and receive WhatsApp messages. To set this up:

1. **Create a Twilio Account:**
   - Sign up at [Twilio](https://www.twilio.com/)
   - Verify your account with a phone number

2. **Get WhatsApp Enabled:**
   - In your Twilio Console, go to Messaging → Settings → WhatsApp
   - Follow the instructions to enable WhatsApp

3. **Get Your Credentials:**
   - Account SID: Found in your Twilio Console Dashboard
   - Auth Token: Found in your Twilio Console Dashboard
   - WhatsApp Number: The WhatsApp-enabled number provided by Twilio (starts with whatsapp:)

4. **Configure Webhook:**
   - In Twilio Console, go to Messaging → Settings → WhatsApp
   - Set the webhook URL to: `YOUR_BACKEND_URL/api/whatsapp/receive`
   - Method: HTTP POST

5. **Add Environment Variables:**
   - `TWILIO_ACCOUNT_SID`: Your Twilio Account SID
   - `TWILIO_AUTH_TOKEN`: Your Twilio Auth Token
   - `TWILIO_WHATSAPP_NUMBER`: Your WhatsApp-enabled Twilio number (without whatsapp: prefix)

**Note:** For production, enable request validation in the webhook settings for security.

### Social Authentication (Optional)

To enable Google and Facebook login:

1. **Google OAuth:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create/select a project
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `YOUR_BACKEND_URL/api/auth/google/callback`

2. **Facebook OAuth:**
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Create an app
   - Add Facebook Login product
   - Add redirect URI: `YOUR_BACKEND_URL/api/auth/facebook/callback`

## API Documentation

This documentation provides a complete reference for all endpoints, including:

- HTTP method and URL
- Required headers
- Example request bodies
- Example responses
- Access level (public, protected, or admin-only)

**Note:** Social login endpoints (Google/Facebook) will return 404 if credentials are not configured.



API Documentation
////////  Auth Routes  ///////////

///////////////////////////////////////////////////////////////////////////////////////
* Register User (Public) ****

Method: POST

URL: /api/auth/register

Body (JSON):

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}

Response (JSON):

{
  "_id": "64f0c3b2a1d4e12345abcd67",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "customer",
  "verified": false,
  "message": "Registration successful. Please check your email to verify your account."
}
///////////////////////////////////////////////////////////////////////////////////////////
Verify Email (Public) ****

Method: POST

URL: /api/auth/verify-email

Body (JSON):

{
  "token": "verification_token_from_email"
}

Response (JSON):

{
  "message": "Email verified successfully",
  "user": {
    "_id": "64f0c3b2a1d4e12345abcd67",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "verified": true,
    "token": "jwt_token_here"
  }
}
///////////////////////////////////////////////////////////////////////////////////////////
Resend Verification Email (Public) ****

Method: POST

URL: /api/auth/resend-verification

Body (JSON):

{
  "email": "john@example.com"
}

Response (JSON):

{
  "message": "Verification email sent successfully"
}
///////////////////////////////////////////////////////////////////////////////////////////
Forgot Password (Public) ****

Method: POST

URL: /api/auth/forgot-password

Body (JSON):

{
  "email": "john@example.com"
}

Response (JSON):

{
  "message": "Password reset email sent successfully"
}
///////////////////////////////////////////////////////////////////////////////////////////
Reset Password (Public) ****

Method: POST

URL: /api/auth/reset-password

Body (JSON):

{
  "token": "reset_token_from_email",
  "password": "newpassword123"
}

Response (JSON):

{
  "message": "Password reset successfully"
}
///////////////////////////////////////////////////////////////////////////////////////////
Login User (Public) ****

Method: POST

URL: /api/auth/login

Body (JSON):

{
  "email": "john@example.com",
  "password": "secret123"
}

Response (JSON):

{
  "_id": "64f0c3b2a1d4e12345abcd67",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "customer",
  "verified": true,
  "token": "jwt_token_here"
}
///////////////////////////////////////////////////////////////////////////////////////////
Google Login (Public) ****

Method: GET

URL: /api/auth/google

Response: Redirects to Google OAuth
///////////////////////////////////////////////////////////////////////////////////////////
Google OAuth Callback (Internal) ****

Method: GET

URL: /api/auth/google/callback

Response: Redirects to frontend with token
///////////////////////////////////////////////////////////////////////////////////////////
Facebook Login (Public) ****

Method: GET

URL: /api/auth/facebook

Response: Redirects to Facebook OAuth
///////////////////////////////////////////////////////////////////////////////////////////
Facebook OAuth Callback (Internal) ****

Method: GET

URL: /api/auth/facebook/callback

Response: Redirects to frontend with token
///////////////////////////////////////////////////////////////////////////////////////
Get Current User (Protected) ****

Method: GET

URL: /api/auth/me

Headers: Authorization: Bearer <token>

Response (JSON):

{
  "_id": "64f0c3b2a1d4e12345abcd67",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "customer"
}
///////////////////////////////////////////////////////////////////////////////////////
Update Current User (Protected) ****

Method: PUT

URL: /api/auth/me

Headers: Authorization: Bearer <token>

Body (JSON):

{
  "name": "Updated Name",
  "email": "newemail@example.com",
  "password": "newpassword123"
}

Response (JSON):

{
  "_id": "64f0c3b2a1d4e12345abcd67",
  "name": "Updated Name",
  "email": "newemail@example.com",
  "role": "customer"
}
///////////////////////////////////////////////////////////////////////////////////////
Delete Current User (Protected) ****

Method: DELETE

URL: /api/auth/me

Headers: Authorization: Bearer <token>

Response (JSON):

{
  "message": "User deleted successfully"
}
///////////////////////////////////////////////////////////////////////////////////////
Get All Users (Admin Only) ****

Method: GET

URL: /api/auth/users

Headers: Authorization: Bearer <admin-token>

Response (JSON):

[
  {
    "_id": "64f0c3b2a1d4e12345abcd67",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "verified": true
  },
{

  "url": "https://cloudinary.com/uploaded-image-url",

  "public_id": "luxebags/product_image_12345"

}
///////////////////////////////////////////////////////////////////////////////////////
WhatsApp Routes
Receive Message (Public Webhook) ****

Method: POST

URL: /api/whatsapp/receive

Headers: Content-Type: application/x-www-form-urlencoded (Twilio webhook format)

Body (Form-encoded - example from Twilio):

From=whatsapp%3A%2B1234567890&To=whatsapp%3A%2B9876543210&Body=Hello%2C+I+have+a+question+about+my+order.&MessageSid=SM1234567890

Response: TwiML XML (empty response indicates successful processing)

<?xml version="1.0" encoding="UTF-8"?>
<Response></Response>
///////////////////////////////////////////////////////////////////////////////////////
Send Message (Admin Only) ****

Method: POST

URL: /api/whatsapp/send

Headers: Authorization: Bearer <admin-token>

Body (JSON):

{
  "to": "+1234567890",
  "message": "Your order has been completed and is ready for pickup!"
}

Response (JSON):

{
  "messageId": "wamid.abc123def456",
  "status": "sent",
  "message": "Message sent successfully"
}
]
///////////////////////////////////////////////////////////////////////////////////////
Delete Any User (Admin Only) ****

Method: DELETE

URL: /api/auth/users/:id

Headers: Authorization: Bearer <admin-token>

Response (JSON):

{
  "message": "User deleted successfully"
}
///////////////////////////////////////////////////////////////////////////////////////
Order Routes
Create Order (Public) ****

Method: POST

URL: /api/orders

Body (JSON):

{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+1234567890",
  "shippingAddress": {
    "address": "123 Main Street",
    "city": "Springfield",
    "postalCode": "12345",
    "country": "USA"
  },
  "products": [
    {
      "productId": "64f0c3b2a1d4e12345abcd68",
      "quantity": 2,
      "color": "red",
      "size": "M"
    }
  ],
  "totalPrice": 199.99
}

Response (JSON):

{
  "_id": "64f0c3b2a1d4e12345abcd69",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+1234567890",
  "shippingAddress": {
    "address": "123 Main Street",
    "city": "Springfield",
    "postalCode": "12345",
    "country": "USA"
  },
  "products": [
    {
      "productId": "64f0c3b2a1d4e12345abcd68",
      "quantity": 2,
      "color": "red",
      "size": "M"
    }
  ],
  "totalPrice": 199.99,
  "status": "pending",
  "createdAt": "2024-01-03T07:13:52.000Z"
}
///////////////////////////////////////////////////////////////////////////////////////
Cancel Order (Customer, Public) ****

Method: PUT

URL: /api/orders/:id/cancel

Headers: Authorization: optional if logged-in

Body: None

Response (JSON):

{
  "_id": "64f0c3b2a1d4e12345abcd69",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "status": "cancelled",
  "updatedAt": "2024-01-03T07:13:52.000Z"
}
///////////////////////////////////////////////////////////////////////////////////////
Get Order by ID (Public) ****

Method: GET

URL: /api/orders/:id

Response (JSON):

{
  "_id": "64f0c3b2a1d4e12345abcd69",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+1234567890",
  "shippingAddress": {
    "address": "123 Main Street",
    "city": "Springfield",
    "postalCode": "12345",
    "country": "USA"
  },
  "products": [
    {
      "productId": "64f0c3b2a1d4e12345abcd68",
      "quantity": 2,
      "color": "red",
      "size": "M"
    }
  ],
  "totalPrice": 199.99,
  "status": "pending",
  "createdAt": "2024-01-03T07:13:52.000Z",
  "updatedAt": "2024-01-03T07:13:52.000Z"
}
///////////////////////////////////////////////////////////////////////////////////////
Get All Orders (Admin Only) ****

Method: GET

URL: /api/orders

Headers: Authorization: Bearer <admin-token>

Response (JSON):

[
  {
    "_id": "64f0c3b2a1d4e12345abcd69",
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "totalPrice": 199.99,
    "status": "pending",
    "createdAt": "2024-01-03T07:13:52.000Z"
  }
]
///////////////////////////////////////////////////////////////////////////////////////
Cancel Any Order (Admin Only) ****

Method: PUT

URL: /api/orders/:id/admin-cancel

Headers: Authorization: Bearer <admin-token>

Response (JSON):

{
  "_id": "64f0c3b2a1d4e12345abcd69",
  "customerName": "John Doe",
  "status": "cancelled",
  "updatedAt": "2024-01-03T07:13:52.000Z"
}
///////////////////////////////////////////////////////////////////////////////////////
Update Order Status (Admin Only) ****

Method: PUT

URL: /api/orders/:id/status

Headers: Authorization: Bearer <admin-token>

Body (JSON):

{
  "status": "delivered"
}

Response (JSON):

{
  "_id": "64f0c3b2a1d4e12345abcd69",
  "customerName": "John Doe",
  "status": "delivered",
  "updatedAt": "2024-01-03T07:13:52.000Z"
}

**Note:** When an order is created and confirmed (status: "pending"), an order confirmation email is automatically sent to the customer.
///////////////////////////////////////////////////////////////////////////////////////
Product Routes
Create Product (Admin Only) ****

Method: POST

URL: /api/products

Headers: Authorization: Bearer <admin-token>

Body (JSON):

{
  "name": "Elegant Bag",
  "description": "Leather ladies bag",
  "price": 149.99,
  "category": "Ladies Bag",
  "image": "https://cloudinary.com/image-url",
  "stock": 10,
  "colors": ["red", "black"],
  "sizes": ["S", "M", "L"],
  "isFeatured": true
}

Response (JSON):

{
  "_id": "64f0c3b2a1d4e12345abcd70",
  "name": "Elegant Bag",
  "description": "Leather ladies bag",
  "price": 149.99,
  "category": "Ladies Bag",
  "image": "https://cloudinary.com/image-url",
  "stock": 10,
  "colors": ["red", "black"],
  "sizes": ["S", "M", "L"],
  "isFeatured": true,
  "createdAt": "2024-01-03T07:14:07.000Z"
}
///////////////////////////////////////////////////////////////////////////////////////
Get All Products (Public) ****

Method: GET

URL: /api/products

Response (JSON):

[
  {
    "_id": "64f0c3b2a1d4e12345abcd70",
    "name": "Elegant Bag",
    "description": "Leather ladies bag",
    "price": 149.99,
    "category": "Ladies Bag",
    "image": "https://cloudinary.com/image-url",
    "stock": 10,
    "colors": ["red", "black"],
    "sizes": ["S", "M", "L"],
    "isFeatured": true,
    "createdAt": "2024-01-03T07:14:07.000Z"
  }
]
///////////////////////////////////////////////////////////////////////////////////////
Get Single Product (Public) ****

Method: GET

URL: /api/products/:id

Response (JSON):

{
  "_id": "64f0c3b2a1d4e12345abcd70",
  "name": "Elegant Bag",
  "description": "Leather ladies bag",
  "price": 149.99,
  "category": "Ladies Bag",
  "image": "https://cloudinary.com/image-url",
  "stock": 10,
  "colors": ["red", "black"],
  "sizes": ["S", "M", "L"],
  "isFeatured": true,
  "createdAt": "2024-01-03T07:14:07.000Z",
  "updatedAt": "2024-01-03T07:14:07.000Z"
}
///////////////////////////////////////////////////////////////////////////////////////
Update Product (Admin Only) ****

Method: PUT

URL: /api/products/:id

Headers: Authorization: Bearer <admin-token>

Body (JSON):

{
  "name": "Updated Product Name",
  "price": 199.99
}

Response (JSON):

{
  "_id": "64f0c3b2a1d4e12345abcd70",
  "name": "Updated Product Name",
  "description": "Leather ladies bag",
  "price": 199.99,
  "category": "Ladies Bag",
  "image": "https://cloudinary.com/image-url",
  "stock": 10,
  "colors": ["red", "black"],
  "sizes": ["S", "M", "L"],
  "isFeatured": true,
  "updatedAt": "2024-01-03T07:14:07.000Z"
}
///////////////////////////////////////////////////////////////////////////////////////
Delete Product (Admin Only) ****

Method: DELETE

URL: /api/products/:id

Headers: Authorization: Bearer <admin-token>

Response (JSON):

{
  "message": "Product deleted successfully"
}
///////////////////////////////////////////////////////////////////////////////////////
Upload Routes
Upload Image (Admin Only) ****

Method: POST

URL: /api/uploads

Headers: Authorization: Bearer <admin-token>

Body (form-data): Key = image, Value = file

Response (JSON):

{
  "url": "https://cloudinary.com/uploaded-image-url",
  "public_id": "luxebags/product_image_12345"
}
