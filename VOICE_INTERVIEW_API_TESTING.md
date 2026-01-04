# 🧪 Voice Interview API - Quick Testing Guide

## Prerequisites

1. ✅ Backend server running on `http://localhost:5000`
2. ✅ You have a recruiter account and JWT token
3. ✅ You have at least one job posted
4. ✅ API keys added to `.env` file

---

## 🎯 Complete Test Flow

### **Step 1: Login as Recruiter**

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "testrecruiter@example.com",
  "password": "Recruit@123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

**Save the token** for subsequent requests!

---

### **Step 2: Get Your Jobs**

```http
GET http://localhost:5000/api/jobs/my-jobs
Authorization: Bearer {your_token}
```

**Note the Job ID** (e.g., `jobId: 1`)

---

### **Step 3: Create Interview**

```http
POST http://localhost:5000/api/interviews
Authorization: Bearer {your_token}
Content-Type: application/json

{
  "jobId": 1,
  "title": "Frontend Developer Voice Interview",
  "description": "AI-powered voice assessment for React developers",
  "settings": {
    "numberOfQuestions": 3,
    "timePerQuestion": 120,
    "skillCategories": ["technical", "communication", "problem_solving"],
    "autoEvaluate": true,
    "passingScore": 70
  },
  "voiceConfig": {
    "voiceId": "EXAVITQu4vr4xnSDxMaL",
    "stability": 0.5,
    "similarity_boost": 0.8
  }
}
```

**Save the Interview ID** from response!

---

### **Step 4: Generate Questions**

```http
POST http://localhost:5000/api/interviews/{interview_id}/generate-questions
Authorization: Bearer {your_token}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Questions generated successfully",
  "questions": [
    {
      "id": 1,
      "questionText": "Tell me about your experience with React hooks...",
      "skillCategory": "technical",
      "difficulty": "medium",
      "timeLimit": 120,
      "order": 1
    },
    ...
  ]
}
```

This will take **~5-10 seconds** as AI generates questions.

---

### **Step 5: Generate TTS Audio**

```http
POST http://localhost:5000/api/interviews/{interview_id}/generate-audios
Authorization: Bearer {your_token}
```

This will:
1. Generate TTS audio for each question using ElevenLabs
2. Upload audio files to Cloudinary
3. Update questions with audio URLs

Takes **~3-5 seconds per question**.

**Expected Response:**
```json
{
  "success": true,
  "message": "Audio generation completed",
  "results": [
    {
      "questionId": 1,
      "audioUrl": "https://res.cloudinary.com/...",
      "success": true
    },
    ...
  ]
}
```

---

### **Step 6: Publish Interview**

```http
POST http://localhost:5000/api/interviews/{interview_id}/publish
Authorization: Bearer {your_token}
```

**Response:**
```json
{
  "success": true,
  "message": "Interview published successfully",
  "interview": { ... }
}
```

Now the interview is **active** and ready for candidates!

---

### **Step 7: View Interview (Candidate Perspective)**

```http
GET http://localhost:5000/api/interviews/{interview_id}
```

No authentication needed for active interviews. This is what candidates see before starting.

---

### **Step 8: Start Interview Session**

```http
POST http://localhost:5000/api/interviews/{interview_id}/start-session
Content-Type: application/json

{
  "candidateName": "John Doe",
  "candidateEmail": "john.doe@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Interview session started",
  "session": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "interviewId": 1,
    "jobTitle": "Frontend Developer",
    "company": "TechCorp",
    "totalQuestions": 3,
    "currentQuestionIndex": 0,
    "status": "in_progress"
  },
  "currentQuestion": {
    "id": 1,
    "text": "Tell me about your experience with React hooks...",
    "audioUrl": "https://res.cloudinary.com/...",
    "timeLimit": 120,
    "questionNumber": 1,
    "totalQuestions": 3
  }
}
```

**Save the Session ID!**

---

### **Step 9: Submit Answer (with Audio File)**

#### Option A: Using Postman

1. Select `POST` method
2. URL: `http://localhost:5000/api/interviews/sessions/{session_id}/submit-answer`
3. Go to **Body** tab
4. Select **form-data**
5. Add fields:
   - `questionId`: `1` (number)
   - `timeTaken`: `85` (number, seconds)
   - `audio`: Select **File** type and upload an audio file (`.mp3`, `.webm`, `.wav`, `.m4a`)

#### Option B: Using cURL

```bash
curl -X POST http://localhost:5000/api/interviews/sessions/{session_id}/submit-answer \
  -F "questionId=1" \
  -F "timeTaken=85" \
  -F "audio=@path/to/your/audio.webm"
```

**Response:**
```json
{
  "success": true,
  "message": "Answer submitted successfully",
  "response": {
    "id": 1,
    "status": "processing",
    "audioUrl": "https://res.cloudinary.com/..."
  }
}
```

**Save the Response ID!**

---

### **Step 10: Check Processing Status**

```http
GET http://localhost:5000/api/interviews/sessions/{session_id}/responses/{response_id}/status
```

Poll this endpoint every 2-3 seconds until status is `completed`.

**Processing Flow:**
- `transcribing` → Deepgram is converting speech to text
- `evaluating` → AI is scoring the answer
- `completed` → Ready!

