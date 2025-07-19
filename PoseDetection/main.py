# Import necessary libraries
import cv2
import mediapipe as mp
import numpy as np
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import time
import json
import atexit
import os
import google.generativeai as genai
from datetime import datetime 
import threading

# Configure Gemini API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Buffers and logs
gemini_buffer = []
gemini_analysis_logs = []
gemini_lock = threading.Lock()

# Path to the MediaPipe model
model_path = 'pose_landmarker_full.task'

# Set up MediaPipe pose detection options
BaseOptions = mp.tasks.BaseOptions
PoseLandmarker = mp.tasks.vision.PoseLandmarker
PoseLandmarkerOptions = mp.tasks.vision.PoseLandmarkerOptions
VisionRunningMode = mp.tasks.vision.RunningMode

# Drawing utils and style
mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose
landmark_style = mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=3)
connection_style = mp_drawing.DrawingSpec(color=(0, 0, 255), thickness=2)

# Globals for tracking frames and landmarks
frame_counter = 0
prev_landmarks = None
activity_logs = []

# Draw landmarks and connections on the video frame
def draw_landmarks_on_frame(frame, landmarks):
    image_height, image_width, _ = frame.shape

    # Draw connections between landmarks
    for connection in mp_pose.POSE_CONNECTIONS:
        start_idx, end_idx = connection
        if start_idx >= len(landmarks) or end_idx >= len(landmarks):
            continue
        x1 = int(landmarks[start_idx].x * image_width)
        y1 = int(landmarks[start_idx].y * image_height)
        x2 = int(landmarks[end_idx].x * image_width)
        y2 = int(landmarks[end_idx].y * image_height)
        cv2.line(frame, (x1, y1), (x2, y2), connection_style.color, connection_style.thickness)

    # Draw each landmark
    for landmark in landmarks:
        x = int(landmark.x * image_width)
        y = int(landmark.y * image_height)
        cv2.circle(frame, (x, y), landmark_style.circle_radius, landmark_style.color, -1)

# Save activity logs to JSON
def export_logs_to_file(filename="pose_log.json"):
    try:
        with open(filename, "w") as f:
            json.dump(activity_logs, f, indent=4)
        print(f"\n✅ Activity logs saved to {filename}")
    except Exception as e:
        print(f"❌ Failed to save activity logs: {e}")

# Save Gemini analysis logs to JSON
def export_gemini_logs(filename="gemini_analysis_log.json"):
    try:
        with open(filename, "w") as f:
            json.dump(gemini_analysis_logs, f, indent=4)
        print(f"\n✅ Gemini analysis logs saved to {filename}")
    except Exception as e:
        print(f"❌ Failed to save Gemini analysis logs: {e}")

# Automatically export logs on exit
atexit.register(export_logs_to_file)
atexit.register(export_gemini_logs)

# Function to send pose batch to Gemini API and store analysis
def ask_gemini_about_movement(log_batch):
# Full prompt omitted for brevity (already well-defined)
    prompt = f""" 
You are a movement analysis expert using human pose data.

Each entry in the log represents a set of 3D coordinates (x, y, z) for 33 pose landmarks of a person detected using MediaPipe. The landmark indices and names are:

0 - nose
1 - left eye (inner)
2 - left eye
3 - left eye (outer)
4 - right eye (inner)
5 - right eye
6 - right eye (outer)
7 - left ear
8 - right ear
9 - mouth (left)
10 - mouth (right)
11 - left shoulder
12 - right shoulder
13 - left elbow
14 - right elbow
15 - left wrist
16 - right wrist
17 - left pinky
18 - right pinky
19 - left index
20 - right index
21 - left thumb
22 - right thumb
23 - left hip
24 - right hip
25 - left knee
26 - right knee
27 - left ankle
28 - right ankle
29 - left heel
30 - right heel
31 - left foot index
32 - right foot index

Given this time series of human pose data:

{json.dumps(log_batch, indent=2)}

Please analyze the overall movement. Your output should include:
Identify the type of movement that is being observed based on the pose data. Consider the following aspects:
- What type of activity is being performed (e.g. sitting, standing, walking, jumping
You want to fill out for each activity, the type, the time start and time end, and a short concise description

Be simple in your analysis, for example like playing or resting, or walking or jumping, etc.

Do not reference the different indexes in your output
Output your response in bullet points with clear and concise analysis.
"""

    try:
        model = genai.GenerativeModel('gemini-2.5-pro')
        response = model.generate_content(prompt)
        analysis = response.text.strip()

        print("\n🤖 Gemini Activity Analysis:")
        print(analysis)

        with gemini_lock:
            gemini_analysis_logs.append({
                "timestamp": datetime.now().isoformat(),
                "summary": analysis
            })

        time.sleep(0.5)

    except Exception as e:
        print(f"❌ Gemini API Error: {e}")

