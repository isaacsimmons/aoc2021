import * as fs from 'fs';



const lines = new String(fs.readFileSync('input-8.txt')).split('\n');

interface InputLine {
    uniques: string[];
    digits: string[];
}

const parsedLines: InputLine[] = [];
let partialLine: string | null = null;


const sortLine = (s: string): string => {
    return s.trim().split('').sort().join('');
};

const whatsMissing = (s: string): Set<string> => {
    const missing = new Set(['a', 'b', 'c', 'd', 'e', 'f', 'g']);
    s.split('').forEach(c => missing.delete(c));
    return missing;
};

const filterSplit = <T>(items: T[], fn: (item: T) => boolean): [T[], T[]] => {
    const has = items.filter(fn);
    const hasnt = items.filter(item => !fn(item));
    return [has, hasnt];
};

for (const line of lines) {
    if (line.endsWith('|')) {
        if (partialLine !== null) {
            throw new Error();
        }
        partialLine = line.substring(0, line.length - 2);
    } else {
        if (partialLine !== null) {
            if (line.indexOf('|') !== -1) {
                throw new Error();
            }
            parsedLines.push({uniques: partialLine.split(' ').map(sortLine), digits: line.split(' ').map(sortLine)});
            partialLine = null;
        } else {
            const [p1, p2] = line.split(' | ');
            parsedLines.push({uniques: p1.split(' ').map(sortLine), digits: p2.split(' ').map(sortLine)});
        }
    }
}


export type Collection<T> = Set<T> | Array<T>;

const isSet = <T>(c: Collection<T>): c is Set<T> => c.constructor.name === 'Set';
const toSet = <T>(c: Collection<T>): Set<T> => isSet(c) ? c : new Set(c);
const toArray = <T>(c: Collection<T>): Array<T> => isSet(c) ? [...c] : c;

export const union = <T>(...collections: Collection<T>[]): Set<T> => {
    const arrays = collections.map(toArray);
    const joined = ([] as T[]).concat(...arrays);
    return new Set(joined);
};

export const intersection = <T>(...collections: Collection<T>[]): Set<T> => {
    const [firstColl, ...restColl] = collections;
    const first = toArray(firstColl);
    const rest = restColl.map(toSet);
    return new Set(first.filter(item => rest.every(set => set.has(item))));
};

const containsAll= (value: string, doesItContainThis: string): boolean => {
    for (const c of doesItContainThis.split('')) {
        if (value.indexOf(c) === -1) {
            return false;
        }
    }
    return true;
};

const mapUniques = (uniques: string[]): Map<string, number> => {
    if (uniques.length !== 10) {
        throw new Error();
    }
    const byLength = new Map<number, Set<string>>();
    uniques.forEach(unique => {
        let match = byLength.get(unique.length);
        if (!match) {
            match = new Set<string>();
            byLength.set(unique.length, match);
        }
        match.add(unique);
    });


    const result = new Map<string, number>();

    const theOne = byLength.get(2);
    if (theOne === undefined || theOne.size !== 1) {
        throw new Error();
    }
    const one = [...theOne][0];
    console.log('one is ', one);
    const [oneA, oneB] = one.split('');
    result.set(one, 1);

    const theSeven = byLength.get(3);
    if (theSeven === undefined || theSeven.size !== 1) {
        throw new Error();
    }
    const seven = [...theSeven][0];
    result.set(seven, 7);

    const theFour = byLength.get(4);
    if (theFour === undefined || theFour.size !== 1) {
        throw new Error();
    }
    const four = [...theFour][0]
    result.set(four, 4);

    const theEight = byLength.get(7);
    if (theEight === undefined || theEight.size !== 1) {
        throw new Error();
    }
    result.set([...theEight][0], 8);

    // whatever is missing from a sixer and also missing from 4 is bottom left (and now I can pull 9 out of the sixers)
    // whatever is missing in any fiver is an edge
    // whatever sixer is missing not an edge is 0
    // the remaining sixer is 6 (and its missing segment is top right)
    // the fiver missing top right is 5
    // the fiver that "contains" 1 is 3
    // the last fiver is 2


    const fivers = [...byLength.get(5)!];
    const sixers = [...byLength.get(6)!];


    const edgeSegments = union(...fivers.map(whatsMissing));
    const segmentsMissingFromSixers = union(...sixers.map(whatsMissing));
   
 
    const bottomLeftSegmentSet = intersection(segmentsMissingFromSixers, whatsMissing(four));
    if (bottomLeftSegmentSet.size !== 1) {
        throw new Error();
    }
    const bottomLeftSegment = [...bottomLeftSegmentSet][0];

//    let topRightSegment: string|null = null;

    let zero: string | null = null;
    let nine: string | null = null;
    let six: string | null = null;
    for (const sixer of sixers) {
        if (sixer.indexOf(bottomLeftSegment) === -1) {
            if (nine !== null) {
                throw new Error();
            }
            nine = sixer;
            result.set(nine, 9);
            continue;
        }

        const missingDigits = whatsMissing(sixer);
        const missingEdges = intersection(missingDigits, edgeSegments);
        if (missingEdges.size === 0) {
            if (zero !== null) {
                throw new Error();
            }
            zero = sixer;
            result.set(zero, 0);
            continue;
        }

        if (six !== null) {
            throw new Error();
        }
        six = sixer;
        result.set(six, 6);
 //       topRightSegment = [...missingDigits][0];
    }

    // if (topRightSegment === null) {
    //     throw new Error();
    // }

    let five: string | null = null;
    let two: string | null = null;
    let three: string | null = null;
    for (const fiver of fivers) {
        if (containsAll(fiver, one)) {
            if (three !== null) {
                throw new Error();
            }
            three = fiver;
            result.set(three, 3);
            continue;
        }

        const missingDigits = whatsMissing(fiver);
        if (missingDigits.has(bottomLeftSegment)) {
            if (five !== null) {
                throw new Error();
            }
            five = fiver;
            result.set(five, 5);
            continue;
        }

        if (two !== null) {
            throw new Error();
        }
        two = fiver;
        result.set(two, 2);
    }

    return result;

};

const descramble = (digits: string[], mapping: Map<string, number>): number => {
    const nums = digits.map(digit => {
        const num = mapping.get(digit);
        if (num === undefined) {
            throw new Error();
        }
        return num;
    });
    const joined = Number(nums.reduce((a, b) => { return a + String(b); }, ''));
    return joined;
};

const values = parsedLines.map(parsedLine => {
    const mapping = mapUniques(parsedLine.uniques);
    return descramble(parsedLine.digits, mapping);
});

console.log(values);

const sum = values.reduce((a, b) => a + b, 0);
console.log(sum);

