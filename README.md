# PlantWise AI

Build a mobile-first web app called “PlantAI” for farmers. The app helps farmers identify plants and detect visible plant health problems using their phone camera, then gives simple recommendations through AI.

IMPORTANT: This is an MVP for a competition/demo. Keep the implementation simple and finishable. Do NOT add unnecessary pages, dashboards, admin panels, payments, maps, social features, profiles, settings, or complex backend systems. Focus only on the core experience below.

1. DESIGN DIRECTION

Use the attached reference screenshots as the visual inspiration.

The design should feel:

Modern

Clean

Agricultural

Friendly

Professional

Mobile-first

Easy for a farmer to understand

Use:

White backgrounds

Dark green text

Fresh green accent colors

Soft light-green cards

Rounded corners

Large readable typography

Simple icons

Real plant photographs instead of illustrations/placeholders

Generous spacing

Bottom navigation only if genuinely necessary

The application must look like a real mobile product, not a generic desktop website squeezed into a phone.

Make the main content optimized for approximately 375px × 812px mobile screens, while still being responsive on larger screens.

Use the attached plant-app screenshots as visual inspiration for:

Plant image cards

Health-status cards

Plant information sections

Disease/problem sections

Care recommendations

AI chat section

Rounded green buttons

Soft green backgrounds

Do NOT copy the exact UI. Create an original but visually similar design.

2. LANDING PAGE

Create a very simple landing page.

Hero section:

Full-screen or large background photograph of a healthy green crop/plant.

Use a real high-quality plant/farm photograph, not a generated-looking illustration.

Add a subtle dark/green overlay so text is readable.

Text:

PlantAI

Know your plant. Protect your harvest.

Short description:

“Use your phone camera to identify plants, detect health problems, and get simple AI-powered advice.”

Primary button:

Start Scanning

Secondary text/button:

Log in

Add a small trust statement:

“AI-powered plant identification and health guidance.”

Keep this page visually impressive but very lightweight.

3. LOGIN / SIGNUP

Create a simple authentication screen.

Title:

Welcome to PlantAI

Subtitle:

“Your smart farming assistant.”

Fields:

Email

Password

Buttons:

Log in

Create account

For signup:

Name

Email

Password

Also include:

“Continue as guest”

if implementing authentication would slow development.

IMPORTANT:
If real authentication is easy to implement with Supabase, use Supabase authentication.

If authentication setup would prevent the MVP from being completed quickly, create a functional demo authentication flow using local state/localStorage instead.

Do not spend development effort on advanced account management.

4. HOME / SCANNER SCREEN

After login, show the main PlantAI screen.

Header:

Hello, Farmer 👋

Subtitle:

“Check your plant with your camera.”

Main large card:

Scan a Plant

“Take a photo of a plant or crop and PlantAI will analyze it.”

Large green button:

Start Scanning →

When the user taps it, immediately open the device camera using the browser camera API.

Use:

navigator.mediaDevices.getUserMedia()

Rear-facing camera when supported

Camera preview

Capture button

The interface should look like a real mobile plant scanner.

Scanner UI:

Top:
Scan your plant

Center:
Live camera preview

Overlay:
A simple rounded scanning frame.

Bottom:
Large circular/rounded capture button.

Text:
“Place the plant inside the frame.”

Also provide:

Upload photo

as a fallback for browsers where camera access is unavailable.

5. REAL PLANT ANALYSIS

After the user captures a photo, show a short loading state:

Analyzing your plant...

Subtext:

“PlantAI is identifying the plant and checking for visible health problems.”

Use a simple animated loading indicator.

Then show the result screen.

IMPORTANT:

The analysis should use a real AI vision API, not fake random results.

Structure the AI integration so an API key can be added through environment variables.

Prefer a vision-capable model such as OpenAI vision through a secure server/API route.

Do NOT expose API keys in frontend code.

Create a simple server/API function that receives the captured image and asks the vision model to return structured JSON.

Expected response:

{
"plantName": "...",
"scientificName": "...",
"confidence": 0,
"healthStatus": "Healthy | Warning | Diseased",
"problem": "...",
"description": "...",
"recommendations": [
"...",
"...",
"..."
]
}

If the AI cannot confidently identify the plant, it must say so instead of inventing an answer.

6. PLANT RESULT SCREEN

This is the most important screen.

Make it visually inspired by the provided screenshots.

At the top:

Large captured plant image.

Below:

Plant name

Example:

Tomato

Small text:

“Solanum lycopersicum”

Add small information chips such as:

Crop

Edible

Flowering

Only show attributes when the AI has reasonable information.

Then create a prominent health card.

Example for healthy plant:

🌱 Plant Health

YOUR PLANT LOOKS HEALTHY

“PlantAI did not detect obvious visible signs of disease.”

Use a green visual treatment.

For unhealthy plants:

⚠️ Plant Health

POSSIBLE HEALTH PROBLEM

Show the detected issue in simple language.

Example:

“Possible early blight symptoms detected.”

Do not claim certainty when the AI cannot reliably diagnose it.

Use wording such as:

“Possible”

“Signs may indicate”

“AI visual assessment”

7. PLANT DESCRIPTION

Add:

About this plant

Show a short AI-generated description.

Example:

“Tomato is a widely cultivated crop that grows best in warm conditions. It requires adequate sunlight, water, and nutrients.”

Keep descriptions short and easy to understand.

Add:

Read more

only if necessary.

Do not create another page.

