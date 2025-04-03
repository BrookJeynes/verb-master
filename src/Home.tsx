import { useEffect, useRef } from "react";
import { Config, default_config, TenseOption } from "./config";
import { State, Tense, Theme, WordConjugation } from "./types";
import { getRandomConjugations, isValidVerb } from "./conjugator";
import { FaMoon, FaRectangleXmark, FaSun } from "react-icons/fa6";
import { parseKimchiCsv } from "./csv";

function Home({
    setState,
    setWords,
    setQuestionCount,
    setConfig,
    setError,
    switchTheme,
    config,
    error,
    theme,
}: {
    setState: React.Dispatch<React.SetStateAction<State>>,
    setWords: React.Dispatch<React.SetStateAction<WordConjugation[]>>,
    setQuestionCount: React.Dispatch<React.SetStateAction<number>>,
    setConfig: React.Dispatch<React.SetStateAction<Config>>,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
    switchTheme: () => void,
    config: Config,
    error: string | null,
    theme: Theme,
}) {
    const upload_file_ref = useRef(null);

    function start(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        // @ts-ignore
        const question_count = Number(e.target.question_count.value);
        setQuestionCount(question_count);

        const dbs = Object.values(config.datasets).filter(db => db.enabled).map(db => db.dataset);
        const tenses = Object.keys(config.tenses).filter(tense => config.tenses[tense as Tense].enabled) as Tense[];

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

    // Save config to local storage
    useEffect(() => {
        localStorage.setItem("config", JSON.stringify(config));
    }, [config]);

    return (
        <div className="flex w-full flex-col items-center dark:bg-offblack dark:text-whitehover">
            <form
                className="light:text-black flex w-full flex-col items-center px-5 py-4 xl:w-4/6 2xl:w-2/3"
                onSubmit={start}
            >
                {error && <div className="mb-10 w-2/3 rounded-md bg-redhover px-4 py-2 text-base">
                    <p className="text-center font-bold text-whitehover shadow-sm">Error: {error}</p>
                </div>}

                <div className="mb-8 mt-2 text-center">
                    <h1 className="mb-2 text-6xl font-bold">동사마스터</h1>
                    <h2 className="text-xl text-darkgray dark:text-whitehover">Your companion for Korean verbs</h2>
                </div>
                <label htmlFor="question_count">Number of questions:</label>
                <input
                    id="question_count"
                    type="number"
                    defaultValue={10}
                    min={1}
                    className="mt-4 w-full max-w-[17rem] rounded-md border-2 border-platinum px-4 py-2 text-black shadow"
                />

                <div className="mt-4 flex w-full items-center justify-center gap-6">
                    <input
                        type="submit"
                        value="START"
                        className="mt-4 h-12 w-56 rounded-md bg-green px-4 py-2 font-bold shadow-sm hover:cursor-pointer hover:bg-greenhover"
                    />
                    <button
                        type="button"
                        onClick={reset}
                        className="mt-4 h-12 w-56 rounded-md border border-platinum px-4 py-2 font-bold shadow-sm hover:bg-whitehover dark:hover:bg-black"
                    >
                        RESET
                    </button>
                </div>

                <div className="mt-12 flex w-full flex-col justify-center gap-24 rounded-md bg-lightgray px-5 py-6 dark:bg-jet md:flex-row">
                    <div className="flex flex-col gap-1">
                        <h2 className="mb-4 text-2xl font-bold">Conjugation Forms</h2>
                        <div className="flex items-center">
                            <input
                                id="toggle_all"
                                type="checkbox"
                                className="mr-2 size-5 cursor-pointer rounded border border-darkgray"
                                defaultChecked={Object.values(config.tenses).every(t => t.enabled)}
                                onChange={(e) => {
                                    const checked = e.target.checked;
                                    setConfig((prevConfig) => ({
                                        ...prevConfig,
                                        tenses: Object.fromEntries(
                                            Object.entries(prevConfig.tenses).map(([key, value]): [string, TenseOption] => [
                                                key,
                                                { ...value, enabled: checked },
                                            ])
                                        ) as Config["tenses"],
                                    }));
                                }}
                            />
                            <label htmlFor="toggle_all">Toggle all</label>
                        </div>
                        {Object.keys(config.tenses).map(tense_key => {
                            const tense = config.tenses[tense_key as Tense];
                            return (
                                <div key={tense_key} className="flex items-center">
                                    <input
                                        id={tense_key}
                                        type="checkbox"
                                        className="mr-2 size-5 cursor-pointer rounded border border-darkgray"
                                        checked={tense.enabled}
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            setConfig((prevConfig) => ({
                                                ...prevConfig,
                                                tenses: {
                                                    ...prevConfig.tenses,
                                                    [tense_key]: {
                                                        ...tense,
                                                        enabled: checked,
                                                    }
                                                },
                                            }));
                                        }}
                                    />
                                    <label htmlFor={tense_key}>{tense_key[0].toUpperCase() + tense_key.substring(1)} ({tense.example})</label>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex flex-col gap-1">
                        <h2 className="mb-4 text-2xl font-bold">Decks</h2>
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
                <footer className="mt-5 flex gap-2">
                    <button aria-label="Dark/Light mode switcher" type="button" onClick={switchTheme}>{theme === "light" ? <FaSun className="text-yellow" /> : <FaMoon className="text-blue" />}</button>
                    <p className="text-sm">This project is completely open-source! You can checkout the code <a className="underline hover:text-blue" target="_blank" href="https://github.com/brookjeynes/verb-master">on GitHub here</a>.</p>
                </footer>
            </form>
        </div>
    );
}

export default Home;
