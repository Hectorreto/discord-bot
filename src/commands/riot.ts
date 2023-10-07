import { type ChatInputCommandInteraction } from 'discord.js';

const { RIOT_TOKEN } = process.env;

export const data = {
	name: 'riot',
	description: 'Get League of Legends summoner information and rank.',
	options: [
		{
			name: 'summoner',
			description: 'The summoner name to look up.',
			type: 3,
			required: true,
		},
	],
};

type SummonerDTO = {
	id: string;
	accountId: string;
	puuid: string;
	name: string;
	profileIconId: number;
	revisionDate: number;
	summonerLevel: number;
};

type LeagueEntryDTO = {
	leagueId: string;
	queueType: 'RANKED_SOLO_5x5' | 'RANKED_FLEX_SR';
	tier: 'GOLD' | 'PLATINUM' | 'EMERALD';
	rank: 'IV' | 'III' | 'II' | 'I';
	summonerId: string;
	summonerName: string;
	leaguePoints: number;
	wins: number;
	losses: number;
	veteran: boolean;
	inactive: boolean;
	freshBlood: boolean;
	hotStreak: boolean;
};

const fetchSummoner = async (summonerName: string): Promise<SummonerDTO> => {
	const url = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`;
	const options = { headers: { 'X-Riot-Token': RIOT_TOKEN } };
	const response = await fetch(url, options);

	if (response.status !== 200) {
		throw new Error('Error fetching summoner data');
	}

	return response.json();
};

const fetchLeagueEntries = async (summonerId: string): Promise<LeagueEntryDTO[]> => {
	const url = `https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`;
	const options = { headers: { 'X-Riot-Token': RIOT_TOKEN } };
	const response = await fetch(url, options);

	if (response.status !== 200) {
		throw new Error('Error fetching league entries');
	}

	return response.json();
};

const getSummonerState = (leagueEntry: LeagueEntryDTO) => {
	const stateFlags = [];

	if (leagueEntry.veteran) {
		stateFlags.push('Veteran 👊');
	}

	if (leagueEntry.inactive) {
		stateFlags.push('Inactive 😴');
	}

	if (leagueEntry.freshBlood) {
		stateFlags.push('Fresh Blood 🩸');
	}

	if (leagueEntry.hotStreak) {
		stateFlags.push('Hot Streak 🥵');
	}

	if (stateFlags.length > 0) {
		return stateFlags.join(' - ');
	}

	return 'No info... 😭';
};

const getSummonerInfo = async (summonerName: string) => {
	const summoner = await fetchSummoner(summonerName);
	const leagueEntries = await fetchLeagueEntries(summoner.id);
	const rankedSolo5x5 = leagueEntries.find((entry) => entry.queueType === 'RANKED_SOLO_5x5');

	const reply = [
		`Summoner name: ${rankedSolo5x5.summonerName}`,
		`Tier: ${rankedSolo5x5.tier} - Rank: ${rankedSolo5x5.rank} - LP: ${rankedSolo5x5.leaguePoints}`,
		`Level: ${summoner.summonerLevel}`,
		`Wins: ${rankedSolo5x5.wins} | Losses: ${rankedSolo5x5.losses}`,
		`State: ${getSummonerState(rankedSolo5x5)}`,
	];

	return reply.join('\n');
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
	try {
		const summonerName = interaction.options.getString('summoner');
		await interaction.deferReply();
		const summonerInfo = await getSummonerInfo(summonerName);
		await interaction.editReply(summonerInfo);
	} catch (error) {
		console.error(error);
		await interaction.editReply('😭');
	}
};
