import algebraic, { Case, nullary } from "../src";

export class Maybe<T> {
  private cases = algebraic("Maybe", {
    Just: (value: T) => value,
    Nothing: nullary,
  });

  private value: Case<Maybe<T>["cases"]> = this.cases.Nothing();

  constructor(value: T | null | undefined) {
    if (value != null) {
      this.value = this.cases.Just(value);
    }
  }

  static just<T>(value: NonNullable<T>) {
    if (value == null) {
      throw new TypeError("Just() must not receive null or undefined");
    }

    return new this(value);
  }

  static nothing<T>() {
    return new this<T>(null);
  }

  isJust() {
    return this.value.type === "Maybe/Just";
  }

  isNothing() {
    return this.value.type === "Maybe/Nothing";
  }

  map<U>(fn: (value: T) => U) {
    switch (this.value.type) {
      case "Maybe/Just": {
        return new Maybe<U>(fn(this.value.payload));
      }

      default: {
        return new Maybe<U>(null);
      }
    }
  }

  flatMap<U>(fn: (value: T) => Maybe<U>) {
    switch (this.value.type) {
      case "Maybe/Just": {
        return fn(this.value.payload);
      }

      default: {
        return new Maybe<U>(null);
      }
    }
  }

  get() {
    switch (this.value.type) {
      case "Maybe/Just": {
        return this.value.payload;
      }

      default: {
        throw new TypeError("Cannot unwrap Nothing()");
      }
    }
  }

  getOrElse(defaultValue: T) {
    switch (this.value.type) {
      case "Maybe/Just": {
        return this.value.payload;
      }

      default: {
        return defaultValue;
      }
    }
  }
}
