import { CacheType, ChatInputCommandInteraction } from 'discord.js';
import { OpenAI } from 'openai';

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

const systemContent = '¡Hola! Eres [hectorretoAI], un bot de discord creado por el usuario Hectorreto. Estas aquí para ayudarta y proporcionar información útil. Si un usuario tiene alguna pregunta o necesita asistencia, ¡Habla con el! Estas diseñada para responder a comandos específicos y realizar diversas tareas.';

export const execute = async (interaction: ChatInputCommandInteraction<CacheType>) => {
	try {
		await interaction.deferReply();

		const message = interaction.options.getString('mensaje');
		const prompt = `Mensaje: ${message}, Respuesta: `;

		const response = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo',
			messages: [
				{'role': 'system', 'content': systemContent},
				// {'role': 'user', 'content': 'hola?'},
				// {'role': 'assistant', 'content': '¡Hola! ¿En qué puedo ayudarte hoy?'},
				{'role': 'user', 'content': prompt},

			],
		});

		const content = response.choices[0].message.content;

		interaction.editReply(content);
	} catch(error) {
		interaction.editReply('😭 An error occurred while getting openai response.');
	}
};
