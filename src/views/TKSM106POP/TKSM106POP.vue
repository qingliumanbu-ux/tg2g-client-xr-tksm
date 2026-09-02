<template>
  <div style="height: 100%">
    <xr-ef-form
      :f3-do="F3_DO"
      :f4-do="F4_DO"
      :f4-pre-do="F4_PRE_DO"
      :f4-cancel="F4_CANCEL"
      :in-dialog-form-name="openInDialog ? dialogFormName : null"
      @closeDialog="closeEfDialog"
      @ready="efFormReady"
    >
      <div
        style="display: flex; height: 100%; width: 100%; flex-direction: row"
      >
        <xr-ef-panel title="配方信息" padding="5px" style="flex: 3">
          <template #customButtonSlot> </template>
          <template v-if="initializeFlag === 1" #contentSlot>
            <er-grid
              :er-form-helper-prop="erFormHelper"
              :toolbar-style="'both'"
              :config-id="'gridView1'"
              @focus-changed="GridView1FocusChanged"
              @erGridReady="erGrid1Ready"
            >
            </er-grid>
          </template>
        </xr-ef-panel>

        <xr-ef-panel title="配方明细" padding="5px" style="flex: 7">
          <template #customButtonSlot> </template>
          <template v-if="initializeFlag === 1" #contentSlot>
            <er-grid
              :er-form-helper-prop="erFormHelper"
              :toolbar-style="'both'"
              :config-id="'gridView2'"
              @erGridReady="erGrid2Ready"
            >
            </er-grid>
          </template>
        </xr-ef-panel>
      </div>
    </xr-ef-form>
  </div>
</template>
<script lang="ts" src="./TKSM106POP.ts"></script>

<style lang="scss" scoped>
@import "./TKSM106POP.scss";
</style>
