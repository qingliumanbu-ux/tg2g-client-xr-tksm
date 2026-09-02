<template>
  <div style="height: 100%">
    <xr-ef-form
      :f3-do="F3_DO"
      :f3-pre-do="F3_PRE_DO"
      :f3-cancel="F3_CANCEL"
      :in-dialog-form-name="openInDialog ? dialogFormName : null"
      @closeDialog="closeEfDialog"
      @ready="efFormReady"
    >
      <template v-if="initializeFlag === 1">
        <er-layout
          v-if="initializeFlag"
          :er-form-helper-prop="erFormHelper"
          :config-id="'LayoutGroupFilter'"
          @item-button-click="butClickMat"
        ></er-layout>
        <xr-ef-panel title="物料信息" style="height: 90%" padding="5px">
          <template #customButtonSlot> </template>
          <template v-if="initializeFlag === 1" #contentSlot>
            <er-grid
              :er-form-helper-prop="erFormHelper"
              :config-id="'gridView1'"
              @erGridReady="erGrid1Ready"
            >
            </er-grid>
          </template>
        </xr-ef-panel>
      </template>
    </xr-ef-form>
  </div>
</template>
<script lang="ts" src="./TKSM105POP.ts"></script>

<style lang="scss" scoped>
@import "./TKSM105POP.scss";
</style>
