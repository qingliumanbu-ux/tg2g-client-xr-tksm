<template>
  <div style="height: 100%">
    <xr-ef-form @ready="efFormReady" :f2-do="F2_DO"  >
      <template v-if="initializeFlag === 1">
        <er-layout
          :er-form-helper-prop="erFormHelper"
          :config-id="'LayoutGroupFilter'"
        ></er-layout>
      </template>    
          <v-splitter style="height: 100%" class="default-theme">
            <v-splitter-pane size="40">
              <xr-ef-panel
                title="信息"
                style="height: 100%"
                padding="5px"
              >
                <template v-if="initializeFlag === 1" #contentSlot>
                  <er-grid
                    :er-form-helper-prop="erFormHelper"
                    @erGridReady="erGrid1Ready" @focus-changed="gridView1FocusChanged "
                    :config-id="'gridView1'"
                  >
                  </er-grid>
                </template>
              </xr-ef-panel>
            </v-splitter-pane>
            <v-splitter-pane size="60">
              <xr-ef-panel title="详细信息" style="height: 100%" padding="5px">
                <template #customButtonSlot> </template>
                <template v-if="initializeFlag === 1" #contentSlot>
                  <er-grid
                    :er-form-helper-prop="erFormHelper"
                    :config-id="'gridView2'"
                    @erGridReady="erGrid2Ready"
                  >
                  </er-grid>
                </template>
              </xr-ef-panel>
            </v-splitter-pane>
          </v-splitter>       
    </xr-ef-form>
  </div>
</template>
<script lang="ts" src="./TKBS02.ts"></script>

<style lang="scss" scoped>
@import "./TKBS02.scss";
</style>
