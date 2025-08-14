import { useState, useEffect } from "react";
import type { Question } from "@shared/schema";

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string, responseTime: number) => void;
  disabled: boolean;
}

export default function QuestionCard({ question, onAnswer, disabled }: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());

  useEffect(() => {
    setStartTime(Date.now());
    setSelectedOption(null);
  }, [question]);

  const handleOptionClick = (option: string) => {
    if (disabled || selectedOption) return;
    
    const responseTime = (Date.now() - startTime) / 1000;
    setSelectedOption(option);
    onAnswer(option, responseTime);
  };

  const options = [
    { key: 'A', text: question.optionA },
    { key: 'B', text: question.optionB },
    { key: 'C', text: question.optionC },
    { key: 'D', text: question.optionD },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="mb-4">
        <span className="inline-block bg-medical-blue text-white text-xs font-semibold px-3 py-1 rounded-full">
          {question.domaine}
        </span>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-6 leading-relaxed">
        {question.question}
      </h3>
      
      {/* Answer Options */}
      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.key}
            onClick={() => handleOptionClick(option.key)}
            disabled={disabled}
            className={`w-full text-left p-4 border-2 rounded-lg transition-all duration-200 group ${
              selectedOption === option.key
                ? 'border-medical-blue bg-blue-50'
                : disabled
                ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                : 'border-gray-200 hover:border-medical-blue hover:bg-blue-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold ${
                selectedOption === option.key
                  ? 'border-medical-blue bg-medical-blue text-white'
                  : disabled
                  ? 'border-gray-300 text-gray-400'
                  : 'border-gray-300 group-hover:border-medical-blue text-gray-600 group-hover:text-medical-blue'
              }`}>
                {option.key}
              </div>
              <span className={`${
                disabled ? 'text-gray-500' : 'text-gray-700 group-hover:text-gray-900'
              }`}>
                {option.text}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
