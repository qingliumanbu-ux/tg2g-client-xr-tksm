<template>
  <xr-ef-form @ready="efFormReady"
    :f2-do="F2_DO">
    <er-layout v-if="initializeFlag === 1"
      :er-form-helper-prop="erFormHelper"
      :config-id="'LayoutGroupFilter'"></er-layout>
    <v-splitter horizontal
      style="height: 100%"
      class="default-theme">
      <v-splitter-pane>
        <div style="
              display: flex;
              width: 100%;
              height: 100%;
              flex-direction: column;
            ">
          <xr-ef-panel title="炉次信息"
            padding="5px"
            style="height: 100%">
            <template #contentSlot>
              <er-grid v-if="initializeFlag === 1"
                :er-form-helper-prop="erFormHelper"
                :config-id="'gridView1'"
                @erGridReady="erGrid1Ready"
                @focus-changed="gridView1FocusChanged">
              </er-grid>
            </template>
          </xr-ef-panel>
        </div>
      </v-splitter-pane>
      <v-splitter-pane>
        <div style="
              display: flex;
              width: 100%;
              height: 100%;
              flex-direction: column;
            ">
          <xr-ef-panel title="详细信息"
            padding="5px"
            style="height: 100%">
            <template #contentSlot>
              <er-grid v-if="initializeFlag === 1"
                :er-form-helper-prop="erFormHelper"
                :config-id="'gridView2'"
                @erGridReady="erGrid2Ready"
                :auto-bind="true"
                :grid-options="{scrollable:{virtual:true}}">
              </er-grid>
            </template>
          </xr-ef-panel>
        </div>
      </v-splitter-pane>
    </v-splitter>

  </xr-ef-form>
</template>

<script lang="ts"
  src="./TKSM01.ts">
</script>

<style lang="scss"
  scoped>
@import './TKSM01.scss';
</style>
