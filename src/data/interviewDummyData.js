// Phase-2: AI Voice/Video Interview - Dummy Data

export const skillCategories = [
  { id: 'communication', label: 'Communication', color: 'blue' },
  { id: 'technical', label: 'Technical Knowledge', color: 'purple' },
  { id: 'confidence', label: 'Confidence', color: 'green' },
  { id: 'problem_solving', label: 'Problem Solving', color: 'orange' },
  { id: 'leadership', label: 'Leadership', color: 'red' },
  { id: 'teamwork', label: 'Teamwork', color: 'teal' },
];

export const jobRoles = [
  { id: 1, title: 'Frontend Developer', department: 'Engineering' },
  { id: 2, title: 'Backend Developer', department: 'Engineering' },
  { id: 3, title: 'Full Stack Developer', department: 'Engineering' },
  { id: 4, title: 'UI/UX Designer', department: 'Design' },
  { id: 5, title: 'Product Manager', department: 'Product' },
  { id: 6, title: 'Data Scientist', department: 'Data' },
  { id: 7, title: 'DevOps Engineer', department: 'Engineering' },
  { id: 8, title: 'QA Engineer', department: 'Quality' },
];

export const difficultyLevels = [
  { id: 'easy', label: 'Easy', color: 'green' },
  { id: 'medium', label: 'Medium', color: 'yellow' },
  { id: 'hard', label: 'Hard', color: 'red' },
];

export const sampleQuestions = [
  {
    id: 1,
    text: 'Tell me about yourself and your experience in software development.',
    skill: 'communication',
    difficulty: 'easy',
    timeLimit: 120,
  },
  {
    id: 2,
    text: 'Describe a challenging technical problem you solved recently. What was your approach?',
    skill: 'problem_solving',
    difficulty: 'medium',
    timeLimit: 180,
  },
  {
    id: 3,
    text: 'Explain the difference between REST and GraphQL APIs. When would you choose one over the other?',
    skill: 'technical',
    difficulty: 'medium',
    timeLimit: 150,
  },
  {
    id: 4,
    text: 'How do you handle disagreements with team members about technical decisions?',
    skill: 'teamwork',
    difficulty: 'medium',
    timeLimit: 120,
  },
  {
    id: 5,
    text: 'Walk me through how you would design a scalable notification system.',
    skill: 'technical',
    difficulty: 'hard',
    timeLimit: 180,
  },
  {
    id: 6,
    text: 'Describe a time when you had to lead a project or initiative. What was the outcome?',
    skill: 'leadership',
    difficulty: 'medium',
    timeLimit: 150,
  },
  {
    id: 7,
    text: 'How do you stay updated with the latest technologies and industry trends?',
    skill: 'communication',
    difficulty: 'easy',
    timeLimit: 90,
  },
  {
    id: 8,
    text: 'Explain the concept of state management in React. What are the different approaches?',
    skill: 'technical',
    difficulty: 'medium',
    timeLimit: 150,
  },
  {
    id: 9,
    text: 'How would you optimize a slow-performing web application?',
    skill: 'problem_solving',
    difficulty: 'hard',
    timeLimit: 180,
  },
  {
    id: 10,
    text: 'Describe your experience with CI/CD pipelines and deployment strategies.',
    skill: 'technical',
    difficulty: 'medium',
    timeLimit: 150,
  },
  {
    id: 11,
    text: 'How do you prioritize tasks when working on multiple projects simultaneously?',
    skill: 'leadership',
    difficulty: 'easy',
    timeLimit: 120,
  },
  {
    id: 12,
    text: 'What is your approach to writing clean, maintainable code?',
    skill: 'technical',
    difficulty: 'medium',
    timeLimit: 120,
  },
];

export const sampleTranscripts = [
  {
    questionId: 1,
    transcript: "I have been working as a software developer for the past 5 years, primarily focusing on frontend technologies. I started my career with HTML, CSS, and JavaScript, and gradually moved into modern frameworks like React and Vue. I've worked on various projects ranging from e-commerce platforms to enterprise dashboards.",
    score: 85,
    feedback: "Great introduction with clear progression of experience. Consider mentioning specific achievements or metrics.",
    skillScores: {
      communication: 88,
      confidence: 82,
      technical: 85,
    }
  },
  {
    questionId: 2,
    transcript: "Recently, I faced a performance issue where our application was taking too long to load. I analyzed the bundle size, implemented code splitting, and optimized images. This reduced the load time by 60%.",
    score: 90,
    feedback: "Excellent problem-solving approach with measurable results. Very well structured response.",
    skillScores: {
      problem_solving: 92,
      technical: 88,
      communication: 90,
    }
  },
];

