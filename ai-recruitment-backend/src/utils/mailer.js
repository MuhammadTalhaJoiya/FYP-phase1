import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp-mail.outlook.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized: false
    }
  });
};

// Generic send email function
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();
    
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });
    
    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email send error:', error.message);
    return { success: false, error: error.message };
  }
};

// Send shortlist notification email
export const sendShortlistEmail = async (candidateEmail, candidateName, jobTitle, companyName) => {
  const subject = `🎉 Great News! You've Been Shortlisted for ${jobTitle}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">
            🎉 Congratulations!
          </h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">
            You've been shortlisted!
          </p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
          <p style="font-size: 16px; color: #374151; margin: 0 0 20px;">
            Hi <strong>${candidateName}</strong>,
          </p>
          
          <p style="font-size: 16px; color: #374151; margin: 0 0 25px; line-height: 1.6;">
            We're thrilled to inform you that you have been <span style="color: #10b981; font-weight: 600;">shortlisted</span> for the following position:
          </p>
          
          <!-- Job Card -->
          <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; padding: 25px; margin: 0 0 25px; border-left: 4px solid #667eea;">
            <h2 style="margin: 0 0 8px; color: #1f2937; font-size: 22px; font-weight: 600;">
              ${jobTitle}
            </h2>
            <p style="margin: 0; color: #6b7280; font-size: 16px;">
              🏢 ${companyName}
            </p>
          </div>
          
          <p style="font-size: 16px; color: #374151; margin: 0 0 15px; line-height: 1.6;">
            This means your profile stood out among many applicants! The recruiter was impressed with your qualifications and experience.
          </p>
          
          <p style="font-size: 16px; color: #374151; margin: 0 0 30px; line-height: 1.6;">
            <strong>What's next?</strong> The recruiter will reach out to you soon with further details about the next steps in the hiring process.
          </p>
          
          <!-- CTA Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/my-applications" 
               style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
              View My Applications →
            </a>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0 0 10px; color: #9ca3af; font-size: 14px;">
            This email was sent by AI Recruitment Platform
          </p>
          <p style="margin: 0; color: #9ca3af; font-size: 12px;">
            © ${new Date().getFullYear()} AI Recruitment. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
Congratulations ${candidateName}!

You've been shortlisted for ${jobTitle} at ${companyName}.

The recruiter will reach out to you soon with further details about the next steps.

View your applications at: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/my-applications

Best regards,
AI Recruitment Platform
  `;
  
  return sendEmail({ to: candidateEmail, subject, html, text });
};

// Send interview scheduled email
export const sendInterviewEmail = async (candidateEmail, candidateName, jobTitle, companyName, interviewDetails) => {
  const subject = `📅 Interview Scheduled for ${jobTitle}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">
            📅 Interview Scheduled
          </h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">
            Get ready for your interview!
          </p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
          <p style="font-size: 16px; color: #374151; margin: 0 0 20px;">
            Hi <strong>${candidateName}</strong>,
          </p>
          
          <p style="font-size: 16px; color: #374151; margin: 0 0 25px; line-height: 1.6;">
            Great news! Your interview has been scheduled for the following position:
          </p>
          
          <!-- Job Card -->
          <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 12px; padding: 25px; margin: 0 0 25px; border-left: 4px solid #3b82f6;">
            <h2 style="margin: 0 0 8px; color: #1f2937; font-size: 22px; font-weight: 600;">
              ${jobTitle}
            </h2>
            <p style="margin: 0 0 15px; color: #6b7280; font-size: 16px;">
              🏢 ${companyName}
            </p>
            ${interviewDetails ? `
            <div style="background: #ffffff; border-radius: 8px; padding: 15px; margin-top: 15px;">
              <p style="margin: 0; color: #1f2937; font-size: 16px; font-weight: 600;">
                🕐 ${interviewDetails}
              </p>
            </div>
            ` : ''}
          </div>
          
          <p style="font-size: 16px; color: #374151; margin: 0 0 15px; line-height: 1.6;">
            <strong>Tips to prepare:</strong>
          </p>
          <ul style="color: #374151; font-size: 15px; line-height: 1.8; margin: 0 0 25px; padding-left: 20px;">
            <li>Review the job description carefully</li>
            <li>Prepare examples of your relevant experience</li>
            <li>Test your audio/video if it's a virtual interview</li>
            <li>Have questions ready for the interviewer</li>
          </ul>
          
          <!-- CTA Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/my-applications" 
               style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
              View Interview Details →
            </a>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0 0 10px; color: #9ca3af; font-size: 14px;">
            This email was sent by AI Recruitment Platform
          </p>
          <p style="margin: 0; color: #9ca3af; font-size: 12px;">
            © ${new Date().getFullYear()} AI Recruitment. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
Hi ${candidateName},

Your interview has been scheduled for ${jobTitle} at ${companyName}.

${interviewDetails ? `Interview Time: ${interviewDetails}` : ''}

Tips to prepare:
- Review the job description carefully
- Prepare examples of your relevant experience
- Test your audio/video if it's a virtual interview
- Have questions ready for the interviewer

View details at: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/my-applications

Best regards,
AI Recruitment Platform
  `;
  
  return sendEmail({ to: candidateEmail, subject, html, text });
};

