import { CacheType, ChatInputCommandInteraction } from 'discord.js';

export const data = {
	name: 'pokemon',
	description: 'Get information about a Pokémon.',
	options: [
		{
			name: 'name',
			description: 'The name of the Pokémon.',
			type: 3, // Type 3 represents a STRING
			required: true, // This option is required
		},
	],
};

type PokemonType = {
	type: { name: string; };
};

type PokemonDTO = {
	types: PokemonType[];
};

export const execute = async (interaction: ChatInputCommandInteraction<CacheType>) => {
	const rawName = interaction.options.getString('name');
	const name = rawName.toLowerCase();
	const api = `https://pokeapi.co/api/v2/pokemon/${name}`;

	try {
		await interaction.deferReply();
		const response = await fetch(api);

		if (response.ok) {
			const pokemon: PokemonDTO = await response.json();
			const types = pokemon.types.map(({ type }) => type.name);
			const reply = `${name} is of type: ${types.join(', ')}`;
			await interaction.editReply(reply);
		} else {
			await interaction.editReply(`Error getting information for ${name}`);
		}

	} catch (error) {
		console.error(error);
		await interaction.editReply('😭 An error occurred while fetching Pokémon data.');
	}
};
