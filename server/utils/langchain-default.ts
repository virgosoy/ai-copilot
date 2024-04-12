import { defu } from 'defu'
// import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatOpenAI } from "@langchain/openai";
// import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAIEmbeddings } from "@langchain/openai";


function useChatOpenAI(...args: ConstructorParameters<typeof ChatOpenAI>) {
  const config = useRuntimeConfig()
  const [arg0 , ...argElse]= args
  return new ChatOpenAI(defu(arg0, {
    openAIApiKey: config.openaiApiKey,
    configuration: {
      baseURL: config.openaiBaseUrl,
    }
  }), ...argElse)
}

function useOpenAIEmbeddings(...args: ConstructorParameters<typeof OpenAIEmbeddings>){
  const config = useRuntimeConfig()
  const [arg0 , ...argElse]= args
  return new OpenAIEmbeddings(defu(arg0, {
    openAIApiKey: config.openaiApiKey,
    configuration: {
      baseURL: config.openaiBaseUrl,
    }
  }), ...argElse)
}

/**
 * Wrapper around OpenAI large language models that use the Chat endpoint.
 *
 * To use you should have the `openai` package installed, with the
 * `OPENAI_API_KEY` environment variable set.
 *
 * To use with Azure you should have the `openai` package installed, with the
 * `AZURE_OPENAI_API_KEY`,
 * `AZURE_OPENAI_API_INSTANCE_NAME`,
 * `AZURE_OPENAI_API_DEPLOYMENT_NAME`
 * and `AZURE_OPENAI_API_VERSION` environment variable set.
 * `AZURE_OPENAI_BASE_PATH` is optional and will override `AZURE_OPENAI_API_INSTANCE_NAME` if you need to use a custom endpoint.
 *
 * @remarks
 * Any parameters that are valid to be passed to {@link
* https://platform.openai.com/docs/api-reference/chat/create |
* `openai.createChatCompletion`} can be passed through {@link modelKwargs}, even
* if not explicitly available on this class.
* @example
* ```typescript
* // Create a new instance of ChatOpenAI with specific temperature and model name settings
* const model = new ChatOpenAI({
*   temperature: 0.9,
*   modelName: "ft:gpt-3.5-turbo-0613:{ORG_NAME}::{MODEL_ID}",
* });
*
* // Invoke the model with a message and await the response
* const message = await model.invoke("Hi there!");
*
* // Log the response to the console
* console.log(message);
*
* ```
*/
export class DefaultChatOpenAI extends ChatOpenAI {
  /**
   * 
   * @link 
   */
  constructor(...args: ConstructorParameters<typeof ChatOpenAI>) {
    const config = useRuntimeConfig()
    const [arg0 , ...argElse]= args
    super(defu(arg0, {
      openAIApiKey: config.openaiApiKey,
      configuration: {
        baseURL: config.openaiBaseUrl,
      }
    }), ...argElse)
  }
}

/**
 * Class for generating embeddings using the OpenAI API. Extends the
 * Embeddings class and implements OpenAIEmbeddingsParams and
 * AzureOpenAIInput.
 * @example
 * ```typescript
 * // Embed a query using OpenAIEmbeddings to generate embeddings for a given text
 * const model = new OpenAIEmbeddings();
 * const res = await model.embedQuery(
 *   "What would be a good company name for a company that makes colorful socks?",
 * );
 * console.log({ res });
 *
 * ```
 */
export class DefaultOpenAIEmbeddings extends OpenAIEmbeddings {
  constructor(...args: ConstructorParameters<typeof OpenAIEmbeddings>) {
    const config = useRuntimeConfig()
    const [arg0 , ...argElse]= args
    super(defu(arg0, {
      openAIApiKey: config.openaiApiKey,
      configuration: {
        baseURL: config.openaiBaseUrl,
      }
    }), ...argElse)
  }
}