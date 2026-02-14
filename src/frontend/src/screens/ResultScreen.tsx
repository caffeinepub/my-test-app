import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, RotateCcw } from 'lucide-react';

interface ResultScreenProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

export default function ResultScreen({
  score,
  totalQuestions,
  onRestart,
}: ResultScreenProps) {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  const getPerformanceMessage = () => {
    if (percentage >= 80) return { text: 'Excellent!', emoji: '🎉' };
    if (percentage >= 60) return { text: 'Good Job!', emoji: '👍' };
    if (percentage >= 40) return { text: 'Keep Practicing!', emoji: '💪' };
    return { text: 'Try Again!', emoji: '📚' };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="space-y-8 text-center">
      <div className="space-y-4">
        <div className="flex justify-center">
          <Trophy className="w-20 h-20 text-yellow-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Test Complete!
        </h1>
        <p className="text-xl text-muted-foreground">
          {performance.text} {performance.emoji}
        </p>
      </div>

      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 space-y-6">
          <div>
            <p className="text-lg text-muted-foreground mb-2">Your Score</p>
            <p className="text-5xl md:text-6xl font-bold text-foreground">
              {score}/{totalQuestions}
            </p>
          </div>

          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block text-blue-600">
                  {percentage}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-4 text-xs flex rounded-full bg-gray-200">
              <div
                style={{ width: `${percentage}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 text-sm">
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-green-600 font-semibold">Correct</p>
              <p className="text-2xl font-bold text-green-700">{score}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <p className="text-red-600 font-semibold">Incorrect</p>
              <p className="text-2xl font-bold text-red-700">
                {totalQuestions - score}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={onRestart}
        size="lg"
        className="text-lg px-12 py-6 h-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
      >
        <RotateCcw className="mr-2 h-5 w-5" />
        Restart Test
      </Button>
    </div>
  );
}
