/*
	Jagajaga by bei2
*/

type resQuery = {[key: string]: string}[];

class SQLProvider implements Provider {

	private tables: TableManager;
	
	public constructor(tables?: TableManager) {
		if(!tables) {
			tables = new TableManager();
		}

		this.tables = tables;
	}

	public getName(): string {
		return "SQLProvider";
	}

	public getTableManager(): TableManager {
		return this.tables;
	}

	public existsWorld(world: string): boolean {
		return this.tables.existsTable(world);
	}

	public getLastTime(world: string, off?: number): number {
		if(!this.tables.existsTable(world)) {
			return -1;
		}

		var time: number = -1;

		var table: string = this.tables.getTable(world);

		var sql: string = "SELECT MAXIMUM(addtime_hour) FROM " + table + ";";
		if(off) {
			sql = "SELECT MAXIMUM(addtime_hour) FROM " + table + " WHERE addtime_hour < " + off;
		}

		var data: resQuery = this.getQuery(sql);

		if(data[0] != null){
			time = Number(data[0]["MAXIMUM(addtime_hour)"]);
		}

		return time;
	}

	public getLastTimeAll(off?: number): number {
		var time = -1;

		var times: number[] = [];

		var tables: {[key: string]: string} = this.tables.getTables();
		for(var world in tables) {
			times.push(this.getLastTime(world, off));
		}

		//Thanks: http://qiita.com/PianoScoreJP/items/f0ff7345229871039672
		times.sort(function(a,b){
			if( a > b ) return -1;
			if( a < b ) return 1;
			return 0;
		});

		if(times[0] != null) {
			time = times[0];
		}

		return time;
	}

	public getWorldData(world: string, time: number, correct?: boolean): Info {
		if(!this.tables.existsTable(world)) {
			return null;
		}

		var info: Info = null;

		var table: string = this.tables.getTable(world);

		var sql: string = "SELECT * FROM " + table + " WHERE MAXIMUM(addtime_hour) <= " + time + " LIMIT 1;";
		if(correct) {
			sql = "SELECT * FROM " + table + " WHERE MAXIMUM(addtime_hour) = " + time + " LIMIT 1;";
		}

		var res: resQuery = this.getQuery(sql);
		if(res[0] != null) {
			var data: {[key: string]: any} = res[0];

			info = {
				asset: data.asset,
				salary: data.salary,
				people: data.people,
				perAssets: data.per_assets,
				onlinePlayers: data.online_players,
				upd: data.upd,
				addtime: data.addtime
			};
		}

		return info;
	}

	public getWorldDataEvery(world: string, every: number, count: number, time?: number, correct?: boolean): Info[] {
		if(!this.tables.existsTable(world)) {
			return null;
		}

		if(!time) {
			time = this.getLastTime(world);
		}

		var data: Info[] = [];
		for(var i: number = 0; i < count; i++) {
			time = time - (i > 0 ? every : 0);

			var info: Info = this.getWorldData(world, time, correct);
			if(info !== null) {
				data.push(info);
				time = Math.floor(info.addtime / 3600);
			} else {
				if(!correct) {
					var last: number = this.getLastTime(world, time);
					if(last === -1) {
						break;
					}

					time = last;
					--i;
				}
			}
		}

		return data.reverse();
	}

	public addWorldData(world: string, data: Info): boolean {
		if(!this.tables.existsTable(world)) {
			return false;
		}

		var table: string = this.tables.getTable(world);

		if(!data.addtime) {
			data.addtime = microtime();
		}

		var date = Utilities.formatDate(unix2date(data.addtime), "JST", "yyyy/MM/dd");

		var sql:string = "INSERT INTO " + table +
			"(asset, salary, people, per_assets, online_players, upd, addtime, addtime_hour, addtime_date)" +
			"VALUES(" + 
				data.asset + "," + 
				data.salary + "," + 
				data.people + "," + 
				data.perAssets + "," + 
				"'" + data.onlinePlayers + "'," + 
				data.upd + "," + 
				data.addtime + "," + 
				Math.floor(data.addtime / 3600) + "," + 
				"'" + date + "'"+ 
		");";

		this.query(sql);

		return true;
	}

	private query(sql: string): any {
		return FusionTables.Query.sql(sql);
	}

	private getQuery(sql: string): resQuery {
		var data: FusionTables.SQLGetResponse = FusionTables.Query.sqlGet(sql);
		var result: resQuery = [];

		var keys = data["columns"];
		var values = data["rows"];

		if(values != null) {
			for (var i: number = 0; i < values.length; i++) {
				result[i] = {};
				for (var j: number = 0; j < values[i].length; j++) {
					var key: string = keys[j];
					var val: any = values[i][j];
					if(val === "NaN") {
						val = null;
					}

					result[i][key] = val;
				}
			}
		}

		return result;
	}

	public createWorldData(world: string): string {
		var res: FusionTables.TableResource = {
			"name": world,
			"isExportable": true,
			"kind": "fusiontables#table",
			"columns": [
				{
					"name": "asset",
					"type": "NUMBER",
					"kind": "fusiontables#column",
					"validateData": true
				},
				{
					"name": "salary",
					"type": "NUMBER",
					"kind": "fusiontables#column",
					"validateData": true
				},
				{
					"name": "people",
					"type": "NUMBER",
					"kind": "fusiontables#column",
					"validateData": true
				},
				{
					"name": "per_assets",
					"type": "NUMBER",
					"kind": "fusiontables#column",
					"validateData": true
				},
				{
					"name": "online_players",
					"type": "STRING",
					"kind": "fusiontables#column",
					"validateData": true
				},
				{
					"name": "upd",
					"type": "NUMBER",
					"kind": "fusiontables#column",
					"validateData": true
				},
				{
					"name": "addtime",
					"type": "NUMBER",
					"kind": "fusiontables#column",
					"validateData": true
				},
				{
					"name": "addtime_hour",
					"type": "NUMBER",
					"kind": "fusiontables#column",
					"validateData": true
				},
				{
					"name": "addtime_date",
					"type": "STRING",
					"kind": "fusiontables#column",
					"validateData": true
				}
			],
		};

		var id: string = FusionTables.Table.insert(res).tableId;

		this.tables.addTable(world, id);

		return id;
	}
}