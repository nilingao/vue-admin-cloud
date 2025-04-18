<template>
  <BasicModal
    :footer="null"
    :title="t('layout.header.switchTenants')"
    v-bind="$attrs"
    :class="prefixCls"
    @register="register"
  >
    <div :class="`${prefixCls}__entry`">
      <BasicForm @register="registerForm" />
      <div :class="`${prefixCls}__footer`">
        <a-button type="primary" block class="mt-2" @click="handleSwitch">
          {{ t('layout.header.switch') }}
        </a-button>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, computed, reactive } from 'vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useDesign } from '@/hooks/web/useDesign';
  import { doTenantSelect } from '@/api/sys/tenant';
  import { defHttp } from '@/utils/http/axios';
  import { useUserStore } from '@/store/modules/user';
  import { debounce } from 'lodash-es';
  import { useTabs } from '@/hooks/web/useTabs';
  import { BasicModal, useModalInner } from '@/components/Modal/index';
  import { BasicForm, useForm } from '@/components/Form/index';
  import { isEmpty } from '@/utils/is';

  export default defineComponent({
    name: 'TenantModal',
    components: { BasicModal, BasicForm },

    setup() {
      const { t } = useI18n();
      const { refreshPage } = useTabs();
      const userStore = useUserStore();
      const { prefixCls } = useDesign('header-lock-modal');
      const [register, { closeModal }] = useModalInner();
      const state = reactive({
        tenantName: '',
      });
      //默认api传入租户名称与后端名称对应
      const schemasTenantId = defHttp.getOptions().requestOptions?.dataHeaderTenant;

      const searchParams = computed<Recordable>(() => {
        const searchName = { tenantName: state.tenantName, limit: 20 };
        return searchName;
      });

      const onTenantSearch = debounce((value) => {
        state.tenantName = value;
      }, 300);

      const handleSelectChange = () => {
        state.tenantName = '';
      };

      const [registerForm, { validateFields }] = useForm({
        showActionButtonGroup: false,
        schemas: [
          {
            field: schemasTenantId as string,
            label: t('layout.header.tenantName'),
            defaultValue: userStore.getSearchTenant,
            colProps: {
              span: 24,
            },
            component: 'ApiSelect',
            componentProps: {
              api: doTenantSelect,
              filterable: true,
              multiple: true,
              allowCreate: true,
              showSearch: true,
              filterOption: false,
              params: searchParams,
              onSearch: onTenantSearch,
              onChange: handleSelectChange,
              labelField: 'name',
              valueField: 'id',
            },
          },
        ],
      });
      const handleSwitch = async () => {
        const val = (await validateFields()) as any;
        await userStore.setSearchTenant(val[schemasTenantId as string]);

        //刷新页面
        refreshPage();
        closeModal();
      };
      return {
        t,
        prefixCls,
        register,
        registerForm,
        handleSwitch,
      };
    },
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-header-lock-modal';

  .@{prefix-cls} {
    &__entry {
      position: relative;
      //height: 240px;
      padding: 40px 30px;
      border-radius: 10px;
    }

    &__header {
      position: absolute;
      top: 0;
      left: calc(50% - 45px);
      width: auto;
      text-align: center;

      &-img {
        width: 70px;
        border-radius: 50%;
      }

      &-name {
        margin-top: 5px;
      }
    }

    &__footer {
      text-align: center;
    }
  }
</style>
