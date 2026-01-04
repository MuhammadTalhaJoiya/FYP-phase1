import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Mic, Video, Clock, Hash, Sparkles, 
  ChevronLeft, Settings, FileText, CheckCircle 
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { QuestionCard } from '../../components/phase2/interview/QuestionCard';
import { 
  jobRoles, 
  skillCategories, 
  generateInterviewQuestions 
} from '../../data/interviewDummyData';

const CreateInterview = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  
  const [formData, setFormData] = useState({
    jobRole: '',
    numberOfQuestions: 5,
    interviewMode: 'voice',
    timePerQuestion: 120,
    selectedSkills: [],
  });

  const handleSkillToggle = (skillId) => {
    setFormData(prev => ({
      ...prev,
      selectedSkills: prev.selectedSkills.includes(skillId)
        ? prev.selectedSkills.filter(s => s !== skillId)
        : [...prev.selectedSkills, skillId]
    }));
  };

  const handleGenerateQuestions = async () => {
    setIsGenerating(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const questions = generateInterviewQuestions({
      numberOfQuestions: formData.numberOfQuestions,
      skills: formData.selectedSkills.length > 0 ? formData.selectedSkills : null,
    });
    
    setGeneratedQuestions(questions);
    setIsGenerating(false);
  };

  const handleCreateInterview = () => {
    // In production, this would create the interview via API
    // For now, navigate to a demo interview
    navigate('/interview/demo-001');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/recruiter-dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Create AI Interview</h1>
                <p className="text-sm text-gray-500">Set up automated candidate screening</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            {/* Interview Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary-600" />
                  Interview Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Job Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Role
                  </label>
                  <Select
                    value={formData.jobRole}
                    onChange={(e) => setFormData(prev => ({ ...prev, jobRole: e.target.value }))}
                  >
                    <option value="">Select a job role</option>
                    {jobRoles.map(role => (
                      <option key={role.id} value={role.id}>
                        {role.title} ({role.department})
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Number of Questions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Hash className="w-4 h-4 inline mr-1" />
                    Number of Questions
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.numberOfQuestions}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      numberOfQuestions: parseInt(e.target.value) || 5 
                    }))}
                  />
                </div>

                {/* Interview Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Interview Mode
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, interviewMode: 'voice' }))}
                      className={`
                        flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all
                        ${formData.interviewMode === 'voice'
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }
                      `}
                    >
                      <Mic className="w-5 h-5" />
                      <span className="font-medium">Voice Interview</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, interviewMode: 'video' }))}
                      className={`
                        flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all
                        ${formData.interviewMode === 'video'
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }
                      `}
                    >
                      <Video className="w-5 h-5" />
                      <span className="font-medium">Video Interview</span>
                    </button>
                  </div>
                </div>

                {/* Time per Question */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Time per Question (seconds)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={30}
                      max={180}
                      step={30}
                      value={formData.timePerQuestion}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        timePerQuestion: parseInt(e.target.value) 
                      }))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                    />
                    <span className="text-lg font-semibold text-gray-900 w-16 text-right">
                      {formData.timePerQuestion}s
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skill Categories Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary-600" />
                  Skill Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Select the skills you want to evaluate (leave empty for all)
                </p>
                <div className="flex flex-wrap gap-2">
                  {skillCategories.map(skill => {
                    const isSelected = formData.selectedSkills.includes(skill.id);
                    return (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => handleSkillToggle(skill.id)}
                        className={`
                          flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all
                          ${isSelected
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                          }
                        `}
                      >
                        {isSelected && <CheckCircle className="w-4 h-4" />}
                        <span className="text-sm font-medium">{skill.label}</span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Button
              onClick={handleGenerateQuestions}
              loading={isGenerating}
              disabled={!formData.jobRole}
              className="w-full"
              size="lg"
              icon={<Sparkles className="w-5 h-5" />}
            >
              Generate Interview Questions
            </Button>
          </div>

          {/* Right Column - Generated Questions */}
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Generated Questions</span>
                  {generatedQuestions.length > 0 && (
                    <Badge variant="primary">{generatedQuestions.length} questions</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {generatedQuestions.length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-12"
                    >
                      <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No questions generated yet
                      </h3>
                      <p className="text-sm text-gray-500">
                        Configure your interview settings and click generate
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="questions"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      {generatedQuestions.map((question, index) => (
                        <QuestionCard
                          key={question.id}
                          question={question}
                          index={index}
                          compact
                        />
                      ))}

                      {/* Create Interview Button */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="pt-4 border-t border-gray-200"
                      >
                        <Button
                          onClick={handleCreateInterview}
                          className="w-full"
                          size="lg"
                          variant="success"
                        >
                          Create Interview & Get Link
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateInterview;

