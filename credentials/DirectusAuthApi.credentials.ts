import { Icon, ICredentialType, INodeProperties } from 'n8n-workflow';

export class DirectusAuthApi implements ICredentialType {
    name = 'directusAuthApi';
    displayName = 'Directus Static Token API';
		documentationUrl = 'https://directus.io/docs/api/authentication';
		icon = 'file:directus.svg' as Icon;
    properties: INodeProperties[] = [
        {
            displayName: 'Directus URL',
            name: 'url',
            type: 'string',
            default: '',
            description: 'Базовый URL вашего Directus, например, https://tracker.aitomaton.online',
        },
        {
            displayName: 'Static Token',
            name: 'token',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
        },
    ];

    authenticate = {
        type: 'generic' as const,
        properties: {
            headers: {
                // Это свойство будет добавлять заголовок в HTTP Request нодах
                'Authorization': '=Bearer {{$credentials.token}}',
            },
        },
    };

    // Блок для проверки учетных данных при сохранении
    test = {
        request: {
            // 1. Улучшенная сборка URL: удаляем слэш в конце, если он есть
            url: '={{$credentials.url.replace(/\\/$/, "") + "/users/me"}}',
            method: 'GET' as const,
            headers: {
                // 2. Добавляем заголовки, которые обычно шлет Postman
                'User-Agent': 'n8n',
                'Accept': 'application/json, text/plain, */*',

                // Главный заголовок авторизации
                'Authorization': '=Bearer {{$credentials.token}}',
            },
            // 3. Указываем, что тело запроса отсутствует
            body: undefined,
        },
    };
}
