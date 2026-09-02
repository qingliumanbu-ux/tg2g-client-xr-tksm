<template>
  <div style="height: 100%">
    <xr-ef-form
      :f3-do="F3_DO"
      :in-dialog-form-name="openInDialog ? dialogFormName : null"
      @closeDialog="closeEfDialog"
      @ready="efFormReady"
    >
      <template v-if="initializeFlag === 1">
        <div
          style="height: 100%; width: 100%; display: flex; flex-direction: row"
        >
          <div style="height: 100%; width: 20%">
            <er-layout
              :er-form-helper-prop="erFormHelper"
              :config-id="'LayoutGroupFilterStno'"
            ></er-layout>
            <er-layout
              :er-form-helper-prop="erFormHelper"
              :config-id="'LayoutGroupFilterPath'"
            ></er-layout>
          </div>
          <div style="height: 100%; width: 80%">
            <xr-ef-panel title="配方信息" style="height: 100%" padding="5px">
              <template #customButtonSlot> </template>
              <template v-if="initializeFlag === 1" #contentSlot>
                <div
                  style="
                    display: flex;
                    height: 100%;
                    width: 100%;
                    flex-direction: row;
                  "
                >
                  <div style="height: 100%; width: 30%">
                    <er-grid
                      :er-form-helper-prop="erFormHelper"
                      :toolbar-style="'both'"
                      :config-id="'gridView1'"
                      @focus-changed="GridView1FocusChanged"
                      @erGridReady="erGrid1Ready"
                    >
                    </er-grid>
                  </div>
                  <div style="height: 100%; width: 70%">
                    <er-grid
                      :er-form-helper-prop="erFormHelper"
                      :toolbar-style="'both'"
                      :config-id="'gridView2'"
                      @erGridReady="erGrid2Ready"
                    >
                    </er-grid>
                  </div>
                </div>
              </template>
            </xr-ef-panel>
          </div>
        </div>
      </template>
    </xr-ef-form>
  </div>
</template>
<script lang="ts" src="./TKSM107POP.ts"></script>

<style lang="scss" scoped>
@import "./TKSM107POP.scss";
</style>
./TKSM107POP.js./TKSM107POP.js
