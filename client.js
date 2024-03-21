import {io} from 'socket.io-client';
import {NEW_MESSAGE_EVENT, INFO_EVENT, PUBLIC_CHANNEL_ID} from "./constants.js";
import {createInterface} from 'readline/promises';
import {stdin as input, stdout as output} from 'process';

function setupSocket() {
    const socket = io(`ws://localhost:4001`);

    socket.on("connect", () => {
        clearPrevLine();
        console.log('[SERVER]: CONNECTED!');
        printDivider();
    });

    socket.on(INFO_EVENT, (message) => {
        clearPrevLine();
        console.log(`[SERVER INFO]: ${message}`);
        printDivider();
    });

    socket.on(NEW_MESSAGE_EVENT, ({name, message}) => {
        // clearPrevLine();
        console.log(`[${name}]: ${message}`);
        printDivider();
    });

    return socket;
}

async function main() {
    const rl = createInterface(input, output);
    const name = await rl.question('Enter your name: ');

    const socket = setupSocket();

    await getMessage(rl, socket, name);
}


function clearPrevLine() {
    output.moveCursor(0, -1);
    output.clearLine(0);
}

function printDivider() {
    console.log('----------------------');
}

const getMessage = async (rl, socket, name) => {
    const message = await rl.question('');

    if (message) {
        clearPrevLine();
        socket.emit(NEW_MESSAGE_EVENT, {name, message});
    } else {
        socket.emit(INFO_EVENT, 'You can\'t send an empty message.');
    }

    await getMessage(rl, socket, name);
}

await main();