**Final Response:**
```json
{
  "success": true,
  "response": {
    "id": 1,
    "status": "completed",
    "transcript": "I have been working with React hooks for over 2 years. I use useState for state management...",
    "score": 85,
    "feedback": "Excellent answer demonstrating deep understanding of React hooks. You provided specific examples and showed practical knowledge.",
    "skillScores": {
      "technical": 88,
      "communication": 82,
      "confidence": 85
    },
    "evaluatedAt": "2026-01-04T14:30:00.000Z"
  }
}
```

---

### **Step 11: Move to Next Question**

```http
POST http://localhost:5000/api/interviews/sessions/{session_id}/next
```

**Response:**
```json
{
  "success": true,
  "message": "Moved to next question",
  "completed": false,
  "currentQuestion": {
    "id": 2,
    "text": "How do you handle state management in large applications?",
    "audioUrl": "https://res.cloudinary.com/...",
    "timeLimit": 120,
    "questionNumber": 2,
    "totalQuestions": 3
  },
  "progress": {
    "current": 2,
    "total": 3,
    "percentage": "67"
  }
}
```

**Repeat Steps 9-11** for all questions.

---

### **Step 12: Complete Interview**

After answering all questions:

```http
POST http://localhost:5000/api/interviews/sessions/{session_id}/complete
```

This will:
1. Check all responses are processed
2. Generate overall feedback using AI
3. Calculate aggregate scores
4. Provide hiring recommendation

Takes **~10-15 seconds** for AI to analyze all responses.

**Response:**
```json
{
  "success": true,
  "message": "Interview completed successfully",
  "session": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "completed",
    "totalScore": 82.5,
    "recommendation": "shortlist",
    "completedAt": "2026-01-04T14:45:00.000Z"
  }
}
```

---

### **Step 13: Get Results**

```http
GET http://localhost:5000/api/interviews/sessions/{session_id}/results
```

**Full Results Response:**
```json
{
  "success": true,
  "results": {
    "session": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "candidateName": "John Doe",
      "candidateEmail": "john.doe@example.com",
      "completedAt": "2026-01-04T14:45:00.000Z",
      "totalScore": 82.5,
      "recommendation": "shortlist",
      "recommendationReason": "Strong technical skills with excellent understanding of React ecosystem. Good communication and problem-solving abilities."
    },
    "interview": {
      "title": "Frontend Developer Voice Interview",
      "jobTitle": "Frontend Developer",
      "company": "TechCorp"
    },
    "overallFeedback": "The candidate demonstrated strong technical knowledge...",
    "skillScores": {
      "technical": 85,
      "communication": 80,
      "problem_solving": 82,
      "confidence": 83
    },
    "strengths": [
      "Deep understanding of React hooks and state management",
      "Clear and articulate communication",
      "Practical examples from real-world projects",
      "Good problem-solving approach"
    ],
    "weaknesses": [
      "Could improve on system design concepts",
      "Limited discussion of testing strategies"
    ],
    "questionResults": [
      {
        "questionNumber": 1,
        "questionText": "Tell me about your experience with React hooks...",
        "skillCategory": "technical",
        "difficulty": "medium",
        "transcript": "I have been working with React hooks...",
        "score": 85,
        "feedback": "Excellent answer...",
        "skillScores": {
          "technical": 88,
          "communication": 82
        },
        "timeTaken": 85
      },
      ...
    ]
  }
}
```

---

## 🎯 Quick Test Checklist

- [ ] Login as recruiter
- [ ] Create interview
- [ ] Generate questions (wait ~10 sec)
- [ ] Generate audios (wait ~15 sec for 3 questions)
- [ ] Publish interview
- [ ] Start session
- [ ] Submit audio answer
- [ ] Check processing status
- [ ] Move to next question
- [ ] Complete interview
- [ ] Get results

---

## 📝 Sample Audio Files

If you don't have audio files, you can:

1. **Record yourself** answering the question using:
   - Windows Voice Recorder
   - Online tools like https://voicerecorder.online/
   - Your phone's voice recorder

2. **Use any format**: `.mp3`, `.webm`, `.wav`, `.m4a`, `.ogg`

3. **Keep it short**: 30-90 seconds per answer

---

## 🔍 Troubleshooting

### **Issue: "Interview not found or not active"**
- Make sure you published the interview (Step 6)
- Check the interview ID is correct

### **Issue: "Audio file is required"**
- Ensure you're uploading a file with key `audio`
- Check file format is supported

### **Issue: "Processing status stuck on 'transcribing'"**
- Check Deepgram API key is correct in `.env`
- Check backend console for errors
- Audio file might be corrupted or invalid format

### **Issue: "Transcription failed"**
- Audio URL might not be publicly accessible
- Check Cloudinary configuration
- Verify Deepgram API has credits

### **Issue: "X response(s) still processing"**
- Wait a few more seconds
- Check backend console logs
- One or more responses might have failed (check status)

---

## 💡 Tips

1. **Use Thunder Client** (VS Code extension) or **Postman** for easier testing
2. **Save your collection** of requests for quick testing
3. **Check backend console** for detailed logs
4. **Processing is async** - expect 10-15 seconds per answer
5. **Test with real speech** for best results

---

## 🎉 Success!

If you completed all steps successfully, your voice interview system is **fully functional**!

**Next Step**: Integrate with your React frontend for a complete user experience.

---

**Happy Testing! 🎤✨**

