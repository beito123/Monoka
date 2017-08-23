/*
	Jagajaga by bei2
*/

//TableManager is simple table id manager for gas.
class TableManager {//Simple

	private tables: {[key: string]: string;} = {};

	public constructor() {
		//
	}

	public getTables(): {[key: string]: string} {
		return this.tables;
	}

	public getTable(name: string): string {
		if(this.existsTable(name)) {
			return this.tables[name];
		}

		return null;
	}

	public existsTable(name: string): boolean {
		return name in this.tables;
	}

	public addTable(name: string, id: string) {
		this.tables[name] = id;
	}

	public removeTable(name: string) {
		if(this.existsTable(name)) {
			delete this.tables[name];
		}
	}

	public removeTableByID(id: string) {
		var keys: string[] = this.getKeyById(id);
		for(var key in keys) {
			delete this.tables[key];
		}

		return Object.keys(keys).length;
	}

	private getKeyById(id: string): string[] {
		var keys: string[] = [];

		for(var key in this.tables) {
			if(key === id) {
				keys.push(key);
			}
		}

		return keys;
	}
}