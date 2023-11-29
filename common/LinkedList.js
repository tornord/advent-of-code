export class LinkedList {
  constructor(toHash = (d) => d) {
    this.toHash = toHash;
    this.nodes = {};
    this.head = null;
  }

  find(item) {
    return this.nodes[this.toHash(item)] ?? null;
  }

  insert(item, prev = null) {
    if (prev === null && this.head !== null) {
      prev = this.head.prev;
    }
    const node = { item, prev: null, next: null };
    this.nodes[this.toHash(item)] = node;
    if (prev === null) {
      node.prev = node;
      node.next = node;
      this.head = node;
    } else {
      node.prev = prev;
      node.next = prev.next;
      prev.next.prev = node;
      prev.next = node;
    }
    return node;
  }

  remove(item = null) {
    let node;
    let h;
    if (item !== null) {
      h = this.toHash(item);
      node = this.nodes[h];
    } else {
      h = this.toHash(this.head.item);
      node = this.head;
    }
    delete this.nodes[h];
    if (node === node.prev) {
      this.head = null;
    } else {
      node.prev.next = node.next;
      node.next.prev = node.prev;
      if (item === null) {
        this.head = node.next;
      }
    }
    return node.item;
  }

  stepForward(n = 1) {
    for (let i = 0; i < n; i++) {
      this.head = this.head.next;
    }
    return this.head.item;
  }

  stepBackward(n = 1) {
    for (let i = 0; i < n; i++) {
      this.head = this.head.prev;
    }
    return this.head.item;
  }
}
