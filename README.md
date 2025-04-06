# Book Management App

A full-stack Book Management web application built using:

- ⚙️ Node.js, Express (Backend)
- 🌐 React + TypeScript + Vite (Frontend)
- 🗄 MongoDB (Database)

## Live Site

Check out the live React app here: [https://bma.madbrain.dev](https://bma.madbrain.dev)

---

## Project Structure

```
book-management-app/
├── api/                 ← Express server (Node.js)
├── client/              ← React frontend (Vite)
├── vercel.json          ← For deploying API to Vercel
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB Atlas or local MongoDB instance](https://www.mongodb.com/cloud/atlas)

---

## Backend Setup (Express API)

### 1. Navigate to the API folder

```bash
cd api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env` file

Create a file named `.env` inside the `API/` directory and add the following variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_very_long_secret_key
```

### 4. Start the API server

```bash
npm run dev
```

This should start your backend server at `http://localhost:5000`.

---

## Frontend Setup (React)

### 1. Navigate to the client folder

```bash
cd client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env` file

Create a file named `.env` inside the `client/` directory and add the following:

```env
VITE_API_URL=http://localhost:5000/api
```
Change the VITE_API_URL according to your server URL

### 4. Start the React app

```bash
npm run dev
```

This should start the frontend at `http://localhost:5173`.

---

## Testing Live

Go to **[https://bma.madbrain.dev](https://bma.madbrain.dev)** to view the deployed React frontend.

---

## .gitignore Note

- All `node_modules/` and `.env` files are ignored
- `vercel.json` is NOT ignored so it can be used to deploy the API to Vercel

---

## License

MIT License
