/*
	Jagajaga by bei2
*/

//IF YOU USE MONOKA, PLEASE REMOVE THE UNDER COMMENT OUT (//).
//const TAKEN = "";//your taken

const worlds: {[key: string]: string} = {
	"north": "http://123saba.fun/wiki/north",
	"east": "http://123saba.fun/wiki/east",
	"west": "http://123saba.fun/wiki/west",
	"south": "http://123saba.fun/wiki/south",
};

function doGet(e: any) {
	//HtmlService.createHtmlOutput(e.parameter.taken);

	var response: APIResponse = new APIResponse();

	var output = function(response: APIResponse){
		return HtmlService.createHtmlOutput(response.toJSON());
	};

	var args: {[key: string]: string} = e.parameter;

	if(!("taken" in args)) {
		response.setError("Taken wasn't set in parameters.");

		return output(response);
	}

	if(args.taken !== TAKEN) {
		response.setError("The taken didn't match.");

		return output(response);
	}

	if(!("type" in args)) {
		response.setError("Type wasn't set in parameters.");

		return output(response);
	}

	var type: string = args.type.toLowerCase();

	var result: Result = {};
	switch (type) {
		case "collect":
			if(!("world" in args)) {
				result.error = "World wasn't set in parameters.";
			}

			result = collect(args.world);
			break;
		case "getdata":
			if(!("world" in args)) {
				result.error = "World wasn't set in parameters.";
			}

			if(!("every" in args)) {
				result.error = "Every wasn't set in parameters.";
			}

			if(!("count" in args)) {
				result.error = "Count wasn't set in parameters.";
			}

			result = getData(args.world, Number(args.every), Number(args.count));
			break;
		default:
			response.setError("The type doesn't exist.");

			return output(response);
	}

	if(result.error != null && result.error.length > 0) {
		response.setError("Happened a error for " + args.type + ". Error: " + result.error);

		return output(response);
	}

	response.setResult(result);

	return output(response);
}

function collect(world: string): CollectResult {
	var result: CollectResult = {};

	if(!worlds[world]) {
		result.error = "The world doesn't exist.";

		return result;
	}

	var monoka = new Monoka(init());

	try {
		if(!monoka.collectWorldInfo(new HihumiParser(), world, worlds[world])) {
			result.error = "Cloudn't collect data.";
		}
	}catch(err) {
		var msg: string = "Couldn't collect data. Error: ";

		if(err instanceof Error) {
			msg += err.message;
		}

		result.error = msg;

		throw err;//Debug
	}
	
	return result;
}

function getData(world: string, every: number, count: number): WorldInfoResult {
	var result: WorldInfoResult = {
		data: null
	};

	if(!worlds[world] && world !== "all") {
		result.error = "The world doesn't exist.";

		return result;
	}

	var monoka = new Monoka(init());

	try {
		var data: WorldInfo;
		if(world === "all") {
			data = monoka.getAllWorldDataEvery(every, count);
		} else {
			data = monoka.getWorldDataEvery(world, every, count);
		}

		result.data = data;
	}catch(err) {
		var msg: string = "Couldn't collect data. Error: ";

		if(err instanceof Error) {
			msg += err.message;
		}

		result.error = msg;

		//throw err;
	}
	
	return result;
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