export const sampleInterviewResult = {
  id: 'interview-001',
  candidateName: 'John Doe',
  jobRole: 'Frontend Developer',
  company: 'TechCorp Inc.',
  interviewType: 'voice',
  completedAt: new Date().toISOString(),
  overallScore: 82,
  questionResults: [
    {
      questionId: 1,
      questionText: 'Tell me about yourself and your experience in software development.',
      score: 85,
      transcript: "I have been working as a software developer for the past 5 years...",
      feedback: "Great introduction with clear progression of experience.",
      skillScores: { communication: 88, confidence: 82 }
    },
    {
      questionId: 2,
      questionText: 'Describe a challenging technical problem you solved recently.',
      score: 90,
      transcript: "Recently, I faced a performance issue where our application...",
      feedback: "Excellent problem-solving approach with measurable results.",
      skillScores: { problem_solving: 92, technical: 88 }
    },
    {
      questionId: 3,
      questionText: 'Explain the difference between REST and GraphQL APIs.',
      score: 78,
      transcript: "REST APIs use HTTP methods and have fixed endpoints...",
      feedback: "Good understanding but could elaborate more on use cases.",
      skillScores: { technical: 80, communication: 76 }
    },
    {
      questionId: 4,
      questionText: 'How do you handle disagreements with team members?',
      score: 75,
      transcript: "I believe in open communication and finding common ground...",
      feedback: "Showed good interpersonal skills but lacked specific examples.",
      skillScores: { teamwork: 78, communication: 72 }
    },
  ],
  strengths: [
    'Strong technical foundation in frontend development',
    'Excellent problem-solving skills with data-driven approach',
    'Good communication and ability to explain complex concepts',
    'Proactive in staying updated with latest technologies',
  ],
  weaknesses: [
    'Could provide more specific examples in behavioral questions',
    'Room for improvement in system design explanations',
    'Consider elaborating more on team collaboration experiences',
  ],
  recommendation: 'shortlist', // 'shortlist' | 'consider' | 'reject'
  recommendationReason: 'Strong technical skills and problem-solving abilities make this candidate a good fit for the frontend developer role.',
};

export const interviewInstructions = {
  voice: [
    'Ensure you are in a quiet environment with minimal background noise',
    'Use headphones for better audio quality',
    'Speak clearly and at a moderate pace',
    'Take a moment to think before answering each question',
    'You cannot skip questions - each must be answered before proceeding',
    'The AI will evaluate your response after each answer',
  ],
  video: [
    'Ensure you are in a well-lit environment',
    'Position your camera at eye level',
    'Dress professionally as you would for an in-person interview',
    'Maintain eye contact with the camera',
    'Speak clearly and confidently',
    'You cannot skip questions - each must be answered before proceeding',
  ],
};

// Helper function to generate random questions based on settings
export const generateInterviewQuestions = (settings) => {
  const { numberOfQuestions, skills, difficulty } = settings;
  
  let filteredQuestions = [...sampleQuestions];
  
  // Filter by skills if specified
  if (skills && skills.length > 0) {
    filteredQuestions = filteredQuestions.filter(q => skills.includes(q.skill));
  }
  
  // Shuffle and take required number
  const shuffled = filteredQuestions.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(numberOfQuestions, shuffled.length));
};

// Mock API functions (to be replaced with real API calls later)
export const mockFetchInterview = async (interviewId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    id: interviewId,
    candidateName: 'John Doe',
    jobRole: 'Frontend Developer',
    company: 'TechCorp Inc.',
    interviewType: 'voice', // or 'video'
    questions: sampleQuestions.slice(0, 5),
    timePerQuestion: 120,
    status: 'pending', // 'pending' | 'in_progress' | 'completed'
  };
};

export const mockSubmitAnswer = async (questionId, audioBlob) => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const sampleResponse = sampleTranscripts[0];
  return {
    questionId,
    transcript: sampleResponse.transcript,
    score: Math.floor(Math.random() * 20) + 75, // Random score 75-95
    feedback: sampleResponse.feedback,
    skillScores: sampleResponse.skillScores,
  };
};

export const mockFetchInterviewResult = async (interviewId) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return sampleInterviewResult;
};

