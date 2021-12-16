import * as fs from 'fs';
import { Point } from './shared';

const modPlusRow = (input: number[], offset: number): number[] => {
    return input.map(i => ((i + offset) % 9) + 1);
}

const inputGrid: number[][] = new String(fs.readFileSync('input-15.txt')).split('\n').map(line => line.trim()).filter(line => line.length > 0).map(line => line.split('').map(s => Number(s) - 1));

const grid: number[][] = [];
for (let multY = 0; multY < 5; multY ++) {
    for (let y = 0; y < inputGrid.length; y++) {
        let gridRow: number[] = [];
        for (let multX = 0; multX < 5; multX++) {
            const modInputRow = modPlusRow(inputGrid[y], multY + multX);
            gridRow = gridRow.concat(modInputRow);
        }
        grid.push(gridRow);
    }
}

const printGrid = (grid: number[][]) => {
    for (const row of grid) {
        console.log(row.join(''));
    }
};

printGrid(grid);

const height = grid.length;
const width = grid[0].length;

const lowestCosts: (number | null)[][] = [];
for (let i = 0; i < grid.length; i++) {
    lowestCosts.push(Array(grid[i].length).fill(null));
}
lowestCosts[0][0] = 0;
let activeNodes: Set<string> = new Set(['0,0']);

const getNeighbors = ({x, y}: Point): Point[] => {
    const neighbors: Point[] = [];
    if (x > 0) {
        neighbors.push({x: x - 1, y});
    }
    if (y > 0) {
        neighbors.push({x, y: y - 1});
    }
    if (x < width - 1) {
        neighbors.push({x: x + 1, y});
    }
    if (y < height - 1) {
        neighbors.push({x, y: y +1});
    }
    return neighbors;
};

while (activeNodes.size > 0) {
    const newNodes = new Set<string>();
    for (const activeNode of activeNodes) {
        const [x,y] = activeNode.split(',').map(Number);
        const activePoint = {x, y};
        const oldCost = lowestCosts[y][x]!;
        for (const {x: neighborX, y: neighborY} of getNeighbors(activePoint)) {
            const newNeighborCost = oldCost + grid[neighborY][neighborX];
            const previousNeighborCost = lowestCosts[neighborY][neighborX];
            if (previousNeighborCost === null || newNeighborCost < previousNeighborCost) {
                lowestCosts[neighborY][neighborX] = newNeighborCost;
                newNodes.add(`${neighborX},${neighborY}`);
            }
        }
    }

    activeNodes = newNodes;
}

console.log(lowestCosts[grid.length - 1][grid[0].length - 1]);

