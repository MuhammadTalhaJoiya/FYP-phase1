import { generateJSONContent, generateContent } from '../config/openai.js';
import * as geminiConfig from '../config/gemini.js';
import axios from 'axios';
import pdfParse from 'pdf-parse';
import fs from 'fs';
import path from 'path';

// Try OpenAI first, then Gemini (e.g. when OpenAI quota exceeded). Returns null if both fail.
const generateJSONWithFallback = async (prompt) => {
  try {
    return await generateJSONContent(prompt);
  } catch (err) {
    const msg = (err && err.message) || String(err);
    console.warn('OpenAI JSON failed:', msg);
    if (process.env.GEMINI_API_KEY && geminiConfig.generateJSONContent) {
      try {
        console.log('🔄 Falling back to Gemini for CV matching...');
        return await geminiConfig.generateJSONContent(prompt);
      } catch (geminiErr) {
        console.warn('Gemini JSON fallback failed:', geminiErr && geminiErr.message);
      }
    }
    return null;
  }
};

// Rule-based skill match when AI is unavailable (no API calls). Uses job skills + CV text.
const ruleBasedMatch = (cvText, job) => {
  let jobSkills = [];
  try {
    jobSkills = typeof job.skills === 'string' ? JSON.parse(job.skills) : (job.skills || []);
  } catch (e) {
    jobSkills = [];
  }
  if (!Array.isArray(jobSkills)) jobSkills = [];
  const cvLower = (cvText || '').toLowerCase();
  const matched = [];
  const missing = [];
  for (const s of jobSkills) {
    const skill = String(s).trim();
    if (!skill) continue;
    if (cvLower.includes(skill.toLowerCase())) matched.push(skill);
    else missing.push(skill);
  }
  const total = matched.length + missing.length;
  const matchScore = total ? Math.min(100, Math.round((matched.length / total) * 85) + 15) : 70;
  const feedback = total
    ? `AI analysis was temporarily unavailable. Approximate match from your CV: ${matched.length} of ${total} required skills found (${matched.join(', ') || 'none'}). ${missing.length ? `Missing: ${missing.join(', ')}.` : ''} The recruiter will review your application.`
    : 'AI analysis was temporarily unavailable. Your CV was uploaded successfully; the recruiter will review it.';
  return {
    matchScore,
    matchedSkills: matched,
    missingSkills: missing,
    feedback,
    highlights: matched.length ? matched.map((s) => `Has ${s}`) : ['CV uploaded successfully'],
    gaps: missing.length ? missing.map((s) => `Missing: ${s}`) : []
  };
};

// Normalize skills from AI (sometimes returns string or single item)
const normalizeSkillsArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val.map(s => String(s).trim()).filter(Boolean);
  if (typeof val === 'string') return val.split(/[,;]/).map(s => s.trim()).filter(Boolean);
  return [String(val)];
};

// Extract text from a local PDF file (used when we have the file on disk - more reliable than URL)
export const extractTextFromFile = async (filePath) => {
  try {
    const ext = path.extname(filePath).toLowerCase();
    if (ext !== '.pdf') return null;
    console.log('📄 Extracting text from local PDF file:', filePath);
    const buffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(buffer);
    const text = (pdfData.text || '').trim();
    const pageCount = pdfData.numpages || 1;
    console.log(`📄 Local PDF parsed: ${text.length} chars, ${pageCount} pages`);
    if (!text || text.length < 10) {
      console.warn('⚠️ Very short or empty text from local PDF (image-based?)');
      return { text: '', isImageBased: true };
    }
    return { text, isImageBased: false };
  } catch (err) {
    console.warn('Local PDF extraction failed:', err.message);
    return null;
  }
};

