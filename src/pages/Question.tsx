import { useRef, useState } from "react";
import { QuestionState, State, WordConjugation } from "../types";
import { FaCircleCheck, FaCircleXmark, FaXmark } from "react-icons/fa6";
import ProgressBar from "../components/ProgressBar";

function Question({
  setState,
  setError,
  incrementCorrectQuestions,
  question_count,
  words,
}: {
  setState: React.Dispatch<React.SetStateAction<State>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  incrementCorrectQuestions: () => void;
  question_count: number;
  words: WordConjugation[];
}) {
  const [question_state, setQuestionState] = useState<QuestionState>(
    QuestionState.undecided,
  );
  const [current_word_idx, setCurrentWordIdx] = useState<number>(0);
  const user_input_ref = useRef(null);

  if (current_word_idx === question_count) {
    setState(State.result);
    return;
  }

  function onQuit() {
    setError(null);
    setState(State.home);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // @ts-ignore
    const user_input = e.target.user_input.value as string;

    if (question_state === QuestionState.undecided) {
      let sanitised_user_input = user_input.trim();
      const word = words[current_word_idx].conjugation;

      // Allow the user to skip the question mark
      if (!sanitised_user_input.endsWith("?") && word.endsWith("?")) {
        sanitised_user_input = sanitised_user_input + "?";
      }

      if (sanitised_user_input === word) {
        setQuestionState(QuestionState.correct);
        incrementCorrectQuestions();
      } else {
        const input_element = document.getElementById("user_input");
        // @ts-ignore
        input_element.classList.add("animate-shake");
        // @ts-ignore
        setTimeout(() => input_element.classList.remove("animate-shake"), 400);
      }
    } else {
      setCurrentWordIdx(current_word_idx + 1);
      // @ts-ignore
      user_input_ref.current.value = "";
      setQuestionState(QuestionState.undecided);
    }
  }

  function onSkip() {
    setQuestionState(QuestionState.incorrect);
  }

  return (
    <form
      className="flex h-full flex-col items-center justify-between text-black dark:bg-offblack dark:text-whitehover"
      onSubmit={onSubmit}
    >
      <div className="flex size-full flex-col items-center px-5 py-6 md:w-5/6 2xl:w-1/2">
        <div className="flex w-full items-center gap-4">
          <FaXmark
            onClick={onQuit}
            size={28}
            className="text-darkgray hover:cursor-pointer hover:text-black dark:text-whitehover dark:hover:text-white"
          />
          <ProgressBar progress={(current_word_idx / question_count) * 100} />
        </div>

        <div className="flex h-4/6 w-full flex-col items-center justify-center gap-4 text-center">
          <p>
            Make the following{" "}
            <span className="font-bold text-blue">
              {words[current_word_idx].tense}
            </span>
          </p>
          <p className="mb-4 text-4xl font-bold">
            {words[current_word_idx].word}
          </p>

          <input
            id="user_input"
            type="text"
            ref={user_input_ref}
            className="w-full rounded-md border-2 border-solid border-platinum px-2 py-1 text-center shadow dark:text-black md:w-5/6"
          />
        </div>
      </div>

      <div
        className={
          "flex w-full items-center justify-center border-t-2 border-t-platinum px-5 py-6 dark:bg-jet " +
          `${question_state === QuestionState.undecided ? "bg-white" : question_state === QuestionState.correct ? "bg-lightgreen" : "bg-lightred"}`
        }
      >
        <div className="flex w-full flex-col items-center justify-between gap-1 md:w-5/6 md:flex-row 2xl:w-1/2">
          {question_state === QuestionState.undecided ? (
            <button
              type="button"
              onClick={onSkip}
              disabled={question_state !== QuestionState.undecided}
              className="h-12 w-full rounded-md border border-platinum bg-white px-4 py-2 font-bold shadow-sm hover:cursor-pointer hover:bg-lightgray dark:bg-offblack dark:hover:bg-black md:w-56"
            >
              SKIP
            </button>
          ) : question_state === QuestionState.correct ? (
            <div className="flex flex-col items-center self-start text-darkgreen md:flex-row">
              <div className="flex flex-col self-start">
                <div className="mb-4 flex items-center gap-4 md:mb-2">
                  <FaCircleCheck size={54} />
                  <div>
                    <div className="flex items-center gap-2 md:mb-2">
                      <p>Correct:</p>
                      <p className="hidden text-2xl font-bold md:block">
                        {words[current_word_idx].conjugation}
                      </p>
                    </div>
                    <p className="block text-2xl font-bold md:mb-2 md:hidden">
                      {words[current_word_idx].conjugation}
                    </p>
                    <div className="hidden text-base md:block">
                      {words[current_word_idx].reasons.map((reason, i) => (
                        <p key={reason}>
                          {i + 1}. {reason}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="block text-base md:hidden">
                {words[current_word_idx].reasons.map((reason, i) => (
                  <p key={reason}>
                    {i + 1}. {reason}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center self-start text-red md:flex-row">
              <div className="flex flex-col self-start">
                <div className="mb-4 flex items-center gap-4 md:mb-2">
                  <FaCircleXmark size={54} />
                  <div>
                    <div className="flex items-center gap-2 md:mb-2 ">
                      <p>Correct solution:</p>
                      <p className="hidden text-2xl font-bold md:block">
                        {words[current_word_idx].conjugation}
                      </p>
                    </div>
                    <p className="block text-2xl font-bold md:mb-2 md:hidden">
                      {words[current_word_idx].conjugation}
                    </p>
                    <div className="hidden text-base md:block">
                      {words[current_word_idx].reasons.map((reason, i) => (
                        <p key={reason}>
                          {i + 1}. {reason}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="block text-base md:hidden">
                {words[current_word_idx].reasons.map((reason, i) => (
                  <p key={reason}>
                    {i + 1}. {reason}
                  </p>
                ))}
              </div>
            </div>
          )}

          <input
            type="submit"
            value={
              question_state === QuestionState.undecided ? "CHECK" : "CONTINUE"
            }
            className={`mt-4 h-12 w-full rounded-md shadow-sm md:mt-0 ${question_state !== QuestionState.incorrect ? "bg-green hover:bg-greenhover" : "bg-red hover:bg-redhover"} px-4 py-2 font-bold hover:cursor-pointer md:w-56`}
          />
        </div>
      </div>
    </form>
  );
}

export default Question;
