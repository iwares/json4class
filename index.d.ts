import 'reflect-metadata';
export declare type Class<T = any> = {
    new (): T;
};
export declare type Normalizer = (v: any) => any;
export declare type Specializer = (s: any) => any;
export declare function json4class(constructor: Class): PropertyDecorator;
export declare namespace json4class {
    var version: string;
    var normalize: (object: any) => any;
    var stringify: (object: any, space?: string | number | undefined) => string;
    var specialize: <T = any>(object: any, constructor: Class<T>) => T | T[];
    var parseObject: <T = any>(json: string, constructor?: Class<T> | undefined) => T;
    var parseArray: <T = any>(json: string, constructor?: Class<T> | undefined) => T[];
    var parse: <T = any>(json: string, constructor?: Class<T> | undefined) => T | T[];
    var dateNormalizer: (date: Date) => any;
    var dateSpecializer: (date: any) => Date;
}
export declare function json4class(normalizer: Normalizer, specializer: Specializer): PropertyDecorator;
export declare namespace json4class {
    var version: string;
    var normalize: (object: any) => any;
    var stringify: (object: any, space?: string | number | undefined) => string;
    var specialize: <T = any>(object: any, constructor: Class<T>) => T | T[];
    var parseObject: <T = any>(json: string, constructor?: Class<T> | undefined) => T;
    var parseArray: <T = any>(json: string, constructor?: Class<T> | undefined) => T[];
    var parse: <T = any>(json: string, constructor?: Class<T> | undefined) => T | T[];
    var dateNormalizer: (date: Date) => any;
    var dateSpecializer: (date: any) => Date;
}
