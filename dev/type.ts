/*
	Jagajaga by bei2
*/

type Info = {
	asset: number,
	salary: number,
	people: number,
	perAssets: number,
	onlinePlayers: string,
	upd: number,
	addtime?: number
};

type WorldInfo = {
	[key: string]: Info[]
};

type BaseResponse = {
	status: number,
	error: string
};