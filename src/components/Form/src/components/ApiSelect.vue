<template>
  <div class="ant-api-select">
    <div class = "ant-api-select-group-wrapper">
      <template v-if="$slots.addonBefore">
        <div class="ant-api-select-group-addon">
          <slot name="addonBefore"></slot>
        </div>
      </template>
      <Select
        @dropdown-visible-change="handleFetch"
        v-bind="$attrs"
        @change="handleChange"
        :show-search="true"
        @search="debounceSearchFn"
        :options="getOptions"
        v-model:value="state"
      >
        <template #[item]="data" v-for="item in Object.keys($slots)">
          <slot :name="item" v-bind="data || {}"></slot>
        </template>
        <template #suffixIcon v-if="loading">
          <LoadingOutlined spin />
        </template>
        <template #notFoundContent v-if="loading">
          <span>
            <LoadingOutlined spin class="mr-1" />
            {{ t('component.form.apiSelectNotFound') }}
          </span>
        </template>
      </Select>
      <template v-if="$slots.addonAfter">
        <div class="ant-api-select-group-addon">
          <slot name="addonAfter"></slot>
        </div>
      </template>
      
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, PropType, ref, unref, watch } from 'vue';
  import { Select } from 'ant-design-vue';
  import type { SelectValue } from 'ant-design-vue/es/select';
  import { isEmpty, isFunction } from '@/utils/is';
  import { useRuleFormItem } from '@/hooks/component/useFormItem';
  import { assignIn, get, isEqual, omit } from 'lodash-es';
  import { LoadingOutlined } from '@ant-design/icons-vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { propTypes } from '@/utils/propTypes';
  import { useDebounceFn } from '@vueuse/core';

  type OptionsItem = { label?: string; value?: string; disabled?: boolean; [name: string]: any };

  type ApiSearchOption = {
    // 展示搜索
    show?: boolean;
    // 待搜索字段名
    searchName?: string;
    // 是否允许空搜索
    emptySearch?: boolean;
    // 搜索前置方法
    beforeFetch?: (value?: string) => Promise<string>;
    // 拦截方法
    interceptFetch?: (value?: string) => Promise<boolean>;
  };

  defineOptions({ name: 'ApiSelect', inheritAttrs: false });

  const props = defineProps({
    value: { type: [Array, Object, String, Number] as PropType<SelectValue> },
    numberToString: propTypes.bool,
    api: {
      type: Function as PropType<(arg?: any) => Promise<OptionsItem[] | Recordable>>,
      default: null,
    },
    // api params
    params: propTypes.any.def({}),
    // support xxx.xxx.xx
    resultField: propTypes.string.def(''),
    labelField: propTypes.string.def('label'),
    valueField: propTypes.string.def('value'),
    immediate: propTypes.bool.def(true),
    alwaysLoad: propTypes.bool.def(false),
    options: {
      type: Array<OptionsItem>,
      default: [],
    },
    apiSearch: {
      type: Object as PropType<ApiSearchOption>,
      default: () => null,
    },
    beforeFetch: {
      type: Function as PropType<Fn>,
      default: null,
    },
    afterFetch: {
      type: Function as PropType<Fn>,
      default: null,
    },
    defValOne: propTypes.bool.def(false),
  });

  const emit = defineEmits(['options-change', 'change', 'update:value', 'asearch']);

  const optionsRef = ref<OptionsItem[]>([]);

  const loading = ref(false);
  // 首次是否加载过了
  const isFirstLoaded = ref(false);
  const emitData = ref<OptionsItem[]>([]);
  const searchParams = ref<any>({});
  const { t } = useI18n();

  // Embedded in the form, just use the hook binding to perform form verification
  const [state] = useRuleFormItem(props, 'value', 'change', emitData);

  const getOptions = computed(() => {
    const { labelField, valueField, numberToString } = props;

    let data = unref(optionsRef).reduce((prev, next: any) => {
      if (next) {
        const value = get(next, valueField);
        prev.push({
          ...omit(next, [labelField, valueField]),
          label: get(next, labelField),
          value: numberToString ? `${value}` : value,
        });
      }
      return prev;
    }, [] as OptionsItem[]);
    return data.length > 0 ? data : props.options;
  });

  watch(
    () => state.value,
    (v) => {
      emit('update:value', v);
    },
  );

  watch(
    () => props.params,
    (value, oldValue) => {
      if (isEqual(value, oldValue)) return;
      fetch();
    },
    { deep: true, immediate: props.immediate },
  );

  watch(
    () => searchParams.value,
    (value, oldValue) => {
      if (isEmpty(value) || isEqual(value, oldValue)) return;
      (async () => {
        await fetch();
        searchParams.value = {};
      })();
    },
    { deep: true, immediate: props.immediate },
  );

  async function fetch() {
    let { api, beforeFetch, afterFetch, params, resultField } = props;
    if (!api || !isFunction(api) || loading.value) return;
    optionsRef.value = [];
    try {
      loading.value = true;
      let apiParams = assignIn({}, params, searchParams.value);
      if (beforeFetch && isFunction(beforeFetch)) {
        apiParams = (await beforeFetch(apiParams)) || apiParams;
      }
      let res = await api(apiParams);
      if (afterFetch && isFunction(afterFetch)) {
        res = (await afterFetch(res)) || res;
      }
      isFirstLoaded.value = true;
      if (Array.isArray(res)) {
        optionsRef.value = res;
        if(props.defValOne,optionsRef.value &&optionsRef.value.length>0){
          state.value = optionsRef.value[0][props.valueField];
        }
        emitChange();
        return;
      }
      if (resultField) {
        optionsRef.value = get(res, resultField) || [];
      }
      if(props.defValOne,optionsRef.value &&optionsRef.value.length>0){
        state.value = optionsRef.value[0][props.valueField];
      }
      emitChange();
    } catch (error) {
      console.warn(error);
      // reset status
      isFirstLoaded.value = false;
    } finally {
      loading.value = false;
    }
  }

  async function handleFetch(visible: boolean) {
    if (visible) {
      if (props.alwaysLoad) {
        await fetch();
      } else if (!props.immediate && !unref(isFirstLoaded)) {
        // 动态搜索查询时，允许控制初始不加载数据
        if (!(!!props.apiSearch && !!props.apiSearch.show && !props.apiSearch.emptySearch)) {
          await fetch();
        } else {
          optionsRef.value = [];
          emitChange();
        }
      }
    }
  }

  let debounceSearchFn = useDebounceFn(handleSearch, 500);

  async function handleSearch(value: any) {
    emit('asearch', value);
    if (!props.apiSearch) {
      return;
    }
    const { show, searchName, beforeFetch, interceptFetch } = props.apiSearch;
    if (!show || !searchName) {
      return;
    }

    value = value || undefined;
    if (beforeFetch && isFunction(beforeFetch)) {
      value = (await beforeFetch(value)) || value;
    }

    if (interceptFetch && isFunction(interceptFetch)) {
      if (!(await interceptFetch(value))) {
        return;
      }
    }
    searchParams.value = {
      [searchName]: value,
    };
  }

  function emitChange() {
    emit('options-change', unref(getOptions));
  }

  function handleChange(_, ...args) {
    emitData.value = args;
  }
