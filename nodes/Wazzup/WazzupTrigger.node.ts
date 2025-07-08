import {
	IHookFunctions,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	INodeExecutionData,
} from 'n8n-workflow';

enum EventTypes {
	Test = 'test',
	CreateContact = 'createContact',
	NewMessage = 'messages',
	Statuses = 'statuses',
	ContactsDeals = 'contacts_deals',
	Channels = 'channels',
	Default = 'default',
}


export class WazzupTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Wazzup Trigger',
		name: 'wazzupTrigger',
		icon: 'file:wazzup.svg',
		group: ['trigger'],
		version: 4, // Версия увеличена из-за новых функций
		description: 'Starts a workflow when Wazzup sends a webhook. Automatically registers and unregisters the webhook.',
		defaults: { name: 'Wazzup Trigger' },
		inputs: [],
		outputs: ["main"],
		credentials: [
			{
				name: 'wazzupApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'wazzup',
			},
		],
		properties: [
			{
				displayName: 'Event Type',
				name: 'eventType',
				type: 'multiOptions',
				options: [
					{ name: 'Message Status Changes', value: 'statuses' },
					{ name: 'Channels Status Updates', value: 'channels' },
					{ name: 'Contact and Deal Creation', value: 'contacts_deals' },
				],
				default: ['messages'],
				description:
					'Choose which event types should trigger this workflow. This also controls automatic webhook registration.',
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				return false;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const credentials = await this.getCredentials('wazzupApi');
				const webhookUrl = this.getNodeWebhookUrl('default');
				const eventTypes = this.getNodeParameter('eventType', ['messages']) as string[];

				const subscribeToMessagesAndStatuses = eventTypes.includes('statuses');
				const subscribeToContactsAndDeals = eventTypes.includes('contacts_deals');
				const subscribeToChannells = eventTypes.includes('channels');

				console.log('Subscribe to Messages and Statuses:', subscribeToMessagesAndStatuses);
				console.log('Subscribe to Contacts and Deals:', subscribeToContactsAndDeals);
				console.log('Subscribe to Channels:', subscribeToChannells);

				const body = {
					webhooksUri: webhookUrl,
					subscriptions: {
						messagesAndStatuses: subscribeToMessagesAndStatuses,
						contactsAndDealsCreation: subscribeToContactsAndDeals,
						phones: subscribeToChannells,
					},
				};

				await this.helpers.httpRequest({
					method: 'PATCH',
					url: 'https://api.wazzup24.com/v3/webhooks',
					headers: {
						Authorization: `Bearer ${credentials.apiKey}`,
					},
					body,
					json: true,
				});

				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const credentials = await this.getCredentials('wazzupApi');

				// Для отписки отправляем PATCH-запрос с пустыми полями
				const body = {
					webhooksUri: '',
					subscriptions: {
						messagesAndStatuses: false,
						contactsAndDealsCreation: false,
						channelsUpdates: false,
					},
				};

				await this.helpers.httpRequest({
					method: 'PATCH',
					url: 'https://api.wazzup24.com/v3/webhooks',
					headers: {
						Authorization: `Bearer ${credentials.apiKey}`,
					},
					body,
					json: true,
				});

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();

		const incomingEventType = (Object.values(EventTypes) as string[]).includes(Object.keys(req.body)[0]) ? Object.keys(req.body)[0] : EventTypes.Default;

		// Если тело запроса пустое или нет ключей, обрабатываем весь запрос
		if (!req.body || Object.keys(req.body).length === 0) {
			const returnData: INodeExecutionData[] = [{
				json: {
					eventType: 'empty',
					Body: req.body,
					headers: req.headers,
				},
			}];

			return {
				workflowData: [returnData],
			};
		}

		const returnData: INodeExecutionData[] = [{
			json: {
				eventType: incomingEventType,
				headers: req.headers,
				body: req.body,
			}
		}];

		return {
			workflowData: [returnData],
		};
	}
}
