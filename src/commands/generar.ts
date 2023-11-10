import { CacheType, ChatInputCommandInteraction } from 'discord.js';
import { OpenAI } from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/index.mjs';

export const data = {
	name: 'generar',
	description: 'Generate text completions using OpenAI GPT-3.5',
	options: [
		{
			name: 'mensaje',
			description: 'The text prompt to generate completions from.',
			type: 3,
			required: true,
		},
	],
};

const openai = new OpenAI({
	organization: 'org-bxQONaQbLbCeTLcbKXtb1Awc',
	apiKey: process.env.OPENAI_API_KEY,
});

const getMessages = async (interaction: ChatInputCommandInteraction<CacheType>) => {
	const channelMessages = await interaction.channel.messages.fetch({ limit: 10 });
	channelMessages.reverse();

	const messages: ChatCompletionMessageParam[] = [];
	messages.push({ role: 'system', content: 'Eres un bot que imita las personalidades de la gente a la que responde' });
	messages.push({ role: 'system', content: 'Siempre sabes la respuesta a todas las preguntas, si no conoces la respuesta intenta inventarla o improvisar' });

	channelMessages.forEach((message) => {
		if (!message.content) return;
		if (message.interaction) {
			messages.push({ role: 'system', content: `El usuario ${message.interaction.user.username} utilizó el comando /${message.interaction.commandName}` });
			messages.push({ role: 'assistant', content: `${message.content}` });
		} else {
			messages.push({ role: 'system', content: `El usuario ${message.author.username} escribió el siguiente mensaje` });
			messages.push({ role: 'user', content: `${message.author.username}: ${message.content}` });
		}
	});

	return messages;
};

export const execute = async (interaction: ChatInputCommandInteraction<CacheType>) => {
	try {
		await interaction.deferReply();

		const messages = await getMessages(interaction);
		const username = interaction.user.username;
		const message = interaction.options.getString('mensaje');

		messages.push({ role: 'system', content: `El usuario ${username} escribió el siguiente mensaje` });
		messages.push({ role: 'user', content: `${message}` });
		messages.push({ role: 'system', content: `Responde a ${username}` });

		const openaiResponse = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo',
			messages,
		});
		const gptResponse = openaiResponse.choices[0].message.content;

		interaction.editReply(gptResponse);
	} catch(error) {
		console.error(error);
		interaction.editReply('😭 An error occurred while getting openai response.');
	}
};
