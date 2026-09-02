import {
  defineComponent,
  onMounted,
  ref,
  reactive,
  computed,
  nextTick,
  toRaw,
  Ref,
} from "vue";
import { EI, EIManager } from "EIX/ei";
import xrEfDialog from "EFX/xrEfDialog";
import { ER } from "ERX/Er";
import { SiUtils } from "ERX/SiUtils";
import { FiUtils } from "ERX/FiUtils";
import xrEfForm from "EFX/xrEfForm";
import xrEfPanel from "EFX/xrEfPanel";
import erLayout from "ERX/ErLayout";
import erGrid from "ERX/ErGrid";
import ErPopFree from "ERX/ErPopFree";
import ErPopQuery from "ERX/ErPopQuery";

import { useRoute } from "vue-router";
import { PopQueryReturnInfo, PopFreeReturnInfo } from "ERX/er-type";

export default defineComponent({
  name: "TKBS02",
  components: {
    xrEfForm,
    xrEfPanel,
    erLayout,
    erGrid,
  },
  setup: () => {
    // 获取画面的分区信息及设置画面初始化service
    const initializeService = "tk00_be2_iniform";

    // 变量定义
    let formName: "TKBS02";
    let service2 = "tkbs02_inq";
    let service2_sub = "tkbs02_inq2";
    let service3 = " ";
    let service4 = " ";
    let service5 = " ";
    const initializeFlag = ref(0); 
    
    // 画面相关数据初始化
    let popFreeEdit: ER.PopFreeHelper;
    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    const efFormInfo = ref<{ [key: string]: any }>({});
    let formPartition: string;
    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      formPartition = efFormInfo.value.formPartition; // 分区
      formName = efFormInfo.value.formName;

      if (efFormInfo.value.formParams?.service2) {
        service2 = efFormInfo.value.formParams["service2"];
      }
      if (efFormInfo.value.formParams?.service2_sub) {
        service2_sub = efFormInfo.value.formParams["service2_sub"];
      }
      if (efFormInfo.value.formParams?.service3) {
        service3 = efFormInfo.value.formParams["service3"];
      }
      if (efFormInfo.value.formParams?.service4) {
        service4 = efFormInfo.value.formParams["service4"];
      }
      if (efFormInfo.value.formParams?.service5) {
        service5 = efFormInfo.value.formParams["service5"];
      }
      Initialize();
    };
    // 画面相关数据初始化
    const Initialize = async () => {
      const initialResult = await erFormHelper.Initialize(
        formPartition,
        formName,
        "",
        initializeService
      );
      if (initialResult.flag >= 0) {
        initializeFlag.value = 1;
        InitialToolbar();
        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {        
        });
      } else {
        erFormHelper.messageError(
          "ErFormHelper initialize faild, error msg is [" +
            initialResult.msg +
            "]!"
        );
      }
    };

    // 自定义工具栏按钮功能
    const InitialToolbar = () => {};

    //查询所有GridView信息(根据条件同时查询)
    const query = async () => {
      const eiInfo = new EI.EIInfo();
      const queryConditionEiBlock: EI.EiBlock =
        erFormHelper.getAllControlValueAsEiBlock("LayoutGroupFilter");
      eiInfo.addBlock(queryConditionEiBlock);
      
      const outInfo = await erFormHelper.callService(
        service2,
        eiInfo,
        true,
        false,
        true
      );

      // 判断调后台是否失败
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError("查询错误:" + outInfo.sys.msg);
      } else {
        erFormHelper.mergeEiBlockToGrid(outInfo.getBlock(0), 'gridView1');
        //erFormHelper.messageSuccess("查询成功");
      }     

    };

    const query_sub = async (eiBlock:any) => {

      erFormHelper.clearGridData("gridView2");
      const inInfo = new EI.EIInfo();      
      inInfo.addBlock(eiBlock);
      inInfo.addBlock(
        erFormHelper.getAllControlValueAsEiBlock("LayoutGroupFilter"),
        "PARA"
      );
      const outInfo = await erFormHelper.callService(
        service2_sub,
        inInfo,
        true,
        false,
        true
      );
      
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError("查询错误:" + outInfo.sys.msg);
      } else {  
        erFormHelper.mergeEiBlockToGrid(outInfo.getBlock(0), "gridView2");
      }
    } ;
  
    const gridView1FocusChanged = (e: any) => {
      if (e && e.data) {       
        let selectedMainGridRow: any = [];
        selectedMainGridRow = e.data.toJSON();
        const eiBlock = new EI.EiBlock();
        eiBlock.pushData(selectedMainGridRow, true);
        query_sub(eiBlock);  
      } 
    };
   

    const erGrid1Ready = () => {
      erFormHelper.setGridEditable('gridView1', false); // 设置grid不可编辑
    };

    const erGrid2Ready = () => {
      erFormHelper.setGridEditable('gridView2', false); // 设置grid不可编辑
    };  

    onMounted(() => {
      //Initialize();
    });

    const F2_DO = async (e: any) => {
      query();
    };   

    

    return {
      erFormHelper,
      initializeFlag,
      F2_DO,
      erGrid1Ready,
      erGrid2Ready,
      efFormReady,
      gridView1FocusChanged
    };
  },
});
