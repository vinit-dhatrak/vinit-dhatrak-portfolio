# AI Algorithms from Scratch: A C++ Guide

This repository contains the source code for an educational website focused on the fundamental data structures and algorithms behind deep learning and artificial intelligence. The project's philosophy is to learn and teach these core concepts by building simple, understandable programs from the ground up in C++.

This project started as a personal journey to truly understand what goes on inside a neural network, beyond the high-level frameworks. It has now been structured as a step-by-step, hands-on guide for anyone who wants to get their hands dirty and learn the applied principles of AI.

The live website, built from this code, is available at **[dhatrak.com/learn](https://dhatrak.com)**.

## 🚀 Features

- **Step-by-Step Lessons**: 10 sequential lessons that build from a single neuron to a fully trainable neural network.
- **Focus on Fundamentals**: Emphasizes the underlying data structures and algorithms, not just framework usage.
- **Hands-On Code**: Every lesson is accompanied by a complete, runnable C++ code example.
- **Interactive Website**: A clean, modern, two-column layout with dynamic content loading.
- **Lightweight & Fast**: Built with vanilla HTML, CSS, and JavaScript for optimal performance.
- **Dark/Light Theme**: User-selectable theme for comfortable reading.

## 🛠️ Tech Stack

- **Core Content**: C++ for the algorithm examples.
- **Frontend**: HTML5, CSS3, Vanilla JavaScript.
- **Deployment**: Cloudflare Pages.

## 📁 Project Structure

```
portfolio/
├── index.html          # Main landing page for the course
├── about.html          # About Me / Original portfolio page
├── lessons/            # Directory containing individual HTML for each lesson
│   ├── lesson-1.html
│   └── ...
├── styles.css          # All CSS styles
├── script.js           # Core JavaScript for interactivity
├── serve.py            # Simple local development server
└── README.md           # This file
```

## 🚀 Local Development

1.  **Clone the repository**
    ```bash
    git clone https://github.com/vinitdhatrak/portfolio.git
    cd portfolio
    ```

2.  **Start local server**
    ```bash
    # Use the provided Python script or the standard http.server
    python3 serve.py
    # OR
    python3 -m http.server 8000
    ```

3.  **Open in browser**
    Navigate to the URL provided by the server (e.g., `http://localhost:8080` or `http://localhost:8000`).

## 🌐 Deployment

The site is configured for automatic continuous deployment on Cloudflare Pages. Any push to the `main` branch will automatically trigger a new build and deployment.

For detailed instructions, see the `DEPLOYMENT.md` file.

## 📄 License

This project is licensed under the MIT License.
