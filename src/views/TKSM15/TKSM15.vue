<template>
  <div style="height: 100%">
    <xr-ef-form @ready="efFormReady" :f2-do="F2_DO">
      <div style="height: 20%" class="tktop">
        <div v-for="(item, index) in tktopList" class="card">
          <div id="{{item}}" style="
              background: #78bb7b;
              border-radius: 8px ;
              height: 100%;
              text-align: center;
              flex-direction: column;
              justify-content: space-around;
              color: aliceblue;
            ">
            <img :src="item.src" alt="" style="height: 20px; margin: 2%" />碳钢
            <div style=" display: flex; justify-content: space-around; font-size: 20px; 
              flex-direction: column; ">
              <div class=" tip">{{ item.title }}
              </div>
              <div class="tip">{{ item.data }}{{ item.unit }}</div>
            </div>
          </div>
        </div>
      </div>
      <div style="height: 20%" class="tktop">
        <div v-for="(item, index) in tktopList2" class="card">
          <div id="{{item}}" style="
              background: #78bb7b;
              border-radius: 8px;
              height: 100%;
              text-align: center;
              flex-direction: column;
              justify-content: space-around;
              color: aliceblue;
            ">
            <img :src="item.src" alt="" style="height: 20px; margin: 2%" />不锈钢
            <div style=" display: flex; justify-content: space-around; font-size: 20px; 
              flex-direction: column; ">
              <div class=" tip">{{ item.title }}
              </div>
              <div class="tip">{{ item.data }}{{ item.unit }}</div>
            </div>
          </div>
        </div>
      </div>
      <xr-ef-panel style="height: 100%" padding="5px" boder="false" title="明细信息">
        <template #customButtonSlot> </template>
        <template v-if="initializeFlag === 1" #contentSlot>
          <er-grid :er-form-helper-prop="erFormHelper" :config-id="'gridView1'" @erGridReady="erGrid1Ready">
          </er-grid>
        </template>
      </xr-ef-panel>
    </xr-ef-form>
  </div>
</template>
<script lang="ts" src="./TKSM15.ts"></script>

<style lang="scss" scoped>
@import "./TKSM15.scss";
</style>
