import { Conjugation } from "../external/korean_conjugation/conjugator";

export interface Db {
  words: string[];
}

export interface DbSet {
  enabled: boolean;
  name: string;
  dataset: Db;
  isCustom: boolean;
}

export enum State {
  home,
  question,
  result,
}

export enum QuestionState {
  correct,
  incorrect,
  undecided,
}

export type Theme = "light" | "dark";

export type WordConjugation = Conjugation & { word: string };

export type Tense =
  | "declarative present informal low"
  | "declarative present informal high"
  | "declarative present formal low"
  | "declarative present formal high"
  | "declarative past informal low"
  | "declarative past informal high"
  | "declarative past formal low"
  | "declarative past formal high"
  | "declarative future informal low"
  | "declarative future informal high"
  | "declarative future formal low"
  | "declarative future formal high"
  | "declarative future conditional informal low"
  | "declarative future conditional informal high"
  | "declarative future conditional formal low"
  | "declarative future conditional formal high"
  | "inquisitive present informal low"
  | "inquisitive present informal high"
  | "inquisitive present formal low"
  | "inquisitive present formal high"
  | "inquisitive past informal low"
  | "inquisitive past informal high"
  | "inquisitive past formal low"
  | "inquisitive past formal high"
  | "imperative present informal low"
  | "imperative present informal high"
  | "imperative present formal low"
  | "imperative present formal high"
  | "propositive present informal low"
  | "propositive present informal high"
  | "propositive present formal low"
  | "propositive present formal high"
  | "connective if"
  | "connective and"
  | "nominal ing";
