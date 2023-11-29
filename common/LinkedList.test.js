import { LinkedList } from "./LinkedList";

describe("LinkedList", () => {
  test("should insert and find items correctly", () => {
    const list = new LinkedList();

    list.insert(1);
    list.insert(2);
    list.insert(3);

    expect(list.find(1).item).toBe(1);
    expect(list.find(2).prev.item).toBe(1);
    expect(list.find(3).prev.item).toBe(2);
    expect(list.find(4)).toBe(null);
  });

  test("should remove items correctly", () => {
    const list = new LinkedList();

    list.insert(1);
    list.insert(2);
    list.insert(3);

    list.remove(2);

    expect(!!list.find(1)).toBe(true);
    expect(!!list.find(2)).toBe(false);
    expect(!!list.find(3)).toBe(true);
  });

  test("should step forward and backward correctly", () => {
    const list = new LinkedList();

    list.insert(1);
    list.insert(2);
    list.insert(3);

    list.stepForward();
    expect(list.head.item).toBe(2);
    list.stepForward();
    expect(list.head.item).toBe(3);
    list.stepForward();
    expect(list.head.item).toBe(1);
    list.stepForward(3);
    expect(list.head.item).toBe(1);

    list.stepBackward();
    expect(list.head.item).toBe(3);
  });
});
