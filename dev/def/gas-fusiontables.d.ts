/*
	Jagajaga by bei2
*/

declare module FusionTables {
	
	export var Column: {

		//Implements...
    }

    export var Query: {
        sql(sql: string, hdrs?: boolean, typed?: boolean): any;
        sqlGet(sql: string, hdrs?: boolean, typed?: boolean): SQLGetResponse;
    };

	export var Style: {
		//Implements...
	}

	export var Table: {
		insert(res: TableResource): TableResource;
		insert(columns: {[key: string]: any;}, isExportable?: boolean, name?: string): TableResource;

		//Implements...
	}

	export var Task: {
		//Implements...
	}

	export var Template: {
		//Implements...
	}

	export type ColumnsResource = {

	};

	export type TableResource = {
		 attribution?: string,
		 attributionLink?: string,
		 baseTableIds?: string[],
		 columnPropertiesJsonSchema?: string,
		 columns?: ColumnsResource,
		 description?: string,
		 isExportable?: boolean,
		 kind?: string,
		 name?: string,
		 sql?: string,
		 tableId?: string,
		 tablePropertiesJson?: string,
		 tablePropertiesJsonSchema?: string
	}

	export type SQLGetResponse = {
		kind: string,
		columns: string[],
		rows: [
			number | string | {
				geometry: {
					type: string,
					coordinates: number[]
				}
				type: string,
				geometries: [{
					type: string,
					coordinates: number[] | number[][]
				}]
			}
		][]
	}
}
