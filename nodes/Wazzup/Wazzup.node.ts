import {
	IExecuteFunctions,
	INodeType,
	INodeTypeDescription,
	INodeExecutionData,
	NodeConnectionType,
} from 'n8n-workflow';
import { wazzupNodeProperties } from './Wazzup.node.properties';

export class Wazzup implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Wazzup',
		name: 'wazzup',
		icon: 'file:wazzup.svg',
		group: ['communication'],
		version: 2,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		description: 'Interact with the Wazzup API',
		defaults: { name: 'Wazzup' },
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [{ name: 'wazzupApi', required: true }],
		properties: wazzupNodeProperties,
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('wazzupApi');
		const apiKey = credentials.apiKey as string;
		const baseUrl = 'https://api.wazzup24.com/v3';

		for (let i = 0; i < items.length; i++) {
			const resource = this.getNodeParameter('resource', i) as string;
			const operation = this.getNodeParameter('operation', i) as string;

			try {
				let endpoint = `/${resource}s`; // Default endpoint (contacts, deals, users, channels)
				let method: 'GET' | 'POST' | 'DELETE' = 'GET';
				let body: any = undefined;
				const qs: { [key: string]: any } = {};

				if (resource === 'message') {
					endpoint = '/message';
					if (operation === 'send') {
						method = 'POST';
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as any;
						body = {
							channelId: this.getNodeParameter('channelId', i) as string,
							chatId: this.getNodeParameter('chatId', i) as string,
							chatType: this.getNodeParameter('chatType', i) as string,
							text: this.getNodeParameter('text', i) as string,
							contentUri: additionalFields.contentUri,
							quotedMessageId: additionalFields.quotedMessageId,
						};
					}
				} else if (resource === 'contact' || resource === 'deal') {
					if (operation === 'createOrUpdate') {
						method = 'POST';
						body = JSON.parse(this.getNodeParameter(`${resource}Data`, i) as string);
					} else if (operation === 'delete') {
						method = 'DELETE';
						body = JSON.parse(this.getNodeParameter(`${resource}Ids`, i) as string);
					} else if (operation === 'getAll') {
						method = 'GET';
						const options = this.getNodeParameter('options', i, {}) as any;
						if (options.limit) qs.limit = options.limit;
						if (options.offset) qs.offset = options.offset;
					}
				} else if (resource === 'user' || resource === 'channel') {
					if (operation === 'getAll') {
						method = 'GET';
					}
				}

				const options = {
					method,
					url: `${baseUrl}${endpoint}`,
					headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
					body,
					qs,
					json: true,
				};

				const response = await this.helpers.httpRequest(options);
				returnData.push({ json: response, pairedItem: { item: i } });
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
					continue;
				}
				throw error;
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
