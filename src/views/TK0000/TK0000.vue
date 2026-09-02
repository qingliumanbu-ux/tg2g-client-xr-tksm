<template>
  <xr-ef-form @ready="efFormReady"
    :f2-do="F2_DO"
    :f3-do="F3_DO"
    :f3-pre-do="F3_PRE_DO"
    :f3-cancel="F3_CANCEL">
    <er-layout v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper" :config-id="`${layout}`"></er-layout>
    <xr-ef-panel :title="`${c_name}`" padding="5px" style="height: 100%">
          <template #customButtonSlot>
          </template>
          <template #contentSlot>
            <er-grid v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper" :config-id="`${gridview}`"
              :toolbar-style="'both'" :toolbar-options="gridToolbar" @erGridReady="erGrid1Ready"></er-grid>
          </template>
        </xr-ef-panel>
  </xr-ef-form>
</template>

<script lang="ts"
  src="./TK0000.ts">
</script>

<style lang="scss"
  scoped>
@import './TK0000.scss';
</style>
