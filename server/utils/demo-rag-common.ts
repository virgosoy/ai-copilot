import { MemoryVectorStore } from "langchain/vectorstores/memory";

export const vectorStore = new MemoryVectorStore(new DefaultOpenAIEmbeddings())
