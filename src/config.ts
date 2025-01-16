import kimchiFrequency from "./data/kimchi_frequency_verbs_15-01-25.json";
import { DbSet, Tense } from "./types";

export interface Config {
    tenses: { [key in Tense]: TenseOption };
    datasets: { [key: string]: DbSet };
}

export interface TenseOption {
    enabled: boolean;
    example: string;
}

export const default_config: Config = {
    tenses: {
        "declarative present informal low": { enabled: true, example: "해" },
        "declarative present informal high": { enabled: true, example: "해요" },
        "declarative present formal low": { enabled: true, example: "한다" },
        "declarative present formal high": { enabled: true, example: "합니다" },
        "declarative past informal low": { enabled: true, example: "했어" },
        "declarative past informal high": { enabled: true, example: "했어요" },
        "declarative past formal low": { enabled: true, example: "했다" },
        "declarative past formal high": { enabled: true, example: "했습니다" },
        "declarative future informal low": { enabled: true, example: "할 거야" },
        "declarative future informal high": { enabled: true, example: "할 거예요" },
        "declarative future formal low": { enabled: true, example: "할 거다" },
        "declarative future formal high": { enabled: true, example: "할 겁니다" },
        "declarative future conditional informal low": { enabled: true, example: "하겠어" },
        "declarative future conditional informal high": { enabled: true, example: "하겠어요" },
        "declarative future conditional formal low": { enabled: true, example: "하겠다" },
        "declarative future conditional formal high": { enabled: true, example: "하겠습니다" },
        "inquisitive present informal low": { enabled: true, example: "해?" },
        "inquisitive present informal high": { enabled: true, example: "해요?" },
        "inquisitive present formal low": { enabled: true, example: "하니?" },
        "inquisitive present formal high": { enabled: true, example: "합니까?" },
        "inquisitive past informal low": { enabled: true, example: "했어?" },
        "inquisitive past informal high": { enabled: true, example: "했어요?" },
        "inquisitive past formal low": { enabled: true, example: "했니?" },
        "inquisitive past formal high": { enabled: true, example: "했습니까?" },
        "imperative present informal low": { enabled: true, example: "해" },
        "imperative present informal high": { enabled: true, example: "하세요" },
        "imperative present formal low": { enabled: true, example: "해라" },
        "imperative present formal high": { enabled: true, example: "하십시오" },
        "propositive present informal low": { enabled: true, example: "해" },
        "propositive present informal high": { enabled: true, example: "해요" },
        "propositive present formal low": { enabled: true, example: "하자" },
        "propositive present formal high": { enabled: true, example: "합시다" },
        "connective if": { enabled: true, example: "하면" },
        "connective and": { enabled: true, example: "하고" },
        "nominal ing": { enabled: true, example: "함" },
    },
    datasets: {
        kimchiFrequency: {
            enabled: true,
            name: "Kimchi Reader most frequent words",
            dataset: kimchiFrequency,
            isCustom: false,
        }
    },
};
