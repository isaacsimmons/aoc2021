import * as fs from 'fs';

interface Point {
    x: number;
    y: number;
}

interface Fold {
    direction: 'up' | 'left';
    num: number;
}

interface Rule {
    match: string;
    insert: string;
}

type ChunkedString = Map<string, number>;

const parseRule = (input: string): Rule => {
    const [match, insert] = input.split(' -> ').map(l => l.trim());
    return {match, insert};
};

const inputLines: string[] = new String(fs.readFileSync('input-14.txt')).split('\n').map(line => line.trim()).filter(line => line.length > 0);

const [initialState, ...ruleInputs] = inputLines;
const rules = ruleInputs.map(parseRule);

const ruleMap = new Map(rules.map(({match, insert}) => [match, insert]));

const chunkString = (s: string): ChunkedString => {
    const chunks = new Map<string, number>();
    for (let i = 0; i < s.length; i++) {
        const chunk = s.substring(i, i + 2);
        addToMap(chunks, chunk, 1);
    }
    return chunks;
};

const countChars = (s: ChunkedString): Map<string, number> => {
    const counts = new Map<string, number>();
    for (const [chunk, count] of s.entries()) {
        const c = chunk[0];
        addToMap(counts, c, count);
    }
    return counts;
};

const addToMap = <T>(map: Map<T, number>, key: T, quantity: number) => {
    const oldValue = map.get(key);
    if (oldValue) {
        map.set(key, oldValue + quantity);
    } else {
        map.set(key, quantity);
    }
};

const step = (state: ChunkedString, rules: Map<string, string>): ChunkedString => {
    const after = new Map<string, number>();

    for (const [chunk, count] of state.entries()) {
        const addition = ruleMap.get(chunk);
        if (addition) {
            const new1 = chunk[0] + addition;
            const new2 = addition + chunk[1];
            addToMap(after, new1, count);
            addToMap(after, new2, count);
        } else {
            addToMap(after, chunk, count);
        }
    }
    return after;
};

const mostAndLeastCommon = (b: Map<string, number>): {most: number, least: number} => {
    const frequencies = [...b.values()];
    const maxFreq = Math.max(...frequencies);
    const minFreq = Math.min(...frequencies);
    return {most: maxFreq, least: minFreq};
}

let state = chunkString(initialState);
for (let stepNum = 1; stepNum <= 40; stepNum++) {
    state = step(state, ruleMap);
    console.log('new state', stepNum);

}

const buckets = countChars(state);
const {most, least} = mostAndLeastCommon(buckets);

console.log(state);
console.log(buckets);
console.log(most, least);
console.log(most - least);