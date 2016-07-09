function defaultEqualityCheck(a, b) {
  return a === b
}

export function customMemoize(func, equalityCheck = defaultEqualityCheck, cacheSize) {
  let lastResult = []

  return (...args) => {
    let answer
    answer = lastResult.find(result => {
      return (
        result.args !== null &&
        result.args.length === args.length &&
        args.every((value, index) => equalityCheck(value, result.args[index]))
      )
    })

    if (answer) {
      return answer.val;
    } else {
      // nothing so run itself
      result = func(...args)
      lastResult.unshift({val: result, args})
      lastResult = lastResult.slice(0, cacheSize)
      return result
    }
  }
}


let result = [
  {
    val: 3,
    args: [2,1]
  },
  {
    val: 2,
    args: [2,1]
  }
]
