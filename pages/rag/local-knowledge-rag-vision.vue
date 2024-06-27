<script setup lang="ts">
import LuAiMessage from '~/components/lu/LuAiMessage.vue';
import LuHumanMessage from '~/components/lu/LuHumanMessage.vue';
import SyHiddenInputFile from '~/components/sy/SyHiddenInputFile.vue';
import { useMarkdown } from '~/composables/useMarkdown';
import { asyncMap } from '~/utils/PromiseUtils';

const markdown = useMarkdown()

const fileComp = ref<InstanceType<typeof SyHiddenInputFile>>()
const prompt = ref('')
const imagePromptDataUrls = ref<string[]>([])
const aiResponse = ref('')
async function sendMessage(){
  aiResponse.value =  await $fetch('/api/langserve/local-knowledge-rag-vision', {
    method: 'POST',
    body: {
      files: imagePromptDataUrls.value.map(du => getBase64FromDataUrl(du)),
      text: prompt.value,
    }
  })
}

async function handleAttachFile(){
  fileComp.value?.popupFileSelector()
}
async function handleFileSelected({files} : {event: Event, files: FileList}){
  const dataUrls = await asyncMap(Array.from(files), file => getDataUrlFromFile(file))
  imagePromptDataUrls.value.push(...dataUrls)
}
async function removeImagePromptByIndex(index: number){
  imagePromptDataUrls.value.splice(index, 1)
}
</script>

