import * as fs from 'fs';

const NUM_STEPS = 256;

const fishes = new String(fs.readFileSync('input-6.txt')).split(',').map(Number);
let buckets = Array(9).fill(0);
fishes.forEach(fish => { buckets[fish]++; });

const countTotal = (buckets: number[]): number => 
    buckets.reduce((a, b) => a + b, 0);

const step = (buckets: number[]): number[] => {
    const [zero, ...next] = buckets;
    next[6] += zero;
    next[8] = zero;
    return next;
};

for(let i = 0; i < NUM_STEPS; i++) {
    buckets = step(buckets);
}

console.log(countTotal(buckets));
