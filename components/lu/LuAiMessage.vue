
<script setup lang="ts">
import dayjs from 'dayjs'
import type { LogEntry } from '@langchain/core/tracers/log_stream'

const props = withDefaults(defineProps<{
  content?: string
  /** 中间步骤，可选。 */
  intermediateSteps?: Record<string, LogEntry>
}>(),{
  content: '',
})

const isOpenOfIntermediateStepsModal = ref(false)
function showIntermediateSteps(){
  isOpenOfIntermediateStepsModal.value = true
}
</script>

<template>
  <!-- ai message -->
  <div class="flex items-start">
    <img
      class="mr-2 h-8 w-8 rounded-full"
      src="https://dummyimage.com/128x128/354ea1/ffffff&text=G"
    />

    <div
      class="flex flex-col min-h-[85px] rounded-b-xl rounded-tr-xl bg-slate-50 p-4 dark:bg-slate-800 sm:min-h-0 sm:max-w-md md:max-w-2xl"
    >
      <slot>
        <p>
          {{ content }}
        </p>
      </slot>
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
      <button v-if="$props.intermediateSteps" @click="showIntermediateSteps" class="hover:text-blue-600">
        <!-- rm width="32" height="32" -->
        <svg xmlns="http://www.w3.org/2000/svg" 
          class="h-5 w-5"
          viewBox="0 0 16 16">
          <path fill="currentColor" fill-rule="evenodd" d="M0 4.13v1.428a.5.5 0 0 0 .725.446l.886-.446l.377-.19L2 5.362l1.404-.708l.07-.036l.662-.333l.603-.304a.5.5 0 0 0 0-.893l-.603-.305l-.662-.333l-.07-.036L2 1.706l-.012-.005l-.377-.19l-.886-.447A.5.5 0 0 0 0 1.51zM7.25 2a.75.75 0 0 0 0 1.5h7a.25.25 0 0 1 .25.25v8.5a.25.25 0 0 1-.25.25h-9.5a.25.25 0 0 1-.25-.25V6.754a.75.75 0 0 0-1.5 0v5.496c0 .966.784 1.75 1.75 1.75h9.5A1.75 1.75 0 0 0 16 12.25v-8.5A1.75 1.75 0 0 0 14.25 2zm-.5 4a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5zM6 9.25a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 0 1.5h-3.5A.75.75 0 0 1 6 9.25" clip-rule="evenodd"/>
        </svg>
      </button>
      <UModal v-model="isOpenOfIntermediateStepsModal">
        <div class="p-4">
          <div v-for="(log, step) in $props.intermediateSteps">
            <div class="flex items-center justify-between">
              <div class="text-sm font-medium">{{ step }}({{ log.name }})</div>
              <div class="text-sm">{{ dayjs.utc(log.start_time).local().format('YYYY-MM-DD HH:mm:ss') }}</div>
            </div>
            <div className="bg-gray-100 rounded-lg p-3 relative group">
              <pre className="break-words whitespace-pre-wrap min-w-0 text-sm">{{ JSON.stringify(log.final_output, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </UModal>
    </div>
  </div>
</template>
