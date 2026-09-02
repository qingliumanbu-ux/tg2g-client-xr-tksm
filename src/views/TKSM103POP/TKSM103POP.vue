<template>
  <div style="height: 100%">
    <xr-ef-form
      :f3-do="F3_DO"
      :in-dialog-form-name="openInDialog ? dialogFormName : null"
      @closeDialog="closeEfDialog"
      @ready="efFormReady"
    >
      <template v-if="initializeFlag === 1">
        <er-layout
          :er-form-helper-prop="erFormHelper"
          :config-id="'LayoutGroupFilterStno'"
        ></er-layout>
        <er-layout
          :er-form-helper-prop="erFormHelper"
          :config-id="'LayoutGroupFilterPath'"
        ></er-layout>
      </template>
    </xr-ef-form>
  </div>
</template>
<script lang="ts" src="./TKSM103POP.ts"></script>

<style lang="scss" scoped>
@import "./TKSM103POP.scss";
</style>
