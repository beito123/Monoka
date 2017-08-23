/*
	Jagajaga by bei2
*/

interface Provider {

	getName(): string;

	getTableManager(): TableManager;

	existsWorld(world: string): boolean;

	//Returns the latest added time(hour-time) in database.
	//If the database doesn't have  the time, returns -1.
	getLastTime(world: string, off?: number): number;

	getLastTimeAll(off?: number): number;

	//
	getWorldData(world: string, time: number, correct?: boolean): Info;

	getWorldDataEvery(world: string, every: number, count: number): Info[];
	//
	addWorldData(world: string, data: Info): boolean;
}