8. PROBLEM / DISEASE SECTION

If a problem is detected, show:

Possible problem

Disease/problem name.

Then:

What we noticed

Short explanation of the visible symptoms.

Then:

What you can do

Use 3–5 simple recommendations.

Example:

Remove badly affected leaves.

Avoid watering the leaves directly.

Improve airflow around the plants.

Monitor the plant for spreading symptoms.

IMPORTANT:
Recommendations must be presented as general guidance, not guaranteed medical/agricultural diagnosis.

If no problem is detected, instead show:

Plant looks healthy 🌱

“Continue monitoring your crop regularly.”

9. BASIC CARE INFORMATION

Under the result, show a compact card called:

Care Guide

Only include the most useful information:

☀️ Sunlight
💧 Water
🌱 Soil
🌡️ Temperature

Keep it compact.

Example:

Sunlight: Full sun

Water: Keep soil consistently moist

Soil: Well-drained soil

Do NOT build a huge encyclopedia of plant information.

10. AI CHAT — SAME SCREEN

This is very important.

At the bottom of the plant result screen, create:

Ask PlantAI

Subtitle:

“Have a question about this plant?”

Chat interface should appear on the same result screen, not on a separate complicated page.

Include:

Chat messages

User message bubble

AI response bubble

Text input

Send button

Placeholder:

“Ask about your plant...”

Examples of suggested questions:

Why are the leaves turning yellow?

How often should I water it?

What should I do next?

The AI chat should know the current scanned plant and its analysis.

For example, if the scanned plant is tomato, the AI should receive context such as:

Plant: Tomato
Scientific name: Solanum lycopersicum
Health status: Warning
Detected problem: Possible early blight

Then the farmer can ask follow-up questions.

Use the same secure AI API approach as the plant analysis.

Do not build a separate chatbot application.

11. REAL IMAGES

Use real plant photography throughout the application.

Do NOT use:

Empty image placeholders

Gray image boxes

Cartoon plants

Generic abstract illustrations

Fake UI image URLs

For the landing page use a real high-quality crop/plant photograph.

For demonstration/sample content, use real photographs of recognizable crops such as:

Tomato

Maize/corn

Potato

Bean

Pepper

Wheat

If external image URLs are used, use reliable publicly accessible image sources.

The application must still work even if external image loading fails.

For the actual scanner result, always display the photo captured by the farmer.

12. SAMPLE DEMO MODE

Because this is a competition prototype, include a lightweight demo fallback.

If the AI API key is not configured, do not show a broken application.

Instead, provide a clearly labeled:

Demo Mode

where the captured image can produce a sample analysis for demonstration purposes.

But when an AI API key is configured, use the real AI analysis.

The UI should make it easy to switch from demo mode to real AI.

13. MOBILE NAVIGATION

Keep navigation extremely simple.

Prefer only:

Home | Scan

Do not create unnecessary navigation items.

The main goal is:

Landing → Login → Home → Camera → AI Analysis → Plant Result + Chat

This entire flow should be easy to demonstrate in under 2 minutes.

14. TECHNICAL REQUIREMENTS

Use a simple modern stack supported by Lovable.

Recommended:

React

TypeScript

Tailwind CSS

shadcn/ui where useful

Supabase only if needed

Browser Camera API

Secure server/API route for AI calls

Use environment variables for API keys.

Never place private API keys directly in React frontend code.

Make the application responsive.

Make buttons actually work.

Make camera permissions work.

Make image capture work.

Make image upload work.

Make the AI analysis flow work.

Make the chat work.

Persist the last scan locally so refreshing the page does not immediately destroy the demo.

15. IMPORTANT SCOPE LIMIT

DO NOT BUILD:

Admin dashboard

Farmer marketplace

Payments

Weather system

Maps

Community/social feed

Complex farmer profiles

Notifications

Multi-language system

Crop marketplace

IoT hardware

Disease database

Complex analytics dashboard

Separate chatbot page

Complex onboarding

Subscription system

These are outside the MVP.

Spend the development effort on making the camera → AI → result → recommendations → chat experience excellent.

16. FINAL USER EXPERIENCE

The complete experience should be:

Farmer opens PlantAI.

Sees beautiful real plant background.

Taps Start Scanning.

Logs in/signs up if required.

Arrives at scanner.

Camera opens.

Farmer points phone at crop.

Farmer captures image.

PlantAI analyzes the image using AI vision.

App shows the captured plant image.

App identifies the plant.

App gives a health status.

App explains possible diseases/problems.

App gives simple actions the farmer can take.

Farmer can immediately ask PlantAI questions in the chat on the same screen.

The app should feel like:

“Take a picture → Understand your plant → Know what to do.”

17. VISUAL QUALITY PRIORITY

Prioritize visual polish on these three areas:

Landing page

Beautiful real plant photograph + strong green agricultural branding.

Scanner

Clean mobile camera interface that feels like a real farming AI product.

Results

Beautiful plant image + health card + problem detection + recommendations + AI chat.

Use the provided screenshots as the main visual reference for the result-card style: rounded cards, soft green backgrounds, clear sections, green health indicators, compact information chips, and easy-to-read typography.

Keep everything simple enough to finish within the available Lovable credits.

Before finishing, test the complete primary flow and fix broken buttons, camera access, routing, image display, and AI error states.

Do not spend credits redesigning the application after the core functionality is working.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e9322b38-3c56-4f5b-b8ea-c8e89f5b3508).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
