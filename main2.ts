import * as fs from 'fs';


type direction = 'forward' | 'up' | 'down';

const parseLine = (line: string): {direction: direction, distance: number} => {
    const [directionStr, distanceStr] = line.split(' ');
    return { direction: directionStr as direction, distance: Number(distanceStr) };
};

const lines = new String(fs.readFileSync('input-2a.txt')).split('\n').map(parseLine);

let horiz = 0;
let depth = 0;
let aim = 0;

for (const {direction, distance} of lines) {
    switch (direction) {
        case 'down':
            aim += distance;
            break;
        case 'up':
            aim -= distance;
            break;
        case 'forward':
            horiz += distance;
            depth += aim * distance;
            break;
    }
}

console.log({horiz, depth});
console.log(horiz * depth);
