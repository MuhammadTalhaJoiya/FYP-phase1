import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';

const applicationTrendData = [
  { month: 'Jan', applications: 2, interviews: 1 },
  { month: 'Feb', applications: 5, interviews: 2 },
  { month: 'Mar', applications: 3, interviews: 3 },
  { month: 'Apr', applications: 7, interviews: 4 },
  { month: 'May', applications: 4, interviews: 2 },
  { month: 'Jun', applications: 6, interviews: 3 },
];

const skillMatchData = [
  { skill: 'React', proficiency: 90 },
  { skill: 'TypeScript', proficiency: 85 },
  { skill: 'Node.js', proficiency: 75 },
  { skill: 'GraphQL', proficiency: 60 },
  { skill: 'Docker', proficiency: 50 },
];

const applicationStatusData = [
  { name: 'Under Review', value: 5, color: '#FCD34D' },
  { name: 'Shortlisted', value: 3, color: '#34D399' },
  { name: 'Interview', value: 2, color: '#60A5FA' },
  { name: 'Rejected', value: 1, color: '#F87171' },
];

export const ApplicationTrendChart = () => (
  <Card>
    <CardHeader>
      <CardTitle>Application Trend</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={applicationTrendData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: '12px' }} />
          <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#FFF', 
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '12px'
            }} 
          />
          <Line 
            type="monotone" 
            dataKey="applications" 
            stroke="#4F46E5" 
            strokeWidth={2}
            dot={{ fill: '#4F46E5', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="interviews" 
            stroke="#10B981" 
            strokeWidth={2}
            dot={{ fill: '#10B981', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary-600 rounded-full" />
          <span className="text-sm text-gray-600">Applications</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span className="text-sm text-gray-600">Interviews</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const SkillProficiencyChart = () => (
  <Card>
    <CardHeader>
      <CardTitle>Skills Proficiency</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={skillMatchData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis type="number" stroke="#6B7280" style={{ fontSize: '12px' }} />
          <YAxis dataKey="skill" type="category" stroke="#6B7280" style={{ fontSize: '12px' }} width={80} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#FFF', 
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '12px'
            }} 
          />
          <Bar dataKey="proficiency" fill="#4F46E5" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export const ApplicationStatusChart = () => (
  <Card>
    <CardHeader>
      <CardTitle>Application Status</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={applicationStatusData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {applicationStatusData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-3 mt-4">
        {applicationStatusData.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-gray-600">{item.name} ({item.value})</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

