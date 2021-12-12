import * as fs from 'fs';

const octos: number[][] = new String(fs.readFileSync('input-11.txt')).split('\n').filter(line => line.length > 0).map(line => line.split('').map(Number));
const flashedThisTurn: boolean[][] = [];

const makeEmptyBool = (x: number, y: number): boolean[][] => {
    const result: boolean[][] = [];
    for (let j = 0; j < y; j++) {
        result.push(new Array(x).fill(false));
    }
    return result;
};

const countTrues = (flashers: boolean[][]): number => {
    let result = 0;
    for (let j = 0; j < flashers.length; j++) {
        for (let i = 0; i < flashers[j].length; i++) {
            if (flashers[i][j]) {
                result ++;
            }
        }
    }
    return result;
}

const incrementAll = (octos: number[][]) => {
    for (let j = 0; j < octos.length; j++) {
        for (let i = 0; i < octos[j].length; i++) {
            octos[i][j]++;
        }
    }
};

const incrementOne = (octos: number[][], x: number, y: number) => {
    if (x < 0 || y < 0 || x >= octos[0].length || y >= octos.length) {
        return;
    }
    octos[x][y]++;
};

const doFlash = (octos: number[][], flashedThisTurn: boolean[][]) => {
    let anyFlashes = false;
    for (let j = 0; j < octos.length; j++) {
        for (let i = 0; i < octos[j].length; i++) {
            if (octos[i][j] > 9 && flashedThisTurn[i][j] === false) {
                anyFlashes = true;
                flashedThisTurn[i][j] = true;
                incrementOne(octos, i - 1, j - 1);
                incrementOne(octos, i - 1, j);
                incrementOne(octos, i - 1, j + 1);
                incrementOne(octos, i, j - 1);
                incrementOne(octos, i, j + 1);
                incrementOne(octos, i + 1, j - 1);
                incrementOne(octos, i + 1, j);
                incrementOne(octos, i + 1, j + 1);
            }
        }
    }

    // Recurse until no more have flashed
    if (anyFlashes) {
        doFlash(octos, flashedThisTurn);
    }
};

const zeroThemOut = (octos: number[][], flashedThisTurn: boolean[][]) => {
    for (let j = 0; j < octos.length; j++) {
        for (let i = 0; i < octos[j].length; i++) {
            if (flashedThisTurn[i][j]) {
                if (octos[i][j] < 9) {
                    throw new Error();
                }
                octos[i][j] = 0;
            }
        }
    }
};

console.log(octos);
let totalFlashes = 0;
for (let step = 1; step <= 100000; step++) {
    incrementAll(octos);
    const flashedThisTurn = makeEmptyBool(10, 10);
    doFlash(octos,flashedThisTurn);
    const numFlashes = countTrues(flashedThisTurn);
    totalFlashes += numFlashes;
    if (numFlashes === 100) {
        console.log('turn is', step);
        break;
    }
    zeroThemOut(octos, flashedThisTurn);
    console.log(octos);
}
console.log(totalFlashes);