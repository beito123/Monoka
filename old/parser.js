function parse(context) {
	var data = {};

	var doc = Xml.parse(context, true);

	var bodyHtml = doc.html.body.toXmlString();

	doc = XmlService.parse(bodyHtml);
	var root = doc.getRootElement();


	var node = getElementById(root, "info");
	if(node !== false) {
		var items = node.getChild("tbody").getChildren("tr")[3].getChildren();
		
		data["asset"] = items[0].getValue();
		data["people"] = items[1].getValue();
		data = {
			"asset": items[0].getValue(),
			"people": items[1].getValue(),
			"salary": items[2].getValue(),
			"per_assets": items[3].getValue(),
			"upd": items[4].getValue()
		};

		data["online_players"] = [];
		var tr = getElementById(root, "players").getChild("tbody").getChildren("tr");
		for (var i = 0; i < tr.length; i++) {
			if((i % 2) === 0) {
				continue;
			}

			var td = tr[i].getChildren("td");//note//0:nodata/1:name/2:is_admin/3:online_info or nodata/4:login_time/5:last_time
			
			var isOnline = td[3].getValue();
			if(isOnline.length <= 0) {//offline
				break;
			}

			data["online_players"].push({
				"name": td[1].getValue()
			});
		}
	}

	return data;
}

//Thanks: http://yoshiyuki-hirano.hatenablog.jp/entry/2015/10/01/231813
//https://sites.google.com/site/scriptsexamples/learn-by-example/parsing-html

function getElementById(element, idToFind) {
  var descendants = element.getDescendants();
  for (var i in descendants) {
    var elem = descendants[i].asElement();
    if ( elem != null) {
      var id = elem.getAttribute('id');
      if ( id != null && id.getValue() == idToFind) return elem;
    }
  }

  return false;
}