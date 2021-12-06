import * as fs from 'fs';

type bit = 0 | 1;
type num = bit[];

interface point {x: number, y: number};
interface line { start: point, end: point};

const isHoriz = ({start, end}: line) => start.y === end.y;
const isVert = ({start, end}: line) => start.x === end.x;
const isHorizOrVert = (line: line) => isHoriz(line) || isVert(line);

const parsePoint = (s: string): point => {
    const [x, y] = s.trim().split(',').map(s => Number(s.trim()));
    return {x, y};
};

const parseLine = (line: string): line => {
    const [start, end] = line.split('->').map(parsePoint);
    return {start, end};
};

const getMax = (lines: line[]): point => {
    let x = 0;
    let y = 0;
    lines.forEach(line => {
        x = Math.max(x, line.start.x, line.end.x);
        y = Math.max(y, line.start.y, line.end.y);
    });
    return {x: x+1, y: y+1};
};

const lines = new String(fs.readFileSync('input-5.txt')).split('\n').map(parseLine);
const max = getMax(lines);

const board: number[] = Array(max.x * max.y).fill(0);

const idx = (point: point): number => {
    return point.x + (point.y * max.x);
};

const drawLine = (line: line, board: number[]) => {
    const dx = line.end.x - line.start.x;
    const dy = line.end.y - line.start.y;
    const len = Math.max(Math.abs(dx), Math.abs(dy));
    const stepX = dx / len;
    const stepY = dy / len;

    for (let i = 0; i <= len; i++) {
        board[idx({x: line.start.x + (stepX * i), y: line.start.y + (stepY * i)})]++;
    }
};

const drawBoard = (board: number[]) => {
    for (let n = 0; n < max.y; n++) {
        const row = board.slice(n * max.x, (n+1) * max.x).map(num => num === 0 ? '.' : String(num)).join('');
        console.log(row);
    }
};


const countIntersections = (board: number[]): number => {
    return board.filter(num => num > 1).length;
};

lines.forEach(line => drawLine(line, board));

drawBoard(board);
const intersections = countIntersections(board);

console.log(intersections);

