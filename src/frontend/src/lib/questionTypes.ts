export interface Question {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
}

export interface AirtableRecord {
  id: string;
  fields: {
    Question?: string;
    OptionA?: string;
    OptionB?: string;
    OptionC?: string;
    OptionD?: string;
    CorrectAnswer?: string;
  };
}

export interface AirtableResponse {
  records: AirtableRecord[];
}

export function parseAirtableResponse(jsonString: string): Question[] {
  try {
    const data: AirtableResponse = JSON.parse(jsonString);
    
    return data.records
      .map((record) => {
        const fields = record.fields;
        
        // Validate that all required fields are present
        if (
          !fields.Question ||
          !fields.OptionA ||
          !fields.OptionB ||
          !fields.OptionC ||
          !fields.OptionD ||
          !fields.CorrectAnswer
        ) {
          return null;
        }

        return {
          question: fields.Question,
          optionA: fields.OptionA,
          optionB: fields.OptionB,
          optionC: fields.OptionC,
          optionD: fields.OptionD,
          correctAnswer: fields.CorrectAnswer,
        };
      })
      .filter((q): q is Question => q !== null);
  } catch (error) {
    console.error('Failed to parse Airtable response:', error);
    return [];
  }
}
