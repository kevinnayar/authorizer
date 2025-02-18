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
  cache?: IMinimalCache;
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

export interface IAuthorizer<T extends object> {
  /**
   * Validate the parent and child entities
   * @param parent - The parent entity
   * @param child - The child entity
   * @returns A promise that resolves to true if the entities are valid, false otherwise
   */
  validate: (parent: Entity<T>, child: Entity<T>) => Promise<true>;
  /**
   * Validate the parent and child entities and return a result object
   * @param parent - The parent entity
   * @param child - The child entity
   * @returns A promise that resolves to a result object
   */
  safeValidate: (
    parent: Entity<T>,
    child: Entity<T>,
  ) => Promise<SafeValidationResult>;
  /**
   * Validate multiple parent and child entities
   * @param entities - An array of parent and child entities
   * @returns A promise that resolves to an array of true values if the entities are valid, false otherwise
   */
  validateMany: (entities: [Entity<T>, Entity<T>][]) => Promise<true[]>;
  /**
   * Validate multiple parent and child entities and return a result object
   * @param entities - An array of parent and child entities
   * @returns A promise that resolves to an array of result objects
   */
  safeValidateMany: (
    entities: [Entity<T>, Entity<T>][],
  ) => Promise<SafeValidationResult[]>;
  /**
   * Remove a parent and child entity from the cache
   * @param parent - The parent entity
   * @param child - The child entity
   * @returns A promise that resolves to void
   */
  removeFromCache: (parent: Entity<T>, child: Entity<T>) => Promise<void>;
  /**
   * Remove multiple parent and child entities from the cache
   * @param entities - An array of parent and child entities
   * @returns A promise that resolves to void
   */
  removeManyFromCache: (entities: [Entity<T>, Entity<T>][]) => Promise<void>;
  /**
   * Clear the cache
   * @returns A promise that resolves to void
   */
  clearCache: () => Promise<void>;
}

export interface IMinimalCache {
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
