import { readFile } from 'fs/promises'

/**
 * Returns text file lines
 * @param {string} path 
 */
export function readLines(path) {
  return readFile(path, { encoding: 'utf-8' })
    .then(s => s.split('\n'))
}