<template>
  <!-- Prompt Messages Container - Modify the height according to your need -->
  <div class="flex h-[97vh] w-full flex-col">
    <!-- Prompt Messages -->
    <div
      class="flex-1 space-y-6 overflow-y-auto rounded-xl bg-slate-200 p-4 text-sm leading-6 text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-300 sm:text-base sm:leading-7"
    >
      <!-- <!== human message ==>
      <div class="flex flex-row-reverse items-start">
        <img
          class="ml-2 h-8 w-8 rounded-full"
          src="https://dummyimage.com/128x128/363536/ffffff&text=H"
        />
        <div
          class="flex rounded-b-xl rounded-tl-xl bg-slate-50 p-4 dark:bg-slate-800 sm:max-w-md md:max-w-2xl"
        >
          <p>Explain quantum computing in simple terms</p>
        </div>
      </div>
      <!== ai message ==>
      <div class="flex items-start">
        <img
          class="mr-2 h-8 w-8 rounded-full"
          src="https://dummyimage.com/128x128/354ea1/ffffff&text=G"
        />

        <div
          class="flex min-h-[85px] rounded-b-xl rounded-tr-xl bg-slate-50 p-4 dark:bg-slate-800 sm:min-h-0 sm:max-w-md md:max-w-2xl"
        >
          <p>
            Certainly! Quantum computing is a new type of computing that relies on
            the principles of quantum physics. Traditional computers, like the one
            you might be using right now, use bits to store and process
            information. These bits can represent either a 0 or a 1. In contrast,
            quantum computers use quantum bits, or qubits.<br /><br />
            Unlike bits, qubits can represent not only a 0 or a 1 but also a
            superposition of both states simultaneously. This means that a qubit
            can be in multiple states at once, which allows quantum computers to
            perform certain calculations much faster and more efficiently
          </p>
        </div>
        <div
          class="ml-2 mt-1 flex flex-col-reverse gap-2 text-slate-500 sm:flex-row"
        >
          <button class="hover:text-blue-600" type="button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path
                d="M8 8m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z"
              ></path>
              <path
                d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2"
              ></path>
            </svg>
          </button>
          <button class="hover:text-blue-600" type="button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path
                d="M7 13v-8a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v7a1 1 0 0 0 1 1h3a4 4 0 0 1 4 4v1a2 2 0 0 0 4 0v-5h3a2 2 0 0 0 2 -2l-1 -5a2 3 0 0 0 -2 -2h-7a3 3 0 0 0 -3 3"
              ></path>
            </svg>
          </button>
          <button class="hover:text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path
                d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <div class="flex flex-row-reverse items-start">
        <img
          class="mr-2 h-8 w-8 rounded-full"
          src="https://dummyimage.com/128x128/363536/ffffff&text=J"
        />
        <div
          class="flex rounded-b-xl rounded-tr-xl bg-slate-50 p-4 dark:bg-slate-800 sm:max-w-md md:max-w-2xl"
        >
          <p>What are three great applications of quantum computing?</p>
        </div>
      </div>
      <LuAiMessage>
        <p>Three great applications of quantum computing are: Optimization of
            complex problems, Drug Discovery and Cryptography.</p>
      </LuAiMessage> -->
      <LuHumanMessage>
        <img v-for="du in imagePromptDataUrls" :src="du"/>
        <!-- <p>{{ prompt }}</p> -->
        <div v-html="markdown.render(prompt)"></div>
      </LuHumanMessage>
      <LuAiMessage>
        <!-- <p>{{ aiResponse }}</p> -->
        <div v-html="markdown.render(aiResponse)"></div>
      </LuAiMessage>
    </div>
    <!-- file panel above input -->
    <div
      v-if="imagePromptDataUrls.length"
      class="mt-2 flex w-full gap-x-4 pt-2.5 overflow-x-auto whitespace-nowrap text-xs text-slate-600 dark:text-slate-300 sm:text-sm"
    >
      <div v-for="du, dui in imagePromptDataUrls">
        <div 
          class="relative">
          <img 
            class="h-10 rounded-lg"
            :src="du"/>
          <svg xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 absolute -top-2.5 -right-2.5 cursor-pointer"
            viewBox="0 0 20 20"
            @click="removeImagePromptByIndex(dui)">
            <g id="Layer_1">
              <ellipse id="svg_1" ry="9" rx="9" cy="10" cx="10" fill="#f33"/>
              <line id="svg_2" y2="14" x2="14" y1="6" x1="6"  stroke="#fff" stroke-width="1" fill="none" />
              <line id="svg_3" y2="14" x2="6" y1="6" x1="14" stroke="#fff" stroke-width="1" fill="none"/>
            </g>
          </svg>
        </div>
      </div>
    </div>
    <!-- Prompt message input -->
    <form @submit.prevent="sendMessage">
      <!-- rmclass max-w-3xl -->
      <div class="mb-4 w-full rounded-lg bg-slate-200 dark:bg-slate-900">
        <div
          class="rounded-lg rounded-b-none border border-slate-300 bg-slate-50 px-2 py-2 dark:border-slate-700 dark:bg-slate-800"
        >
          <label for="prompt-input" class="sr-only">Enter your prompt</label>
          <textarea
            id="prompt-input"
            rows="4"
            class="w-full border-0 bg-slate-50 px-0 text-base text-slate-900 focus:outline-none dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-400"
            placeholder="Enter your prompt"
            required
            v-model="prompt"
          ></textarea>
        </div>
        <div class="flex items-center justify-between px-2 py-2">
          <SyHiddenInputFile ref="fileComp" @fileSelect="handleFileSelected" />
          <button
            type="button"
            class="inline-flex cursor-pointer justify-center rounded-lg p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-600 dark:hover:text-slate-50"
            @click="handleAttachFile"
          >
            <span class="sr-only">Attach file</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path
                d="M15 7l-6.5 6.5a1.5 1.5 0 0 0 3 3l6.5 -6.5a3 3 0 0 0 -6 -6l-6.5 6.5a4.5 4.5 0 0 0 9 9l6.5 -6.5"
              ></path>
            </svg>
            <span class="px-2 text-sm">Attach a file</span>
          </button>
          <button
            type="submit"
            class="mr-1 inline-flex items-center gap-x-2 rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-slate-50 hover:bg-blue-800 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 sm:text-base"
          >
            Generate
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M10 14l11 -11"></path>
              <path
                d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<style>
/* code {
  color: rgb(37 99 235);
  white-space: pre-wrap;
}

.hljs {
  display: block;
  padding: 8px;
  background-color: #e5e5e5;
  margin-top: 8px;
  margin-bottom: 8px;
} */
</style>