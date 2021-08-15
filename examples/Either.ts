import { AlgebraicDataTypeDeclaration, Case } from "../src";

type Cases<L, R> = AlgebraicDataTypeDeclaration<
  "Either",
  "/",
  {
    Left(value: L): L;
    Right(value: R): R;
  }
>;

export class Either<L, R> {
  private constructor(private value: Case<Cases<L, R>>) {}

  static try<L, R>(fn: () => R) {
    try {
      return new Either<L, R>({
        type: "Either/Right",
        payload: fn(),
      });
    } catch (e: unknown) {
      return new Either<L, R>({
        type: "Either/Left",
        payload: e as L,
      });
    }
  }

  static async tryAsync<L, R>(fn: () => Promise<R>) {
    try {
      return new Either<L, R>({
        type: "Either/Right",
        payload: await fn(),
      });
    } catch (e: unknown) {
      return new Either<L, R>({
        type: "Either/Left",
        payload: e as L,
      });
    }
  }

  isLeft() {
    return this.value.type === "Either/Left";
  }

  isRight() {
    return this.value.type === "Either/Right";
  }

  map<U>(fn: (value: R) => U) {
    switch (this.value.type) {
      case "Either/Right": {
        return new Either<L, U>({
          type: "Either/Right",
          payload: fn(this.value.payload),
        });
      }

      case "Either/Left": {
        return this as unknown as Either<L, U>;
      }
    }
  }

  flatMap<U>(fn: (value: R) => Either<L, U>) {
    switch (this.value.type) {
      case "Either/Right": {
        return fn(this.value.payload);
      }

      case "Either/Left": {
        return this as unknown as Either<L, U>;
      }
    }
  }
}
