import * as fs from 'fs';

interface Edge {
    node1: string;
    node2: string;
}

const parseLine = (line: string): Edge => {
    const [node1, node2] = line.split('-');
    return {node1, node2};
};

const edges: Edge[] = new String(fs.readFileSync('input-12.txt')).split('\n').filter(line => line.length > 0).map(parseLine);
const graph = new Map<string, Set<string>>();
for (const {node1, node2} of edges) {
    const node1Outbound = graph.get(node1);
    if (node1Outbound) {
        node1Outbound.add(node2);
    } else {
        graph.set(node1, new Set([node2]));
    }

    const node2Outbound = graph.get(node2);
    if (node2Outbound) {
        node2Outbound.add(node1);
    } else {
        graph.set(node2, new Set([node1]));
    }
}

const isSmallCave = (node: string) => node[0].toLowerCase() === node[0];

class Route {
    nodeSet: Set<string>;

    constructor(public readonly nodeList: string[], public readonly smallCaveOverflow: boolean = false) {
        this.nodeSet = new Set(nodeList);
    }

    public append(node: string): Route | null {
        if (node === 'start') {
            return null;
        }
        if (isSmallCave(node) && this.nodeSet.has(node)) {
            if (this.smallCaveOverflow === true) {
                return null;
            } else {
                return new Route([...this.nodeList, node], true);
            }
        }
        return new Route([...this.nodeList, node], this.smallCaveOverflow);
    }

    public end(): string {
        return this.nodeList[this.nodeList.length - 1];
    }
}

console.log(graph);

let length = 1;
let currentRoutes = [new Route(['start'])];
let nextRoutes: Route[] = [];
let completeRoutes: Route[] = [];

while (currentRoutes.length > 0) {
    for (const route of currentRoutes) {
        const outboundEdges = [...graph.get(route.end())!];
        for (const outboundEdge of outboundEdges) {
            const newRoute = route.append(outboundEdge);
            if (newRoute === null) {
                continue;
            }
            if (outboundEdge === 'end') {
                completeRoutes.push(newRoute);
            } else {
                nextRoutes.push(newRoute);
            }
        }
    }

    currentRoutes = nextRoutes;
    nextRoutes = [];
}

//completeRoutes.forEach(r => console.log(r.nodeList));
console.log(completeRoutes.length);