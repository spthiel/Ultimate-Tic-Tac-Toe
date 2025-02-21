export default class Result<T, E extends Error> {
	
	static of<T, E extends Error>(error: E): Result<T, E>;
	static of<T, E extends Error>(value: T): Result<T, E>;
	static of<T, E extends Error>(value: T | E) {
		if (value instanceof Error) {
			return new Result<T, E>(undefined, value);
		} else {
			return new Result<T, E>(value, undefined)
		}
	}
	
	private constructor(
		private value: T,
		private error: E,
	) {}
	
	public hasError(): boolean {
		return this.error !== undefined;
	}
	
	public get() {
		if (this.hasError()) {
			throw new Error("Attempting to unwrap value on error result.")
		}
		
		return this.value;
	}
	
	public getError() {
		if (!this.hasError()) {
			throw new Error("Attempting to unwrap error on value result.")
		}
		
		return this.error;
	}
	
	public getOr(or: undefined): T;
	public getOr<V>(or: V): T | V;
	public getOr<V>(or: V): T | V {
		if (this.hasError()) {
			return or;
		}
		return this.get();
	}
	
	public switchOn(or: T, ...types: (typeof Error)[]): Result<T, E> {
		if (!this.hasError()) {
			return this;
		}
		
		const error = this.getError();
		
		for (const type of types) {
			if (error instanceof type) {
				return Result.of(or);
			}
		}
		
		return this;
	}
}