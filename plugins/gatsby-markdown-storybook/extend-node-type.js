const Remark = require(`remark`)
const _ = require(`lodash`)
const visit = require(`unist-util-visit`)
const toHAST = require(`mdast-util-to-hast`)
const hastToHTML = require(`hast-util-to-html`)
const Promise = require(`bluebird`)
const stripPosition = require(`unist-util-remove-position`)
const hastReparseRaw = require(`hast-util-raw`)
const codeHandler = require(`./code-handler`)


function buildNode({ type, basePath, cache}){

  if (type.name !== `MarkdownStorybook`) { return {} }

  const pathPrefixCacheStr = basePath || ``
  const htmlAstCacheKey = node => `transformer-markdown-storybook-hast-${node.internal.contentDigest}-${pathPrefixCacheStr}`


  return new Promise((resolve, reject) => {

    let remark = new Remark()

    async function getHTMLAst(markdownNode) {
      const cachedAst = await cache.get(htmlAstCacheKey(markdownNode))

      //If in Cache return it
      if (cachedAst) return cachedAst

      const mdAst = remark.parse(markdownNode.internal.content)
      const htmlAst = toHAST(mdAst, { allowDangerousHTML: true,  handlers: { code: codeHandler} }) // Save new HTML AST to cache and return

      cache.set(htmlAstCacheKey(markdownNode), htmlAst)
      return htmlAst

    }

    //      const html = hastToHTML(ast, {allowDangerousHTML: true}) // Save new HTML to cache

    return resolve({
      ast: {
        type: `JSON`,
        resolve(markdownNode) {
          return getHTMLAst(markdownNode).then(ast => {
            const strippedAst = stripPosition(_.clone(ast), true)
            return hastReparseRaw(strippedAst)
          })
        }
      }

    })
  })
}


module.exports = buildNode