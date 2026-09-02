<template>
  <xr-ef-form @ready="efFormReady"
    :f2-do="F2_DO">
    <er-layout v-if="initializeFlag === 1"
      :er-form-helper-prop="erFormHelper"
      :config-id="'LayoutGroupFilter'"></er-layout>
    <xr-ef-panel title="日趋势图"
      padding="5px">
      <template #contentSlot>
        <div id="container"
          style="width: 100%;height:100%;">
        </div>
      </template>
    </xr-ef-panel>
  </xr-ef-form>
</template>

<script lang="ts"
  src="./TKSM06.ts">
</script>

<style lang="scss"
  scoped>
@import './TKSM06.scss';
</style>
