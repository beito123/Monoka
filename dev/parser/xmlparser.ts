/*
	Jagajaga by bei2
*/

/*
class XMLParser implements Parser {

	public parse(context: string): Info {
		return null;
	}

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
}*/