// Extract text from CV URL
const extractTextFromCV = async (cvUrl) => {
  try {
    console.log('📄 Extracting text from CV:', cvUrl);
    
    // Download PDF from Cloudinary or local storage
    console.log('📥 Downloading PDF...');
    const response = await axios.get(cvUrl, {
      responseType: 'arraybuffer',
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/pdf,*/*'
      },
      maxRedirects: 5,
      validateStatus: (status) => status === 200
    });
    
    // Parse PDF to extract text
    console.log('📄 Parsing PDF...');
    const pdfData = await pdfParse(Buffer.from(response.data));
    
    const extractedText = pdfData.text.trim();
    const pageCount = pdfData.numpages;
    
    console.log(`📄 PDF parsed: ${extractedText.length} chars, ${pageCount} pages`);
    
    // Allow even very short text - let AI try to analyze it
    if (!extractedText || extractedText.length < 10) {
      console.warn('⚠️ Very short or empty text extracted from PDF');
      // Return placeholder text for image-based PDFs
      return {
        text: `[Image-based PDF detected - ${pageCount} page(s). CV file uploaded successfully but text could not be extracted. The recruiter will manually review this CV.]`,
        url: cvUrl,
        pageCount: pageCount,
        characterCount: 0,
        isImageBased: true
      };
    }
    
    console.log(`✅ Extracted ${extractedText.length} characters from ${pageCount} page(s)`);
    
    return {
      text: extractedText,
      url: cvUrl,
      pageCount: pageCount,
      characterCount: extractedText.length
    };
  } catch (error) {
    console.error('❌ CV extraction error:', error.message);
    if (error.response) {
      console.error('Error details:', error.response.status, error.response.statusText);
    }
    throw new Error('Failed to extract CV content: ' + error.message);
  }
};

// Analyze CV with AI
export const analyzeCV = async (cvUrl) => {
  try {
    const cvContent = await extractTextFromCV(cvUrl);
    
    console.log('🤖 Sending CV to OpenAI for analysis...');
    
    const prompt = `
You are an expert HR AI assistant. Analyze the following CV/Resume and extract structured information.

CV CONTENT:
${cvContent.text}

Please analyze the CV and provide a JSON response with the following structure:
{
  "summary": "Brief professional summary",
  "skills": ["skill1", "skill2", ...],
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "duration": "Duration",
      "description": "Brief description"
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "Institution Name",
      "year": "Year"
    }
  ],
  "strengths": ["strength1", "strength2", ...],
  "recommendations": ["recommendation1", "recommendation2", ...]
}

Extract all information from the actual CV text provided above.
`;

    const analysis = await generateJSONContent(prompt);
    
    console.log('✅ AI analysis complete');
    
    return {
      success: true,
      analysis
    };
    
  } catch (error) {
    console.error('❌ CV analysis error:', error);
    // Return fallback analysis
    return {
      success: false,
      analysis: {
        summary: "CV uploaded successfully. Detailed analysis pending.",
        skills: [],
        experience: [],
        education: [],
        strengths: ["Professional CV uploaded"],
        recommendations: ["Profile is ready for job applications"]
      }
    };
  }
};

// Match CV to Job
export const matchJobToCV = async (cvUrl, job) => {
  try {
    const cvContent = await extractTextFromCV(cvUrl);
    
    // If CV is image-based, return a partial match encouraging manual review
    if (cvContent.isImageBased) {
      console.log('📷 Image-based PDF detected - returning partial match for manual review');
      return {
        matchScore: 65,
        matchedSkills: normalizeSkillsArray([]),
        missingSkills: normalizeSkillsArray([]),
        feedback: "This CV appears to be an image-based PDF (possibly scanned). Text could not be automatically extracted for AI analysis. The recruiter will manually review your application. Consider uploading a text-based PDF for better AI matching.",
        highlights: ["CV uploaded successfully", "Pending manual review"],
        gaps: ["AI analysis unavailable for image-based PDFs"],
        requiresManualReview: true
      };
    }
    
    console.log('🤖 Matching CV to job with OpenAI...');
    
    // Parse job skills
    let jobSkills = [];
    try {
      jobSkills = typeof job.skills === 'string' ? JSON.parse(job.skills) : (job.skills || []);
    } catch (e) {
      jobSkills = [];
    }
    if (!Array.isArray(jobSkills)) jobSkills = [];

    const prompt = `
You are an expert recruitment AI. Match a candidate's CV with a job posting and provide an accurate, justified match score.

JOB DETAILS:
- Title: ${job.title}
- Company: ${job.company}
- Required Skills: ${jobSkills.join(', ')}
- Experience Level: ${job.experienceLevel}
- Job Type: ${job.jobType}
- Requirements: ${job.requirements}
- Description: ${job.description}

CANDIDATE CV CONTENT:
${cvContent.text}

IMPORTANT SCORING GUIDELINES:
1. Be ACCURATE and FAIR in your scoring - base it strictly on the match between CV and job requirements
2. Identify SPECIFIC skills from the CV that match the job requirements
3. Identify SPECIFIC skills missing from the CV that the job requires
4. Consider experience level alignment
5. Provide actionable feedback

Score Interpretation:
- 90-100: Excellent match - candidate exceeds most requirements
- 75-89: Good match - candidate meets most key requirements
- 60-74: Fair match - candidate meets some requirements but has gaps
- 40-59: Partial match - significant gaps but some relevant background
- Below 40: Poor match - candidate doesn't meet key requirements

Provide a JSON response:
{
  "matchScore": <number between 0-100 based on actual match quality>,
  "matchedSkills": ["list", "of", "skills", "from", "CV", "that", "match", "job"],
  "missingSkills": ["skills", "job", "requires", "but", "CV", "lacks"],
  "experienceMatch": "excellent/good/fair/poor",
  "feedback": "Detailed explanation of why you gave this score. Be specific about what matched and what didn't.",
  "highlights": ["Specific positive aspects of this candidate for this role"],
  "gaps": ["Specific areas where candidate doesn't meet requirements"]
}
`;

    const matchResult = await generateJSONWithFallback(prompt);
    if (!matchResult) {
      console.log('📋 Using rule-based skill match (AI unavailable)');
      return ruleBasedMatch(cvContent.text, job);
    }
    
    console.log(`✅ Match complete: ${matchResult.matchScore}% match`);
    console.log(`📊 Matched skills: ${matchResult.matchedSkills?.length || 0}`);
    console.log(`📊 Missing skills: ${matchResult.missingSkills?.length || 0}`);
    
    return {
      matchScore: matchResult.matchScore || 70,
      matchedSkills: normalizeSkillsArray(matchResult.matchedSkills),
      missingSkills: normalizeSkillsArray(matchResult.missingSkills),
      feedback: matchResult.feedback || "Your profile has been analyzed. The recruiter will review your application soon.",
      highlights: Array.isArray(matchResult.highlights) ? matchResult.highlights : (matchResult.highlights ? [matchResult.highlights] : []),
      gaps: Array.isArray(matchResult.gaps) ? matchResult.gaps : (matchResult.gaps ? [matchResult.gaps] : [])
    };
    
  } catch (error) {
    console.error('❌ Job matching error:', error);
    try {
      const cvContent = await extractTextFromCV(cvUrl);
      if (cvContent && !cvContent.isImageBased && cvContent.text && cvContent.text.length >= 10) {
        console.log('📋 Using rule-based skill match after error');
        return ruleBasedMatch(cvContent.text, job);
      }
    } catch (_) {}
    return {
      matchScore: 70,
      matchedSkills: [],
      missingSkills: [],
      feedback: "Your application has been submitted successfully. The recruiter will review it soon.",
      highlights: ["Application submitted"],
      gaps: []
    };
  }
};

// Match CV to job using already-extracted text (avoids Cloudinary download; use when we have file on disk)
export const matchJobToCVWithText = async (cvText, job) => {
  if (!cvText || cvText.length < 10) {
    return {
      matchScore: 65,
      matchedSkills: [],
      missingSkills: [],
      feedback: "CV text could not be extracted (e.g. image-based PDF). The recruiter will manually review your application. For best results, use a text-based PDF.",
      highlights: ["CV uploaded successfully", "Pending manual review"],
      gaps: ["AI analysis unavailable - upload a text-based PDF for matched/missing skills"],
      requiresManualReview: true
    };
  }
  try {
    console.log('🤖 Matching CV to job with OpenAI (using extracted text)...');
    let jobSkills = [];
    try {
      jobSkills = typeof job.skills === 'string' ? JSON.parse(job.skills) : (job.skills || []);
    } catch (e) {
      jobSkills = [];
    }
    const prompt = `
You are an expert recruitment AI. Match a candidate's CV with a job posting and provide an accurate, justified match score.

JOB DETAILS:
- Title: ${job.title}
- Company: ${job.company}
- Required Skills: ${Array.isArray(jobSkills) ? jobSkills.join(', ') : jobSkills}
- Experience Level: ${job.experienceLevel}
- Job Type: ${job.jobType}
- Requirements: ${job.requirements}
- Description: ${job.description}

CANDIDATE CV CONTENT:
${cvText}

IMPORTANT SCORING GUIDELINES:
1. Be ACCURATE and FAIR - base the score strictly on match between CV and job requirements.
2. List SPECIFIC skills from the CV that match the job in "matchedSkills" (array of strings).
3. List SPECIFIC skills the job requires that are missing from the CV in "missingSkills" (array of strings).
4. Consider experience level alignment.
5. Give actionable feedback.

Score: 90-100 = excellent, 75-89 = good, 60-74 = fair, 40-59 = partial, below 40 = poor match.

Respond with JSON only:
{
  "matchScore": <number 0-100>,
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill3", "skill4"],
  "experienceMatch": "excellent/good/fair/poor",
  "feedback": "Detailed explanation referencing actual CV and job.",
  "highlights": ["positive point 1", "positive point 2"],
  "gaps": ["gap 1", "gap 2"]
}
`;
    const matchResult = await generateJSONWithFallback(prompt);
    if (!matchResult) {
      console.log('📋 Using rule-based skill match (AI unavailable)');
      return ruleBasedMatch(cvText, job);
    }
    console.log(`✅ Match complete: ${matchResult.matchScore}% match`);
    console.log(`📊 Matched skills: ${normalizeSkillsArray(matchResult.matchedSkills).length}`);
    console.log(`📊 Missing skills: ${normalizeSkillsArray(matchResult.missingSkills).length}`);
    return {
      matchScore: matchResult.matchScore != null ? Number(matchResult.matchScore) : 70,
      matchedSkills: normalizeSkillsArray(matchResult.matchedSkills),
      missingSkills: normalizeSkillsArray(matchResult.missingSkills),
      feedback: matchResult.feedback || "Your profile has been analyzed. The recruiter will review your application soon.",
      highlights: Array.isArray(matchResult.highlights) ? matchResult.highlights : (matchResult.highlights ? [matchResult.highlights] : []),
      gaps: Array.isArray(matchResult.gaps) ? matchResult.gaps : (matchResult.gaps ? [matchResult.gaps] : [])
    };
  } catch (error) {
    console.error('❌ Job matching (with text) error:', error);
    try {
      return ruleBasedMatch(cvText, job);
    } catch (_) {}
    return {
      matchScore: 70,
      matchedSkills: [],
      missingSkills: [],
      feedback: "Your application has been submitted successfully. The recruiter will review it soon.",
      highlights: ["Application submitted"],
      gaps: []
    };
  }
};

// Generate skill gap analysis
export const analyzeSkillGap = async (candidateSkills, requiredSkills) => {
  try {
    const prompt = `
You are a career development AI assistant. Analyze the skill gap between a candidate and job requirements.

CANDIDATE SKILLS: ${candidateSkills.join(', ')}
REQUIRED SKILLS: ${requiredSkills.join(', ')}

Provide a JSON response:
{
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill3", "skill4"],
  "matchPercentage": 75,
  "learningPath": [
    {
      "skill": "skill name",
      "priority": "high/medium/low",
      "estimatedTime": "time to learn",
      "resources": ["resource1", "resource2"]
    }
  ],
  "recommendations": ["recommendation1", "recommendation2"]
}
`;

    const analysis = await generateJSONContent(prompt);
    return analysis;
    
  } catch (error) {
    console.error('Skill gap analysis error:', error);
    return {
      matchedSkills: [],
      missingSkills: [],
      matchPercentage: 0,
      learningPath: [],
      recommendations: []
    };
  }
};

// Generate interview questions
export const generateInterviewQuestions = async (job, candidateProfile) => {
  try {
    const prompt = `
You are an expert interviewer. Generate relevant interview questions for this job and candidate.

JOB: ${job.title} at ${job.company}
EXPERIENCE LEVEL: ${job.experienceLevel}
REQUIREMENTS: ${job.requirements}

CANDIDATE PROFILE: ${JSON.stringify(candidateProfile)}

Generate a JSON response with 10 interview questions:
{
  "questions": [
    {
      "id": 1,
      "category": "technical/behavioral/situational",
      "difficulty": "easy/medium/hard",
      "question": "Question text",
      "expectedAnswer": "What a good answer should include",
      "scoringCriteria": ["criteria1", "criteria2"]
    }
  ]
}

Include a mix of:
- Technical questions (specific to job)
- Behavioral questions
- Situational questions
- Culture fit questions
`;

    const questions = await generateJSONContent(prompt);
    return questions;
    
  } catch (error) {
    console.error('Question generation error:', error);
    return { questions: [] };
  }
};

// Evaluate interview answer
export const evaluateAnswer = async (question, answer, scoringCriteria) => {
  try {
    const prompt = `
You are an expert interview evaluator. Evaluate this candidate's answer.

QUESTION: ${question}
CANDIDATE ANSWER: ${answer}
SCORING CRITERIA: ${scoringCriteria.join(', ')}

Provide a JSON response:
{
  "score": 8,
  "maxScore": 10,
  "feedback": "Detailed feedback on the answer",
  "strengths": ["strength1", "strength2"],
  "improvements": ["area1", "area2"]
}
`;

    const evaluation = await generateJSONContent(prompt);
    return evaluation;
    
  } catch (error) {
    console.error('Answer evaluation error:', error);
    return {
      score: 5,
      maxScore: 10,
      feedback: "Answer recorded",
      strengths: [],
      improvements: []
    };
  }
};

// Generate job recommendations for candidate
export const recommendJobs = async (candidateProfile, availableJobs) => {
  try {
    const prompt = `
You are a career matching AI. Recommend the best jobs for this candidate.

CANDIDATE PROFILE: ${JSON.stringify(candidateProfile)}

AVAILABLE JOBS: ${JSON.stringify(availableJobs)}

Provide a JSON response:
{
  "recommendations": [
    {
      "jobId": 1,
      "matchScore": 85,
      "reason": "Why this job is a good match",
      "highlights": ["highlight1", "highlight2"]
    }
  ]
}

Sort by match score (highest first). Include top 5 matches.
`;

    const recommendations = await generateJSONContent(prompt);
    return recommendations;
    
  } catch (error) {
    console.error('Job recommendation error:', error);
    return { recommendations: [] };
  }
};

// AI Chatbot response
export const getChatbotResponse = async (userMessage, context = {}) => {
  try {
    const prompt = `
You are an AI recruitment assistant. Help users with their questions about jobs, applications, and career advice.

USER CONTEXT: ${JSON.stringify(context)}
USER MESSAGE: ${userMessage}

Provide a helpful, professional response. If the question is about:
- Job search: Help them find relevant opportunities
- Applications: Guide them through the process
- CV tips: Provide actionable advice
- Interview prep: Share relevant tips
- Career advice: Offer professional guidance

Keep responses concise and actionable.
`;

    const response = await generateContent(prompt);
    return {
      message: response,
      timestamp: new Date()
    };
    
  } catch (error) {
    console.error('Chatbot error:', error);
    return {
      message: "I'm here to help! Could you please rephrase your question?",
      timestamp: new Date()
    };
  }
};
