export interface MinimalRedisClient {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string, options?: { EX?: number }) => Promise<void>;
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
  cache?: MinimalRedisClient;
  verbose?: boolean;
};

export type ConsoleMethod =
  | 'log'
  | 'error'
  | 'warn'
  | 'debug'
  | 'info'
  | 'trace';
