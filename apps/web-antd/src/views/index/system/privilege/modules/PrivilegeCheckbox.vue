

<template>
  <div class="m-4 flex flex-col bg-white">
    <div class="justify-end">
      <a-button
        class="float-right mr-4 mt-4"
        type="primary"
        @click="handleSave"
      >
        保存
      </a-button>
    </div>
    <div class="grow overflow-hidden">
      <MyCheckBox :treeData="tree" @subset="handleSubsetChange" />
    </div>
  </div>
</template>
