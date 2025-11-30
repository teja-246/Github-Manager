// fetch-polyfill.js
import fetch, {
  Headers,
  Request,
  Response,
  Blob,
  File,
  FormData
} from 'node-fetch'

if (!globalThis.fetch) {
  globalThis.fetch = fetch
  globalThis.Headers = Headers
  globalThis.Request = Request
  globalThis.Response = Response
  globalThis.Blob = Blob
  globalThis.File = File
  globalThis.FormData = FormData
}
