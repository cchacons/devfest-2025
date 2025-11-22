# DevFest 2025 Demos

This repository contains demos and examples for DevFest 2025.

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/tpiros/devfest-2025.git
    cd devfest-2025
    ```

2.  **Open the project:**
    -   **VS Code:** Open the folder in Visual Studio Code (`code .`).
    -   **Antigravity Google IDE:** Open the project using the Antigravity interface.

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

### Demo 2: Weather Chatbot with Function Calling

This demo showcases how to use Gemini's function calling capability to retrieve real-time (simulated) data. The chatbot can answer questions about the weather in specific cities by calling a defined `getWeather` function.

#### Key Features
-   **Function Calling**: Defines a tool for retrieving weather data.
-   **User Confirmation**: Asks for permission before executing the function.
-   **Simulated Data**: Provides weather for Singapore, New York, London, and Tokyo.

#### Setup Instructions

1.  **Navigate to the directory**
    ```bash
    cd demo-2
    ```
2.  **Configure Environment Variables**
    Copy the example environment file and add your API key:
    ```bash
    cp .env.example .env
    ```
    Edit `.env` and set `GEMINI_API_KEY`.

3.  **Install Dependencies**
    ```bash
    npm install
    ```

4.  **Run the Application**
    ```bash
    node --env-file=.env app.js
    ```

### Demo 3: Flight Booking Agent

This is a more advanced agent capable of searching for flights and making bookings. It demonstrates multi-turn conversations and complex tool usage.

#### Key Features
-   **Complex Tool Use**: Supports `searchFlights` and `bookFlight` functions.
-   **Interactive Flow**: Guides the user through searching, selecting, and booking a flight.
-   **Structured Output**: Displays flight options in a clear, readable format.

#### Setup Instructions

1.  **Navigate to the directory**
    ```bash
    cd demo-3
    ```
2.  **Configure Environment Variables**
    Copy the example environment file and add your API key:
    ```bash
    cp .env.example .env
    ```
    Edit `.env` and set `GEMINI_API_KEY`.

3.  **Install Dependencies**
    ```bash
    npm install
    ```

4.  **Run the Application**
    ```bash
    node --env-file=.env app.js
    ```
### Demo 4: Model Context Protocol (MCP) Client & Server

This demo illustrates the Model Context Protocol (MCP), where a client connects to a server to access tools. Here, a Gemini-powered client connects to a "SWAPI" (Star Wars API) MCP server.

#### Key Features
-   **MCP Architecture**: Separates the AI client from the tool-providing server.
-   **SWAPI Integration**: The server exposes tools to query Star Wars data.
-   **Gemini Integration**: The client uses Gemini to understand user queries and call MCP tools.

#### Setup Instructions

This demo consists of two parts: the server and the client.

**1. Setup the Server**

1.  Navigate to the `mcp-server` directory:
    ```bash
    cd mcp-server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
    (Note: The server does not require an API key for this demo, but you can verify the `.env` if needed).

**2. Setup and Run the Client**

1.  Open a new terminal window and navigate to the `mcp-client` directory:
    ```bash
    cd mcp-client
    ```
2.  Configure Environment Variables:
    ```bash
    cp .env.example .env
    ```
    Edit `.env` and set `GEMINI_API_KEY`.
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Start the Client:
    ```bash
    npm start
    ```
    The client will automatically start the server (defined in `config.ts`) and establish the connection. You can then chat about Star Wars!
