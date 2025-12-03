# Chatbot Experiment - Emoji Effect on Banking Interactions

A research chatbot that measures how emoji presence in chatbot dialogue affects user interactions in a banking scenario. The experiment tracks keylogging, latency, and user responses.

## 🚀 Deployment

This chatbot is automatically deployed to GitHub Pages at `https://leeguhn.github.io` when you push to the main branch.

### Prerequisites

1. **Firebase Project Setup**
   - Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
   - Enable Firestore Database (in Build → Firestore Database)
   - Copy your Firebase configuration

2. **Configure GitHub Secrets**
   
   Go to your GitHub repository → Settings → Secrets and variables → Actions, and add these secrets:
   
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

3. **Enable GitHub Pages**
   
   Go to repository Settings → Pages → Source → select "GitHub Actions"

### Deploy to Production

```bash
git add .
git commit -m "Deploy chatbot"
git push origin main
```

The GitHub Actions workflow will automatically build and deploy your chatbot. Check the Actions tab to monitor deployment progress.

## 🛠️ Local Development

### Install Dependencies

```bash
cd chatbot
npm install
```

### Environment Setup

Create a `.env` file in the `chatbot` directory:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

## 📊 Data Collection

All experiment data is automatically saved to Firebase Firestore in real-time. Each participant session logs:

- **Participant ID** and **Condition** (none/low/high emoji)
- **Keystrokes**: detailed log with timestamps
- **Latency Metrics**: 
  - Total input latency
  - Time to first keystroke
  - Typing duration
- **Response Data**: user text responses
- **Timestamps**: session start, input available, first keystroke, submit
- **State Information**: current conversation state

### Accessing Your Data

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to Firestore Database
4. View the `events` collection
5. Export data:
   - Use the Firebase Console export feature
   - Or use Firebase Admin SDK for programmatic access
   - Data is in JSON format

### Data Structure Example

```json
{
  "participant_id": "user123",
  "condition": "high",
  "state": "amount_confirmation",
  "event_type": "response_submitted",
  "timestamp": 1234567.89,
  "response_data": {
    "text": "$100",
    "latency": {
      "total_input_latency_ms": 3456,
      "time_to_first_keystroke_ms": 890,
      "typing_duration_ms": 2566
    },
    "keystrokes": {
      "count": 4,
      "detailed_log": [...]
    }
  }
}
```

## 🧪 Experiment Conditions

The experiment tests three conditions:
- **none**: No emojis in chatbot responses
- **low**: Occasional emojis
- **high**: Frequent emojis

Participants can be assigned multiple conditions in sequence using URL parameters:
```
https://leeguhn.github.io/?participant_id=P001&condition_order=none-low-high
```

## 📁 Project Structure

```
chatbot/
├── src/
│   ├── components/     # React components (ChatWindow, InputBox, etc.)
│   ├── data/          # Condition JSON files
│   ├── logic/         # State machine and logger
│   ├── pages/         # Experiment and Survey pages
│   └── firebase.js    # Firebase configuration
└── public/            # Static assets
```

## 🔒 Security Notes

- `.env` files are git-ignored to protect credentials
- Firebase API keys are safe to expose in client-side code (protected by Firebase Security Rules)
- Set up Firestore Security Rules to prevent unauthorized data modification:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /events/{document=**} {
      allow create: if true;  // Allow anyone to create events
      allow read, update, delete: if false;  // Prevent reading/modifying
    }
  }
}
```

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
