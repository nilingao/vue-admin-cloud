<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import {
  computed,
  h,
  onMounted,
  onUnmounted,
  reactive,
  useTemplateRef,
} from 'vue';

import { AuthenticationLogin, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { Image } from 'ant-design-vue';

import { doGetCode } from '#/api';
import { useAuthStore } from '#/store';
import { EncryptionBean } from '#/utils/cipher';

defineOptions({ name: 'Login' });
const loginRef =
  useTemplateRef<InstanceType<typeof AuthenticationLogin>>('loginRef');
const stats = reactive({
  images: '',
  key: '',
  timer: undefined as any,
});

onMounted(() => {
  GetCode();
  stats.timer = setInterval(() => GetCode(), 1000 * 60 * 1);
});

onUnmounted(() => {
  stats.timer && clearInterval(stats.timer);
});

const GetCode = async () => {
  const { key, image } = await doGetCode();
  stats.images = image;
  stats.key = key;
  loginRef.value?.getFormApi().setValues({ loginCode: '' });
};

const encryption = new EncryptionBean().createAesEncryption();
const submitFrom = async (from: Recordable<any>) => {
  const fromData = {
    grantType: 'code',
    loginType: 'WEB_ACCOUNT',
    code: {
      username: encryption.encrypt(from.username),
      password: encryption.encrypt(from.password),
      key: stats.key,
      verificationCode: from.loginCode,
    },
  };
  authStore.authLogin(fromData);
};

const authStore = useAuthStore();

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.usernameTip'),
      },
      fieldName: 'username',
      label: $t('authentication.username'),
      rules: z.string().min(1, { message: $t('authentication.usernameTip') }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: $t('authentication.password'),
      },
      fieldName: 'password',
      label: $t('authentication.password'),
      rules: z.string().min(1, { message: $t('authentication.passwordTip') }),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('authentication.sendCode'),
      },
      renderComponentContent: () => ({
        suffix: () =>
          h(Image, {
            src: stats.images,
            preview: false,
            class: 'object-fill cursor-pointer',
            onClick: () => {
              GetCode();
            },
          }),
      }),
      fieldName: 'loginCode',
      rules: z
        .string()
        .min(1, { message: $t('authentication.verifyRequiredTip') })
        .max(4, { message: '最长4位' }),
    },
  ];
});
</script>

<template>
  <AuthenticationLogin
    ref="loginRef"
    :form-schema="formSchema"
    :loading="authStore.loginLoading"
    @submit="submitFrom"
  />
</template>
