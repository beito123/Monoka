/*
	Jagajaga by bei2
*/

type BaseResponse = {
	status: number,
	error: string,
	result: Result
};

type Result = {//TODO: REWRITE FOR NEW METHOD....
	error?: string
};

interface CollectResult extends Result {
};

interface WorldInfoResult extends Result {
	data: any;
};

class APIResponse {

	private response: BaseResponse;

	public constructor(response?: BaseResponse) {
		if(!response) {
			response = {
				status: APICONST.STATUS.SUCCESS,
				error: null,
				result: {}
			};
		}

		this.response = response;
	}

	public getStatus(): number {
		return this.response.status;
	}

	public setStatus(stat: number): void {
		this.response.status = stat;
	}

	public hasError(): boolean {
		if("error" in this.response.result) {
			return this.response.result.error.length > 0;
		}

		return "error" in this.response && (this.response.error.length > 0);
	}

	public getError(): string {
		return this.response.error;
	}

	public setError(err: string): void {
		this.setStatus(APICONST.STATUS.ERROR);

		this.response.error = err;
	}

	public getResult(): Result {
		return this.response.result;
	}

	public setResult(result: Result): void{
		this.response.result = result;
	}

	public toJSON(): string {
		return JSON.stringify(this.response);
	}
}