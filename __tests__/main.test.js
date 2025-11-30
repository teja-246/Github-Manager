import { expect, test } from '@jest/globals'
import * as cp from 'child_process'
import * as path from 'path'
import * as process from 'process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test('test runs', () => {
    process.env['INPUT_ACTION'] = 'code-review'
    process.env['GITHUB_ACTION'] = 'code-review'
    process.env['GITHUB_TOKEN'] = 'dummy-token'
    process.env['GITHUB_REPOSITORY'] = 'owner/repo'
    const np = process.execPath
    const ip = path.join(__dirname, '..', 'src', 'main.js')
    const options = {
        env: process.env
    }
    try {
        console.log(cp.execFileSync(np, [ip], options).toString())
    } catch (e) {
        console.log('Error running main.js:')
        console.log(e.stdout ? e.stdout.toString() : '')
        console.log(e.stderr ? e.stderr.toString() : '')
        throw e
    }
})
