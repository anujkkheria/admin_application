# Project Setup and Documentation

## **Requirements**

To run the project, ensure you have the following installed and configured:

- **Git**
- **Node.js**: Version 20 or above
- **npm**: Version 10.5 or above
- **SendGrid API Key and Email**

---

## **How to Setup the Codebase**

### **1. Clone the Repository**

1. Get the repository URL from your GitHub repository.
2. Run the following command in your terminal:
   ```bash
   git clone <REPOSITORY_URL>
   ```

### **2. Create a `.env` File**

1. Create a `.env` file in the root directory.
2. Add the following environment variables:

   **Example `.env` file:**

   ```env
   PORT=3000
   DB_URI="mongodb+srv://DBUSER:<password>@cluster0"
   DB_PASS=mongo_pass
   JWT_SECRET=secret
   JWT_EXPIRESIN=10d
   BASE_URL=https://localhost:3000
   RESET_EMAIL=<sendgrid_email>
   EMAIL_APIKEY=<sendgrid_api_key>
   ```

### **3. Install Dependencies**

Run the following command to install all required dependencies:

```bash
npm install
```

### **4. Start the Development Server**

Run the following command to start the server in development mode:

```bash
npm run dev
```

---

## **Routes**

### **Authentication**

1. **Login**

   - **Method**: POST
   - **Endpoint**: `/auth/login`
   - **Body**:
     ```json
     {
       "email": "string",
       "password": "string"
     }
     ```

2. **Signup**

   - **Method**: POST
   - **Endpoint**: `/auth/signup`
   - **Body**:
     ```json
     {
       "email": "string",
       "password": "string",
       "confirmPassword": "string",
       "role": "string"
     }
     ```

3. **Request Password Reset**

   - **Method**: POST
   - **Endpoint**: `/auth/forgot-password`
   - **Body**:
     ```json
     {
       "email": "string"
     }
     ```

4. **Reset Password**
   - **Method**: POST
   - **Endpoint**: `/auth/resetpassword`
   - **Query Parameters**:
     - `id`: User ID
     - `token`: Password reset token

---

### **Admin Logs**

1. **Get Logs**
   - **Method**: GET
   - **Endpoint**: `/logs/`
   - **Body**:
     ```json
     {
       "userid": "string"
     }
     ```

---

## **Notes**

- Ensure all environment variables in the `.env` file are correctly set before starting the server.
- Replace placeholder values (e.g., `<password>`, `<sendgrid_email>`, `<sendgrid_api_key>`) with actual credentials.
