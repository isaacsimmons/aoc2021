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

const parseRule = (input: string): Rule => {
    const [match, insert] = input.split(' -> ').map(l => l.trim());
    return {match, insert};
};

const inputLines: string[] = new String(fs.readFileSync('input-14.txt')).split('\n').map(line => line.trim()).filter(line => line.length > 0);

const [initialState, ...ruleInputs] = inputLines;
const rules = ruleInputs.map(parseRule);

const ruleMap = new Map(rules.map(({match, insert}) => [match, insert]));

const step = (state: string, rules: Map<string, string>): string => {
    const after: string[] = [state[0]];

    for (let i = 1; i < state.length; i++) {
        const candidate = state.substring(i - 1, i + 1);
      //  console.log(candidate);
        const addition = ruleMap.get(candidate);
        if (addition) {
            after.push(addition);
        }
        after.push(state[i]);

    }

    return after.join('');
};

const makeBuckets = (s: string): Map<string, number> => {
    const b = new Map<string, number>();

    for (let i = 0; i < s.length; i++) {
        const c = s[i];
        let match = b.get(c);
        if (match) {
            b.set(c, match + 1);
        } else {
            b.set(c, 1);
        }
    }
    return b;
};

const mostAndLeastCommon = (b: Map<string, number>): {most: number, least: number} => {
    const frequencies = [...b.values()];
    const maxFreq = Math.max(...frequencies);
    const minFreq = Math.min(...frequencies);
    return {most: maxFreq, least: minFreq};
    // let most: string | null = null;
    // let least: string | null = null;
    // for (const [key, value] of b.entries()) {
    //     if (value === maxFreq) {
    //         most = key;
    //     } else if (value === minFreq) {
    //         least = key;
    //     }
    // }
    // return {most: most!, least: least!};
}

//console.log(initialState, rules);

let state = initialState;
for (let stepNum = 1; stepNum <= 40; stepNum++) {
    state = step(state, ruleMap);
    console.log('new state', stepNum);
}

const buckets = makeBuckets(state);
const {most, least} = mostAndLeastCommon(buckets);

console.log(state);
console.log(buckets);
console.log(most, least);
console.log(most - least);