</script>
<style lang="less">
  :where(.ant-api-select-group-addon:first-child){
    .ant-select-selector{
      border-start-start-radius: 0;
      border-end-start-radius: 0;
    }
  }
  .ant-api-select{
    width: 100%;
    max-width: 100%;
    display: inline-block;
    text-align: start;
    vertical-align: top;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    font-size: 14px;
    box-sizing: border-box;
    .ant-api-select-group-wrapper{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      color: rgba(0, 0, 0, 0.88);
      font-size: 14px;
      line-height: 1.5714285714285714;
      list-style: none;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
      position: relative;
      display: table;
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      .ant-select-selector:not(:first-child):not(:last-child) {
          border-radius: 0;
      }
      .ant-select-selector:first-child {
        border-start-start-radius: 0;
        border-end-start-radius: 0;
      }
      .ant-select-selector:last-child {
        border-start-end-radius: 0;
        border-end-end-radius: 0;
      }
      .ant-api-select-group-addon{
        border-radius: 4px;
        position: relative;
        padding: 0 11px;
        color: rgba(0, 0, 0, 0.88);
        font-weight: normal;
        font-size: 14px;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.02);
        border: 1px solid #d9d9d9;
        transition: all 0.3s;
        display: table-cell;
        width: 1px;
        white-space: nowrap;
        vertical-align: middle;
        box-sizing: border-box;
        line-height: 1;
        &:first-child{
          width: 83px;
          border-right: 0;
          border-start-end-radius: 0;
          border-end-end-radius: 0;
          border-inline-end: 0;
        }

        &:last-child{
          border-left: 0;
          border: none;
          padding: 0;
          border-start-start-radius: 0;
          border-end-start-radius: 0;
          border-inline-start: 0;
        }

      }
    }
  }
  
</style>