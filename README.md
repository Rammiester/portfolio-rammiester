# Ramit Kr. Gupta - Interactive Portfolio

Welcome to my interactive portfolio! This application is a unique, multi-mode experience built with **React**, **Next.js**, **Tailwind CSS**, and **Firebase**. It showcases my skills, experience, and projects through three distinct, interactive environments.

## 🌟 Modes Overview

### 1. XP Mode (Nostalgic Desktop)
A fully functional, retro Windows XP-style desktop environment.
- **Interactive Windows:** Draggable, resizable, and stackable windows.
- **Resume Editor:** A built-in editor to update my profile details directly, synced with Firebase.
- **Minesweeper:** A fully playable classic Minesweeper game.
- **Customization:** Change desktop backgrounds, color schemes (Blue, Olive, Silver), and toggle Dark Mode.
- **AI Integration:** Upload a PDF resume and watch Gemini AI automatically parse and populate the profile data!

### 2. Dev Mode (Developer Environment)
A sleek, IDE-like interface tailored for developers.
- **Terminal:** A functional command-line interface with commands like `whoami`, `ls`, `cat`, `clear`, and `help`.
- **Code Viewer:** Browse my projects and experience as if you were reading source code.
- **Themes:** Switch between Dark, Dim, and Light themes, complete with syntax highlighting colors.

### 3. Creative Mode (Immersive Showcase)
A visually stunning, full-screen presentation mode.
- **Cover Flow:** Swipe through my projects in a beautiful, Apple Music-style cover flow interface.
- **Dynamic Backgrounds:** The background adapts to the currently viewed project.
- **Immersive Details:** View project tech stacks and descriptions in a clean, distraction-free environment.

---

## 👨‍💻 About Me

**Ramit Kr. Gupta**
*Software Engineer*
📍 Bangalore, India | ✉️ ramitg89@gmail.com

**Bio:**
Software Engineer with 1.5 years of experience in frontend development using React, Next.js, Redux, and TailwindCSS. Recently architected performance optimization reducing API calls by 90% and improving load times by 90%.

### 🛠 Skills
- **Frontend:** ReactJS, Next.js, Redux, TailwindCSS, Material-UI, Context API, Redux Toolkit
- **Backend & DB:** Node.js, SQL (Postgres), REST APIs
- **Languages & Tools:** JavaScript (ES6+), Git

### 💼 Experience

**Software Engineer @ Edstellar** *(Aug 2024 – Present)*
Architected ReferenceDataContext solution reducing API calls by 90%. Developed and optimized responsive user interfaces with Next.js and TailwindCSS.

**Front-end Developer Intern @ Volopay** *(Feb 2024 – May 2024)*
Streamlined payment workflows in the Payment Squad, reducing user friction by 25%. Built reusable React components and integrated payment APIs.

**Software Engineer @ Freelance** *(Mar 2023 – Jan 2024)*
Built Stock Ninja Shopify app. Designed React-based app for autistic children. Developed ERP system with Laravel.

### 🚀 Projects

**Smart Summarizer**
Chrome Extension that summarizes web content via Gemini API. Features modular tabs and dark mode.
*Tech Stack:* Vanilla JS, Gemini API, Chrome Extensions

---

## 🏗 Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion (`motion/react`)
- **Icons:** Lucide React
- **Database & Auth:** Firebase (Firestore, Google Authentication)
- **AI Integration:** Google Gemini API (`@google/genai`)

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up Environment Variables:**
   Create a `.env.local` file and add your Firebase and Gemini API keys:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```
   *(Ensure your `firebase-applet-config.json` is correctly configured for Firebase)*
4. **Run the development server:**
   ```bash
   npm run dev
   ```
5. **Open your browser:**
   Navigate to `http://localhost:3000` to view the application.

## 🔒 Security & Data

This application uses Firebase Firestore to store profile data and user settings. Security rules are implemented to ensure that only authenticated administrators can modify the global profile, while anyone can view it.

---
*Built with ❤️ by Ramit Kr. Gupta*
