import { Question } from '../lib/questionTypes';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

interface QuizScreenProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  onNext: () => void;
}

export default function QuizScreen({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  onNext,
}: QuizScreenProps) {
  const options = [
    { label: 'A', value: question.optionA },
    { label: 'B', value: question.optionB },
    { label: 'C', value: question.optionC },
    { label: 'D', value: question.optionD },
  ];

  const getOptionColor = (optionLabel: string) => {
    const colors = {
      A: 'from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600',
      B: 'from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600',
      C: 'from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600',
      D: 'from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600',
    };
    return colors[optionLabel as keyof typeof colors];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium text-muted-foreground">
          Question {questionNumber} of {totalQuestions}
        </div>
        <div className="h-2 flex-1 mx-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-8">
            {question.question}
          </h2>

          <div className="space-y-3">
            {options.map((option) => {
              const isSelected = selectedAnswer === option.label;
              
              return (
                <button
                  key={option.label}
                  onClick={() => onAnswerSelect(option.label)}
                  disabled={selectedAnswer !== null}
                  className={`
                    w-full text-left p-4 rounded-lg transition-all duration-200
                    ${
                      isSelected
                        ? `bg-gradient-to-r ${getOptionColor(option.label)} text-white shadow-lg scale-[1.02]`
                        : 'bg-gray-50 hover:bg-gray-100 text-foreground border-2 border-gray-200'
                    }
                    ${selectedAnswer !== null && !isSelected ? 'opacity-50' : ''}
                    disabled:cursor-not-allowed
                    flex items-center justify-between
                    text-base md:text-lg
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`
                        flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold
                        ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }
                      `}
                    >
                      {option.label}
                    </span>
                    <span>{option.value}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-6 h-6" />}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={onNext}
          disabled={selectedAnswer === null}
          size="lg"
          className="text-lg px-8 py-6 h-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          {questionNumber === totalQuestions ? 'Finish' : 'Next'}
        </Button>
      </div>
    </div>
  );
}
