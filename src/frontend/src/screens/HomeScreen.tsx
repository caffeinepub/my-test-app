import { useState } from 'react';
import { useQuestions } from '../hooks/useQuestions';
import { Question } from '../lib/questionTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface HomeScreenProps {
  onStartTest: (questions: Question[]) => void;
}

export default function HomeScreen({ onStartTest }: HomeScreenProps) {
  const [baseId, setBaseId] = useState('');
  const [tableId, setTableId] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [configSaved, setConfigSaved] = useState(false);

  const { questions, isLoading, error, saveConfig, refetch } = useQuestions();

  const handleSaveConfig = async () => {
    if (baseId && tableId && apiToken) {
      await saveConfig(apiToken, baseId, tableId);
      setConfigSaved(true);
      // Clear the token from UI for security
      setApiToken('');
    }
  };

  const handleStartTest = () => {
    if (questions.length > 0) {
      onStartTest(questions);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          My Test App
        </h1>
        <p className="text-lg text-muted-foreground">
          Test your knowledge with multiple-choice questions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Airtable Configuration</CardTitle>
          <CardDescription>
            Optional: Connect to your Airtable database for custom questions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="baseId">Base ID</Label>
            <Input
              id="baseId"
              placeholder="appXXXXXXXXXXXXXX"
              value={baseId}
              onChange={(e) => setBaseId(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tableId">Table Name or ID</Label>
            <Input
              id="tableId"
              placeholder="Questions"
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="apiToken">API Token</Label>
            <Input
              id="apiToken"
              type="password"
              placeholder="patXXXXXXXXXXXXXX"
              value={apiToken}
              onChange={(e) => setApiToken(e.target.value)}
            />
          </div>
          
          <Button
            onClick={handleSaveConfig}
            disabled={!baseId || !tableId || !apiToken}
            className="w-full"
          >
            Save Configuration
          </Button>
          
          {configSaved && (
            <p className="text-sm text-green-600 text-center">
              Configuration saved! Click "Start Test" to load questions.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="text-center space-y-4">
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              {error}
            </p>
            <p className="text-xs text-yellow-600 mt-1">
              Using fallback questions instead.
            </p>
          </div>
        )}

        {isLoading ? (
          <Button disabled size="lg" className="text-lg px-12 py-6 h-auto">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Loading Questions...
          </Button>
        ) : (
          <Button
            onClick={handleStartTest}
            size="lg"
            className="text-lg px-12 py-6 h-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Start Test
          </Button>
        )}

        {questions.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {questions.length} questions ready
          </p>
        )}
      </div>
    </div>
  );
}
