# Echoes of Time 🕰️

**Breathe new life into your cherished memories.**

Echoes of Time is a modern web application built with Next.js and powered by cutting-edge Generative AI. It provides a magical experience for users to restore, enhance, and creatively re-imagine their old or damaged family photos.

## ✨ Features

-   **AI-Powered Photo Restoration:** Automatically repair scratches, tears, and fading from old photographs.
-   **Intelligent Colorization:** Transform black and white photos into vibrant, historically accurate color images.
-   **Creative Re-imagination:** Go beyond restoration and generate new moments:
    -   **Outpaint:** Expand the original photo to different aspect ratios (e.g., cinematic 16:9), letting AI create the world beyond the original frame.
    -   **Another Moment:** Generate a new, candid shot from just before or after the original photo was taken.
    -   **Subtle Smile:** Add a gentle, natural smile to a subject's face.
    -   **Slight Pose:** Subtly alter the poses of subjects for a more dynamic feel.
    -   **Zoom Out:** Widen the scene to see more of the photo's original surroundings.
-   **Modern, Responsive UI:** A beautiful, intuitive interface built with Next.js, React, and shadcn/ui that works on any device.

## 🚀 Tech Stack

-   **Framework:** [Next.js](https://nextjs.org/) (with App Router)
-   **AI/ML:** [Google Gemini via Genkit](https://firebase.google.com/docs/genkit)
-   **UI:** [React](https://react.dev/), [shadcn/ui](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Code Quality:** [Biome](https://biomejs.dev/) (Linting and Formatting)

## 🛠️ Getting Started

To get the project up and running on your local machine, follow these steps:

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

3.  **Open Your Browser:**
    Navigate to `http://localhost:9002` to see the application in action.

## available Scripts

-   `npm run dev`: Starts the Next.js development server.
-   `npm run build`: Builds the application for production.
-   `npm run start`: Starts a production server.
-   `npm run lint`: Lints the codebase using Biome.
-   `npm run format`: Formats the codebase using Biome.
-   `npm run check`: Runs Biome linter and formatter and applies fixes.
