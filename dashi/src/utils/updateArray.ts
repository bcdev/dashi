export function updateArray<T>(
  array: T[],
  index: number,
  item: Partial<T>,
): T[] {
  array = [...array];
  array[index] = { ...array[index], ...item };
  return array;
}
