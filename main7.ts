import * as fs from 'fs';

const NUM_STEPS = 256;

const crabs = new String(fs.readFileSync('input-7.txt')).split(',').map(Number);

const sum = (nums: number[]): number => 
    nums.reduce((a, b) => a + b, 0);

const cost = (crabs: number[], position: number) => {
    return crabs.map(crab => {const dist = Math.abs(crab - position); return dist * (dist + 1) / 2; }).reduce((a, b) => a + b, 0);
};

const min = Math.min(...crabs);
const max = Math.max(...crabs);
let lowestCost = Number.MAX_SAFE_INTEGER;
let bestPosition = -1;
for (let pos = min; pos <= max; pos++) {
    const c = cost(crabs, pos);
    if (c < lowestCost) {
        lowestCost = c;
        bestPosition = pos;
    }
}
console.log(bestPosition, lowestCost);
