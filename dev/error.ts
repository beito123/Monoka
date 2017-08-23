/*
	Jagajaga by bei2
*/

//Thanks: http://qiita.com/kenju/items/b0554846a44d369cba7b
class ApplicationError implements Error {
	public name: string = "ApplicationError";
	public message: string;

	public constructor(message: string) {
		this.message = message;
	}

	public toString() {
		return this.name + ": " + this.message;
	}
}

