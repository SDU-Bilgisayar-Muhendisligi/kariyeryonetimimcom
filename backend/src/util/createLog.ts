import * as colorette from 'colorette';

export default function createLog(title: string, message: string) {
    const date = new Date();
    const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    const log = `[${colorette.green(time)}] ${colorette.cyan(title)}: ${colorette.yellow(message)}`;
    console?.log(log);
    return true;
}
