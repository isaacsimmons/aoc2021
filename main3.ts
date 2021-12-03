import * as fs from 'fs';

type bit = 0 | 1;
type num = bit[];
type buckets = number[];

const parseLine = (line: string): num => {
    const bits = line.split('').map(c => { if (c === '0') return 0; if (c === '1') return 1; throw new Error(); })
//    if (bits.length !== 5) throw new Error();
    return bits as num;
};

const toNumber = (num: num): number => {
    let accum = 0;
    let pow = 1;
    for (let digit = num.length - 1; digit >= 0; digit--) {
        accum += num[digit] * pow;
        pow *= 2;
    }
    return accum;
}

const lines = new String(fs.readFileSync('input-3.txt')).split('\n').map(parseLine);
console.log(lines);

const count1s = (lines: num[]): buckets => {
    const counts = new Array(lines[0].length).fill(0);

    for (let i = 0; i < lines[0].length; i++) {
        lines.forEach(line => {
            counts[i] += line[i];
        });
    }

    return counts;
}

const counts = count1s(lines);
console.log(counts);

const gamma = (counts: buckets, n: number): num => {
    return counts.map(count => count > n/2 ? 1 : 0);
};
const epsilon = (counts: buckets, n: number): num => {
    return counts.map(count => count < n/2 ? 1 : 0);
};

const g = gamma(counts, lines.length);
const e = epsilon(counts, lines.length);

const numG = toNumber(g);
const numE = toNumber(e);

console.log(numG, numE, numG * numE);
