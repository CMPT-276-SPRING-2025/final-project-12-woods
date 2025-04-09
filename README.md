# 🍽️ FoodieFind

**FoodieFind** is a React-based web application that helps users discover local restaurants. It leverages the **Google Maps API** and **Gemini API** to offer location-based restaurant search and personalized recommendations.

---

## 🚀 Features

- 🔍 Restaurant discovery
- 🗺️ Interactive map with pins
- 💬 Food recommendation chat
- 🥗 Restaurant visit planner

---

## 🛠️ Local Development Setup

Follow these steps to run the **FoodieFind** project on your local machine:

---

### ✅ Step 1: Install Prerequisites

Make sure you have **Node.js (v14 or higher)** and **npm** installed.

To verify installation, run:

```bash
node -v
npm -v
```

To install Node.js:
1. Visit [https://nodejs.org/en](https://nodejs.org/en)
2. Download and install the **LTS version** of Node.js (includes npm)

---

### ✅ Step 2: Clone the Repository

Use SSH to clone the GitHub repository:

```bash
git clone git@github.com:CMPT-276-SPRING-2025/final-project-12-woods.git
```

Alternatively, you can use HTTPS:

```bash
git clone https://github.com/CMPT-276-SPRING-2025/final-project-12-woods.git
```

---

### ✅ Step 3: Navigate to the Project Directory

```bash
cd final-project-12-woods/foodiefind
```

---

### ✅ Step 4: Install Dependencies

Install all required packages:

```bash
npm install
```

---

### ✅ Step 5: Create a `.env` File for API Keys

Create a file named `.env` in the **root of the `foodiefind` directory** and add the following lines:

```env
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

#### How to get these keys:

**Google Maps API Key:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Enable the following APIs:
   - **Maps JavaScript API**
   - **Places API**
4. Go to **APIs & Services > Credentials**
5. Click **Create API key**
6. Copy the key and paste it in your `.env` file as `VITE_GOOGLE_MAPS_API_KEY`

**Gemini API Key:**

1. Visit [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in and generate a key
3. Copy the key and paste it in your `.env` file as `VITE_GEMINI_API_KEY`

> 🔐 Never commit your `.env` file to version control (it's included in `.gitignore` by default)

---

### ✅ Step 6: Run the Development Server

```bash
npm run dev
```

After the server starts, you should see output similar to:

```
  VITE vX.X.X  ready in XXX ms
  ➜  Local:   http://localhost:5173/
```

Visit the displayed URL in your browser to access the app.

> ⚠️ The port number may vary if 5173 is already in use.

---

### 🔗 Project Links
- Live Website: [FoodieFind](https://foodiefindz.netlify.app/)
- Demo Video: [Demo Video](https://youtu.be/2rNCe_G50Q8?si=An6jaVJ6YgpZSL1y)
- Final Report: [Report](misc/WOODS 12 Final Project Report.pdf)

---

### ⚖️ License & Usage
This project is licensed under the MIT license and is intended strictly for educational and training purposes. 

