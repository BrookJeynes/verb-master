import { useState } from "react";
import { State, WordConjugation } from "./types";
import Result from "./pages/Result";
import Question from "./pages/Question";
import Home from "./pages/Home";

function App() {
  const [state, setState] = useState<State>(State.home);
  const [question_count, setQuestionCount] = useState<number>(10);
  const [correct_question_count, setCorrectQuestionCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [words, setWords] = useState<WordConjugation[]>([]);

  switch (state) {
    case State.home:
      return (
        <Home
          setState={setState}
          setWords={setWords}
          setQuestionCount={setQuestionCount}
          setCorrectQuestionCount={setCorrectQuestionCount}
          setError={setError}
          error={error}
        />
      );
    case State.question:
      if (words.length === 0) {
        setError("No DB selected.");
        return;
      }
      return (
        <Question
          setState={setState}
          setError={setError}
          incrementCorrectQuestions={() =>
            setCorrectQuestionCount(correct_question_count + 1)
          }
          question_count={question_count}
          words={words}
        />
      );
    case State.result:
      return (
        <Result
          setState={setState}
          setError={setError}
          question_count={question_count}
          correct_question_count={correct_question_count}
        />
      );
  }
}

export default App;
