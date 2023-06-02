import { EventEmitter } from 'node:events';

interface options {
    [key: string]: any
}

interface typeToken {
    id: number,
    token: string
}

export class MultipleClient extends EventEmitter {
    private client: any;
    private options: options;
    public tokens: Set<string>;
    public clients: Set<any>;
    constructor(client: any, options: options) {
        super();
        if (!client) throw new Error("(!): \"client\" value must be provided.");
        
        this.client = client;
        this.options = options;
        this.tokens = new Set();
        this.clients = new Set();


        return this;
    }

    public getClientList() {
        return Array.from(this.clients);
    }

    public getClient(index: number) {
        return this.getClientList()?.find((c, i) => c.multipleId === index);
    }

    public login(tokens: typeToken[] | typeToken, callback?: (client: any, error?: Error) => any) {
        if (Array.isArray(tokens)) {
            for (let i = 0; i < tokens.length; i++) {
                const token = tokens[i];
                this.tokens.add(token.token);
                this._login(token, callback);
            }
        } else {
            if (typeof tokens === "object") {
                this._login(tokens, callback);
            } else {
                throw new Error("(!): Login \"tokens\" value must be a { id: number, token: string } or { id: number, token: string }[]");
            }
        }
    }

    private _login(_client: typeToken, callback?: (client: any, error?: Error) => any): Promise<any> {
        const client = new this.client(this.options);
    
        client.emit = (l: string, ...g: any) => {
            if (Array.isArray(g)) {
                let allIsSame = true;
                for (let i = 0; i < g.length; i++) {
                    const element = g[i];
                    if (element !== g[0]) {
                        allIsSame = false;
                    }
                }

                if (allIsSame) g = g[0];
            }
            this.emit(l, client, g);
        }

        client.multipleId = _client.id;
        this.clients.add(client);
        return client.login(_client.token).then(() => {
            if (callback) {
                callback(client)
            }
        }).catch((err: Error) => {
            if (callback) {
                this.emit("error", client, err);
                callback(client, err)
            }
        });
    }
}