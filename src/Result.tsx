import { State } from "./types";

function Result({
    setState,
    setError,
    question_count,
    correct_question_count,
}: {
    setState: React.Dispatch<React.SetStateAction<State>>
    setError: React.Dispatch<React.SetStateAction<string | null>>,
    question_count: number,
    correct_question_count: number,
}) {
    function onBack() {
        setState(State.home);
        setError(null);
    }

    return (
        <div className="flex h-full flex-col items-center gap-8 px-5 py-6 dark:bg-offblack dark:text-whitehover">
            <h1 className="text-center text-4xl font-bold">Results</h1>
            <p className="text-2xl">{correct_question_count} / {question_count}</p>
            <button
                onClick={onBack}
                className="mt-4 h-12 w-56 rounded-md border border-platinum px-4 py-2 font-bold shadow-sm hover:bg-whitehover dark:hover:bg-black"
            >
                Back to home
            </button>
        </div>
    );
}

export default Result;
