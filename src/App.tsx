import { useRef, useState } from "react";
import { getRandomConjugations, isValidVerb } from "./conjugator";
import { Config, default_config } from "./config";
import { Tense, WordConjugation } from "./types";
import { parseKimchiCsv } from "./csv";
import { FaCircleCheck, FaCircleXmark, FaRectangleXmark, FaXmark } from "react-icons/fa6";

enum State {
    home,
    question,
    result,
};

enum QuestionState {
    correct,
    incorrect,
    undecided,
};

function ProgressBar({ progress }: { progress: number }) {
    const fillerStyles = {
        width: `${progress}%`,
    };

    return (
        <div className="h-6 w-full rounded-md border border-platinum bg-lightgray shadow-sm">
            <div className="h-full rounded-md bg-blue" style={fillerStyles} />
        </div>
    );
};

function Home({
    setState,
    setWords,
    setQuestionCount,
    setConfig,
    setError,
    config,
    error,
}: {
    setState: React.Dispatch<React.SetStateAction<State>>,
    setWords: React.Dispatch<React.SetStateAction<WordConjugation[]>>,
    setQuestionCount: React.Dispatch<React.SetStateAction<number>>,
    setConfig: React.Dispatch<React.SetStateAction<Config>>,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
    config: Config,
    error: string | null,
}) {
    const upload_file_ref = useRef(null);

    function start(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        // @ts-ignore
        const question_count = Number(e.target.question_count.value);
        setQuestionCount(question_count);

        const dbs = Object.values(config.datasets).filter(db => db.enabled).map(db => db.dataset);
        const tenses = Object.keys(config.tenses).filter(tense => config.tenses[tense as Tense]) as Tense[];

        try {
            setWords(getRandomConjugations(question_count, tenses, dbs));
        } catch (e) {
            setError((e as Error).message);
            setState(State.home);
            return;
        }

        setState(State.question);
    }

    function reset() {
        // @ts-ignore
        upload_file_ref.current.value = null;
        setError(null);
        setConfig({
            tenses: default_config.tenses,
            // Reset non-user defined datasets.
            datasets: { ...config.datasets, ...default_config.datasets }
        });
    }

    return (
        <div className="flex w-full flex-col items-center">
            <form
                className="flex w-full flex-col items-center px-5 py-4 text-black xl:w-4/6 2xl:w-2/3"
                onSubmit={start}
            >
                {error && <div className="mb-10 w-2/3 rounded-md bg-redhover px-4 py-2 text-base">
                    <p className="text-center font-bold text-white shadow-sm">Error: {error}</p>
                </div>}

                <h1 className="mb-8 text-center text-4xl font-bold">Korean Conjugation Drill</h1>
                <label htmlFor="question_count">Number of questions:</label>
                <input
                    id="question_count"
                    type="number"
                    defaultValue={10}
                    min={1}
                    className="mt-4 rounded-md border border-platinum px-4 py-2"
                />

                <div className="mt-4 flex w-full items-center justify-center gap-6">
                    <input
                        type="submit"
                        value="START"
                        className="mt-4 h-12 w-56 rounded-md bg-green px-4 py-2 font-bold text-white shadow-sm hover:cursor-pointer hover:bg-greenhover"
                    />
                    <button
                        type="button"
                        onClick={reset}
                        className="mt-4 h-12 w-56 rounded-md border border-platinum px-4 py-2 font-bold shadow-sm hover:bg-whitehover"
                    >
                        RESET
                    </button>
                </div>

                <div className="mt-12 flex w-full flex-col justify-center gap-24 rounded-md bg-lightgray px-5 py-6  md:flex-row">
                    <div className="flex flex-col gap-1">
                        <h3 className="mb-4 text-2xl font-bold">Conjugation Forms</h3>
                        {Object.keys(config.tenses).map(tense_key => {
                            const tense = config.tenses[tense_key as Tense];
                            return (
                                <div key={tense_key} className="flex items-center">
                                    <input
                                        id={tense_key}
                                        type="checkbox"
                                        className="mr-2 size-5 cursor-pointer rounded border border-darkgray"
                                        checked={tense}
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            setConfig((prevConfig) => ({
                                                ...prevConfig,
                                                tenses: {
                                                    ...prevConfig.tenses,
                                                    [tense_key]: checked,
                                                },
                                            }));
                                        }}
                                    />
                                    <label htmlFor={tense_key}>{tense_key}</label>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex flex-col gap-1">
                        <h3 className="mb-4 text-2xl font-bold">Decks</h3>
                        {Object.keys(config.datasets).map(dataset_key => {
                            const dataset = config.datasets[dataset_key];
                            return (
                                <div key={dataset_key} className="flex items-center">
                                    <input
                                        id={dataset_key}
                                        type="checkbox"
                                        className="mr-2 size-5 cursor-pointer rounded border border-darkgray"
                                        checked={dataset.enabled}
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            setConfig((prevConfig) => ({
                                                ...prevConfig,
                                                datasets: {
                                                    ...prevConfig.datasets,
                                                    [dataset_key]: {
                                                        ...prevConfig.datasets[dataset_key],
                                                        enabled: checked,
                                                    },
                                                },
                                            }));
                                        }}
                                    />
                                    <label htmlFor={dataset_key}>{dataset.name}</label>
                                    {dataset.isCustom && (
                                        <FaRectangleXmark
                                            size={24}
                                            className="ml-2 text-red hover:cursor-pointer hover:text-redhover"
                                            onClick={() => {
                                                setConfig((prevConfig) => {
                                                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                                    const { [dataset_key]: _, ...updatedDatasets } = prevConfig.datasets;
                                                    return {
                                                        ...prevConfig,
                                                        datasets: updatedDatasets,
                                                    };
                                                });
                                            }}
                                        />
                                    )}
                                </div>
                            );
                        })}

                        <div className="mt-4 flex flex-col gap-2">
                            <label className="font-bold" htmlFor="kimchiCsvUpload">Upload <a className="underline hover:text-blue" target="_blank" href="https://kimchi-reader.app/stats/words/all">KimchiReader exported</a> CSV:</label>
                            <input
                                ref={upload_file_ref}
                                type="file"
                                id="kimchiCsvUpload"
                                accept=".csv"
                                className="overflow-hidden text-base"
                                onChange={e => {
                                    async function onChange() {
                                        const files = e.target.files;
                                        if (!files) return;
                                        const file = files[0];

                                        let words: string[] = [];
                                        try {
                                            words = await parseKimchiCsv(file);
                                        } catch (e) {
                                            setError((e as Error).message);
                                            return;
                                        }

                                        const filtered_words = words.filter(word => isValidVerb(word));

                                        setConfig((prevConfig) => ({
                                            ...prevConfig,
                                            datasets: {
                                                ...prevConfig.datasets,
                                                [file.name]: {
                                                    name: file.name.substring(0, file.name.length - ".csv".length),
                                                    dataset: { words: filtered_words },
                                                    isCustom: true,
                                                    enabled: true,
                                                },
                                            },
                                        }));
                                    }

                                    onChange();
                                }} />
                        </div>
                    </div>
                </div>
                <footer className="mt-5">
                    <p className="text-sm">This project is completely open-source! You can checkout the code <a className="underline hover:text-blue" target="_blank" href="https://github.com/brookjeynes/korean_conjugation_drill">here</a>.</p>
                </footer>
            </form>
        </div>
    );
}

