/*
	Jagajaga by bei2
*/

const APICONST = MonokaConst.API;

class APIResponse {

	private status: number;
	private error: string;

	public constructor(status?: number, error?: string) {
		this.status = (status) ? status : APICONST.STATUS.SUCCESS;
		this.error = (error) ? error : null;
	}

	public getStatus(): number {
		return this.status;
	}

	public setStatus(stat: number): void {
		this.status = stat;
	}

	public getError(): string {
		return this.error;
	}

	public setError(err: string): void {
		this.setStatus(APICONST.STATUS.SUCCESS);

		this.error = err;
	}

	public getResponse(): BaseResponse {
		return {
			status: this.status,
			error: null
		}
	}
}

class CollectResponse extends APIResponse {
}

class WorldInfoResponse extends APIResponse {

	public data: WorldInfo;

	public getData(): WorldInfo {
		return this.data;
	}

	public setData(data: WorldInfo): void {
		this.data = data;
	}
}