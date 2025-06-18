# Expernetic Library Application

## About

This project was completed as an assignment for the Expernetic Software Engineering Full‑Stack Internship assessment. It showcases a simple library management system with a .NET 9 backend (SQLite) and a React (TypeScript) frontend.

## Getting Started

Follow the steps below to run both the backend API and the frontend application locally.

### 1. Clone the repository

```bash
git clone https://github.com/<your‑username>/Expernetic-Library-Application.git
cd Expernetic-Library-Application
```

### 2. Run the backend (.NET)

1. Open the **`Backend`** folder (inside `Expernetic-Library-Application`) in Visual Studio 2022 or a compatible IDE.
2. Select the *HTTPS* launch profile and start the project ( **F5** ).
3. The server will start at **https://localhost:7137** as defined in *launchSettings.json*.
4. A pre‑configured SQLite database file (`Library.db`) is already associated, so existing records will remain intact.

### 3. Run the frontend (React)

```bash
cd Expernetic-Library-Application/Frontend
npm install   # first–time only
npm start
```

The React app will open automatically in your browser

### 4. Create a user account

After the frontend loads, register a new user via the UI. Logging in enables access to the library’s books and operations.

### 5. Explore the API (Scalar)

Additionally, with the backend running, open https://localhost:7137/Scalar/ in your browser.
Scalar provides an interactive UI where you can explore and test all available API endpoints.
