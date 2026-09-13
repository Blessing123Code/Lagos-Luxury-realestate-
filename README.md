# 🏙️ Lagos Luxury Real Estate SPA

> A high-performance, full-stack Single Page Application (SPA) designed to showcase premium residential properties across high-end real estate markets in Lagos, Nigeria (Ikeja GRA, Lekki Phase 1, and Victoria Island).

---

## 📸 System Overview

This platform decouples traditional Django templating in favor of a clean, RESTful API backend coupled with an asynchronous, native JavaScript SPA frontend. It delivers zero-page-reload browsing, instant client-side search filtering, and seamless image rendering for multi-million Naira property listings.

---

## 🚀 Key Features

* **⚡ Zero-Reload SPA Architecture:** Smooth client-side view switching and state updates powered by native JavaScript `fetch()` API.
* **📍 Target Sector Filtering:** Live property filtering based on prime Lagos locations (*Ikeja GRA, Lekki Phase 1, Victoria Island*), price tiers, and bed/bath counts.
* **🔌 Dynamic RESTful APIs:** Django REST Framework serialization delivering clean JSON payloads for properties, media galleries, and inquiry submissions.
* **🖼️ Media Pipeline:** Built-in image handling and validation for high-resolution property interior and exterior photography.
* **📱 Fully Responsive UI:** Custom CSS grid and flexbox layout optimized for seamless browsing on mobile, tablet, and desktop screens.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology |
| :--- | :--- |
| **Backend Framework** | Python 3, Django 5.x |
| **API Layer** | Django REST Framework (DRF) |
| **Frontend SPA** | Native HTML5, Modern CSS3, Vanilla JavaScript (ES6+) |
| **Database** | SQLite3 (Development / Local) |
| **Version Control** | Git & GitHub |

---

## 📡 Primary API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/properties/` | Fetch all luxury property listings |
| `GET` | `/api/properties/?location=Lekki` | Filter listings by location query parameter |
| `GET` | `/api/properties/<id>/` | Retrieve detailed view for a single property |
| `POST` | `/api/inquire/` | Submit a property inquiry/lead to the database |

---

## 💻 Local Installation & Setup

### Prerequisites
* Python 3.10+ installed on your machine
* Git installed

### 1. Clone the Repository
```bash
git clone [https://github.com/Blessing123Code/Lagos-Luxury-realestate.git](https://github.com/Blessing123Code/Lagos-Luxury-realestate.git)
cd Lagos-Luxury-realestate