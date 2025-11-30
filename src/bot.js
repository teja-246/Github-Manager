import './fetch-polyfill.js'

import * as core from '@actions/core'
import * as openai from 'chatgpt'
import * as utils from './utils.js'

export class Bot {
    constructor(options) {
        this.api = null // not free
        this.options = options
        if (process.env.OPENAI_API_KEY) {
            this.api = new openai.ChatGPTAPI({
                systemMessage: options.system_message,
                apiKey: process.env.OPENAI_API_KEY,
                debug: options.debug,
                completionParams: {
                    temperature: options.openai_model_temperature,
                    model: options.openai_model
                }
            })
        } else {
            const err =
                "Unable to initialize the OpenAI API, both 'OPENAI_API_KEY' environment variable are not available"
            throw new Error(err)
        }
    }

    chat = async (message, ids) => {
        let new_ids = {}
        let response = ''
        try {
            [response, new_ids] = await this.chat_(message, ids)
        } catch (e) {
            core.warning(`Failed to chat: ${e}, backtrace: ${e.stack}`)
        }
        return [response, new_ids]
    }

    chat_ = async (message, ids) => {
        // record timing
        const start = Date.now()
        if (!message) {
            return ['', {}]
        }
        if (this.options.debug) {
            core.info(`sending to openai: ${message}`)
        }

        let response = null

        if (this.api) {
            const opts = {
                timeoutMs: this.options.openai_timeout_ms
            }
            if (ids.parentMessageId) {
                opts.parentMessageId = ids.parentMessageId
            }
            try {
                response = await utils.retry(
                    this.api.sendMessage.bind(this.api),
                    [message, opts],
                    this.options.openai_retries
                )
            } catch (e) {
                core.info(
                    `response: ${response}, failed to stringify: ${e}, backtrace: ${e.stack}`
                )
            }
            const end = Date.now()
            core.info(`response: ${JSON.stringify(response)}`)
            core.info(
                `openai sendMessage (including retries) response time: ${end - start
                } ms`
            )
        } else {
            core.setFailed('The OpenAI API is not initialized')
        }
        let response_text = ''
        if (response) {
            response_text = response.text
        } else {
            core.warning('openai response is null')
        }
        // remove the prefix "with " in the response
        if (response_text.startsWith('with ')) {
            response_text = response_text.substring(5)
        }
        if (this.options.debug) {
            core.info(`openai responses: ${response_text}`)
        }
        const new_ids = {
            parentMessageId: response?.id,
            conversationId: response?.conversationId
        }
        return [response_text, new_ids]
    }
}
