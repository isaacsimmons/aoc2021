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

const count1s = (lines: num[], idx: number): number => {
    let count = 0;

    lines.forEach(line => {
        count += line[idx];
    });

    return count;
};

const filterO2 = (lines: num[], idx: number): num[] => {
    const mostCommon = count1s(lines, idx) >= lines.length / 2 ? 1 : 0;
    return lines.filter(line => line[idx] === mostCommon);
};
const filterCO2 = (lines: num[], idx: number): num[] => {
    const mostCommon = count1s(lines, idx) >= lines.length / 2 ? 1 : 0;
    return lines.filter(line => line[idx] !== mostCommon);
};

const findO2 = (lines: num[]): num => {
    for (let i = 0; i < lines[0].length; i++) {
        lines = filterO2(lines, i);
        if (lines.length === 1) {
            return lines[0];
        }
    }
    throw new Error();
}
const findCO2 = (lines: num[]): num => {
    for (let i = 0; i < lines[0].length; i++) {
        lines = filterCO2(lines, i);
        if (lines.length === 1) {
            return lines[0];
        }
    }
    throw new Error();
}

const O2 = findO2(lines);
const o2Num = toNumber(O2);
const CO2 = findCO2(lines);
const co2Num = toNumber(CO2);
console.log(o2Num, co2Num, o2Num * co2Num);