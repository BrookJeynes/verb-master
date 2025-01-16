import kimchiFrequency from "./data/kimchi_frequency_verbs_15-01-25.json";
import { DbSet, Tense } from "./types";

export interface Config {
    tenses: { [key in Tense]: boolean };
    datasets: { [key: string]: DbSet };
}

export const default_config: Config = {
    tenses: {
        "declarative present informal low": true,
        "declarative present informal high": true,
        "declarative present formal low": true,
        "declarative present formal high": true,
        "declarative past informal low": true,
        "declarative past informal high": true,
        "declarative past formal low": true,
        "declarative past formal high": true,
        "declarative future informal low": true,
        "declarative future informal high": true,
        "declarative future formal low": true,
        "declarative future formal high": true,
        "declarative future conditional informal low": true,
        "declarative future conditional informal high": true,
        "declarative future conditional formal low": true,
        "declarative future conditional formal high": true,
        "inquisitive present informal low": true,
        "inquisitive present informal high": true,
        "inquisitive present formal low": true,
        "inquisitive present formal high": true,
        "inquisitive past informal low": true,
        "inquisitive past informal high": true,
        "inquisitive past formal low": true,
        "inquisitive past formal high": true,
        "imperative present informal low": true,
        "imperative present informal high": true,
        "imperative present formal low": true,
        "imperative present formal high": true,
        "propositive present informal low": true,
        "propositive present informal high": true,
        "propositive present formal low": true,
        "propositive present formal high": true,
        "connective if": true,
        "connective and": true,
        "nominal ing": true,
    },
    datasets: {
        kimchiFrequency: {
            enabled: true,
            name: "Kimchi frequency",
            dataset: kimchiFrequency,
            isCustom: false,
        }
    },
};
