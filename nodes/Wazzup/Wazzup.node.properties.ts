import { INodeProperties } from 'n8n-workflow';

export const wazzupNodeProperties: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{ name: 'Channel', value: 'channel' },
			{ name: 'Contact', value: 'contact' },
			{ name: 'Deal', value: 'deal' },
			{ name: 'Message', value: 'message' },
			{ name: 'User', value: 'user' },
		],
		default: 'message',
		description: 'The resource to work with',
	},

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//                                  MESSAGE
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['message'] } },
		options: [{ name: 'Send', value: 'send', action: 'Send a message' }],
		default: 'send',
	},
	{
		displayName: 'Channel ID',
		name: 'channelId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['message'], operation: ['send'] } },
		default: '',
		description: 'The ID of the channel to send the message from',
	},
	{
		displayName: 'Chat ID',
		name: 'chatId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['message'], operation: ['send'] } },
		default: '',
		description: 'The ID of the chat (e.g., phone number)',
	},
	{
		displayName: 'Chat Type',
		name: 'chatType',
		type: 'options',
		displayOptions: { show: { resource: ['message'], operation: ['send'] } },
		options: [
			{ name: 'WhatsApp', value: 'whatsapp' },
			{ name: 'Telegram', value: 'telegram' },
			{ name: 'Instagram', value: 'instagram' },
			// Add other chat types as needed
		],
		default: 'whatsapp',
		description: 'The type of the chat',
	},
	{
		displayName: 'Text',
		name: 'text',
		type: 'string',
		displayOptions: { show: { resource: ['message'], operation: ['send'] } },
		default: '',
		description: 'Text of the message. Required if Content URI is empty.',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['message'], operation: ['send'] } },
		options: [
			{
				displayName: 'Content URI',
				name: 'contentUri',
				type: 'string',
				default: '',
				description: 'URI of the file to send. The message text will be used as a caption.',
			},
			{
				displayName: 'Quoted Message ID',
				name: 'quotedMessageId',
				type: 'string',
				default: '',
				description: 'The ID of the message to quote',
			},
		],
	},

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//                                  CONTACT
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['contact'] } },
		options: [
			{ name: 'Create or Update', value: 'createOrUpdate', action: 'Create or update a contact' },
			{ name: 'Get Many', value: 'getAll', action: 'Get many contacts' },
			{ name: 'Delete', value: 'delete', action: 'Delete contacts' },
		],
		default: 'createOrUpdate',
	},
	{
		displayName: 'Contact Data (JSON)',
		name: 'contactData',
		type: 'json',
		required: true,
		displayOptions: { show: { resource: ['contact'], operation: ['createOrUpdate'] } },
		default: '[]',
		description: 'JSON array with one or more contact objects to create or update',
	},
	{
		displayName: 'Contact IDs (JSON)',
		name: 'contactIds',
		type: 'json',
		required: true,
		displayOptions: { show: { resource: ['contact'], operation: ['delete'] } },
		default: '[]',
		description: 'JSON array of contact IDs to delete, e.g., ["id1", "id2"]',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { resource: ['contact'], operation: ['getAll'] } },
		options: [
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: { minValue: 1 },
				default: 50,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Offset',
				name: 'offset',
				type: 'number',
				typeOptions: { minValue: 0 },
				default: 0,
				description: 'Offset for pagination',
			},
		],
	},

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//                                  DEAL
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['deal'] } },
		options: [
			{ name: 'Create or Update', value: 'createOrUpdate', action: 'Create or update a deal' },
			{ name: 'Get Many', value: 'getAll', action: 'Get many deals' },
			{ name: 'Delete', value: 'delete', action: 'Delete deals' },
		],
		default: 'createOrUpdate',
	},
	{
		displayName: 'Deal Data (JSON)',
		name: 'dealData',
		type: 'json',
		required: true,
		displayOptions: { show: { resource: ['deal'], operation: ['createOrUpdate'] } },
		default: '[]',
		description: 'JSON array with one or more deal objects to create or update',
	},
	{
		displayName: 'Deal IDs (JSON)',
		name: 'dealIds',
		type: 'json',
		required: true,
		displayOptions: { show: { resource: ['deal'], operation: ['delete'] } },
		default: '[]',
		description: 'JSON array of deal IDs to delete, e.g., ["id1", "id2"]',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { resource: ['deal'], operation: ['getAll'] } },
		options: [
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: { minValue: 1 },
				default: 50,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Offset',
				name: 'offset',
				type: 'number',
				typeOptions: { minValue: 0 },
				default: 0,
				description: 'Offset for pagination',
			},
		],
	},

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	//                                  USER & CHANNEL
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['user', 'channel'] } },
		options: [{ name: 'Get Many', value: 'getAll', action: 'Get many items' }],
		default: 'getAll',
	},
];
