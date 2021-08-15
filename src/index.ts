interface Option<Delimiter extends string> {
  delimiter: Delimiter
}

type AlgebraicDataTypeDeclaration<
  Delimiter extends string,
  Namespace extends string,
  Members extends Record<string, (...args: any[]) => any>
  > = {
    [MemberName in keyof Members]: (...args: Parameters<Members[MemberName]>) => {
      type: MemberName extends string ? `${Namespace}${Delimiter}${MemberName}` : never,
      payload: ReturnType<Members[MemberName]>
    }
  }

export function createAlgebraic<Delimiter extends string = '/'>({ delimiter }: Option<Delimiter>) {
  return function algebraic<
    Namespace extends string,
    Members extends Record<string, (...args: any[]) => any>
  >(namespace: Namespace, members: Members) {
    return Object.fromEntries(
      Object.entries(members).map(([name, fn]) => [
        name,
        (...args: unknown[]) => ({
          type: `${namespace}${delimiter}${name}`,
          payload: fn(...args)
        })
      ])
    ) as unknown as AlgebraicDataTypeDeclaration<Delimiter, Namespace, Members>
  }
}

export default createAlgebraic({ delimiter: '/' })

export const nullary = () => ({})

export const unreachable = (value: never) => {
  throw new Error(`[algebraic] unreachable: ${JSON.stringify(value)}`)
}

export const unreachableSilent = (value: never) => void value

export type Case<T extends ReturnType<typeof algebraic>> = ReturnType<T[keyof T]>