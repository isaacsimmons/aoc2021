import * as fs from 'fs';

interface Point {
    x: number;
    y: number;
}

interface Fold {
    direction: 'up' | 'left';
    num: number;
}

const inputLines: string[] = new String(fs.readFileSync('input-13.txt')).split('\n').map(line => line.trim()).filter(line => line.length > 0);

const points: Point[] = [];
const folds: Fold[] = [];

for (const inputLine of inputLines) {
    if (inputLine.startsWith('fold')) {
        const direction = inputLine[11] === 'x' ? 'left' : 'up'
        const num = Number(inputLine.substring(13));
        folds.push({direction, num});
    } else {
        const [x, y] = inputLine.split(',').map(Number);
        points.push({x, y});
    }
}

const maxX = Math.max(...points.map(p => p.x));
const maxY = Math.max(...points.map(p => p.y));

console.log(folds);

const grid: boolean[][] = [];
for (let i = 0; i <= maxY; i++) {
    const row: boolean[] = Array(maxX + 1).fill(false);
    grid.push(row);
}

for (const {x, y} of points) {
    grid[y][x] = true;
}

console.log(grid);

const doFoldUp = (grid: boolean[][], fold: Fold): boolean[][] => {
    for (let greaterY = fold.num + 1, lesserY = fold.num - 1; greaterY < grid.length && lesserY >= 0; greaterY++, lesserY--) {
        console.log('foldingU', greaterY, 'into', lesserY);
        for (let x = 0; x < grid[0].length; x++) {
            if (grid[greaterY][x]) {
                grid[lesserY][x] = true;
                grid[greaterY][x] = false;
            }
        }
    }
    return grid;
};

const doFoldLeft = (grid: boolean[][], fold: Fold): boolean[][] => {
    for (let greaterX = fold.num + 1, lesserX = fold.num - 1; greaterX < grid[0].length && lesserX >= 0; greaterX++, lesserX--) {
        console.log('foldingL', greaterX, 'into', lesserX);
        for (let y = 0; y < grid.length; y++) {
            if (grid[y][greaterX]) {
                grid[y][lesserX] = true;
                grid[y][greaterX] = false;
            }
        }
    }
    return grid;
};

const doFold = (grid: boolean[][], fold: Fold): boolean[][] => {
    if (fold.direction === 'up') {
        return doFoldUp(grid, fold);
    }
    return doFoldLeft(grid, fold);
}


for (const fold of folds) {
    doFold(grid, fold);
}

const count = (grid: boolean[][]): number => {
    let num = 0;
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j]) {
                num++;
            }
        }
    }
    return num;
}

const printOut = (grid: boolean[][]): void => {
    for (let y = 0; y < 50; y++) {
        const line: string[] = [];
        for (let x = 0; x < 120; x++) {
            if (grid[y][x]) {
                line.push('#');
            } else {
                line.push(' ');
            }
        }
        console.log(line.join(''));
    }
};

printOut(grid);