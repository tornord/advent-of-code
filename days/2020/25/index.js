import { strict as assert } from "node:assert";

function handshake(subject, loopSize) {
  let value = 1;
  for (let i = 0; i < loopSize; i++) {
    value *= subject;
    value %= 20201227;
  }
  return value;
}
assert.equal(handshake(7, 8), 5764801);
assert.equal(handshake(17807724, 8), 14897079);
assert.equal(handshake(5764801, 11), 14897079);

function revEngLoopSize(subject, publicKey) {
  let value = 1;
  let i = 0;
  while (i < 100_000_000) {
    i++;
    value *= subject;
    value %= 20201227;
    if (value === publicKey) {
      return i;
    }
  }
  return null;
}
assert.deepEqual(revEngLoopSize(7, 5764801), 8);
assert.deepEqual(revEngLoopSize(7, 17807724), 11);

function calc1(input) {
  const [cardPublicKey, doorPublicKey] = input;
  const cardLoopSize = revEngLoopSize(7, cardPublicKey);
  // const doorLoopSize = revEngLoopSize(7, doorPublicKey);
  const encryptionKey = handshake(doorPublicKey, cardLoopSize);
  return encryptionKey;
}

export default function (inputRows) {
  const input = inputRows.map(Number);
  return calc1(input);
}
