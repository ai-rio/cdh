'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ChartComponent from './ChartComponent';

type DemoState = 'idle' | 'thinking' | 'responding';

interface PromptData {
  id: string;
  text: string;
  response: string;
  hasChart?: boolean;
  chartData?: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }[];
  };
}

const prompts: PromptData[] = [
  {
    id: 'revenue-analysis',
    text: 'Analyze my Q4 revenue trends',
    response: 'Based on your Q4 data, I can see a strong upward trend in your revenue streams. Your content monetization has increased by 34% compared to Q3, with sponsored content being your top performer. Brand partnerships show consistent growth, while your digital product sales have seen a 28% boost.',
    hasChart: true,
    chartData: {
      labels: ['Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Revenue ($)',
          data: [12000, 15500, 18200],
          backgroundColor: 'rgba(163, 230, 53, 0.6)',
          borderColor: 'rgba(163, 230, 53, 1)',
          borderWidth: 2,
        },
      ],
    },
  },
  {
    id: 'content-strategy',
    text: 'Suggest content strategy for next month',
    response: 'For next month, I recommend focusing on educational content that showcases your expertise. Based on your audience engagement patterns, Tuesday and Thursday posts perform 40% better. Consider creating a weekly series around industry insights, and don\'t forget to leverage user-generated content to boost community engagement.',
    hasChart: false,
  },
  {
    id: 'deal-pipeline',
    text: 'Show my deal pipeline status',
    response: 'Your current pipeline looks healthy with 12 active opportunities. You have 3 deals in final negotiations worth $45K total, 5 in proposal stage worth $32K, and 4 new prospects worth $18K. Your conversion rate has improved to 68% this quarter.',
    hasChart: true,
    chartData: {
      labels: ['Prospects', 'Proposals', 'Negotiations', 'Closed'],
      datasets: [
        {
          label: 'Deal Count',
          data: [4, 5, 3, 8],
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
        },
      ],
    },
  },
];

export default function AITypingDemo() {
  const [state, setState] = useState<DemoState>('idle');
  const [selectedPrompt, setSelectedPrompt] = useState<PromptData | null>(null);
  const [displayedText, setDisplayedText] = useState('');
  const [showChart, setShowChart] = useState(false);

  const handlePromptClick = (prompt: PromptData) => {
    if (state !== 'idle') return;
    
    setSelectedPrompt(prompt);
    setState('thinking');
    setDisplayedText('');
    setShowChart(false);

    // Simulate thinking time
    setTimeout(() => {
      setState('responding');
    }, 1500);
  };

  // Typing effect
  useEffect(() => {
    if (state === 'responding' && selectedPrompt) {
      let index = 0;
      const text = selectedPrompt.response;
      
      const typeInterval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(typeInterval);
          // Show chart after typing is complete
          if (selectedPrompt.hasChart) {
            setTimeout(() => {
              setShowChart(true);
            }, 500);
          }
          // Reset to idle after a delay
          setTimeout(() => {
            setState('idle');
            setSelectedPrompt(null);
            setDisplayedText('');
            setShowChart(false);
          }, 8000);
        }
      }, 30); // Typing speed

      return () => clearInterval(typeInterval);
    }
  }, [state, selectedPrompt]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
      {/* Prompt Chips */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 justify-center">
        {prompts.map((prompt) => (
          <Button
            key={prompt.id}
            variant="outline"
            onClick={() => handlePromptClick(prompt)}
            disabled={state !== 'idle'}
            className="bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200 disabled:opacity-50 text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2 flex-shrink-0"
          >
            {prompt.text}
          </Button>
        ))}
      </div>

      {/* AI Response Area */}
      <Card className="bg-black/20 border-white/10 backdrop-blur-xl min-h-[200px] sm:min-h-[250px]">
        <CardContent className="p-4 sm:p-6">
          {state === 'idle' && (
            <div className="text-center text-gray-400 py-6 sm:py-8">
              <div className="text-xl sm:text-2xl mb-2">🤖</div>
              <p className="text-sm sm:text-base px-2">Click a prompt above to see the AI co-pilot in action</p>
            </div>
          )}

          {state === 'thinking' && (
            <div className="text-center text-gray-400 py-6 sm:py-8">
              <div className="text-xl sm:text-2xl mb-4">🤔</div>
              <div className="flex items-center justify-center space-x-1">
                <div className="w-2 h-2 bg-lime-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-lime-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-lime-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <p className="mt-2 text-sm sm:text-base">Analyzing your data...</p>
            </div>
          )}

          {state === 'responding' && selectedPrompt && (
            <div>
              <div className="flex items-start space-x-2 sm:space-x-3 mb-4">
                <div className="text-lg sm:text-xl flex-shrink-0">🤖</div>
                <div className="flex-1 min-w-0">
                  <p className="text-white leading-relaxed text-sm sm:text-base break-words">
                    {displayedText}
                    {displayedText.length < selectedPrompt.response.length && (
                      <span className="inline-block w-2 h-4 sm:h-5 bg-lime-400 ml-1 animate-pulse"></span>
                    )}
                  </p>
                </div>
              </div>
              
              {showChart && selectedPrompt.hasChart && selectedPrompt.chartData && (
                <div className="animate-fade-in mt-4">
                  <ChartComponent data={selectedPrompt.chartData} />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}