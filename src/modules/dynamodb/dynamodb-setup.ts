import { Credentials } from "aws-sdk";
import { Entity, Table, OneSchema } from "dynamodb-onetable";
import { Dynamo } from "dynamodb-onetable/Dynamo";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";


// this messes up the type intelisence
// export const Schema : OneSchema = {
export const Schema = {
	version: "0.0.1",
	indexes: {
		primary: { hash: "pk", sort: "sk" },
		gs1: { hash: "gs1pk", sort: "gs1sk", follow: true },
	},

	models: {
		SessionDataObject: {
			pk: { type: String, value: "${_type}_${gameId}" },
			sk: { type: String, value: "${_type}_" },
			gameId: { type: String, unique: true, required: true  },
			userId: { type: String, required: true },
			socketId: { type: String, unique: true, required: true },
			gs1pk: { type: String, value: "${_type}_socketId" },
			gs1sk: { type: String, value: "${_type}_${userId}" },
		},
	} as const,
} ;

export type SessionDataObjectEntityType = Entity<
	typeof Schema.models.SessionDataObject
>;

export const getConnection : () => {
	client: Dynamo,
	table: Table
} = () => {
	const client = new Dynamo({
		client: new DynamoDBClient({
			region: 'local',
			endpoint: 'http://localhost:8000',
			credentials: new Credentials("local", "local", "local")
					
		}),
	});

	const table = new Table({
		client: client,
		name: 'test_dynamo',
		schema: Schema,
		logger: true,
	});

	return {
		client,
		table
	}
}