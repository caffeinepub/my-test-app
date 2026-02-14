import { useState, useEffect } from 'react';
import { useActor } from './useActor';
import { Question } from '../lib/questionTypes';
import { parseAirtableResponse } from '../lib/questionTypes';
import { fallbackQuestions } from '../data/fallbackQuestions';

export function useQuestions() {
  const { actor, isFetching } = useActor();
  const [questions, setQuestions] = useState<Question[]>(fallbackQuestions);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadQuestionsFromBackend = async () => {
    if (!actor) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await actor.loadQuestions();
      const parsedQuestions = parseAirtableResponse(response);

      if (parsedQuestions.length > 0) {
        setQuestions(parsedQuestions);
      } else {
        setError('No valid questions found in Airtable.');
        setQuestions(fallbackQuestions);
      }
    } catch (err) {
      console.error('Failed to load questions from Airtable:', err);
      setError('Failed to load questions from Airtable.');
      setQuestions(fallbackQuestions);
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = async (apiToken: string, baseId: string, tableId: string) => {
    if (!actor) {
      setError('Backend not available');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await actor.setAirtableCreds(apiToken, baseId, tableId);
      // After saving config, try to load questions
      await loadQuestionsFromBackend();
    } catch (err) {
      console.error('Failed to save Airtable configuration:', err);
      setError('Failed to save configuration.');
      setQuestions(fallbackQuestions);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = () => {
    loadQuestionsFromBackend();
  };

  // Initialize with fallback questions
  useEffect(() => {
    if (!isFetching && actor) {
      // Check if configuration exists
      actor.isConfigured().then((configured) => {
        if (configured) {
          loadQuestionsFromBackend();
        }
      });
    }
  }, [actor, isFetching]);

  return {
    questions,
    isLoading: isLoading || isFetching,
    error,
    saveConfig,
    refetch,
  };
}
