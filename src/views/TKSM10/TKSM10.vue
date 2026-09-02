<template>
  <div style="height: 100%">
    <xr-ef-form
      @ready="efFormReady"
      :f2-do="F2_DO"
      :f3-do="F3_DO"
      :f4-do="F4_DO"
      :f5-do="F5_DO"
      :f6-do="F6_DO"
      :f7-do="F7_DO"
    >
      <template v-if="initializeFlag === 1">
        <er-layout
          :er-form-helper-prop="erFormHelper"
          :config-id="'LayoutGroupFilter'"
        ></er-layout>
      </template>
      <v-splitter>
        <v-splitter-pane size="30">
          <v-splitter style="height: 100%" class="default-theme">
            <v-splitter-pane size="100">
              <xr-ef-panel
                title="碳排钢种路径"
                style="height: 100%"
                padding="5px"
              >
                <template #customButtonSlot> </template>
                <template v-if="initializeFlag === 1" #contentSlot>
                  <er-grid
                    :er-form-helper-prop="erFormHelper"
                    :config-id="'gridView1'"
                    @erGridReady="erGrid1Ready"
                    @focus-changed="GridView1FocusChanged"
                  >
                  </er-grid>
                </template>
              </xr-ef-panel>
            </v-splitter-pane>
          </v-splitter>
        </v-splitter-pane>
        <v-splitter-pane size="70">
          <v-splitter horizontal style="height: 100%" class="default-theme">
            <v-splitter-pane size="50">
              <xr-ef-panel title="碳排信息" style="height: 100%" padding="5px">
                <template #customButtonSlot> </template>
                <template v-if="initializeFlag === 1" #contentSlot>
                  <er-grid
                    :er-form-helper-prop="erFormHelper"
                    :config-id="'gridView3'"
                    @erGridReady="erGrid3Ready"
                  >
                  </er-grid>
                </template>
              </xr-ef-panel>
            </v-splitter-pane>
            <v-splitter-pane size="50">
              <xr-ef-panel title="配方信息" style="height: 100%" padding="5px">
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
        </v-splitter-pane>
      </v-splitter>
    </xr-ef-form>
    <div class="Box" v-if="butFlag === 'F3'">
      <xr-ef-dialog
        v-model:visible="dialogVisible"
        :title="dialogFormName"
        height="65%"
        width="20%"
        @click-close-icon="xrEfDialogClose"
        :default-footer="false"
      >
        <TKSM103POP
          :openInDialog="true"
          :dialogFormName="dialogFormName"
          :parentInfo="parentInfo"
          @getChildInfo="getChildInfo"
        ></TKSM103POP>
      </xr-ef-dialog>
    </div>
    <div class="Box" v-if="butFlag === 'F5'">
      <xr-ef-dialog
        v-model:visible="dialogVisible"
        :title="dialogFormName"
        height="80%"
        width="60%"
        @click-close-icon="xrEfDialogClose"
        :default-footer="false"
      >
        <TKSM105POP
          :openInDialog="true"
          :dialogFormName="dialogFormName"
          :parentInfo="parentInfo"
          @getChildInfo="getChildInfo"
        ></TKSM105POP>
      </xr-ef-dialog>
    </div>
    <div class="Box" v-if="butFlag === 'F6'">
      <xr-ef-dialog
        v-model:visible="dialogVisible"
        :title="dialogFormName"
        height="80%"
        width="70%"
        @click-close-icon="xrEfDialogClose"
        :default-footer="false"
      >
        <TKSM106POP
          :openInDialog="true"
          :dialogFormName="dialogFormName"
          :parentInfo="parentInfo"
          @getChildInfo="getChildInfo"
        ></TKSM106POP>
      </xr-ef-dialog>
    </div>
    <div class="Box" v-if="butFlag === 'F7'">
      <xr-ef-dialog
        v-model:visible="dialogVisible"
        :title="dialogFormName"
        height="70%"
        width="70%"
        @click-close-icon="xrEfDialogClose"
        :default-footer="false"
      >
        <TKSM107POP
          :openInDialog="true"
          :dialogFormName="dialogFormName"
          :parentInfo="parentInfo"
          @getChildInfo="getChildInfo"
        ></TKSM107POP>
      </xr-ef-dialog>
    </div>
  </div>
</template>
<script lang="ts" src="./TKSM10.ts"></script>

<style lang="scss" scoped>
@import "./TKSM10.scss";
</style>
./TKSM10.js./TKSM10.js
