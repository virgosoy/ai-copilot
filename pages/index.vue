<template>
  <!-- <NuxtWelcome /> -->
  <div class="flex flex-col">
    <ULink to="/chat/chat-and-vision"
      class="text-primary">Chat And Vision</ULink>
    <ULink to="/rag/local-knowledge-rag-local-text-chat"
      class="text-primary">Local Knowledge Rag | Only Text Chat And Use Local Embedding</ULink>
    <ULink to="/rag/local-knowledge-rag-text-chat"
      class="text-primary">Local Knowledge Rag | Only Text Chat And Use Openai Embedding</ULink>
    <ULink to="/rag/local-knowledge-rag-chat-and-vision"
      class="text-primary">Local Knowledge Rag | Chat And Vision（@Deprecated）</ULink>
  </div>
</template>