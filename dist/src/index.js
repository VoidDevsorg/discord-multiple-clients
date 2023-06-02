"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultipleClient = void 0;
const node_events_1 = require("node:events");
class MultipleClient extends node_events_1.EventEmitter {
    client;
    options;
    tokens;
    clients;
    constructor(client, options) {
        super();
        if (!client)
            throw new Error("(!): \"client\" value must be provided.");
        this.client = client;
        this.options = options;
        this.tokens = new Set();
        this.clients = new Set();
        return this;
    }
    getClientList() {
        return Array.from(this.clients);
    }
    getClient(index) {
        return this.getClientList()?.find((c, i) => c.multipleId === index);
    }
    login(tokens, callback) {
        if (Array.isArray(tokens)) {
            for (let i = 0; i < tokens.length; i++) {
                const token = tokens[i];
                this.tokens.add(token.token);
                this._login(token, callback);
            }
        }
        else {
            if (typeof tokens === "object") {
                this._login(tokens, callback);
            }
            else {
                throw new Error("(!): Login \"tokens\" value must be a { id: number, token: string } or { id: number, token: string }[]");
            }
        }
    }
    _login(_client, callback) {
        const client = new this.client(this.options);
        client.emit = (l, ...g) => {
            if (Array.isArray(g)) {
                let allIsSame = true;
                for (let i = 0; i < g.length; i++) {
                    const element = g[i];
                    if (element !== g[0]) {
                        allIsSame = false;
                    }
                }
                if (allIsSame)
                    g = g[0];
            }
            this.emit(l, client, g);
        };
        client.multipleId = _client.id;
        this.clients.add(client);
        return client.login(_client.token).then(() => {
            if (callback) {
                callback(client);
            }
        }).catch((err) => {
            if (callback) {
                this.emit("error", client, err);
                callback(client, err);
            }
        });
    }
}
exports.MultipleClient = MultipleClient;
