import algebraic, { nullary, createAlgebraic, Case } from "../src";

describe("algebraic", () => {
  describe("default", () => {
    const ItemAction = algebraic("ItemAction", {
      loaded: nullary,
      selectedOne: (nextId: number) => ({ nextId }),
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type KnownItemAction = Case<typeof ItemAction>;

    test("loaded()", () => {
      expect(ItemAction.loaded()).toMatchInlineSnapshot(`
Object {
  "payload": Object {},
  "type": "ItemAction/loaded",
}
`);
    });

    test("selectedOne()", () => {
      expect(ItemAction.selectedOne(1)).toMatchInlineSnapshot(`
Object {
  "payload": Object {
    "nextId": 1,
  },
  "type": "ItemAction/selectedOne",
}
`);
    });
  });

  describe("custom", () => {
    const customAlgebraic = createAlgebraic({ delimiter: "::" });

    const ItemAction = customAlgebraic("ItemAction", {
      loaded: nullary,
      selectedOne: (nextId: number) => ({ nextId }),
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type KnownItemAction = Case<typeof ItemAction>;

    test("loaded()", () => {
      expect(ItemAction.loaded()).toMatchInlineSnapshot(`
Object {
  "payload": Object {},
  "type": "ItemAction::loaded",
}
`);
    });

    test("selectedOne()", () => {
      expect(ItemAction.selectedOne(1)).toMatchInlineSnapshot(`
Object {
  "payload": Object {
    "nextId": 1,
  },
  "type": "ItemAction::selectedOne",
}
`);
    });
  });

  describe("generics", () => {
    function Option<T = never>() {
      return algebraic("Option", {
        Some: (value: T) => value,
        None: nullary,
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type KnownItemAction<T> = Case<ReturnType<typeof Option>>;

    test("Some()", () => {
      expect(Option<number>().Some(1)).toMatchInlineSnapshot(`
Object {
  "payload": 1,
  "type": "Option/Some",
}
`);
    });

    test("None", () => {
      expect(Option<number>().None()).toMatchInlineSnapshot(`
Object {
  "payload": Object {},
  "type": "Option/None",
}
`);
    });
  });
});
