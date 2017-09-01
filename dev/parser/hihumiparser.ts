/*
	Jagajaga by bei2
*/

class HihumiParser implements Parser {

	public parse(context: string): Info {
		var data: Info = null;

		var base = Xml.parse(context, true);

		var bodyHtml = base.html.body.toXmlString();

		var doc = XmlService.parse(bodyHtml);
		var root = doc.getRootElement();

		var node = this.getElementById(root, "info");
		if(node !== null) {
			var items = node.getChild("tbody").getChildren("tr")[3].getChildren();

			var now = new Date();

			var bupd = items[4].getValue().split("/");

			var upd = new Date(now.getFullYear(), Number(bupd[0]), Number(bupd[1] ? bupd[1]: 0));
			
			data = {
				asset: this.getNumber(items[0].getValue()),
				people: this.getNumber(items[1].getValue()),
				salary: this.getNumber(items[2].getValue()),
				perAssets: this.getNumber(items[3].getValue()),
				upd: date2unix(upd),
				onlinePlayers: ""
			};

			var players: string = "";

			var tr = this.getElementById(root, "players").getChild("tbody").getChildren("tr");
			for (var i = 0; i < tr.length; i++) {
				if((i % 2) === 0) {
					continue;
				}

				var td = tr[i].getChildren("td");//note//0:nodata/1:name/2:is_admin/3:online_info or nodata/4:login_time/5:last_time
				
				var isOnline = td[3].getValue();
				if(isOnline.length <= 0) {//offline
					break;
				}

				/*data["online_players"].push({
					"name": td[1].getValue()
				});*/

				var name: string = td[1].getValue();

				players += name + "/";
			}

			if(players.length > 0) {
				data.onlinePlayers = players.slice(0, -1);//Remove "/"
			}
		}

		return data;
	}

	public getNumber(str: string): number {
		var matches = str.match(/\d+/g);

		if(!matches) {
			return 0;
		}

		Logger.log(matches);

		var n: string = "";
		for(var i: number = 0; i < matches.length; i++) {
			n += matches[i];
		}

		return Number(n);
	}

	//

	public getElementById(element: GoogleAppsScript.XML_Service.Element, idToFind: string): GoogleAppsScript.XML_Service.Element {
		var descendants = element.getDescendants();
		for(var i in descendants) {
			var elem = descendants[i].asElement();
			if(elem != null) {
				var id = elem.getAttribute('id');
				if(id != null && id.getValue() == idToFind) {
					return elem;
				}
			}
		}

		return null;
	}

	public getElementsByClassName(element: GoogleAppsScript.XML_Service.Element, classToFind: string):　GoogleAppsScript.XML_Service.Element[] {
		var data = []
		var descendants: any[] = element.getDescendants();

		descendants.push(element);
		for(var i in descendants) {
			var elem = descendants[i].asElement();
			if(elem != null) {
				var classes = elem.getAttribute('class');
				if(classes != null) {
					classes = classes.getValue();
					if(classes == classToFind) {
						data.push(elem);
					}else{
						classes = classes.split(' ');
						for(var j in classes) {
							if (classes[j] == classToFind) {
								data.push(elem);
								break;
							}
						}
					}
				}
			}
		}

		return data;
	}

	public getElementsByTagName(element: GoogleAppsScript.XML_Service.Element, tagName: string): GoogleAppsScript.XML_Service.Element[] {
		var data = []
		var descendants: GoogleAppsScript.XML_Service.Content[] = element.getDescendants();
		for(var i in descendants) {
			var elem = descendants[i].asElement();
			if(elem != null && elem.getName() == tagName) {
				data.push(elem);
			}
		}

		return data;
	}
}