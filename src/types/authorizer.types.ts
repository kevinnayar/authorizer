export interface MinimalCache {
  get(key: string): Promise<string | null | undefined>;
  set(key: string, value: string, options?: unknown): Promise<unknown>;
  del(key: string): Promise<unknown>;
  flushAll?(): Promise<unknown>;
  clear?(): Promise<unknown>;
}

export type Entity<T extends object> = T & {
  key: string;
  id: string | number;
};

export type BaseEntity = Entity<{}>;

export type AuthorizerValidationFn<T extends object> = (
  parent: Entity<T>,
  child: Entity<T>,
) => Promise<boolean>;

export type AuthorizerValidator<T extends object> = {
  parent: string;
  child: string;
  validator: AuthorizerValidationFn<T>;
};

export type AuthorizerOpts<T extends object> = {
  validators: AuthorizerValidator<T>[];
  cache?: MinimalCache;
  verbose?: boolean;
};

export type LoggerMethod =
  | 'log'
  | 'error'
  | 'warn'
  | 'debug'
  | 'info'
  | 'trace';
