import { get_encoding } from '@dqbd/tiktoken'

const tokenizer = get_encoding('cl100k_base')

export function encode(input) {
    return tokenizer.encode(input)
}

export function get_token_count(input) {
    input = input.replace(/<\|endoftext\|>/g, '')
    return encode(input).length
}
