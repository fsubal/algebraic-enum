import algebraic, { nullary, createAlgebraic } from '../src'

describe("algebraic", () => {
  describe("default", () => {
    const ItemAction = algebraic('ItemAction', {
      loaded: nullary,
      selectedOne: (nextId: number) => ({ nextId })
    })

    test("loaded()", () => {
      expect(ItemAction.loaded()).toMatchInlineSnapshot();
    });

    test("selectedOne()", () => {
      expect(ItemAction.selectedOne(1)).toMatchInlineSnapshot();
    });
  })

  describe("custom", () => {
    const customAlgebraic = createAlgebraic({ delimiter: '::' })

    const ItemAction = customAlgebraic('ItemAction', {
      loaded: nullary,
      selectedOne: (nextId: number) => ({ nextId })
    })

    test("loaded()", () => {
      expect(ItemAction.loaded()).toMatchInlineSnapshot();
    });

    test("selectedOne()", () => {
      expect(ItemAction.selectedOne(1)).toMatchInlineSnapshot();
    });
  })

  describe("generics", () => {
    function Option<T = never>() {
      return algebraic('Option', {
        Some: (value: T) => value,
        None: nullary
      })
    }

    test("Some()", () => {
      expect(Option<number>().Some(1)).toMatchInlineSnapshot();
    });

    test("None", () => {
      expect(Option<number>().None()).toMatchInlineSnapshot();
    });
  })
});
