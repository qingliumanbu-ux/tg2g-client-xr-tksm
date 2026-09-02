<template>
  <div style="width: 100%; height: 100%">
    <xr-ef-form @ready="efFormReady" :f2-do="F2_DO">
      <er-layout style="padding: 0" v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper"
        :config-id="'LayoutGroupFilter'" :show-query-button="true" @query-click="F2_DO"></er-layout>
      <v-splitter horizontal style="height: 100%" class="default-theme">
        <v-splitter-pane>
          <div style="
              display: flex;
              width: 100%;
              height: 100%;
              flex-direction: column;
            ">
            <xr-ef-panel title="查询结果" padding="5px" style="height: 100%">
              <template #contentSlot>
                <er-grid v-if="initializeFlag === 1" :er-form-helper-prop="erFormHelper" :config-id="'gridView1'"
                  @erGridReady="erGrid1Ready" @focus-changed="gridView1FocusChanged">
                </er-grid>
              </template>
            </xr-ef-panel>
          </div>
        </v-splitter-pane>
        <v-splitter-pane>
          <div style="width: 100%; height: 100%">
            <xr-ef-panel title="图形" padding="5px" style="height: 100%">
              <template #contentSlot>
                <div style="
                    display: flex;
                    justify-content: space-around;
                    flex-direction: row;
                    height: 100%;
                  ">
                  <div id="piechart" style="width: 40%; height: 100%"></div>
                  <div id="piechart1" style="width: 30%; height: 100%"></div>
                  <div id="piechart2" style="width: 30%; height: 100%"></div>
                </div>
              </template>
            </xr-ef-panel>
          </div>
        </v-splitter-pane>
      </v-splitter>
    </xr-ef-form>
  </div>
</template>

<script lang="ts" src="./TKSM09.ts"></script>

<style lang="scss">
@import "./TKSM09.scss";
</style>
