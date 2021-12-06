import * as fs from 'fs';

type bit = 0 | 1;
type num = bit[];

const parseLine = (line: string): num => {
    const bits = line.split('').map(c => { if (c === '0') return 0; if (c === '1') return 1; throw new Error(); })
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

const splitNewlines = (lines: string[]): string[][] => {
    let chunks: string[][] = [];
    let currentChunk: string[] = [];

    for(const line of lines) {
        if (line.trim() === '') {
            if (currentChunk.length) {
                chunks.push(currentChunk);
                currentChunk = [];
            }
        } else {
            currentChunk.push(line);
        }
    }
    if (currentChunk.length) {
        chunks.push(currentChunk);
    }
    return chunks;
};

const parseBoard = (lines: string[]): Board => {
    const board: Board = { values: [], marked: []};

    for(const line of lines) {
        const vals = line.trim().split(/[ ]+/).map(Number);
        board.values.push(vals);
        board.marked.push(new Array(vals.length).fill(false));
    }

    return board;
};

const [header, ...rest] = new String(fs.readFileSync('input-4.txt')).split('\n');
const chunks = splitNewlines(rest);
const boards = chunks.map(parseBoard);

interface Board {
    values: number[][];
    marked: boolean[][];
}

const markBoard = (num: number, board: Board) => {
    for (let i = 0; i < board.values.length; i++) {
        for (let j = 0; j < board.values[i].length; j++) {
            if (board.values[i][j] === num) {
                board.marked[i][j] = true;
                return;
            }
        }
    }
};

const callNumber = (num: number, boards: Board[]) => {
    boards.forEach(board => markBoard(num, board));
};

const hasWon = (board: Board): boolean => {
    outer: for (let i = 0; i < board.values.length; i++) {
        inner: for (let j = 0; j < board.values[i].length; j++) {
            if (board.marked[i][j] === false) {
                continue outer;
            }
        }
        return true;
    }
    outer: for (let j = 0; j < board.values[0].length; j++) {
        inner: for (let i = 0; i < board.values.length; i++) {
            if (board.marked[i][j] === false) {
                continue outer;
            }
        }
        return true;
    }
    return false;
};

const findWinners = (boards: Board[]): number[] => {
    const winners: number[] = [];
    boards.forEach((board, idx) => {
        if (hasWon(board)) {
            winners.push(idx);
        }
    });
    return winners;
};

const scoreBoard = (board: Board, lastCalled: number): number => {
    let sumUnMarked = 0;
    for (let i = 0; i < board.values.length; i++) {
        for (let j = 0; j < board.values[i].length; j++) {
            if (!board.marked[i][j]) {
                sumUnMarked += board.values[i][j];
            }
        }
    }
    return sumUnMarked * lastCalled;
};

const calls = header.trim().split(/,[ ]*/).map(Number);
console.log(calls, boards);

for (const call of calls) {
    callNumber(call, boards);
    const winners = findWinners(boards);
    if (winners.length === boards.length) {
        console.log('Board(s) number', winners, 'won');
        const scores = winners.map(winner => scoreBoard(boards[winner], call));
        console.log(scores[9]);
        break;
    }
}
