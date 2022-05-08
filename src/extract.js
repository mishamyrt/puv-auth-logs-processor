//@ts-check
import { appendFile, readdir, rm, stat } from 'fs/promises'
import { join } from 'path'
import { readLines } from './common.js'

const ACCESS_RE = /(.[^\s|]*) .* Access JWT was generated for \[(.[^\]]*)\]/i

/**
 * Checks if file name not starts with period
 * @param {string} fileName 
 */
function isNotHiddenFile(fileName) {
  return !fileName.startsWith('.')
}

/**
 * Extracts log file number from name like `logfile_96.log`
 * @param {string} fileName
 */
function extractLogNumber(fileName) {
  return parseInt(fileName.split('_')[1].split('.')[0])
}

/**
 * Compares log file names
 * @param {string} a
 * @param {string} b
 */
function sortLogs(a, b) {
  return extractLogNumber(a) - extractLogNumber(b)
}

/**
 * Returns sorted log files from directory
 * @param {string} path
 */
function getFiles(path) {
  return readdir(path)
    .then(f => f.filter(isNotHiddenFile))
    .then(f => f.sort(sortLogs))
}

/**
 * Try remove file
 * @param {string} path 
 * @returns 
 */
async function rmf(path) {
  try {
    await rm(path)
  } catch {
    return
  }
}

async function main(path, outPath) {
  const files = await getFiles(path)
  await rmf(outPath)
  for (let i = 0; i < files.length; i++) {
    console.log(`Processing ${files[i]} (${i+1} from ${files.length})`)
    const lines = await readLines(join(path, files[i]))
    let fileResults = ''
    for (let j = 0; j < lines.length; j++) {
      const match = lines[j].match(ACCESS_RE)
      if (match) {
        fileResults += `${match[1]},${match[2]}\n`
      }
    }
    await appendFile(outPath, fileResults)
  }
}

if (process.argv.length < 3) {
  console.log('Logs path not provided')
  process.exit(1)
}
if (process.argv.length < 4) {
  console.log('Output path not provided')
  process.exit(1)
}
main(process.argv[2], process.argv[3])