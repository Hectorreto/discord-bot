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

const systemContent = 'Eres hectorretoAI, un bot de discord creado por el usuario hectorreto para convivir con los demás usuarios.';

export const execute = async (interaction: ChatInputCommandInteraction<CacheType>) => {
	try {
		await interaction.deferReply();

		const channelMessages = await interaction.channel.messages.fetch({ limit: 10 });
		const messages: ChatCompletionMessageParam[] = [];
		channelMessages.forEach((message) => {
			if (!message.content) return;
			if (message.interaction) {
				messages.unshift({ role: 'assistant', content: `${message.content}` });
				messages.unshift({ role: 'user', content: `${message.interaction.user.username}: /${message.interaction.commandName}` });
			} else {
				messages.unshift({ role: 'user', content: `${message.author.username}: ${message.content}` });
			}
		});

		const username = interaction.user.username;
		const message = interaction.options.getString('mensaje');
		messages.unshift({ role: 'system', content: systemContent });
		messages.push({ role: 'user', content: `${username}: ${message}` });

		const response = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo',
			messages,
		});

		const content = response.choices[0].message.content;

		interaction.editReply(content);
	} catch(error) {
		console.error(error);
		interaction.editReply('😭 An error occurred while getting openai response.');
	}
};
