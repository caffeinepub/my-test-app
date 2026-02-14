import { useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import QuizScreen from './screens/QuizScreen';
import ResultScreen from './screens/ResultScreen';
import { Question } from './lib/questionTypes';

type Screen = 'home' | 'quiz' | 'result';

interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  selectedAnswers: (string | null)[];
  score: number;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    selectedAnswers: [],
    score: 0,
  });

  const handleStartTest = (questions: Question[]) => {
    setQuizState({
      questions,
      currentQuestionIndex: 0,
      selectedAnswers: new Array(questions.length).fill(null),
      score: 0,
    });
    setCurrentScreen('quiz');
  };

  const handleAnswerSelect = (answer: string) => {
    const { currentQuestionIndex, selectedAnswers, questions, score } = quizState;
    
    // Prevent double-scoring: only score if this question hasn't been answered yet
    if (selectedAnswers[currentQuestionIndex] === null) {
      const currentQuestion = questions[currentQuestionIndex];
      const isCorrect = answer === currentQuestion.correctAnswer;
      
      const newSelectedAnswers = [...selectedAnswers];
      newSelectedAnswers[currentQuestionIndex] = answer;
      
      setQuizState({
        ...quizState,
        selectedAnswers: newSelectedAnswers,
        score: isCorrect ? score + 1 : score,
      });
    }
  };

  const handleNext = () => {
    const { currentQuestionIndex, questions } = quizState;
    
    if (currentQuestionIndex < questions.length - 1) {
      setQuizState({
        ...quizState,
        currentQuestionIndex: currentQuestionIndex + 1,
      });
    } else {
      // Last question, go to result screen
      setCurrentScreen('result');
    }
  };

  const handleRestart = () => {
    setQuizState({
      questions: [],
      currentQuestionIndex: 0,
      selectedAnswers: [],
      score: 0,
    });
    setCurrentScreen('home');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {currentScreen === 'home' && (
          <HomeScreen onStartTest={handleStartTest} />
        )}
        
        {currentScreen === 'quiz' && (
          <QuizScreen
            question={quizState.questions[quizState.currentQuestionIndex]}
            questionNumber={quizState.currentQuestionIndex + 1}
            totalQuestions={quizState.questions.length}
            selectedAnswer={quizState.selectedAnswers[quizState.currentQuestionIndex]}
            onAnswerSelect={handleAnswerSelect}
            onNext={handleNext}
          />
        )}
        
        {currentScreen === 'result' && (
          <ResultScreen
            score={quizState.score}
            totalQuestions={quizState.questions.length}
            onRestart={handleRestart}
          />
        )}
      </div>
      
      <footer className="py-6 text-center text-sm text-muted-foreground border-t mt-12">
        <p>
          © {new Date().getFullYear()} My Test App. Built with ❤️ using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== 'undefined' ? window.location.hostname : 'my-test-app'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
