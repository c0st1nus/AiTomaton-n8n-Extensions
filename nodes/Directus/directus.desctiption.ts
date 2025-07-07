import { INodeProperties } from 'n8n-workflow';

export const directusNodeOperations: INodeProperties[] = [
	// Поле для выбора коллекции
	{
		displayName: 'Collection',
		name: 'collection',
		type: 'string',
		required: true,
		noDataExpression: true,
		displayOptions: {
			show: {
				operation: ['create', 'delete', 'findMany', 'findOne', 'update'],
			},
		},
		default: '',
		description: 'The collection to perform the operation on',
	},

	// --- ПОЛЯ ДЛЯ ОПЕРАЦИИ ЗАГРУЗКИ ---
	{
		displayName: 'Binary Property Name',
		name: 'binaryPropertyName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				operation: ['upload'],
			},
		},
		default: 'data',
		description: 'Name of the binary property which contains the file data to upload',
	},
	{
		displayName: 'File Name',
		name: 'fileName',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['upload'],
			},
		},
		default: '',
		placeholder: 'audio.mp3',
		description: 'The name to give the uploaded file. If empty, the original filename will be used.',
	},
	// Возвращаем поля в интерфейс для операции Upload
	{
		displayName: 'Folder ID or UUID',
		name: 'folder',
		type: 'string',
		displayOptions: { show: { operation: ['upload'] } },
		description: 'The UUID of the folder to upload the file to.',
		default: undefined
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		displayOptions: { show: { operation: ['upload'] } },
		description: 'The title for the file.',
		default: undefined
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		displayOptions: { show: { operation: ['upload'] } },
		description: 'The description for the file.',
		default: undefined
	},


	// --- Существующие поля для других операций ---
	{
		displayName: 'Fields',
		name: 'fields',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['findMany'],
			},
		},
		default: '',
		placeholder: 'ID,status,title,*,user_created.*',
		description: 'A comma-separated list of fields to return. Supports wildcard (*).',
	},
	{
		displayName: 'Filter',
		name: 'filter',
		type: 'json',
		typeOptions: {
			alwaysShowTools: true,
		},
		displayOptions: {
			show: {
				operation: ['findMany'],
			},
		},
		default: '{}',
		placeholder:
			'{\n  "status": {\n    "_eq": "published"\n  },\n  "date_created": {\n    "_gte": "$NOW(-1 year)"\n  }\n}',
		description: 'Directus filter rules object. See Directus docs for more details.',
	},
	{
		displayName: 'Record ID',
		name: 'recordId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				operation: ['findOne', 'update', 'delete'],
			},
		},
		default: '',
		description: 'The ID of the record',
	},
	{
		displayName: 'Data (JSON)',
		name: 'data',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				operation: ['create', 'update'],
			},
		},
		default: '{}',
		description: 'The data to create or update a record with',
	},
];