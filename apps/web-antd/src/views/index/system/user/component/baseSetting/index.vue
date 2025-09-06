<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { useVbenForm } from '#/adapter/form';
import { UserInfoApi } from '#/api/sys/user';
import { SystemEnum } from '#/enums';
import { useSystemStore } from '#/store';

import { useBaseSettingFormSchema } from './data';

const props = defineProps({
  userId: {
    type: [Number, String],
    default: undefined,
  },
});
const emit = defineEmits(['update:form-api']);
const systemStore = useSystemStore();
const staticPath = systemStore.getSystemConfigMap[SystemEnum.SYSTEM_PATH];
const imageUrlData = ref({});
// 图片覆盖
const headerImageChange = async ({ file }: any) => {
  if (file.response) {
    imageUrlData.value = file.response;
    formApi.setValues({
      imageUrl: [
        {
          status: 'done',
          url: file.response.fullPath,
          path: file.response.path,
        },
      ],
    });
  }
};

const [Form, formApi] = useVbenForm({
  layout: 'horizontal',
  schema: useBaseSettingFormSchema(headerImageChange),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 lg:grid-cols-2',
});
const init = async () => {
  if (props.userId) {
    formApi.setValues({ id: props.userId });
    const { provinceId, cityId, areaId, imageUrl, ...userInfo } =
      await UserInfoApi({ id: props.userId });
    if (imageUrl) {
      headerImageChange({
        file: {
          response: {
            fullPath: staticPath + imageUrl,
            path: imageUrl,
          },
        },
      });
    }
    formApi.setValues({ ...userInfo, areaList: [provinceId, cityId, areaId] });
  }
  emit('update:form-api', formApi);
};
onMounted(() => {
  init();
});
</script>
<template>
  <Form class="mx-4" />
</template>
