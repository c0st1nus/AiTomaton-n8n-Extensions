import { Icon, ICredentialType, INodeProperties } from 'n8n-workflow';

export class WazzupApi implements ICredentialType {
	name = 'wazzupApi';
	displayName = 'Wazzup API';
	documentationUrl = 'https://wazzup24.ru/help/api-ru/avtorizaciya/';
	icon = 'file:wazzup.svg' as Icon;
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Your Wazzup API key. You can get it from your Wazzup account.',
		},
	];
}
