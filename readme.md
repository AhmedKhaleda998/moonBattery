# MoonBattery API

MoonBattery is an API for managing battery registration and status updates. It allows devices to register batteries using their MAC addresses and perform periodic "ping" operations to log and monitor their activity.

## Features

- **Battery Registration:** Register batteries with a unique MAC address and generate a secure token.
- **Battery Status Ping:** Update and log the last activity ("ping") time of a battery.
- **Validation:** Ensures MAC addresses follow the proper format.
- **Error Handling:** Provides descriptive error messages for invalid inputs and unauthorized actions.

## Technologies Used

- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework for building APIs.
- **MongoDB**: Database for storing battery information.
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB.
- **Jest**: Testing framework.
- **Supertest**: HTTP assertion library for testing API endpoints.

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (v14 or later)
- MongoDB

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AhmedKhaleda998/moonBattery
   cd moonBattery

2. Install dependencies:
   ```bash
   npm install

3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following environment variables:
     ```
     PORT=3000
     MONGODB_URI=mongodb://localhost:27017/moonBattery
     JWT_SECRET=secret_key
     ```

4. Start the server:
    ```bash
    npm start

5. For development with hot-reloading:
    ```bash
    npm run dev

---

## Live Demo

A live demo of the API is available at [moonBattery API](https://moonbattery.onrender.com/).

---

## API Endpoints

### Register Battery

- **URL:** `/api/batteries/register`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
        "macAddress": "00:00:00:00:00:00"
  }
  ```
- **Response:**
  ```json
    {
        "message": "Battery registered successfully",
        "token": "A JWT Token",
        "serialNumber": "A unique serial number"
    }
    ```
- **Error Response:**
    - Status Code: 400
    - Content:
        ```json
        {
            "error": "Invalid MAC address"
        }
        ```
### Ping Battery

- **URL:** `/api/batteries/ping`
- **Method:** `POST`
- **Request Headers:**
  - `Authorization (Bearer Token)`
- **Request Body:**
  ```json
  {
        "macAddress": "00:00:00:00:00:00"
  }
  ```
- **Response:**
  ```json
  {
        "message": "Battery pinged successfully"
  }
  ```
- **Error Response:**
    - Status Code: 401
    - Content:
        ```json
        {
            "error": "Unauthorized"
        }
        ```
---

### Edit Battery Configuration

- **URL:** `/api/batteries/configurations`
- **Method:** `PUT`
- **Request Headers:**
  - `Authorization (Bearer Token)`
- **Request Body:**
  ```json
  {
        "macAddress": "00:00:00:00:00:00",
        "configuration": {
        "pingInterval": 60
        }
  }
  ```
- **Response:**
  ```json
  {
        "message": "Battery configuration updated successfully"
  }
  ```
- **Error Response:**
    - Status Code: 401
    - Content:
        ```json
        {
            "error": "Unauthorized"
        }
        ```
---

## Testing

Run the following command to execute the tests:

```bash
npm test
```

---

## Project Structure

```
moonBattery/
├── src/
│   ├── configurations/
│   │   ├── database.js
│   │── controllers/
│   │   ├── battery.js
│   │── middlewares
│   │   ├── authorization.js
│   │   ├── ratelimit.js
│   │   ├── validationError
│   │── models
│   │   ├── battery.js
│   │── routes
│   │   ├── battery.js
│   │── utils
│   │   ├── error.js
│   │   ├── jwt.js
│   │   ├── serial.js
│   ├── validations
│   │   ├── battery.js
│   ├── app.js
├── tests/
│   ├── utils
│   │   ├── testDatabase.js
│   ├── battery.test.js
│   ├── .env.test
│   ├── jest.config.js
├── .env
├── package.json
├── README.md
```


## Security Measures

Securing the communication between **moonBattery** and the backend is crucial to ensure data integrity, confidentiality, and protection against unauthorized access. Below are the measures currently implemented and future improvements planned:

### Current Security Measures

1. **JWT Authentication**  
   - Each registered battery receives a **JSON Web Token (JWT)** upon registration.  
   - The token is required for all subsequent requests (e.g., `POST /api/batteries/ping`) to authenticate the battery.  
   - Tokens are signed using a secret key (`JWT_SECRET`) stored securely in environment variables.  

2. **Request Rate Limiting**  
   - A **rate-limiting mechanism** restricts the number of requests a client can make within a specific time window.  
   - This helps mitigate risks like **Denial of Service (DoS)** attacks and prevents spamming the API.  

3. **Validation and Sanitization**  
   - Input data (e.g., `macAddress`) is rigorously validated to prevent injection attacks and ensure data integrity.  

4. **HTTPS Enforcement**  
   - All communication occurs over **HTTPS** to ensure data is encrypted in transit, protecting against man-in-the-middle (MITM) attacks.  

---

### Planned Security Enhancements

1. **IP Whitelisting for Registration**  
   - Limit the IP addresses allowed to register new batteries. This ensures that only trusted devices or networks can access the registration endpoint.  

2. **Enhanced Token Security**  
   - Implement token expiration and refresh mechanisms to further secure JWT usage.  
   - Use **short-lived tokens** with a refresh mechanism to limit the potential impact of a leaked token.  

3. **Strict CORS Policy**  
   - Define a **Cross-Origin Resource Sharing (CORS)** policy to restrict which domains can interact with the API.  

4. **Encryption for Sensitive Data**  
   - Store sensitive data (e.g., tokens, logs) securely using encryption at rest and in transit.  

5. **Honeypot Endpoints**  
   - Add decoy endpoints to detect and deter malicious actors attempting unauthorized access.  

6. **Audit Logging**  
   - Implement detailed logging of all API interactions for monitoring and detecting potential security threats.  

7. **API Key Authentication for Additional Layers**  
   - Use API keys alongside JWT to add another layer of authentication, especially for critical operations.  


By combining these measures, **moonBattery** ensures a robust and secure communication framework for its APIs, enhancing trust and reliability. 

---

## Author

For any questions or suggestions, feel free to contact:
- **Name:**  Ahmed Khaled
- **Email:** ahmedkhaleda998877@gmail.com

---