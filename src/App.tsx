import { useEffect, useState } from "react";
import { Config, default_config } from "./config";
import { State, Theme, WordConjugation } from "./types";
import Result from "./Result";
import Question from "./Question";
import Home from "./Home";

function loadConfig(): Config {
    const persistent_config = localStorage.getItem("config");
    if (persistent_config) {
        return JSON.parse(persistent_config);
    }

    return { ...default_config };
}

function App() {
    const [state, setState] = useState<State>(State.home);
    const [config, setConfig] = useState<Config>(loadConfig());
    const [question_count, setQuestionCount] = useState<number>(10);
    const [correct_question_count, setCorrectQuestionCount] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [words, setWords] = useState<WordConjugation[]>([]);
    const [theme, setTheme] = useState<Theme>("light");

    function switchTheme() {
        if (localStorage.theme === "light" || !("theme" in localStorage)) {
            setTheme("dark");
            localStorage.theme = "dark";
            document.documentElement.classList.add("dark");
        } else {
            setTheme("light");
            localStorage.theme = "light";
            document.documentElement.classList.remove("dark");
        }
    }

    useEffect(() => {
        if (localStorage.theme === "light" || !("theme" in localStorage)) {
            setTheme("light");
            document.documentElement.classList.remove("dark");
        } else {
            setTheme("dark");
            document.documentElement.classList.add("dark");
        }
    }, []);

    useEffect(() => {
        if (state === State.home) {
            setCorrectQuestionCount(0);
        }
    }, [state]);

    switch (state) {
        case State.home:
            return <Home
                setState={setState}
                setWords={setWords}
                setQuestionCount={setQuestionCount}
                setConfig={setConfig}
                switchTheme={switchTheme}
                setError={setError}
                config={config}
                theme={theme}
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
                incrementCorrectQuestions={
                    () => setCorrectQuestionCount(correct_question_count + 1)
                }
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
