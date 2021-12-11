import * as fs from 'fs';

const lines: string[] = new String(fs.readFileSync('input-10.txt')).split('\n').filter(line => line.length > 0);

const openChars = new Set<string>(['[', '<', '(', '{']);
const closePairs = new Map<string, string>([[']', '['], ['>', '<'], [')', '('], ['}', '{']]);
const scoreMap = new Map<string, number>([[']', 57], ['>', 25137], [')', 3], ['}', 1197]]);
const missingScoreMap = new Map<string, number>([['[', 2], ['<', 4], ['(', 1], ['{', 3]]);

const invalidScore = (line: string): number|null => {
    const stack: string[] = [];
    const chars = line.trim().split('');
    for(const char of chars) {
        console.log('testing', char);
        if (openChars.has(char)) {
            console.log('its an open');
            stack.push(char);
        } else if (closePairs.has(char)) {
            console.log('its a close');
            const expectedPair = closePairs.get(char);
            const incorrectScore = scoreMap.get(char)!;
            if (stack.length === 0) {
                return null;
//                return incorrectScore;
            }
            const actualPair = stack.pop();
            if (expectedPair !== actualPair) {
                console.log(expectedPair, actualPair, 'no match');
                return null;
//                return incorrectScore;
            }
        } else {
            console.log('wat');
            throw new Error();
        }
    }

    if (stack.length === 0) {
        return null;
    }

    let score = 0;
    while (stack.length > 0) {
        score *= 5;
        const missingSymbol = stack.pop()!;
        const missingScore = missingScoreMap.get(missingSymbol)!;
        console.log('adding', missingScore, 'for', missingSymbol);
        score += missingScore;
    }
    return score;
};

const incompleteScores: number[] = lines.map(invalidScore).filter(val => val !== null) as number[];
incompleteScores.sort((a, b) => b - a);
console.log(incompleteScores);
const middleIndex = (incompleteScores.length - 1) / 2;
//console.log(badScore);
console.log(incompleteScores[middleIndex]);