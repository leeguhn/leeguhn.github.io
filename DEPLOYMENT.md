# DEPLOYMENT CHECKLIST

## Before First Deployment

### 1. Set up Firebase Project
- [ ] Create Firebase project at https://console.firebase.google.com
- [ ] Enable Firestore Database
- [ ] Get your Firebase config (Project Settings → General → Your apps → Web app)
- [ ] Set up Firestore Security Rules (see README.md)

### 2. Update Local Environment
- [ ] Fill in your real Firebase credentials in `chatbot/.env`
- [ ] Test locally with `npm run dev` in the chatbot directory

### 3. Configure GitHub Repository
- [ ] Go to GitHub repo Settings → Secrets and variables → Actions
- [ ] Add all 6 Firebase secrets (see README.md for list)
- [ ] Go to Settings → Pages → Source → Select "GitHub Actions"

### 4. Deploy
```bash
# From repository root
git add .
git commit -m "Deploy chatbot to GitHub Pages"
git push origin main
```

### 5. Monitor Deployment
- [ ] Check Actions tab on GitHub for workflow status
- [ ] Wait for build & deploy to complete (~2-3 minutes)
- [ ] Visit https://leeguhn.github.io

## Firestore Security Rules

Set these in Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Legacy events collection (can be removed if not needed)
    match /events/{document=**} {
      allow create: if true;  // Allow participants to log events
      allow read, update, delete: if false;  // Only you can read via console
    }
    
    // New experiment sessions collection
    match /experiment_sessions/{document=**} {
      allow create: if true;  // Allow participants to submit session data
      allow read, update, delete: if false;  // Only you can read via console
    }
    
    // Legacy surveys collection (can be removed if not needed)
    match /surveys/{document=**} {
      allow create: if true;
      allow read, update, delete: if false;
    }
  }
}
```

## Testing Your Deployment

Visit: `https://leeguhn.github.io/?participant_id=TEST&condition_order=none`

After completing a test:
1. Go to Firebase Console → Firestore Database
2. Look for `events` collection
3. Verify data is being logged

## Exporting Data

### Method 1: Firebase Console (Simple)
- Go to Firestore → events collection
- Select documents → Export

### Method 2: Firebase CLI (Bulk Export)
```bash
npm install -g firebase-tools
firebase login
firebase firestore:export gs://YOUR_BUCKET_NAME/export-2024-12-03
```

### Method 3: Python Script (Custom Analysis)
```python
import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate('serviceAccountKey.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

events = db.collection('events').stream()
for event in events:
    print(f'{event.id} => {event.to_dict()}')
```

## Troubleshooting

### Build fails on GitHub Actions
- Check that all 6 Firebase secrets are set correctly
- Verify secret names match exactly (case-sensitive)

### Page shows blank or errors
- Check browser console for errors
- Verify Firebase credentials are correct
- Check that Firestore is enabled

### Data not saving
- Check Firestore Security Rules
- Verify Firebase config in GitHub Secrets
- Check browser console for Firebase errors
