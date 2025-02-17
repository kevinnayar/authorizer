export type Entity<T extends object> = T & {
  key: string;
  id: string | number;
};

export type BaseEntity = Entity<{}>;

export type AuthorizerValidator<T extends object> = {
  parent: string;
  child: string;
  validator: (parent: Entity<T>, child: Entity<T>) => Promise<boolean>;
};

export type AuthorizerOpts<T extends object> = {
  validators: AuthorizerValidator<T>[];
  cache?: MinimalCache;
  verbose?: boolean;
};

export type SafeValidationResult =
  | {
      success: true;
      error: null;
    }
  | {
      success: false;
      error: string | Error;
    };

export type IAuthorizer<T extends object> = {
  validate: (parent: Entity<T>, child: Entity<T>) => Promise<true>;
  safeValidate: (
    parent: Entity<T>,
    child: Entity<T>,
  ) => Promise<SafeValidationResult>;
  validateMany: (entities: [Entity<T>, Entity<T>][]) => Promise<true[]>;
  safeValidateMany: (
    entities: [Entity<T>, Entity<T>][],
  ) => Promise<SafeValidationResult[]>;
  removeFromCache: (parent: Entity<T>, child: Entity<T>) => Promise<void>;
  removeManyFromCache: (entities: [Entity<T>, Entity<T>][]) => Promise<void>;
  clearCache: () => Promise<void>;
};

export interface MinimalCache {
  get(key: string): Promise<string | null | undefined>;
  set(key: string, value: string, options?: unknown): Promise<unknown>;
  del(key: string): Promise<unknown>;
  flushAll?(): Promise<unknown>;
  clear?(): Promise<unknown>;
}

export type LoggerMethod =
  | 'log'
  | 'error'
  | 'warn'
  | 'debug'
  | 'info'
  | 'trace';
