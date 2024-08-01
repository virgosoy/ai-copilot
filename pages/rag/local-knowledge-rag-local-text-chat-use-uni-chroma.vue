<script setup lang="ts">
import BizConfigModelSelect from '~/components/biz/BizConfigModelSelect.vue';
import LuAiMessage from '~/components/lu/LuAiMessage.vue';
import LuHumanMessage from '~/components/lu/LuHumanMessage.vue';
import SyHiddenInputFile from '~/components/sy/SyHiddenInputFile.vue';
import { useMarkdown } from '~/composables/useMarkdown';
import { asyncMap } from '~/utils/PromiseUtils';

const markdown = useMarkdown()

const messages = ref<BaseMessageJsonObj[]>([])

const fileComp = ref<InstanceType<typeof SyHiddenInputFile>>()

const prompt = ref('')
const imagePromptDataUrls = ref<string[]>([])
const aiResponse = ref('')

const modelConfig = ref({})

const {
  isIntermediateSteps, 
  intermediateSteps, 
  intermediateStepsOfMessages,
  fetchLangServeResult,
} = useBizIntermediteStep()

async function sendMessage(){
  const currentMessage = createImgMessage(
    imagePromptDataUrls.value.map(du => getBase64FromDataUrl(du)),
    prompt.value
  )
  messages.value.push(currentMessage)
  imagePromptDataUrls.value = []
  prompt.value = ''

  fetchLangServeResult('/api/langserve/local-knowledge-rag-local-text-chat-use-uni-chroma', {
    input: {
      messages: messages.value,
      collectionName: collectionName.value,
    },
    config: {
      configurable: {
        ...modelConfig.value,
      }
    }
  }, {
    onData({isIntermediateSteps, data, finalOutput}) {
      aiResponse.value = isIntermediateSteps ? finalOutput : (aiResponse.value + data)
    },
    onEnd() {
      messages.value.push(createAIMessage(aiResponse.value))
      aiResponse.value = ''
      return {currentMessageIndex: messages.value.length - 1}
    },
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

const collectionName = ref()
const collectionNameOptions = ['ebs']

</script>

<template>
  <!-- Prompt Messages Container - Modify the height according to your need -->
  <div class="flex h-[97vh] w-full flex-col">
    <!-- Prompt Messages -->
    <div
      class="flex-1 space-y-6 overflow-y-auto rounded-xl bg-slate-200 p-4 text-sm leading-6 text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-300 sm:text-base sm:leading-7"
    >
      <LuHistoryMessages :messages="messages" :intermediateStepsOfMessages="intermediateStepsOfMessages"></LuHistoryMessages>
      <LuAiMessage v-if="aiResponse" 
          :intermediateSteps="intermediateSteps">
        <!-- <p>{{ aiResponse }}</p> -->
        <div v-html="markdown.render(aiResponse)"></div>
      </LuAiMessage>
      <LuHumanMessage v-if="imagePromptDataUrls.length || prompt">
        <img v-for="du in imagePromptDataUrls" :src="du"/>
        <div v-html="markdown.render(prompt)"></div>
      </LuHumanMessage>
      <!-- <LuAiMessage>
        <!== <p>{{ aiResponse }}</p> ==>
        <div v-html="markdown.render(aiResponse)"></div>
      </LuAiMessage> -->
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
          <div class="flex flex-row items-center">
            <!-- <SyHiddenInputFile ref="fileComp" @fileSelect="handleFileSelected" />
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
            </button> -->
            <LuToggle v-model="isIntermediateSteps">Intermediate steps</LuToggle>
            <BizConfigModelSelect v-model="modelConfig"></BizConfigModelSelect>
            <div class="flex flex-row items-center">
              <span class="ml-3 pr-1 text-sm font-medium text-slate-800 dark:text-slate-200">knowledge: </span>
              <USelectMenu v-model="collectionName" :options="collectionNameOptions"></USelectMenu>
            </div>
          </div>
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