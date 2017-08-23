function getInfo() {
	var result = {
		"status": 0,
		"error": ""
	};
}

function collect(world) {
	var result = {
		"status": 0,
		"error": ""
	};
}

var Monoka = function() {
	this.provider = null;
	this.worlds = {
		"south": "http://123saba.fun/wiki/south",
	};

	init();
};

Monoka.prototype.init = function() {
	if(this.provider === null) {
		return false;
	}

	this.provider = new SQLProvider();

	var sp = PropertiesService.getScriptProperties();
	for(var world in this.worlds) {
		var id = sp.getProperty(world);
		if(id == null) {
			id = provider.createWorldData(world);

			sp.setProperty(world, id);
		}


		this.provider.addWorld(world, id);
	}

	return true;
};

Monoka.prototype.getData = function(world, every, count){
	if(!this.worlds[world]) {
		return false;
	}

	var url = this.worlds[world];

	var context = fetchGet(url);
	if(context !== false) {
		return false;
	}

	return parse(context);
};

Monoka.prototype.collect = function(world){
	if(!this.worlds[world]) {
		return false;
	}

	var url = this.worlds[world];

	var context = fetchGet(url);
	if(context !== false) {
		return false;
	}
};

/* old code
function main() {
	var worlds = [
		"south"
	];

	var provider = new SQLProvider();

	var sp = PropertiesService.getScriptProperties();
	for (var i = 0; i < worlds.length; ++i) {
		var w = worlds[i];

		var id = sp.getProperty(w);
		if(id == null) {
			id = provider.createWorldData(w);

			sp.setProperty(w, id);
		}


		provider.addWorld(w, id);
	}


    var time = String(Math.floor(new Date().getTime() / 1000));

	var data = {
		asset: 100,
		salary: 100,
		people: 100,
		per_assets: 100,
		online_players: "beito123/jagajaga",
		upd: time,
		addtime: time,
		addtime_hour: Math.floor(time / 3600),
		addtime_date: "jaga",
	};

	//provider.addWorldData("south", data);

	provider.getLastTime("south");
	//provider.getWorldData("south", provider.getLastTime("south"));
}

function test2() {
	var url = "http://123saba.fun/wiki/south";
	var text = request(url);
	Logger.log("test:" + JSON.stringify(parse(text)));
}
*/