// Send rejection email (optional, more gentle approach)
export const sendRejectionEmail = async (candidateEmail, candidateName, jobTitle, companyName) => {
  const subject = `Update on Your Application for ${jobTitle}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">
            Application Update
          </h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
          <p style="font-size: 16px; color: #374151; margin: 0 0 20px;">
            Hi <strong>${candidateName}</strong>,
          </p>
          
          <p style="font-size: 16px; color: #374151; margin: 0 0 25px; line-height: 1.6;">
            Thank you for your interest in the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.
          </p>
          
          <p style="font-size: 16px; color: #374151; margin: 0 0 25px; line-height: 1.6;">
            After careful consideration, we have decided to move forward with other candidates whose experience more closely matches our current needs.
          </p>
          
          <p style="font-size: 16px; color: #374151; margin: 0 0 25px; line-height: 1.6;">
            We encourage you to continue exploring other opportunities on our platform. New positions are posted regularly, and your profile may be a great fit for future openings.
          </p>
          
          <!-- CTA Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/browse-jobs" 
               style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
              Browse More Jobs →
            </a>
          </div>
          
          <p style="font-size: 16px; color: #374151; margin: 25px 0 0; line-height: 1.6;">
            We wish you the best in your job search!
          </p>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0 0 10px; color: #9ca3af; font-size: 14px;">
            This email was sent by AI Recruitment Platform
          </p>
          <p style="margin: 0; color: #9ca3af; font-size: 12px;">
            © ${new Date().getFullYear()} AI Recruitment. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return sendEmail({ to: candidateEmail, subject, html });
};

// Send acceptance/offer email
export const sendAcceptanceEmail = async (candidateEmail, candidateName, jobTitle, companyName) => {
  const subject = `🎉 Job Offer: ${jobTitle} at ${companyName}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">
            🎉 You Got the Job!
          </h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">
            Congratulations on your new position!
          </p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
          <p style="font-size: 16px; color: #374151; margin: 0 0 20px;">
            Hi <strong>${candidateName}</strong>,
          </p>
          
          <p style="font-size: 16px; color: #374151; margin: 0 0 25px; line-height: 1.6;">
            We are absolutely thrilled to extend you a job offer for the position of:
          </p>
          
          <!-- Job Card -->
          <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 12px; padding: 25px; margin: 0 0 25px; border-left: 4px solid #10b981;">
            <h2 style="margin: 0 0 8px; color: #1f2937; font-size: 22px; font-weight: 600;">
              ${jobTitle}
            </h2>
            <p style="margin: 0; color: #6b7280; font-size: 16px;">
              🏢 ${companyName}
            </p>
          </div>
          
          <p style="font-size: 16px; color: #374151; margin: 0 0 25px; line-height: 1.6;">
            The recruiter will be in touch shortly with the formal offer letter and next steps for onboarding.
          </p>
          
          <p style="font-size: 16px; color: #374151; margin: 0 0 25px; line-height: 1.6;">
            We're excited to have you join the team! 🚀
          </p>
          
          <!-- CTA Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/my-applications" 
               style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
              View Details →
            </a>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0 0 10px; color: #9ca3af; font-size: 14px;">
            This email was sent by AI Recruitment Platform
          </p>
          <p style="margin: 0; color: #9ca3af; font-size: 12px;">
            © ${new Date().getFullYear()} AI Recruitment. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return sendEmail({ to: candidateEmail, subject, html });
};

