import { GridOptions } from "@ag-grid-community/core";
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
import TKSM10POP from "../TKSM10POP/TKSM10POP.vue";
import TKSM103POP from "../TKSM103POP/TKSM103POP.vue";
import TKSM105POP from "../TKSM105POP/TKSM105POP.vue";
import TKSM106POP from "../TKSM106POP/TKSM106POP.vue";
import TKSM107POP from "../TKSM107POP/TKSM107POP.vue";
import { Console } from "console";
export default defineComponent({
  name: "TKSM10",
  components: {
    xrEfForm,
    xrEfPanel,
    TKSM10POP,
    TKSM103POP,
    TKSM105POP,
    TKSM106POP,
    TKSM107POP,
    erLayout,
    erGrid,
    ErPopFree,
    xrEfDialog,
  },
  setup: () => {
    // 获取画面的分区信息及设置画面初始化service
    const initializeService = "mmsm_form_get";

    // 变量定义
    const formName = "TKSM10";
    const initializeFlag = ref(0);

    let gridView1!: any;
    let gridView2!: any;
    let gridView3!: any;

    const gridToolbar: Ref<any[]> = ref([]);

    const dialogFormName = ref("");

    let butFlag = ref("");
    const dialogVisible = ref(false);
    const parentInfo = ref({});
    // 点击按钮打开弹框
    const openXrEfDialog = (PROC_DIV: string) => {
      nextTick(() => {
        dialogVisible.value = true;
      });
    };
    const xrEfDialogClose = async () => {
      dialogVisible.value = false;
      queryGridViewAll();
    };
    // 获取弹窗画面传递过来的数据 新增
    const getChildInfo = (info: any) => {
      if (info.close) {
        xrEfDialogClose();
      }
    };
    const efFormInitialized = (formInfo: any) => {};
    // 自定义工具栏按钮功能
    const InitialToolbar = () => {};
    // 画面相关数据初始化
    let popFreeEdit: ER.PopFreeHelper;
    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    const efFormInfo = ref<{ [key: string]: any }>({});
    let formPartition: string;
    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      // efFormIsReady.value = true;
      formPartition = efFormInfo.value.formPartition; // 分区
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
        // 画面工具类初始化成功后将画面渲染条件设置为1
        initializeFlag.value = 1;
        InitialToolbar();
        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {
          // 获取画面上的主要控件信息
          gridView1 = erFormHelper.getGrid("gridView1");
          gridView2 = erFormHelper.getGrid("gridView2");
          gridView3 = erFormHelper.getGrid("gridView3");
        });
      } else {
        erFormHelper.messageError(
          "ErFormHelper initialize faild, error msg is [" +
            initialResult.msg +
            "]!"
        );
      }
    };

    //查询所有GridView信息(根据条件同时查询)
    const queryGridViewAll = async () => {
      const eiInfo = new EI.EIInfo();
      const queryConditionEiBlock: EI.EiBlock =
        erFormHelper.getAllControlValueAsEiBlock("LayoutGroupFilter", {
          PROC_DIV: "M",
        });
      eiInfo.addBlock(queryConditionEiBlock);
      console.log("225", eiInfo);
      const outInfo = await erFormHelper.callService(
        "tksm10_inq",
        eiInfo,
        true,
        false,
        true
      );

      // 判断调后台是否失败
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError("查询错误:" + outInfo.sys.msg);
      } else {
        // erFormHelper.mergeDataToLayoutOrGrid(outInfo, true, 'GridView1');
        console.log("outInfo", outInfo);
        erFormHelper.mergeEiBlockToGrid(outInfo.getBlock(0), "gridView1");
      }
    };

    const GridView1FocusChanged = async (e: any) => {
      //如果改变状态则不触发
      if (e && e.data) {
        let selectedMainGridRow: any = [];
        selectedMainGridRow = e.data.toJSON();
        const eiBlock = new EI.EiBlock();
        eiBlock.pushData(selectedMainGridRow, true);
        eiBlock.addColumn("PROC_DIV");
        eiBlock.data[0]["PROC_DIV"] = "S";
        query_sub(eiBlock);
      }
    };

    const erGrid1Ready = () => {
      gridView1 = erFormHelper.getGrid("gridView1");
      erFormHelper.setGridEditable("gridView1", false); // 设置grid不可编辑 getRowStyle
    };

    const erGrid2Ready = () => {
      erFormHelper.setGridEditable("gridView2", false); // 设置grid不可编辑
    };
    const erGrid3Ready = () => {
      erFormHelper.setGridEditable("gridView3", false); // 设置grid不可编辑
    };

    const query_sub = async (eiBlock: any) => {
      const inInfo = new EI.EIInfo();
      inInfo.addBlock(eiBlock);
      const outInfo = await erFormHelper.callService(
        "tksm10_inq",
        inInfo,
        true,
        false,
        true
      );
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError("查询错误:" + outInfo.sys.msg);
      } else {
        erFormHelper.mergeEiBlockToGrid(outInfo.getBlock(1), "gridView2");
        erFormHelper.mergeEiBlockToGrid(outInfo.getBlock(2), "gridView3");
      }
    };

    const F2_DO = async (e: any) => {
      queryGridViewAll();
    };
    const F3_DO = async (e: any) => {
      const data = {
        PROC_DIV: "I",
      };
      butFlag.value = "F3";
      dialogFormName.value = "TKSM103POP"; // 读配置表获取画面名
      parentInfo.value = data;
      openXrEfDialog("I");
    };
    const F4_DO = async (e: any) => {
      const inInfo = new EI.EIInfo();
      if (erFormHelper.getGridCheckedRows("gridView1").length === 0) {
        erFormHelper.messageWarning("请勾选信息再删除");
        return false;
      }
      const mes_res = await erFormHelper.messageConfirm(
        "选中的记录将被永久删除， 是否继续？"
      );
      if (!mes_res) {
        return false;
      }
      inInfo.addBlock(
        erFormHelper.getGridSelectRowsAsBlock("gridView1", { PROC_DIV: "D" })
      );
      const outInfo = await erFormHelper.callService(
        "tksm10_save",
        inInfo,
        true,
        false,
        true
      );
      if (outInfo.sys.status < 0) {
        erFormHelper.messageWarning("操作错误:" + outInfo.sys.msg);
        return false;
      } else {
        erFormHelper.messageSuccess("操作成功");
      }
      queryGridViewAll();
    };
    const F5_DO = async (e: any) => {
      const data = {
        PROC_DIV: "I",
      };
      butFlag.value = "F5";
      dialogFormName.value = "TKSM105POP"; // 读配置表获取画面名
      parentInfo.value = data;
      openXrEfDialog("I");
      queryGridViewAll();
    };
    const F6_DO = async (e: any) => {
      const data = {
        PROC_DIV: "I",
      };
      butFlag.value = "F6";
      dialogFormName.value = "TKSM106POP"; // 读配置表获取画面名
      parentInfo.value = data;
      openXrEfDialog("I");
      queryGridViewAll();
    };
    const F7_DO = async (e: any) => {
      const grid1data = erFormHelper.getGridCheckedRows("gridView1");
      if (grid1data.length === 0) {
        erFormHelper.messageWarning("请勾选碳排钢种路径");
        return false;
      }
      const data = {
        ST_NO: grid1data[0].ST_NO,
        WHOLE_BACKLOG: grid1data[0].WHOLE_BACKLOG,
        SEQ_NO: grid1data[0].SEQ_NO,
      };
      console.log("111", data);
      butFlag.value = "F7";
      dialogFormName.value = "TKSM107POP"; // 读配置表获取画面名
      parentInfo.value = data;
      openXrEfDialog("I");
      queryGridViewAll();
    };

    return {
      erFormHelper,
      initializeFlag,
      butFlag,
      F2_DO,
      F3_DO,
      F4_DO,
      F5_DO,
      F6_DO,
      F7_DO,
      efFormReady,
      erGrid1Ready,
      erGrid2Ready,
      erGrid3Ready,
      GridView1FocusChanged,
      efFormInitialized,
      dialogFormName,
      parentInfo,
      dialogVisible,

      getChildInfo,
      xrEfDialogClose,
    };
  },
});