# Callback from MediaPipe with pose results
def print_landmarks(result, output_image, timestamp_ms):
    global current_landmarks, current_mask, frame_counter
    frame_counter += 1

    if result.pose_landmarks:
        current_landmarks = result.pose_landmarks[0]

        if frame_counter % 10 == 0:  # Process every 10 frames
            # Log visible landmarks
            for i, landmark in enumerate(current_landmarks):
                if landmark.visibility > 0.7:
                    print(f"Landmark {i}: x={landmark.x:.2f}, y={landmark.y:.2f}, z={landmark.z:.2f}")

            # Only log important keypoints
            important_indices = [0,7,8,11,12,13,14,15,16,23,24,25,26,31,32]  # Nose, Shoulders, Hips
            activity_logs.append({
                "timestamp": timestamp_ms,
                "landmarks": [
                    {
                        "index": i,
                        "x": round(current_landmarks[i].x, 4),
                        "y": round(current_landmarks[i].y, 4),
                        "z": round(current_landmarks[i].z, 4),
                        "visibility": round(current_landmarks[i].visibility, 2)
                    }
                    for i in important_indices
                    if current_landmarks[i].visibility > 0.7
                ]
            })
            
            # Add to Gemini batch buffer
            gemini_buffer.append(activity_logs[-1])

            # If buffer reaches 10 entries, send to Gemini
            if len(gemini_buffer) >= 10:
                run_gemini_analysis_async(gemini_buffer.copy())
                gemini_buffer.clear()

    if result.segmentation_masks:
        current_mask = result.segmentation_masks[0].numpy_view()

# Start Gemini analysis in a background thread
def run_gemini_analysis_async(batch):
    def task():
        ask_gemini_about_movement(batch)
    threading.Thread(target=task, daemon=True).start()

# MediaPipe landmarker setup
options = PoseLandmarkerOptions(
    base_options=BaseOptions(model_asset_path=model_path),
    running_mode=VisionRunningMode.LIVE_STREAM,
    result_callback=print_landmarks,
    output_segmentation_masks=True,
    min_pose_detection_confidence=0.8,
    min_pose_presence_confidence=0.8,
    min_tracking_confidence=0.8
)

current_landmarks = None
current_mask = None

# Main video capture loop
with PoseLandmarker.create_from_options(options) as landmarker:
    cap = cv2.VideoCapture(0)  # Webcam
    start_time = time.time()

    # Set camera resolution
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

    last_gemini_time = start_time

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Convert to RGB and wrap in MediaPipe Image
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)

        # Detect pose
        timestamp_ms = int((time.time() - start_time) * 1000)

        # Overlay segmentation mask if available
        landmarker.detect_async(mp_image, timestamp_ms)

        if current_mask is not None:
            mask_resized = cv2.resize(current_mask, (frame.shape[1], frame.shape[0]))
            colored_mask = np.zeros_like(frame)
            colored_mask[:, :, 1] = (mask_resized * 255).astype(np.uint8)  # green channel
            overlay = cv2.addWeighted(frame, 0.7, colored_mask, 0.3, 0)
            frame = overlay

        # Draw landmarks
        if current_landmarks is not None:
            draw_landmarks_on_frame(frame, current_landmarks)

        # Run Gemini analysis every 30 seconds
        current_time = time.time()
        if current_time - last_gemini_time >= 30:
            if gemini_buffer:
                run_gemini_analysis_async(gemini_buffer.copy())
                gemini_buffer.clear()
            last_gemini_time = current_time

        # Save logs every minute
        if timestamp_ms % 60000 < 50:  # within a 50ms window once per minute
            export_logs_to_file()
            export_gemini_logs()
        # Display frame
        cv2.imshow('Pose Tracking', frame)
        if cv2.waitKey(1) & 0xFF == 27:  # ESC to quit
            break
        
    # Cleanup
    cap.release()
    cv2.destroyAllWindows()
