const ctx = require.context('templates', false, /\.html$/)

type Filename = string
type Url = string

const loadTemplateFiles = (): Record<Filename, Url> => {
    const result = {}
    ctx.keys().filter(key => key.startsWith('.')).forEach(key => {
        const name = key.slice(2) // remove leading "./"
        result[name] = ctx(key)
    })
    return result
}

/**
 * A map which associates template filenames to urls.
 */
export const templateFiles = loadTemplateFiles()
