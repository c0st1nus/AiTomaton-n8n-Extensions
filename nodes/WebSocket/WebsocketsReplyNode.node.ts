import {
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	IExecuteFunctions,
	INodeExecutionData
} from 'n8n-workflow';
// @ts-ignore
import WebSocket from 'ws';

export class WebsocketsReplyNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Websockets Send Node',
		name: 'websocketsReplyNode',
		group: ['transform'],
		version: 1,
		description: 'Websockets Send',
		icon: 'file:websocket.svg',
		defaults: {
			name: 'Websockets Send Node',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Send Content',
				name: 'content',
				type: 'string',
				default: '',
				required: true,
			},
			{
				displayName: 'Websocket Resource Field (Parameter Name)',
				name: 'websocketResource',
				type: 'string',
				required: true,
				default: 'ws',
				description: 'WS resource field name given by trigger node',
			},
		],
	};

	// @ts-ignore
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const connectedNodes = this.getParentNodes("WebsocketsNode");
		if (!connectedNodes){
			throw new NodeOperationError(
				this.getNode(),
				new Error('No Websocket node found in the workflow'),
				{
					description:
						'Insert a Websocket node to your workflow and set the “Respond” parameter to “Using Respond to Websocket Node” ',
				},
			);
		}

		const items = this.getInputData();

		let websocketResource = this.getNodeParameter('websocketResource', 0) as string;
		let ws: WebSocket = items[0].json[websocketResource]
		if (!ws){
			throw new NodeOperationError(
				this.getNode(),
				`Execution error: No websocket resource received`,
			);
		}

		const content = this.getNodeParameter('content', 0) as string;

		ws.send(content)

		return [[]]
	}
}
