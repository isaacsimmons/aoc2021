import * as fs from 'fs';

enum PacketTypeID {
    SUM = 0,
    PRODUCT = 1,
    MIN = 2,
    MAX = 3,
    LITERAL_VALUE = 4,
    GREATER_THAN = 5,
    LESS_THAN = 6,
    EQUAL_TO = 7,
}


interface BasePacket {
    version: number;
    type: PacketTypeID;
}

interface LiteralPacket extends BasePacket {
    type: PacketTypeID.LITERAL_VALUE;
    value: number;
}

interface OperatorPacket extends BasePacket {
    // TODO: specify that the type can't be 4 for these?
    lengthTypeId: 0 | 1;
    subpackets: Packet[];
}

type Packet = OperatorPacket | LiteralPacket;

const hexInput: string = new String(fs.readFileSync('input-16.txt')).split('\n').map(line => line.trim()).filter(line => line.length > 0)[0];
//const hexInput = '8A004A801A8002F478';
//const hexInput = 'EE00D40C823060';
//const hexInput = 'A0016C880162017C3686B18A3D4780';

const lookupMap: {[key: string]: string} = {
    '0': '0000',
    '1': '0001',
    '2': '0010',
    '3': '0011',
    '4': '0100',
    '5': '0101',
    '6': '0110',
    '7': '0111',
    '8': '1000',
    '9': '1001',
    'A': '1010',
    'B': '1011',
    'C': '1100',
    'D': '1101',
    'E': '1110',
    'F': '1111',
};

const hexToBinary = (hexString: string): string => {
    return hexString.split('').map(hex => lookupMap[hex]).join('');
};

const binary: string = hexToBinary(hexInput);
//(parseInt(hexInput, 16).toString(2));

const parsePacket = (binaryPacket: string): {packet: Packet, remainder: string} => {
    const versionStr = binaryPacket.substring(0, 3);
    const version = parseInt(versionStr, 2);
    const packetTypeStr = binaryPacket.substring(3, 6);
    const packetType = parseInt(packetTypeStr, 2);


    switch (packetType) {
        case PacketTypeID.LITERAL_VALUE:
            let literalValueBinary = '';
            let i = 6;
            let hasMore = true;
            while (hasMore) {
                hasMore = binaryPacket[i] === '1';
                literalValueBinary += binaryPacket.substring(i + 1, i + 5);
                i += 5;
            }
            const literalValue = parseInt(literalValueBinary, 2);
            const remainder = binaryPacket.substring(i);
            console.log('parsed literal value', literalValue);
            return {remainder, packet: {version, type: packetType, value: literalValue}};

        default:
            // all others are operators
            const lengthTypeStr = binaryPacket.substring(6, 7);
            const lengthTypeId = parseInt(lengthTypeStr, 2);
            if (lengthTypeId === 0) {
                const subpacketTotalLengthStr = binaryPacket.substring(7, 22);
                const subpacketTotalLength = parseInt(subpacketTotalLengthStr, 2);
                let subpacketStr = binaryPacket.substring(22, 22 + subpacketTotalLength);

                const subpackets: Packet[] = [];

                while (subpacketStr.length > 5) {
                    const {packet: subPacket, remainder} = parsePacket(subpacketStr);
                    subpackets.push(subPacket);
                    subpacketStr = remainder;
                }

                const remainder = binaryPacket.substring(22 + subpacketTotalLength);
                const packet = {version, type: packetType, lengthTypeId: 0 as const, subpackets};
                console.log('parsed', packet);

                return {packet, remainder};
            } else if (lengthTypeId === 1) {
                const subpacketCountStr = binaryPacket.substring(7, 18);
                const subpacketCount = parseInt(subpacketCountStr, 2);
                let subpacketsEtc = binaryPacket.substring(18);
                let subpackets: Packet[] = [];

                for (let i = 0; i < subpacketCount; i++) {
                    const {packet, remainder} = parsePacket(subpacketsEtc);
                    subpackets.push(packet);
                    subpacketsEtc = remainder;
                }

                const packet = {version, type: packetType, subpackets, lengthTypeId: 1 as const};
                console.log('parsed', packet);
                return {packet, remainder: subpacketsEtc};
            } else {
                throw new Error('invalid length type id');
            }
    }
};

console.log(binary);
const {packet: parsedPacket} = parsePacket(binary);


const sumVersions = (packet: Packet): number => {
    let subpacketsVersionSum = 0;
    if ('subpackets' in packet) {
        for (const subpacket of packet.subpackets) {
            subpacketsVersionSum += sumVersions(subpacket);
        }
    }
    return packet.version + subpacketsVersionSum;
};

const evalPacket = (packet: Packet): number => {
    const {version, type} = packet;
    if (type === PacketTypeID.LITERAL_VALUE) {
        return (packet as LiteralPacket).value;
    }
    const subpacketValues = (packet as OperatorPacket).subpackets.map(subpacket => evalPacket(subpacket));
    switch (type) {
        case PacketTypeID.SUM:
            return subpacketValues.reduce((x, y) => x + y, 0);
        case PacketTypeID.PRODUCT:
            return subpacketValues.reduce((x, y) => x * y, 1);
        case PacketTypeID.MAX:
            return Math.max(...subpacketValues);
        case PacketTypeID.MIN:
            return Math.min(...subpacketValues);
    }

    if (subpacketValues.length !== 2) {
        throw new Error();
    }
    const [val1, val2] = subpacketValues;
    switch (type) {
        case PacketTypeID.EQUAL_TO:
            return val1 === val2 ? 1 : 0;
        case PacketTypeID.GREATER_THAN:
            return val1 > val2 ? 1 : 0;
        case PacketTypeID.LESS_THAN:
            return val1 < val2 ? 1 : 0;
    }

    throw new Error();
}

console.log(evalPacket(parsedPacket));