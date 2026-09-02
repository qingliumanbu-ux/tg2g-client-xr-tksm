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
  name: "TKSM107POP",
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
    const formName = "TKSM107POP";
    const initializeFlag = ref(0);

    let gridView1!: any;
    let mat_codes = "";
    let dev_code = "";
    // 自定义工具栏按钮功能
    const InitialToolbar = () => {};

    // 画面相关数据初始化
    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    const efFormInfo = ref<{ [key: string]: any }>({});
    let formPartition: string;
    const parentInfo = ref(props.parentInfo); // 获取父画面传入参数
    const ST_NO = parentInfo.value?.ST_NO;
    const WHOLE_BACKLOG = parentInfo.value?.WHOLE_BACKLOG;
    const SEQ_NO = parentInfo.value?.SEQ_NO;
    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      // efFormIsReady.value = true;
      formPartition = efFormInfo.value.formPartition; // 分区
      Initialize();
    };
    const erGrid1Ready = () => {
      gridView1 = erFormHelper.getGrid("gridView1");
      erFormHelper.setGridEditable("gridView1", false); // 设置grid不可编辑 getRowStyle
    };
    const erGrid2Ready = () => {
      gridView1 = erFormHelper.getGrid("gridView2");
      erFormHelper.setGridEditable("gridView2", false); // 设置grid不可编辑 getRowStyle
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

          erFormHelper.setAllControlReadOnly("LayoutGroupFilterStno", true);
          erFormHelper.setAllControlReadOnly("LayoutGroupFilterPath", true);
          erFormHelper.setControlValue("LayoutGroupFilterStno", "ST_NO", ST_NO);
          erFormHelper.setControlValue(
            "LayoutGroupFilterPath",
            "PATHZ",
            WHOLE_BACKLOG
          );
          if (WHOLE_BACKLOG.toString().includes("Z")) {
            erFormHelper.setControlValue(
              "LayoutGroupFilterPath",
              "PATHE",
              true
            );
          }
          if (WHOLE_BACKLOG.toString().includes("B")) {
            erFormHelper.setControlValue(
              "LayoutGroupFilterPath",
              "PATHB",
              true
            );
          }
          if (WHOLE_BACKLOG.toString().includes("A")) {
            erFormHelper.setControlValue(
              "LayoutGroupFilterPath",
              "PATHA",
              true
            );
          }
          if (WHOLE_BACKLOG.toString().includes("S")) {
            erFormHelper.setControlValue(
              "LayoutGroupFilterPath",
              "PATHS",
              true
            );
          }
          if (WHOLE_BACKLOG.toString().includes("F")) {
            erFormHelper.setControlValue(
              "LayoutGroupFilterPath",
              "PATHF",
              true
            );
          }
          if (WHOLE_BACKLOG.toString().includes("R")) {
            erFormHelper.setControlValue(
              "LayoutGroupFilterPath",
              "PATHR",
              true
            );
          }
          if (WHOLE_BACKLOG.toString().includes("V")) {
            erFormHelper.setControlValue(
              "LayoutGroupFilterPath",
              "PATHV",
              true
            );
          }
          if (WHOLE_BACKLOG.toString().includes("C")) {
            erFormHelper.setControlValue(
              "LayoutGroupFilterPath",
              "PATHC",
              true
            );
          }
        });

        query();
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

    const efFormInitialized = (formInfo: any) => {};

    const F3_DO = async (e: any) => {
      const eiInfo = new EI.EIInfo();
      const grid2data = erFormHelper.getGridCheckedRows("gridView1");
      if (grid2data.length === 0) {
        erFormHelper.messageWarning("请勾选配方信息");
        return false;
      }

      eiInfo.addBlock(
        erFormHelper.getGridSelectRowsAsBlock(
          "gridView1",
          {
            ST_NO: ST_NO,
            WHOLE_BACKLOG: WHOLE_BACKLOG,
            SEQ_NO: SEQ_NO,
          },
          true
        ),
        "Table0"
      );
      const outInfo = await erFormHelper.callService(
        "tksm10_pf_conn",
        eiInfo,
        true,
        false,
        true
      );

      // 判断调后台是否失败
      if (outInfo.sys.status < 0) {
        erFormHelper.messageWarning("保存错误:" + outInfo.sys.msg);
        return false;
      } else {
        erFormHelper.messageSuccess("保存成功");
        //同时录成分 不关闭弹窗
        closeEfDialog();
      }
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
    const closeEfDialog = () => {
      const data = {
        close: true,
      };
      emit("getChildInfo", data);
    };

    return {
      erFormHelper,
      initializeFlag,

      efFormReady,
      erGrid1Ready,
      erGrid2Ready,
      GridView1FocusChanged,
      closeEfDialog,
      efFormInitialized,
      F3_DO,
    };
  },
});
