import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch,
  toRaw,
  nextTick,
  Ref,
} from "vue";
import xrEfDialog from "EFX/xrEfDialog";
import { EI, EIManager } from "EIX/ei";
import { ER } from "ERX/Er";

import xrEfForm from "EFX/xrEfForm";
import xrEfPanel from "EFX/xrEfPanel";
import erLayout from "ERX/ErLayout";
import erGrid from "ERX/ErGrid";
export default defineComponent({
  name: "TKSM106POP",
  components: {
    xrEfForm,
    xrEfPanel,
    erLayout,
    erGrid,
    xrEfDialog,
  },
  props: {
    openInDialog: {
      type: Boolean,
      default: false,
    },
    dialogFormName: {
      type: String,
      default: "",
    },
    parentInfo: {
      type: Object,
    },
  },
  emits: ["getChildInfo"],
  setup: (props, { emit }) => {
    // 获取画面的分区信息及设置画面初始化service
    const initializeService = "mmsm_form_get";

    // 变量定义
    const formName = "TKSM106POP";
    const initializeFlag = ref(0);
    const mainGridData = ref<any>([]);
    const subGridData = ref<any>([]);
    let SEQ_NO_RECIPE: any;
    let gridView1!: any;
    let gridView2!: any;
    let mat_codes = "";
    let dev_code = "";
    // 自定义工具栏按钮功能
    const InitialToolbar = () => {};
    // 画面相关数据初始化
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
          query();
        });
      } else {
        erFormHelper.messageError(
          "ErFormHelper initialize faild, error msg is [" +
            initialResult.msg +
            "]!"
        );
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
      gridView2 = erFormHelper.getGrid("gridView2");
      erFormHelper.setGridEditable("gridView2", false); // 设置grid不可编辑 getRowStyle
    };
    const efFormInitialized = (formInfo: any) => {};

    const F3_DO = async (e: any) => {
      const inInfo = new EI.EIInfo();
      if (erFormHelper.getGridCheckedRows("gridView1").length === 0) {
        erFormHelper.messageWarning("请勾选左边配方信息再删除");
        return false;
      }
      const mes_res = await erFormHelper.messageConfirm(
        "选中的记录将被永久删除， 是否继续？"
      );
      if (!mes_res) {
        return false;
      }
      inInfo.addBlock(
        erFormHelper.getGridSelectRowsAsBlock("gridView1", { PROC_DIV: "D" }),
        "PARA"
      );
      const outInfo = await erFormHelper.callService(
        "tksm10_pf_save",
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
      query();
    };
    const F4_DO = async (e: any) => {
      erFormHelper.stopGridEditing("gridView2", async () => {
        erFormHelper.setGridToolbarVisible("gridView2", {
          addrow: false,
          copyrow: false,
          delete: false,
        });
        return await saveMainGridData()
          .then((res: any) => {
            erFormHelper.setGridEditable("gridView2", false);
          })
          .catch((error) => {
            erFormHelper.messageError(error);
            return false;
          });
        query();

        erFormHelper.setGridIndicator("gridView1", {
          SEQ_NO_RECIPE: SEQ_NO_RECIPE,
        });
      });
    };
    const F4_PRE_DO = async (e: any) => {
      erFormHelper.setGridToolbarVisible("gridView2", {
        addrow: true,
        delete: true,
      });
      erFormHelper.setGridEditable("gridView2", true);
      erFormHelper.setGridColumnEditable("gridView2", false, "CO2_COE");
      erFormHelper.setGridColumnEditable("gridView2", false, "CO2_WT");
      erFormHelper.setGridColumnEditable("gridView2", false, "MAT_NAME");
    };
    const F4_CANCEL = async (e: any) => {
      erFormHelper.setGridToolbarVisible("gridView2", {
        addrow: false,
        delete: false,
      });
      erFormHelper.setGridEditable("gridView2", false);
      closeEfDialog();
    };

    const closeEfDialog = () => {
      const data = {
        close: true,
      };
      emit("getChildInfo", data);
    };
    const query = async () => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = erFormHelper.getAllControlValueAsEiBlock(
        "LayoutGroupFilter",
        { PROC_DIV: "M" }
      );
      eiInfo.addBlock(eiBlock, "Table0");
      erFormHelper
        .callService("tksm10_pf_inq", eiInfo, true, true, true)
        .then((res) => {
          const mainData = res.blocks["Table0"].data;
          nextTick(() => {
            erFormHelper.mergeDataToGrid(mainData, "gridView1");
            erFormHelper.setGridEditable("gridView1", false);
            erFormHelper.setGridEditable("gridView2", false);
          });
        });
      erFormHelper.clearGridData("gridView2");
    };
    const query_sub = async (eiBlock: any) => {
      const inInfo = new EI.EIInfo();
      inInfo.addBlock(eiBlock);
      const outInfo = await erFormHelper.callService(
        "tksm10_pf_inq",
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
    };
    const saveMainGridData = async () => {
      if (erFormHelper.hasDataChange("gridView2")) {
        const eiinfo = new EI.EIInfo();
        const created = erFormHelper.getGridRowsAsBlock(gridView2, "add");
        eiinfo.addBlock(created, "ADD_S");

        const updated = erFormHelper.getGridRowsAsBlock(gridView2, "modify");
        eiinfo.addBlock(updated, "UPD_S");

        const deleted = erFormHelper.getGridRowsAsBlock(gridView2, "delete");
        eiinfo.addBlock(deleted, "DEL_S");

        const grid1data = erFormHelper.getGridCurrentRowAsBlock("gridView1");
        if (erFormHelper.getGridDataCount("gridView1") !== 0) {
          eiinfo.addBlock(grid1data, "MAIN");
          SEQ_NO_RECIPE = grid1data.data[0]["SEQ_NO_RECIPE"];
        }
        console.log("0307", eiinfo);
        erFormHelper
          .callService("tksm10_pf_save", eiinfo, true, true, true)
          .then((res) => {
            subGridData.value = res.getBlock("Table0").data;
          });
      }
    };
    return {
      erFormHelper,
      initializeFlag,
      F3_DO,
      F4_DO,
      F4_PRE_DO,
      F4_CANCEL,
      efFormReady,
      erGrid1Ready,
      erGrid2Ready,
      GridView1FocusChanged,
      closeEfDialog,
      efFormInitialized,
    };
  },
});
