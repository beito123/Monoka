/*
	Jagajaga by bei2
*/

function jagajaga(): string {
	return "jagajaga";
}

function microtime(): number {
	return date2unix(new Date());
}

function unix2date(unix: number): Date {
	return new Date(unix * 1000);//microtime
}

function date2unix(date: Date): number {
	return Math.floor(date.getTime() / 1000);//microtime
}

function fetchGet(url: string): string {
	var res = UrlFetchApp.fetch(url, {
		muteHttpExceptions:true
	});

	var rescode = res.getResponseCode();

	if(rescode !== 200) {
		return null;
	}

	return res.getContentText();
}