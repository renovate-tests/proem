import { Predicate, Guard, Reducer, UnaryFn, BinaryFn } from '@proem/function'

export interface Dictionary<A> {
  [key: string]: A
}

export function map<A, B>(
  dict: Dictionary<A>,
  mapfn: BinaryFn<string, A, B>
): Dictionary<B> {
  const result: Dictionary<B> = {}
  for (let key in dict) {
    if (dict.hasOwnProperty(key)) {
      result[key] = mapfn(key, dict[key])
    }
  }
  return result
}

map.partial = function mapPartial<A, B>(
  mapFn: BinaryFn<string, A, B>
): (dict: Dictionary<A>) => Dictionary<B> {
  return (dict: Dictionary<A>) => map(dict, mapFn)
}

export function filter<A, B extends A>(
  dict: Dictionary<A>,
  guard: Guard<A, B>
): Dictionary<B>
export function filter<A>(
  dict: Dictionary<A>,
  predicate: (index: string, value: A) => boolean
): Dictionary<A>
export function filter(
  dict: Dictionary<any>,
  predicate: (index: string, value: any) => boolean
): Dictionary<any> {
  const result: Dictionary<any> = {}
  for (let key in dict) {
    if (dict.hasOwnProperty(key)) {
      if (predicate(key, dict[key])) {
        result[key] = dict[key]
      }
    }
  }
  return result
}

function filterPartial<A, B extends A>(
  guard: Guard<A, B>
): (dict: Dictionary<A>) => Dictionary<B>
function filterPartial<A>(
  predicate: (index: string, value: A) => boolean
): (dict: Dictionary<A>) => Dictionary<A>
function filterPartial(
  predicate: (index: string, value: any) => boolean
): (dict: Dictionary<any>) => Dictionary<any> {
  return (dict: Dictionary<any>) => filter(dict, predicate)
}

filter.partial = filterPartial

export const reduce = <A, R>(
  dict: Dictionary<A>,
  initial: R,
  reducer: Reducer<[string, A], R>
) => {
  let result = initial
  for (let key in dict) {
    if (dict.hasOwnProperty(key)) {
      const entry: [string, A] = [key, dict[key]]
      result = reducer(result, entry)
    }
  }
  return result
}

reduce.partial = <A, R>(reducer: Reducer<[string, A], R>) => (initial: R) => (
  dict: Dictionary<A>
) => reduce(dict, initial, reducer)