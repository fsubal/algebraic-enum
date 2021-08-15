interface Option<Delimiter extends string> {
  delimiter: Delimiter;
}

export type AlgebraicDataTypeDeclaration<
  Namespace extends string,
  Delimiter extends string,
  Members extends Record<string, (...args: any[]) => any>
> = {
  [MemberName in keyof Members]: (...args: Parameters<Members[MemberName]>) => {
    type: MemberName extends string
      ? `${Namespace}${Delimiter}${MemberName}`
      : never;
    payload: ReturnType<Members[MemberName]>;
  };
};

export function createAlgebraic<Delimiter extends string>({
  delimiter,
}: Option<Delimiter>) {
  return function algebraic<
    Namespace extends string,
    Members extends Record<string, (...args: any[]) => any>
  >(namespace: Namespace, members: Members) {
    return Object.fromEntries(
      Object.entries(members).map(([name, fn]) => [
        name,
        (...args: unknown[]) => ({
          type: `${namespace}${delimiter}${name}`,
          payload: fn(...args),
        }),
      ])
    ) as unknown as AlgebraicDataTypeDeclaration<Namespace, Delimiter, Members>;
  };
}

const algebraic = createAlgebraic({ delimiter: "/" });

export default algebraic;

export const nullary = () => ({});

export const unreachable = (value: never) => {
  throw new Error(`[algebraic-enum] unreachable: ${JSON.stringify(value)}`);
};

export const unreachableSilent = (value: never) => void value;

export type Case<T extends ReturnType<ReturnType<typeof createAlgebraic>>> =
  ReturnType<T[keyof T]>;
