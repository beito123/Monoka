var SQLProvider = function() {
	this.tableIds = {};
};

SQLProvider.prototype.addWorld = function(world, id) {
	this.tableIds[world] = id;
};

SQLProvider.prototype.getLastTime = function(world, off) {
	if(!(world in this.tableIds)) {
		return false;
	}

	var time = false;

	var table = this.tableIds[world];

	var sql = "SELECT MAXIMUM(addtime_hour) FROM " + table + ";";
	if(off) {
		sql = "SELECT MAXIMUM(addtime_hour) FROM " + table + " WHERE addtime_hour < " + off;
	}

	//var data = FusionTables.Query.sqlGet(sql);

	var data = this.getQuery(sql);

	if(data["0"] != null) {
		time = data["0"]["MAXIMUM(addtime_hour)"];
	}

	return time;
};

SQLProvider.prototype.getWorldData = function(world, time, correct) {
	if(!(world in this.tableIds)) {
		return false;
	}

	var info = false;

	var table = this.tableIds[world];

	var sql = null;
	if(correct) {
		sql = "SELECT * FROM " + table + " WHERE MAXIMUM(addtime_hour) = " + time + " LIMIT 1;";
	} else {
		sql = "SELECT * FROM " + table + " WHERE MAXIMUM(addtime_hour) <= " + time + " LIMIT 1;";
	}

	var data = this.getQuery(sql);
	if(data["0"] != null) {
		info = data["0"];
	}

	return info;
};

SQLProvider.prototype.addWorldData = function(world, data) {
	if(!(world in this.tableIds)) {
		return false;
	}

	var tableId = this.tableIds[world];

	var sql = "INSERT INTO " + tableId +
	"(asset, salary, people, per_assets, online_players, upd, addtime, addtime_hour, addtime_date)" +
	"VALUES(" + 
		data.asset + "," + 
		data.salary + "," + 
		data.people + "," + 
		data.per_assets + "," + 
		"'" + data.online_players + "'," + 
		data.upd + "," + 
		data.addtime + "," + 
		data.addtime_hour + "," + 
		"'" + data.addtime_date + "'"+ 
	");";

	FusionTables.Query.sql(sql);

	return true;
};

//Thanks: http://qiita.com/U11/items/91e7da3884f2592d70e3
SQLProvider.prototype.createWorldData = function(world) {
	var resource = {
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

  return FusionTables.Table.insert(resource).tableId;
};

SQLProvider.prototype.getQuery = function(sql) {
	var data = FusionTables.Query.sqlGet(sql);
	if(data["kind"] === "fusiontables#sqlresponse") {
		var result = [];

		var keys = data["columns"];
		var values = data["rows"];

		for (var i = 0; i < values.length; i++) {
			result[i] = {};
			for (var j = 0; j < values[i].length; j++) {
				var key = keys[j];
				var val = values[i][j];
				if(val === "NaN") {
					val = null;
				}

				result[i][key] = val;
			}
		}

		return result;
	}

	return data;
};

function test() {
	main();
}