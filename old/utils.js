function jagajaga() {
	return "jagajaga";
}

function fetchGet(url) {//Simple
	var res = UrlFetchApp.fetch(url, {
		muteHttpExceptions:true
	});

	var rescode = res.getResponseCode();

	if(rescode != 200) {
		return false;
	}

	return res.getContentText();
}