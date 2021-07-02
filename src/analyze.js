//@ts-check
import { readLines } from './common.js'

/**
 * Checks if item is unique
 * @param {string} value 
 * @param {number} index 
 * @param {string[]} self
 */
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

/**
 * Extracts hours from time string
 * @param {string} time 
 */
function getHours (time) {
  // Date is random, just for transform
  const date = new Date(Date.parse(`2011-10-10T${time}`))
  return date.getHours()
}

async function main(path) {
  const lines = await readLines(path)
  const hourResults = {}
  for (const line of lines) {
    const [time, name] = line.split(',')
    if (!time || !name) {
      continue
    }
    const hour = getHours(time)
    if (hourResults[hour]) {
      hourResults[hour].push(name)
    } else {
      hourResults[hour] = [name]
    }
  }
  const results = {}
  for (const key in hourResults) {
    results[key] = {
      users: hourResults[key].filter(onlyUnique).length,
      tokenRequests: hourResults[key].length,
    }
  }
  console.table(results)
}

if (process.argv.length < 3) {
  console.log('CSV path not provided')
  process.exit(1)
}
main(process.argv[2])