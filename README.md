# CanSet_Cubesat_Control_Station
A professional-grade, web-based CanSat Ground Control Station (GCS) dashboard designed for real-time aerospace telemetry simulation. Includes mission control commands, binary fault-code error monitoring, live webcam video streaming, and CSV data logging functionalities.
Overview
The CanSat Ground Control Station (GCS) Dashboard is a comprehensive, real-time aerospace telemetry simulation platform. It serves as a virtual mission control room, providing continuous visibility, monitoring, and command capabilities for CanSat and CubeSat aerospace missions.   
Key Features & Subsystems
Real-Time Telemetry Monitoring: Continuously tracks and updates crucial mission parameters including altitude, temperature, atmospheric pressure, battery voltage, and descent rate.
Dynamic Graph Visualization: Utilizes Chart.js to plot real-time telemetry trends such as altitude variations and environmental data.
GPS Tracking System: Integrates Leaflet.js and OpenStreetMap to display live payload movement and coordinates on an interactive map.
3D Orientation Visualization: Uses Three.js and WebGL to render a 3D model displaying real-time pitch, yaw, and roll rotational states of the payload.
Mission Control Panel: Provides operator controls for manual payload separation, emergency parachute deployment, and redundant system activation.
Error Code Monitoring System: Evaluates incoming telemetry against safe limits using a 4-digit binary fault-code framework (tracking descent rate faults, GPS failures, separation failures, and parachute activation).
Live Video Streaming: Employs the browser Media Devices API to simulate onboard payload camera feeds.   
Data Management & CSV Export: Stores mission logs in memory and utilizes the Blob API to export session data in CSV format for post-mission analysis. 
