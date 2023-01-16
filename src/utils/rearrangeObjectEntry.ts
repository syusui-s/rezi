type ObjKey = string | number | symbol;

const rearrangeObjectEntry = <V>(
  obj: Record<ObjKey, V>,
  key: ObjKey,
  insertBeforeKey: ObjKey,
): Record<string | number | symbol, V> => {
  const entries: [ObjKey, V][] = Array.from(Object.entries(obj));
  const productIndex = entries.findIndex(([k]) => k === key);
  const insertBeforeIndex = entries.findIndex(([k]) => k === insertBeforeKey);
  if (productIndex == null || insertBeforeIndex == null) return obj;

  const [productTuple] = entries.splice(productIndex, 1);
  entries.splice(insertBeforeIndex, 0, productTuple);
  return Object.fromEntries(entries);
};

export default rearrangeObjectEntry;
