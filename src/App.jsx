import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CandidateDashboard from './pages/CandidateDashboard';
import BrowseJobs from './pages/BrowseJobs';
import JobApplication from './pages/JobApplication';
import MyApplications from './pages/MyApplications';
import RecruiterDashboard from './pages/RecruiterDashboard';
import RecruiterJobDetails from './pages/RecruiterJobDetails';
import JobApplications from './pages/JobApplications';
import PostJob from './pages/PostJob';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import { AIChatBot } from './components/AIChatBot';

// Phase-2: AI Voice/Video Interview Pages
import CreateInterview from './pages/phase2/CreateInterview';
import InterviewLanding from './pages/phase2/InterviewLanding';
import VoiceInterview from './pages/phase2/VoiceInterview';
import VideoInterview from './pages/phase2/VideoInterview';
import InterviewResult from './pages/phase2/InterviewResult';

function App() {
  return (
    <BrowserRouter>
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#1F2937',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<CandidateDashboard />} />
        <Route path="/browse-jobs" element={<BrowseJobs />} />
        <Route path="/apply/:jobId" element={<JobApplication />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
        <Route path="/recruiter/post-job" element={<PostJob />} />
        <Route path="/recruiter/job/:id" element={<RecruiterJobDetails />} />
        <Route path="/recruiter/applications/:jobId" element={<JobApplications />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        
        {/* Phase-2: AI Voice/Video Interview Routes */}
        <Route path="/recruiter/create-interview" element={<CreateInterview />} />
        <Route path="/interview/:id" element={<InterviewLanding />} />
        <Route path="/interview/:id/voice" element={<VoiceInterview />} />
        <Route path="/interview/:id/video" element={<VideoInterview />} />
        <Route path="/interview/:id/result" element={<InterviewResult />} />
        
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <AIChatBot />
    </BrowserRouter>
  );
}

export default App;
