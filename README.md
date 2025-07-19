# CoCare <img width="34" height="33" alt="image" src="https://github.com/user-attachments/assets/2d80d557-07ca-497d-afb0-13e57a11443b" />


**Empowering caregivers through AI-driven, adaptive support tools.**

---

## Overview

CoCare is an AI-powered assistant platform designed to support caregivers of individuals with accessibility needs—especially in childcare and mental health environments. By automating routine documentation, offering real-time insights, and promoting individualized care strategies, CoCare allows caregivers to focus on what matters most: people.

## Key Features

- **Passive Observation & Logging**  
  Automatically observes and logs daily activities using secure sensors and machine learning algorithms.

- **Personalized Insights**  
  Uses previous logs and caregiver input to create tailored support plans—because one size doesn't fit all.

- **Anomaly Detection & Soothing Suggestions**  
  Detects signs of overstimulation or distress and recommends calming strategies like quiet time or breathing exercises.

- **Smart Alerts Between Transitions**  
  Get real-time nudges and suggestions during key transitions like rest, meals, or playtime.

- **Quick Interaction Tools**  
  Accept, edit, or reject AI-generated reports with a single tap or voice note.

- **Progress Tracking & Visualizations**  
  Track behavioral and emotional development over time to inform decisions and interventions.

- **Privacy-First Architecture**  
  All collected data is encrypted and stored securely, with full transparency and caregiver control.

---

### Prerequisites

- Node.js ≥ 16
- Python 3.10+
- MongoDB or Firebase (future support)
- TensorFlow

### How It Works

**Real-Time Video Capture**  
Captures live video using a webcam.

**Pose Detection**  
Uses MediaPipe’s PoseLandmarker to track 33 keypoints of the body.

**Log Generation**  
Stores key pose data from relevant points (e.g., shoulders, hips, wrists) every 10 frames.

---

## Gemini Integration

1. Buffers 10 entries and sends them to Gemini (via Google Generative AI) every 30 seconds.  
2. Gemini summarizes detected movements like sitting, playing, jumping, or signs of stress.

---

## Symptom Detection & Suggestions

Can infer overstimulation and trigger suggestions such as:

- Quiet time  
- Deep breathing  
- Stretching or grounding exercises  

---

### Tech Stack

| Technology      | Purpose                                      |
|----------------|-----------------------------------------------|
| `MediaPipe`     | Pose detection (33 keypoints)                |
| `OpenCV`        | Webcam capture and frame drawing             |
| `Google Gemini` | Movement interpretation via natural language |
| `Python`        | Backend logic and processing                 |
| `JSON`          | Logging and data export                      |
| `Threading`     | Async Gemini querying to avoid lag           |
| `Typescript`    | Predictable frontend code.                   |

---

### Who It’s For

- Caregivers of neurodivergent or physically disabled individuals  
- Special education teachers  
- Therapists and child development specialists  
- Parents managing care routines  

---

### License

MIT License © 2025 CoCare AI Team
