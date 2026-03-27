export interface TripLog {
  id: number;
  date: string;
  mood: string;
  moodSub: string;
  moodIndex: number;
  substances: string[];
  locations: string[];
  reasons: string[];
  bodyFeelings: string[];
  feltGood: string;
  challenging: string;
  learned: string;
  different: string;
}

export type JournalStep = 'main' | 'context' | 'mood' | 'reflection' | 'done';
