export interface Point {
    x: number;
    y: number;
}

class Grid<T> {
    private constructor(private readonly values: T[], max: Point) {

    }

    // public static initEmpty = <T>(defaultValue: T, max: Point): Grid<T> => {

    // };


}

export const triangularNumber = (n: number) => n * (n + 1) / 2;