import * as fs from 'fs';

type Grid = number[][];
interface point {x: number, y: number};

const parseLine = (line: string): number[] => {
    return line.split('').map(Number);    
};

const idx = (point: point): number => {
    return point.x + (point.y * max.x);
};

const lines: number[][] = new String(fs.readFileSync('input-9.txt')).split('\n').map(parseLine).filter(line => line.length > 0);
const max: point = {x: lines[0].length, y: lines.length};
const paintBoard: number[] = Array(max.x * max.y).fill(0);

let currentColor = 0;
const colorUsage = new Map<number, number>();
const getColor = () => {
    currentColor++;
    colorUsage.set(currentColor, 0);
    return currentColor;
};

const paint = (point: point, color: number|null = null) => {
    // don't paint past the edges
    if (point.x < 0 || point.y < 0 || point.x >= max.x || point.y >= max.y) {
        return;
    }
    // don't paint if its already painted
    if (paintBoard[idx(point)] !== 0) {
        return;
    }
    // don't paint if its a ridge in the map
    if (lines[point.y][point.x] === 9) {
        return;
    }
    // if we don't already have a brush color, we need to draw a new one
    if (color === null) {
        color = getColor();
    }
    paintBoard[idx(point)] = color;
    colorUsage.set(color, colorUsage.get(color)! + 1);
    paint({x: point.x + 1, y: point.y}, color);
    paint({x: point.x - 1, y: point.y}, color);
    paint({x: point.x, y: point.y + 1}, color);
    paint({x: point.x, y: point.y - 1}, color);
};

paint({x: 0, y: 0});

for (let y = 0; y < max.y; y++) {
    for (let x = 0; x < max.x; x++) {
        paint({x, y});
    }
}

const [c1, c2, c3, ...rest] = [...colorUsage.values()].sort((a, b) => b - a);
console.log(c1, c2, c3, c1 * c2 * c3);
