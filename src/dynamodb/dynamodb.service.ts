// // import { SessionData } from "src/modules/sessions/dynamodb/dynamo-session.entity";
// import { DynamoDB, Credentials } from "aws-sdk";
// import { Entity, Table } from "dynamodb-onetable";
// import { Dynamo } from "dynamodb-onetable/Dynamo";
// import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// import { v4 } from "uuid";
// import { Schema, SessionDataObjectEntityType, getConnection } from "./dynamodb-setup";
// import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";

// @Injectable()
// export class DynamoDBService implements OnModuleInit {
// 	private table: Table;
// 	private client: Dynamo;
// 	private dynamoDB: DynamoDB;

// 	constructor() {
// 		// const config = configService.getConfig();
// 		const { client, table} = getConnection();
// 		this.table = table;
// 		this.client = client;
// 	}

// 	getConnection() {
// 		return this.client;
// 	}
// 	getTest(){

// 		return new Date();
// 	}

// 	async insertTest(){
		
// 	const SessionModel = this.table.getModel<SessionDataObjectEntityType>("SessionDataObject");

	
	
// 		return await SessionModel.create({
// 			gameId: Date.now().toString(),
// 			socketId: Date.now().toFixed(2),
// 			userId: "asdasda"
// 		});
	

// 	return {};

// 	}

// 	async onModuleInit(): Promise<void> {
// 		const tableExists = await this.table.exists();
// 		console.log(tableExists,111)
// 		if (tableExists) {
// 			await this.table.describeTable();
// 		} else {
// 			await this.table.createTable();
// 		}
// 	}
// }








// // async getSessionDataWithSessionToken(
// // 	sessionToken: string,
// // ): Promise<SessionEntity> {
// // 	const SessionModel = this.table.getModel<SessionEntityType>("Session");
// // 	const SessionDataModel = this.table.getModel<SessionDataObjectEntityType>(
// // 		"SessionDataObject",
// // 	);

// // 	const session = await SessionModel.get(
// // 		{
// // 			sessionId: sessionToken,
// // 		},
// // 		{
// // 			index: "gs1",
// // 		},
// // 	);

// // 	if (!session) {
// // 		return null;
// // 	}

// // 	const sessionData = await SessionDataModel.get(
// // 		{
// // 			gameId: session.gameId,
// // 		},
// // 		{
// // 			index: "gs1",
// // 		},
// // 	);

// // 	if (!sessionData) {
// // 		return null;
// // 	}

// // 	return sessionData as SessionEntity;
// // }

// // async getSessionDataWithSocketId(gameId: string): Promise<SessionEntity> {
// // 	const SessionDataModel = this.table.getModel<SessionDataObjectEntityType>(
// // 		"SessionDataObject",
// // 	);

// // 	const sessionData = await SessionDataModel.get(
// // 		{
// // 			gameId: gameId,
// // 		},
// // 		{
// // 			index: "gs1",
// // 		},
// // 	);

// // 	if (!sessionData) {
// // 		return null;
// // 	}

// // 	return sessionData as SessionEntity;
// // }

// // async saveSessionToken(
// // 	sessionToken: string,
// // 	gameId: string,
// // 	sessionSpecificData: any,
// // ) {
// // 	const SessionModel = this.table.getModel<SessionEntityType>("Session");
// // 	const sessionData = await SessionModel.get(
// // 		{
// // 			sessionId: sessionToken,
// // 			gameId: gameId,
// // 		},
// // 		{
// // 			index: "gs1",
// // 		},
// // 	);

// // 	if (!sessionData) {
// // 		return await SessionModel.create({
// // 			sessionId: sessionToken,
// // 			gameId: gameId,
// // 			sessionSpecificData: sessionSpecificData,
// // 		});
// // 	}

// // 	return sessionData;
// // }

// // async saveSessionDataObject(
// // 	gameId: string,
// // 	sessionData: Session,
// // ): Promise<SessionEntity> {
// // 	const SessionDataObjectModel = this.table.getModel<
// // 		SessionDataObjectEntityType
// // 	>("SessionDataObject");

// // 	const sessionDataObject = await SessionDataObjectModel.get(
// // 		{
// // 			gameId: gameId,
// // 		},
// // 		{
// // 			index: "gs1",
// // 		},
// // 	);


// // 	if (sessionDataObject) {
// // 		const updatedSession = (await SessionDataObjectModel.update({
// // 			gameId: gameId,
// // 			sessionData: JSON.parse(JSON.stringify(sessionData)),
// // 		})) as SessionEntity;
// // 		return updatedSession;
// // 	} else {
// // 		return (await SessionDataObjectModel.create({
// // 			gameId: gameId,
// // 			sessionData: JSON.parse(JSON.stringify(sessionData)),
// // 		})) as SessionEntity;
// // 	}
// // }

// // async removeSession(sessionToken: string): Promise<void> {
// // 	const SessionModel = this.table.getModel<SessionEntityType>("Session");
// // 	await SessionModel.remove(
// // 		{
// // 			sessionId: sessionToken,
// // 		},
// // 		{
// // 			index: "gs1",
// // 		},
// // 	);
// // }

// // async removeSessionData(gameId: string): Promise<void> {
// // 	const SessionModel = this.table.getModel<SessionEntityType>("Session");
// // 	const SessionDataObjectModel = this.table.getModel<
// // 		SessionDataObjectEntityType
// // 	>("SessionDataObject");

// // 	await SessionModel.remove(
// // 		{
// // 			gameId: gameId,
// // 		},
// // 		{
// // 			index: "gs1",
// // 			many: true,
// // 		},
// // 	);

// // 	await SessionDataObjectModel.remove(
// // 		{
// // 			gameId: gameId,
// // 		},
// // 		{
// // 			index: "gs1",
// // 			many: true,
// // 		},
// // 	);
// // }