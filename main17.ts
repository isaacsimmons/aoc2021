import { Point, triangularNumber } from "./shared";

// test
//const targetArea = {minX: 20, maxX: 30, minY:-10, maxY:-5};
// real
const targetArea = {minX: 277, maxX: 318, minY:-92, maxY:-53};

//const testIntersect 


// on the way up (only if maxY > 0)
// at the peak (is this any different than on the way up/on the way down?)
// on the way down towards zero (inly if maxY > 0) 
// the max peak of these is when initialY = maxY, and there is always at least one solution where initialX = any value within the range -- just shoot all the way there on your first shot



276 = n*n+1/2
552 = n * n+1
23 * 24




const slowestX = 24; // 23rd triangular number is 276, which is too slow to ever make it to the target area
// const fastesX = 




// for each x, lets list all of the t values we can reach it at:
if (triangular) { add in all values x = t(n) and above } (this also serves as an upper bound on t / lower bound on starting velocity
add in t=1





// at zero (I don't think we can actually have these, because they allow answers of +inf)
// on the way down past zero (only if minY < 0)


//if a triangular number is in the x Range, then we can drop it straight down, and our initialX can be as high as |minY| - 1

//if not, we have to start searching for 2, 3, 4 step solutions



// const testFire = (initialVelocity: Point): {hit: boolean, maxHeight: number} => {
//     const maxHeight = initialVelocity.y >= 0 ? triangularNumber(initialVelocity.y): 0;



//     const hit = ((): boolean => {
//         let position: Point = {x: 0, y: 0};

//         if (maxHeight < targetArea.minY) {
//             return false;
//         }

//         while (position.x <= targetArea.maxX)

//     })();

//     return {maxHeight, hit};
// };

// there is a triangular number in the X Range, so we're dropping straight down

console.log(triangularNumber(Math.abs(targetArea.minY) - 1));