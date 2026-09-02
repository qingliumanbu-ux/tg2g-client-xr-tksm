<template>
  <xr-ef-form @ready="efFormReady"
    :f2-do="F2_DO">
    <er-layout v-if="initializeFlag === 1"
      :er-form-helper-prop="erFormHelper"
      :config-id="'LayoutGroupFilter'"></er-layout>
    <xr-ef-panel title="详细信息"
      padding="5px">
      <template #contentSlot>
        <er-grid v-if="initializeFlag === 1"
          :er-form-helper-prop="erFormHelper"
          :config-id="'gridView1'"
          @erGridReady="erGrid1Ready">
        </er-grid>
      </template>
    </xr-ef-panel>
  </xr-ef-form>
</template>

<script lang="ts"
  src="./TKSM12.ts">
</script>

<style lang="scss"
  scoped>
@import './TKSM12.scss';
</style>
./TKSM12.js./TKSM12.js