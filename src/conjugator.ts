import { Conjugation, Conjugator } from "../external/korean_conjugation/conjugator.ts";
import { Db, Tense, WordConjugation } from "./types.ts";

function filterConjugations(conjugations: Conjugation[], user_filters: Tense[]): Conjugation[] {
    return conjugations.filter(conjugation =>
        user_filters.includes(conjugation.tense as Tense)
    );
}

function getRandomConjugation(db: Db, user_filters: Tense[]): WordConjugation {
    const word = db.words[Math.floor(Math.random() * db.words.length)];

    const conjugator = new Conjugator();
    const conjugations = conjugator.perform(word);
    const filtered_conjugations = filterConjugations(conjugations, user_filters);

    return {
        ...filtered_conjugations[Math.floor(Math.random() * filtered_conjugations.length)],
        word
    };
}

export function getRandomConjugations(count: number, tenses: Tense[], dbs: Db[]): WordConjugation[] {
    const conjugations: WordConjugation[] = [];

    const word_pool: string[] = dbs.map(db => db.words).flat();
    const db: Db = { words: word_pool };

    if (db.words.length === 0) throw new Error("Empty DB");
    if (tenses.length === 0) throw new Error("No tense(s) selected");

    for (let i = 0; i < count; i++) {
        conjugations.push(getRandomConjugation(db, tenses));
    }

    return conjugations;
}

export function isValidVerb(word: string): boolean {
    if (word.endsWith("하다")) return true;
    if (word.endsWith("다니다")) return true;
    if (word.endsWith("니다")) return false;
    if (word.endsWith("이다")) return true;
    if (word.endsWith("다")) return true;

    return false;
}
