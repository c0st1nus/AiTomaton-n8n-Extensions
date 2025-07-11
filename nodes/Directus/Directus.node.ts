import {
    IExecuteFunctions,
    INodeType,
    INodeTypeDescription,
    INodeExecutionData,
		NodeOperationError,
} from 'n8n-workflow';
import { directusNodeOperations } from './directus.desctiption';
import { URLSearchParams } from 'url';
import axios from 'axios';
import FormData from 'form-data';

export class Directus implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Directus API Node',
        name: 'directus',
        icon: 'file:directus.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"]}}',
        description: 'A node for interacting with the Directus API',
        defaults: { name: 'Directus API Node' },
        inputs: ['main'],
        outputs: ['main'],
				usableAsTool: true,
        credentials: [
            {
                name: 'directusAuthApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                options: [
									{ name: 'Create', value: 'create', action: 'Create a record' },
									{ name: 'Delete', value: 'delete', action: 'Delete a record' },
									{ name: 'Find Many', value: 'findMany', action: 'Find many records' },
									{ name: 'Find One', value: 'findOne', action: 'Find one record' },
									{ name: 'Update', value: 'update', action: 'Update a record' },
									{ name: 'Upload', value: 'upload', action: 'Upload a file' },
                ],
                default: 'findMany',
            },
            ...directusNodeOperations,
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        for (let i = 0; i < items.length; i++) {
            try {
                const operation = this.getNodeParameter('operation', i) as string;
                const credentials = await this.getCredentials('directusAuthApi');
                const baseUrl = (credentials.url as string).replace(/\/$/, '');

                if (operation === 'upload') {
									const requestUrl = `${baseUrl}/files`;

									const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
									const fileName = this.getNodeParameter('fileName', i) as string;
									// Получаем опциональные поля
									const folder = this.getNodeParameter('folder', i, '') as string;
									const title = this.getNodeParameter('title', i, '') as string;
									const description = this.getNodeParameter('description', i, '') as string;

									const binaryProperty = items[i].binary?.[binaryPropertyName];
									if (!binaryProperty) {
										throw new NodeOperationError(this.getNode(), `No binary data found on item ${i} in property "${binaryPropertyName}"`);
									}

									const binaryBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
									const finalFileName = fileName || binaryProperty.fileName;

									const form = new FormData();
									// Добавляем файл
									form.append('file', binaryBuffer, {
										filename: finalFileName,
										contentType: binaryProperty.mimeType,
									});

									// --- ИЗМЕНЕНИЕ: Добавляем опциональные поля в форму, если они указаны ---
									if (title) form.append('title', title);
									if (folder) form.append('folder', folder);
									if (description) form.append('description', description);

									const headers = {
										...form.getHeaders(),
										'Authorization': `Bearer ${credentials.token}`,
									};

									const response = await axios.post(requestUrl, form, { headers });
									returnData.push({ json: response.data, pairedItem: { item: i } });

								} else {
									// --- ЛОГИКА ДЛЯ ДРУГИХ ОПЕРАЦИЙ ---
									let requestMethod: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET';
									let requestUrl = '';
									let body: any = {};
									const collection = this.getNodeParameter('collection', i) as string;
									requestUrl = `${baseUrl}/items/${collection}`;
									
									// Инициализируем URLSearchParams
									const params = new URLSearchParams();

									// --- ИЗМЕНЕНИЯ ЗДЕСЬ ---
									if (operation === 'findMany') {
											const filterJson = this.getNodeParameter('filter', i, '{}') as string;
											if (filterJson && filterJson.trim() !== '{}') {
													// Directus ожидает фильтр как строковый параметр 'filter'
													params.append('filter', filterJson);
											}

											const fields = this.getNodeParameter('fields', i, '') as string;
											if (fields) {
													params.append('fields', fields);
											}
									}
									// --- КОНЕЦ ИЗМЕНЕНИЙ ---

									if (operation === 'findOne' || operation === 'update' || operation === 'delete') {
											const recordId = this.getNodeParameter('recordId', i) as string;
											requestUrl += `/${recordId}`;
									}
									if (operation === 'create' || operation === 'update') {
											const data = this.getNodeParameter('data', i, '{}') as string;
											body = JSON.parse(data);
									}
									switch (operation) {
											case 'findMany': case 'findOne': requestMethod = 'GET'; break;
											case 'create': requestMethod = 'POST'; break;
											case 'update': requestMethod = 'PATCH'; break;
											case 'delete': requestMethod = 'DELETE'; break;
											default: throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not supported.`);
									}

									const queryString = params.toString();
									if (queryString) {
											requestUrl += `?${queryString}`;
									}

									const options = { 
											method: requestMethod, 
											url: requestUrl, 
											body, 
											json: true 
									};

									const response = await this.helpers.httpRequestWithAuthentication.call(this, 'directusAuthApi', options);
									returnData.push({ json: response.data ? response.data : response, pairedItem: { item: i } });
							}
            } catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
                    continue;
                }
								if (axios.isAxiosError(error)) {
									throw new NodeOperationError(this.getNode(), JSON.stringify(error.response?.data, null, 2), { itemIndex: i });
								}
                throw error;
            }
        }
        return [this.helpers.returnJsonArray(returnData)];
    }
}