function Question({
    setState,
    setError,
    incrementCorrectQuestions,
    question_count,
    words,
}: {
    setState: React.Dispatch<React.SetStateAction<State>>,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
    incrementCorrectQuestions: () => void,
    question_count: number,
    words: WordConjugation[],
}) {
    const [question_state, setQuestionState] = useState<QuestionState>(QuestionState.undecided);
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
            if (user_input.trim() === words[current_word_idx].conjugation) {
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
            className="flex h-full flex-col items-center justify-between text-black"
            onSubmit={onSubmit}
        >
            <div className="flex size-full flex-col items-center px-5 py-6 md:w-5/6 2xl:w-1/2">
                <div className="flex w-full items-center gap-4">
                    <FaXmark
                        onClick={onQuit}
                        size={28}
                        className="text-darkgray hover:cursor-pointer hover:text-black"
                    />
                    <ProgressBar progress={(current_word_idx / question_count) * 100} />
                </div>

                <div className="flex h-4/6 w-full flex-col items-center justify-center gap-4 text-center">
                    <p>Make the following <span className="font-bold text-blue">{words[current_word_idx].tense}</span></p>
                    <p className="mb-4 text-4xl font-bold">{words[current_word_idx].word}</p>

                    <input
                        id="user_input"
                        type="text"
                        ref={user_input_ref}
                        className="w-full rounded-md border-2 border-solid border-platinum px-2 py-1 text-center shadow  md:w-5/6"
                    />
                </div>
            </div>

            <div
                className={"flex w-full items-center justify-center border-t-2 border-t-platinum px-5 py-6 " +
                    `${question_state === QuestionState.undecided ? "bg-white" : question_state === QuestionState.correct ? "bg-lightgreen" : "bg-lightred"}`
                }
            >
                <div className="flex w-full flex-col items-center justify-between gap-1 md:w-5/6 md:flex-row 2xl:w-1/2">
                    {question_state === QuestionState.undecided ? (
                        <button
                            type="button"
                            onClick={onSkip}
                            disabled={question_state !== QuestionState.undecided}
                            className="h-12 w-full rounded-md border border-platinum bg-white px-4 py-2 font-bold shadow-sm hover:cursor-pointer hover:bg-lightgray md:w-56"
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
                                            <p className="hidden text-2xl font-bold md:block">{words[current_word_idx].conjugation}</p>
                                        </div>
                                        <p className="block text-2xl font-bold md:mb-2 md:hidden">{words[current_word_idx].conjugation}</p>
                                        <div className="hidden text-base md:block">
                                            {words[current_word_idx].reasons.map((reason, i) => (
                                                <p key={reason}>{i + 1}. {reason}</p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="block text-base md:hidden">
                                {words[current_word_idx].reasons.map((reason, i) => (
                                    <p key={reason}>{i + 1}. {reason}</p>
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
                                            <p className="hidden text-2xl font-bold md:block">{words[current_word_idx].conjugation}</p>
                                        </div>
                                        <p className="block text-2xl font-bold md:mb-2 md:hidden">{words[current_word_idx].conjugation}</p>
                                        <div className="hidden text-base md:block">
                                            {words[current_word_idx].reasons.map((reason, i) => (
                                                <p key={reason}>{i + 1}. {reason}</p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="block text-base md:hidden">
                                {words[current_word_idx].reasons.map((reason, i) => (
                                    <p key={reason}>{i + 1}. {reason}</p>
                                ))}
                            </div>
                        </div>
                    )}

                    <input
                        type="submit"
                        value={question_state === QuestionState.undecided ? "CHECK" : "CONTINUE"}
                        className={`mt-4 h-12 w-full rounded-md shadow-sm md:mt-0 ${question_state !== QuestionState.incorrect ? "bg-green hover:bg-greenhover" : "bg-red hover:bg-redhover"} px-4 py-2 font-bold text-white hover:cursor-pointer md:w-56`}
                    />
                </div>
            </div>
        </form>
    );
}

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
        <div className="flex flex-col items-center gap-8 px-5 py-6">
            <h1 className="text-center text-4xl font-bold">Results</h1>
            <p className="text-2xl">{correct_question_count} / {question_count}</p>
            <button
                onClick={onBack}
                className="mt-4 h-12 w-56 rounded-md border border-platinum px-4 py-2 font-bold shadow-sm hover:bg-whitehover"
            >
                Back to home
            </button>
        </div>
    );
}

function App() {
    const [state, setState] = useState<State>(State.home);
    const [config, setConfig] = useState<Config>({ ...default_config });
    const [question_count, setQuestionCount] = useState<number>(10);
    const [correct_question_count, setCorrectQuestionCount] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [words, setWords] = useState<WordConjugation[]>([]);

    function incrementCorrectQuestions() {
        setCorrectQuestionCount(correct_question_count + 1);
    }

    switch (state) {
        case State.home:
            return <Home
                setState={setState}
                setWords={setWords}
                setQuestionCount={setQuestionCount}
                setConfig={setConfig}
                setError={setError}
                config={config}
                error={error}
            />;
        case State.question:
            if (words.length === 0) {
                setError("No DB selected.");
                return;
            }
            return <Question
                setState={setState}
                setError={setError}
                incrementCorrectQuestions={incrementCorrectQuestions}
                question_count={question_count}
                words={words}
            />;
        case State.result:
            return <Result
                setState={setState}
                setError={setError}
                question_count={question_count}
                correct_question_count={correct_question_count}
            />;
    }
}

export default App;
