

# Discord Multiple Clients

[![npm version](https://badge.fury.io/js/@voidpkg/discord-multiple-clients.svg)](https://badge.fury.io/js/@voidpkg/discord-multiple-clients)
[![Build Status](https://img.shields.io/github/checks-status/VoidDevsOrg/discord-multiple-clients/master)](https://github.com/VoidDevsOrg/discord-multiple-clients/actions/workflows/main.yml?query=branch%3Amaster)
[![codecov](https://codecov.io/gh/VoidDevsOrg/discord-multiple-clients/branch/master/graph/badge.svg)](https://codecov.io/gh/VoidDevsOrg/discord-multiple-clients)
![dependencies](https://img.shields.io/david/VoidDevsOrg/discord-multiple-clients)
[![install size](https://packagephobia.now.sh/badge?p=@voidpkg/discord-multiple-clients)](https://packagephobia.now.sh/result?p=@voidpkg/discord-multiple-clients)

## Image

![showcase](https://cdn.discordapp.com/attachments/922959060297457726/1114329389820293141/image.png)

<br>

## Usage
```ts
import { MultipleClient } from '@voidpkg/discord-multiple-clients';
import { Client, GatewayIntentBits } from 'discord.js';

const multipleClient = new MultipleClient(Client, {
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

multipleClient.on("ready", (client) => {
    console.log(`Connected as a ${client.user.username} with ${client.multipleId}`);
});

multipleClient.on("messageCreate", (client, message) => {
    const otherClient = multipleClient.getClient(2);
    if (client.multipleId !== 2 && otherClient) {
        otherClient.channels.cache.get("922959060297457726")?.send([
            "```json",
            JSON.stringify({
                from: client.multipleId,
                message: message.content
            }),
            "```"
        ].join('\n'));
    }
})

multipleClient.login([
    { id: 1, token: "..." },
    { id: 2, token: "..." }
]);

multipleClient.login({ id: 3, token: "..." });
```