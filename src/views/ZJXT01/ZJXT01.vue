<template>
  <xr-ef-form @ready="efFormReady" :f2-do="F2_DO">
    <template v-if="initializeFlag === 1">
      <er-layout
        :er-form-helper-prop="erFormHelper"
        :config-id="'LayoutGroupFilter'"
      ></er-layout>
      <a-tabs
        v-model:activeKey="tabActiveKey"
        type="card"
        @change="handleTabChange"
      >
       <a-tab-pane key="tab1" tab="预处理">
          <er-grid
            v-if="initializeFlag === 1"
            :er-form-helper-prop="erFormHelper"
            :options="{ viewType: 'BandView' }"
            :config-id="'gridView1'"
            @erGridReady="erGrid1Ready"
          >
          </er-grid>
        </a-tab-pane>
         <a-tab-pane key="tab1_1" tab="转炉">
          <er-grid
            v-if="initializeFlag === 1"
            :er-form-helper-prop="erFormHelper"
            :options="{ viewType: 'BandView' }"
            :config-id="'gridView11'"
            @erGridReady="erGrid1Ready"
          >
          </er-grid>
        </a-tab-pane>
         <a-tab-pane key="tab1_2" tab="RH">
          <er-grid
            v-if="initializeFlag === 1"
            :er-form-helper-prop="erFormHelper"
            :options="{ viewType: 'BandView' }"
            :config-id="'gridView12'"
            @erGridReady="erGrid1Ready"
          >
          </er-grid>
        </a-tab-pane>
         <a-tab-pane key="tab1_3" tab="CC">
          <er-grid
            v-if="initializeFlag === 1"
            :er-form-helper-prop="erFormHelper"
            :options="{ viewType: 'BandView' }"
            :config-id="'gridView13'"
            @erGridReady="erGrid1Ready"
          >
          </er-grid>
        </a-tab-pane>
        <a-tab-pane key="tab2" tab="投料明细">
          <er-grid
            v-if="initializeFlag === 1"
            :er-form-helper-prop="erFormHelper"
            :toolbar-style="'both'"
            :config-id="'gridView2'"
            @erGridReady="erGrid2Ready"
          >
          </er-grid>
        </a-tab-pane>
        <a-tab-pane key="tab3" tab="成分明细">
          <er-grid
            v-if="initializeFlag === 1"
            :er-form-helper-prop="erFormHelper"
            :toolbar-style="'both'"
            :config-id="'gridView3'"
            @erGridReady="erGrid3Ready"
          >
          </er-grid>
        </a-tab-pane>
      </a-tabs>
    </template>
  </xr-ef-form>
</template>

<script lang="ts" src="./ZJXT01.ts"></script>

<style lang="scss" scoped>
@import "./ZJXT01.scss";
</style>
