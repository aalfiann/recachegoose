import { Document, Mongoose } from 'mongoose';

declare module 'recachegoose' {

	function cachegoose(mongoose: Mongoose, cacheOptions: cachegoose.Types.IOptions): void;

	namespace cachegoose {
		namespace Types {
			interface IOptions {
				engine?: string
				count?: number
				port?: number
				host?: string
				password?: string,
				client?: any,
			}
		}

		function clearCache(customKey: any, cb: any): void;
	}

	export = cachegoose;
}

declare module 'mongoose' {
  interface Query<ResultType, DocType, THelpers, RawDocType> {
    cache(ttl?: number, customKey?: string): this;
  }
  interface Aggregate<ResultType> {
    cache(ttl?: number, customKey?: string): this;
  }
}
