<script setup lang="ts">
/**
 * 📌注：如果有新增模型，可以更新 modelProviderMapModel
 * @example
 * LangServe 写法：
 * （注：可以结合后端的 from utils.model import biz_configurable_model 方法使用。
 * ```python
 * # 具体模型名称的配置 key 为模型供应商配置值 + '_model'
 * chain = Chat1(model="my_default_model")
 *     .configurable_fields(
 *         model_name=ConfigurableField(
 *             id="my_model_provider1_model",
 *         )
 *     )
 *     .configurable_alternatives(
 *         ConfigurableField(id="model_provider"),
 *         default_key="my_model_provider1",
 *         my_model_provider2=Chat2(model="my_default_model")
 *             .configurable_fields(
 *                 model=ConfigurableField(
 *                     id="my_model_provider2_model",
 *                 )
 *             ),
 *         my_model_provider3=Chat3(model="my_default_model")
 *             .configurable_fields(
 *                 model=ConfigurableField(
 *                     id="my_model_provider3_model",
 *                 )
 *             ),
 *     )
 * ```
 * 
 * 
 * 前端使用：
 * ```ts
 * const modelConfig = ref({})
 * 
 * // 发起请求时
 * $fetch('runnable-url', {
 *   body: {
 *     config: {
 *        configurable: {
 *          ...modelConfig.value
 *        }
 *     }
 *   }
 * })
 * 
 * ```
 * ```html
 * <BizConfigModelSelect v-model="modelConfig" />
 * ```
 */
let _

const modelConfig = defineModel<{
  model_provider?: typeof modelProviderOptions[number],
  openai_model?: string,
  anthropic_model?: string,
  ollama_model?: string,
}>({
  required: true 
})

const modelProviderOptions = ['openai', 'anthropic', 'ollama'] as const
const modelProvider = computed({
  get(){
    return (modelConfig.value.model_provider ??= modelProviderOptions[0]) // as typeof modelProviderOptions[number]
  },
  set(newValue){
    modelConfig.value.model_provider = newValue
  }
})
// ref<typeof modelProviderOptions[number]>(modelProviderOptions[0])

const modelProviderMapModel : Record<typeof modelProviderOptions[number], string[]> = {
  openai: ['gpt-4-turbo', 'gpt-4o', 'gpt-3.5-turbo'],
  anthropic: [
    'claude-3-5-sonnet-20240620',
    'claude-3-opus-20240229',
    // 'claude-3-sonnet-20240229',
    'claude-3-haiku-20240307',
  ],
  ollama: ['qwen2', 'qwen2:72B', 'llama3'],
}
const modelOptions = computed(() => {
  return modelProviderMapModel[modelProvider.value]
})
const model = computed({
  get(){
    return modelConfig.value[`${modelProvider.value}_model`] ??= modelProviderMapModel[modelProvider.value][0]
  },
  set(newValue){
    modelConfig.value[`${modelProvider.value}_model`] = newValue
  }
})
// ref<string>()

// watchEffect(() => {
//   model.value = modelProviderMapModel[modelProvider.value][0]
// })

// watchEffect(() => {
//   const v = {
//     model_provider: modelProvider.value,
//     // 没选择的模型供应商对应的参数用不到，所以无所谓，下面可以设置重复。
//     'openai_model': model.value,
//     'anthropic_model': model.value,
//     'ollama_model': model.value,
//   }
//   modelConfig.value = v
//   console.log(1, v)
// })
// watchEffect(() => {
//   console.log(2, JSON.stringify(modelConfig.value))
//   const v = modelConfig.value
//   modelProvider.value = (v?.model_provider ?? modelProviderOptions[0]) as any
//   // @ts-ignore
//   model.value = v[v[modelProvider.value] + '_model'] ?? modelProviderMapModel[modelProvider.value][0]
// })

</script>

<template>
  <USelectMenu v-model="modelProvider" :options="modelProviderOptions"></USelectMenu>
  <USelectMenu v-model="model" :options="modelOptions"></USelectMenu>
</template>
