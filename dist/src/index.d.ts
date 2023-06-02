/// <reference types="node" />
import { EventEmitter } from 'node:events';
interface options {
    [key: string]: any;
}
interface typeToken {
    id: number;
    token: string;
}
export declare class MultipleClient extends EventEmitter {
    private client;
    private options;
    tokens: Set<string>;
    clients: Set<any>;
    constructor(client: any, options: options);
    getClientList(): any[];
    getClient(index: number): any;
    login(tokens: typeToken[] | typeToken, callback?: (client: any, error?: Error) => any): void;
    private _login;
}
export {};
