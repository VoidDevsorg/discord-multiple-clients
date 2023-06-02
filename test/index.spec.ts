import { MultipleClient } from '../src';
import { Client, GatewayIntentBits } from 'discord.js';

const multipleClient = new MultipleClient(Client, {
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent
    ]
});

multipleClient.on("ready", (client) => {
    console.log(`${client.user.username} olarak Discord'a bağlanıldı.`);

    console.log(client.multipleId)
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
    { id: 1, token: "A" },
    { id: 2, token: "B" }
]);

multipleClient.login({ id: 3, token: "C" });