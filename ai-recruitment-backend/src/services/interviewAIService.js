import { generateJSONContent, generateContent } from '../config/openai.js';

/**
 * Generate interview questions based on job and settings
 * @param {object} job - Job object
 * @param {object} settings - Interview settings
 * @returns {Promise<Array>} Generated questions
 */
export const generateInterviewQuestions = async (job, settings) => {
  try {
    const { numberOfQuestions, skillCategories, difficulty } = settings;

    const prompt = `
You are an expert AI interviewer. Generate ${numberOfQuestions} interview questions for a voice interview.

JOB DETAILS:
- Title: ${job.title}
- Company: ${job.company}
- Experience Level: ${job.experienceLevel}
- Job Type: ${job.jobType}
- Requirements: ${job.requirements}
- Skills Required: ${Array.isArray(job.skills) ? job.skills.join(', ') : job.skills}

INTERVIEW SETTINGS:
- Focus on skill categories: ${skillCategories?.join(', ') || 'all skills'}
- Difficulty level: ${difficulty || 'mixed (easy, medium, hard)'}
- Interview type: Voice-only

IMPORTANT GUIDELINES:
1. Create questions suitable for VOICE responses (not video)
2. Questions should be clear and concise when spoken
3. Mix behavioral, technical, and situational questions
4. Ensure questions test the specified skill categories
5. Vary difficulty levels appropriately
6. Each question should take 60-180 seconds to answer verbally

Provide a JSON response with exactly this format:
{
  "questions": [
    {
      "text": "Question text that will be spoken by TTS",
      "skillCategory": "technical",
      "difficulty": "medium",
      "timeLimit": 120,
      "expectedKeywords": ["keyword1", "keyword2"],
      "scoringCriteria": ["criterion1", "criterion2"]
    }
  ]
}

IMPORTANT: skillCategory must be EXACTLY ONE of these values (no combinations):
- "communication"
- "technical"
- "confidence"
- "problem_solving"
- "leadership"
- "teamwork"
`;

    console.log('🤖 Generating interview questions with AI...');
    const result = await generateJSONContent(prompt);
    console.log(`✅ Generated ${result.questions?.length || 0} questions`);
    return result.questions || [];
  } catch (error) {
    console.error('❌ Question generation error:', error);
    throw new Error('Failed to generate interview questions');
  }
};

/**
 * Evaluate candidate's response to a question
 * @param {string} transcript - Candidate's answer transcript
 * @param {object} question - Question object
 * @param {object} context - Additional context
 * @returns {Promise<object>} Evaluation result
 */
export const evaluateResponse = async (transcript, question, context = {}) => {
  try {
    const prompt = `
You are an expert interview evaluator. Evaluate this candidate's answer to an interview question.

QUESTION: ${question.questionText}
SKILL CATEGORY: ${question.skillCategory}
DIFFICULTY: ${question.difficulty}
EXPECTED KEYWORDS: ${question.expectedKeywords?.join(', ') || 'N/A'}
SCORING CRITERIA: ${question.scoringCriteria?.join(', ') || 'General assessment'}

CANDIDATE'S ANSWER:
"${transcript}"

EVALUATION GUIDELINES:
1. Score the answer from 0-100
2. Be fair and objective
3. Consider:
   - Relevance to the question
   - Clarity and articulation
   - Depth of response
   - Use of specific examples
   - Technical accuracy (if applicable)
   - Communication effectiveness
4. Provide constructive feedback
5. Identify specific skills demonstrated

Provide a JSON response:
{
  "score": 85,
  "feedback": "Detailed feedback explaining the score",
  "skillScores": {
    "${question.skillCategory}": 85,
    "communication": 88,
    "confidence": 82
  },
  "strengths": ["specific strength 1", "specific strength 2"],
  "improvements": ["area for improvement 1", "area for improvement 2"],
  "keywordsMatched": ["keyword1", "keyword2"],
  "keywordsMissed": ["keyword3"]
}
`;

    console.log('🤖 Evaluating response with AI...');
    const evaluation = await generateJSONContent(prompt);
    console.log(`✅ Evaluation complete: ${evaluation.score}/100`);
    return evaluation;
  } catch (error) {
    console.error('❌ Response evaluation error:', error);
    // Return fallback evaluation
    return {
      score: 70,
      feedback: "Your response has been recorded and will be reviewed.",
      skillScores: { [question.skillCategory]: 70 },
      strengths: [],
      improvements: []
    };
  }
};

/**
 * Generate overall interview feedback
 * @param {Array} responses - All interview responses
 * @param {object} interview - Interview object
 * @returns {Promise<object>} Overall feedback
 */
export const generateOverallFeedback = async (responses, interview) => {
  try {
    const averageScore = responses.reduce((sum, r) => sum + (parseFloat(r.score) || 0), 0) / responses.length;
    
    // Aggregate skill scores
    const skillScores = {};
    responses.forEach(response => {
      if (response.skillScores) {
        Object.entries(response.skillScores).forEach(([skill, score]) => {
          if (!skillScores[skill]) skillScores[skill] = [];
          skillScores[skill].push(score);
        });
      }
    });

    const averagedSkillScores = {};
    Object.entries(skillScores).forEach(([skill, scores]) => {
      averagedSkillScores[skill] = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
    });

    const prompt = `
You are an expert interview evaluator. Generate overall feedback for this completed interview.

INTERVIEW: ${interview.title}
JOB: ${interview.job?.title || 'N/A'}
NUMBER OF QUESTIONS: ${responses.length}
AVERAGE SCORE: ${averageScore.toFixed(2)}

SKILL SCORES:
${Object.entries(averagedSkillScores).map(([skill, score]) => `- ${skill}: ${score}/100`).join('\n')}

INDIVIDUAL QUESTION PERFORMANCE:
${responses.map((r, i) => `
Question ${i + 1}: ${r.question?.questionText || 'N/A'}
Score: ${r.score}/100
Feedback: ${r.feedback}
`).join('\n')}

Generate comprehensive interview feedback:

1. Overall assessment (2-3 sentences)
2. Key strengths (3-5 specific points)
3. Areas for improvement (3-5 specific points)
4. Recommendation: should we "shortlist", "consider", or "reject" this candidate?
5. Reason for recommendation

Provide a JSON response:
{
  "overallScore": ${averageScore.toFixed(2)},
  "overallFeedback": "Comprehensive assessment paragraph",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "recommendation": "shortlist|consider|reject",
  "recommendationReason": "Detailed reason for the recommendation",
  "skillScores": ${JSON.stringify(averagedSkillScores)},
  "hiringDecision": {
    "fit": "excellent|good|fair|poor",
    "readiness": "ready|needs_training|not_ready",
    "cultural_fit": "excellent|good|fair|poor"
  }
}
`;

    console.log('🤖 Generating overall feedback...');
    const overallFeedback = await generateJSONContent(prompt);
    console.log(`✅ Overall feedback generated: ${overallFeedback.recommendation}`);
    return overallFeedback;
  } catch (error) {
    console.error('❌ Overall feedback generation error:', error);
    throw error;
  }
};

