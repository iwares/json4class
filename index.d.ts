import 'reflect-metadata';
export declare type Class<T = any> = {
    new (): T;
};
export declare type Stringifier = (v: any) => string;
export declare type Parser = (s: string) => any;
export declare function json4class(constructor: Class): PropertyDecorator;
export declare namespace json4class {
    var version: string;
    var normalize: (object: any) => any;
    var stringify: (object: any, space?: string | number | undefined) => string;
    var specialize: <T>(object: any, constructor: new () => T) => T;
    var parse: <T>(json: string, constructor?: (new () => T) | undefined) => T;
    var dateStringifier: (date: Date) => string;
    var dateParser: (date: string) => Date;
}
export declare function json4class(stringifier: Stringifier, parser: Parser): PropertyDecorator;
export declare namespace json4class {
    var version: string;
    var normalize: (object: any) => any;
    var stringify: (object: any, space?: string | number | undefined) => string;
    var specialize: <T>(object: any, constructor: new () => T) => T;
    var parse: <T>(json: string, constructor?: (new () => T) | undefined) => T;
    var dateStringifier: (date: Date) => string;
    var dateParser: (date: string) => Date;
}
