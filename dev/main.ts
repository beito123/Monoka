/*
	Jagajaga by bei2
*/

const worlds: {[key: string]: string} = {
	"south": "http://123saba.fun/wiki/south",
};

function test() {
	//getData("south", 0, 0);
	Logger.log(collect("south"));
}

function collect(world: string): BaseResponse {
	var result = new CollectResponse();

	if(!worlds[world]) {
		result.setError("The world doesn't exist.");

		return result.getResponse();
	}

	var monoka = new Monoka(init());

	try {
		if(!monoka.collectWorldInfo(new HihumiParser(), world, worlds[world])) {
			result.setError("Cloudn't collect data.");
		}
	}catch(err) {
		var msg: string = "Couldn't collect data. Error: ";

		if(err instanceof Error) {
			msg += err.message;
		}

		result.setError(msg);

		throw err;//Debug
	}
	
	return result.getResponse();
}

function getData(world: string, every: number, count: number): BaseResponse {
	var result: WorldInfoResponse = new WorldInfoResponse();

	if(!worlds[world] && world === "all") {
		result.setError("The world doesn't exist.");

		return result.getResponse();
	}

	var monoka = new Monoka(init());

	try {
		var data: WorldInfo = {};
		if(world === "all") {
			data = monoka.getAllWorldDataEvery(every, count);
		} else {
			data = monoka.getWorldDataEvery(world, every, count);
		}

		result.setData(data);
	}catch(err) {
		var msg: string = "Couldn't collect data. Error: ";

		if(err instanceof Error) {
			msg += err.message;
		}

		result.setError(msg);

		//throw err;
	}
	
	return result.getResponse();
}

function init(): Provider {
	var provider: SQLProvider = new SQLProvider();

	var sp = PropertiesService.getScriptProperties();
	for(var world in worlds) {
		var id = sp.getProperty(world);
		if(id == null) {
			id = provider.createWorldData(world);

			sp.setProperty(world, id);
		}


		provider.getTableManager().addTable(world, id);
	}

	return provider;
}

class Monoka {

	private provider: Provider;

	public constructor(provider: Provider) {
		this.provider = provider;
	}

	public addInfo(world: string, info: Info): void {
		//
	}

	public collectWorldInfo(parser: Parser, world: string, url: string): boolean {
		var content = fetchGet(url);
		if(!content) {
			return false;
		}

		var info = parser.parse(content);
		if(!info) {
			return false;
		}

		Logger.log(info);

		return this.provider.addWorldData(world, info);
	}

	public getWorldDataEvery(world: string, every: number, count: number, time?: number): WorldInfo {
		var data: WorldInfo = null;

		data = {
			[world]: this.provider.getWorldDataEvery(world, every, count)
		};

		return data;
	}

	public getAllWorldDataEvery(every: number, count: number, time?: number): WorldInfo {
		if(!time) {
			time = this.provider.getLastTimeAll();
		}

		var data: WorldInfo = {};

		var tables: {[key: string]: string} = this.provider.getTableManager().getTables();
		for(var i: number = 0; i < time; i++) {
			time = time - (i > 0 ? every : 0);

			var c: number = 0;
			for(var world in tables) {
				if(!data[world]) {
					data[world] = [];
				}

				var info: Info = this.provider.getWorldData(world, time, true);

				if(info === null) {
					data[world].push(null);

					++c;
					continue;
				}

				data[world].push(info);
			}

			if(c === Object.keys(tables).length) {
				time = this.provider.getLastTimeAll(time);

				if(time <= 0) {
					break;
				}

				--i;
			}
		}

		return data;
	}
}

