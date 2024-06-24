
import MarkdownIt from "markdown-it";
import MarkdownItHighlightjs from "markdown-it-highlightjs";
import MarkdownItFootnote from "markdown-it-footnote";

import hljs from 'highlight.js'
import 'highlight.js/styles/nord.css'

/**
 * @example
 * ```ts
 * const markdown = useMarkdown()
 * ```
 * ```html
 * <div v-html="markdown.render(str)"></div>
 * ```
 */
export function useMarkdown(){
  
  onMounted(() => {
    hljs.highlightAll()
  })

  return new MarkdownIt()
    .use(MarkdownItHighlightjs)
    .use(MarkdownItFootnote)
}