# DevFest 2025 Demos

This repository contains demos and examples for DevFest 2025.

## Prerequisites

-   Node.js (v18 or later recommended)
-   Google Cloud Platform account with Gemini API enabled

## Demos

### Demo 1: Gemini API Chatbot

This is a simple command-line chatbot using the Google Gemini API.

#### Setup Instructions

1.  **Get a Gemini API Key**
    1.  Visit [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials).
    2.  Sign in with your Google account.
    3.  Click on **Get API key** and create a new key.

2.  **Configure Environment Variables**
    1.  Navigate to the `demo-1` directory:
        ```bash
        cd demo-1
        ```
    2.  Copy the example environment file to a new file named `.env`:
        ```bash
        cp .env.example .env
        ```
    3.  Open the `.env` file in your text editor.
    4.  Replace the placeholder with your actual API key:
        ```env
        GEMINI_API_KEY=your_actual_api_key_here
        ```

3.  **Install Dependencies**
    ```bash
    npm install
    ```

4.  **Enable Generative Language API**
    If you see a `PERMISSION_DENIED` error, enable the API:
    1.  Visit the [Generative Language API page](https://console.developers.google.com/apis/api/generativelanguage.googleapis.com/overview).
    2.  Select your project and click **Enable**.

5.  **Run the Application**
    ```bash
    node --env-file=.env app.js
    ```

### Demo 2: [Placeholder]

(Instructions for Demo 2 will be added here)

### Demo 3: [Placeholder]

(Instructions for Demo 3 will be added here)
