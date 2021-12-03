import * as fs from 'fs';

console.log('hi');
const lines = new String(fs.readFileSync('input.txt')).split('\n').map(line => Number(line));

console.log(lines);

let increasing = 0;
let last: number | null = null;
for (let i = 0; i < lines.length - 3; i++) {
    if (lines[i] + lines[i + 1] + lines[i + 2] < lines[i + 1] + lines[i+2] + lines[i+3]) {
        console.log('increasing', i);
        increasing++;
    }
}
console.log('increasing', increasing);

