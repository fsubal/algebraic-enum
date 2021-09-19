import algebraic, { Case } from "../src";

export class Either<L, R> {
  private cases = algebraic('Either', {
    Left: (value: L) => value,
    Right: (value: R) => value
  })

  private value: Case<Either<L, R>['cases']>

  private constructor(fn: () => R, private isValidLeft: ((e: unknown) => e is L)) {
    try {
      this.value = this.cases.Right(fn())
    } catch (e: unknown) {
      if (!isValidLeft(e)) {
        throw e
      }
      this.value = this.cases.Left(e)
    }
  }

  isLeft() {
    return this.value.type === "Either/Left";
  }

  isRight() {
    return this.value.type === "Either/Right";
  }

  map<U>(fn: (value: R) => NonNullable<U>) {
    switch (this.value.type) {
      case "Either/Right": {
        const { payload } = this.value
        return new Either<L, U>(() => fn(payload), this.isValidLeft);
      }

      case "Either/Left": {
        return this as unknown as Either<L, U>;
      }
    }
  }

  flatMap<U>(fn: (value: R) => Either<L, NonNullable<U>>) {
    switch (this.value.type) {
      case "Either/Right": {
        return fn(this.value.payload);
      }

      case "Either/Left": {
        return this as unknown as Either<L, NonNullable<U>>;
      }
    }
  }
}
