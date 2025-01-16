import { useRef, useState } from "react";
import { getRandomConjugations, isValidVerb } from "./conjugator";
import { Config, default_config } from "./config";
import { Tense, WordConjugation } from "./types";
import { parseKimchiCsv } from "./csv";

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
    function start(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

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
        setError(null);
        setConfig({
            tenses: default_config.tenses,
            // Reset non-user defined datasets.
            datasets: { ...config.datasets, ...default_config.datasets }
        });
    }

    return (
        <form onSubmit={start}>
            <h1>Korean Conjugation Drill</h1>
            <label htmlFor="question_count">Number of questions:</label>
            <input
                id="question_count"
                type="number"
                defaultValue={10}
                min={1}
            />

            <input type="submit" value="Start" />
            <button type="button" onClick={reset}>Reset</button>

            {error && <p>{error}</p>}

            <div>
                <div>
                    <h3>Conjugation Forms</h3>
                    {Object.keys(config.tenses).map(tense_key => {
                        const tense = config.tenses[tense_key as Tense];
                        return (
                            <div key={tense_key}>
                                <input
                                    id={tense_key}
                                    type="checkbox"
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
                <div>
                    <h3>Decks</h3>

                    <label htmlFor="kimchiCsvUpload">Upload Kimchi exported CSV</label>
                    <input type="file" id="kimchiCsvUpload" accept=".csv" onChange={e => {
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

                    {Object.keys(config.datasets).map(dataset_key => {
                        const dataset = config.datasets[dataset_key];
                        return (
                            <div key={dataset_key}>
                                <input
                                    id={dataset_key}
                                    type="checkbox"
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
                                {dataset.isCustom && <button onClick={() => {
                                    setConfig((prevConfig) => {
                                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                        const { [dataset_key]: _, ...updatedDatasets } = prevConfig.datasets;
                                        return {
                                            ...prevConfig,
                                            datasets: updatedDatasets,
                                        };
                                    });
                                }}>Remove</button>}
                            </div>
                        );
                    })}
                </div>
            </div>
        </form >
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
        const user_input = e.target.user_input.value;

        if (question_state === QuestionState.undecided) {
            if (user_input === words[current_word_idx].conjugation) {
                setQuestionState(QuestionState.correct);
                incrementCorrectQuestions();
            } else {
                setQuestionState(QuestionState.incorrect);
            }
        } else {
            setCurrentWordIdx(current_word_idx + 1);
            user_input_ref.current.value = "";
            setQuestionState(QuestionState.undecided);
        }
    }

    function onSkip() {
        setQuestionState(QuestionState.incorrect);
    }

    return (
        <form onSubmit={onSubmit}>
            <button onClick={onQuit}>Quit</button>
            {current_word_idx + 1} / {question_count}

            <p>Make the following <span>{words[current_word_idx].tense}</span></p>
            <p>{words[current_word_idx].word}</p>

            <input id="user_input" type="text" ref={user_input_ref} />

            <input type="submit" value={question_state === QuestionState.undecided ? "CHECK" : "CONTINUE"} />
            <button type="button" onClick={onSkip} disabled={question_state !== QuestionState.undecided}>SKIP</button>

            {question_state === QuestionState.incorrect && (
                <div>
                    <p>{words[current_word_idx].conjugation}</p>
                    <div>
                        {words[current_word_idx].reasons.map((reason, i) => (
                            <p key={reason}>{i + 1}. {reason}</p>
                        ))}
                    </div>
                </div>
            )}
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
        <div>
            <p>{correct_question_count} / {question_count}</p>
            <button onClick={onBack}>Back to home</button>
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
