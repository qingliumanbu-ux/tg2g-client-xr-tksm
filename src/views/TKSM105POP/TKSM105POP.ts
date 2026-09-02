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
  name: "TKSM105POP",
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
    const formName = "TKSM105POP";
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
        });
        const eiInfo = new EI.EIInfo();
        const eiBlock =
          erFormHelper.getAllControlValueAsEiBlock("LayoutGroupFilter");
        eiInfo.addBlock(eiBlock, "Table0");
        erFormHelper
          .callService("tk0001_inq", eiInfo, true, true, true)
          .then((res) => {
            const mainData = res.blocks["Table0"].data;
            nextTick(() => {
              erFormHelper.mergeDataToGrid(mainData, gridView1);
            });
          });
      } else {
        erFormHelper.messageError(
          "ErFormHelper initialize faild, error msg is [" +
            initialResult.msg +
            "]!"
        );
      }
    };
    const erGrid1Ready = () => {
      gridView1 = erFormHelper.getGrid("gridView1");
      erFormHelper.setGridEditable("gridView1", false); // 设置grid不可编辑 getRowStyle
    };
    const efFormInitialized = (formInfo: any) => {};

    const F3_DO = async (e: any) => {
      const eiInfo = new EI.EIInfo();
      if (erFormHelper.getGridCheckedRows("gridView1").length === 0) {
        erFormHelper.messageWarning("请勾选信息");
        return false;
      }
      for (let item1 of erFormHelper.getGridSelectRows("gridView1")) {
        if (item1.DEVO_WT === 0) {
          erFormHelper.messageWarning(item1.MAT_CODE + "重量不能为0！");
          return false;
        }
      }
      //获取物料代码
      eiInfo.addBlock(
        erFormHelper.getGridSelectRowsAsBlock("gridView1", { PROC_DIV: "I" }),
        "PARA"
      );

      const outInfo = await erFormHelper.callService(
        "tksm10_pf_save",
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
    const F3_PRE_DO = async (e: any) => {
      erFormHelper.setGridEditable("gridView1", true);
      erFormHelper.setGridColumnEditable(gridView1, false, "MAT_CODE");
      erFormHelper.setGridColumnEditable(gridView1, false, "MAT_NAME");
      erFormHelper.setGridColumnEditable(gridView1, false, "TYPE_CODE");
      erFormHelper.setGridColumnEditable(gridView1, false, "TYPE_DESC");
      erFormHelper.setGridColumnEditable(gridView1, false, "UNIT");
    };
    const F3_CANCEL = async (e: any) => {
      erFormHelper.setGridEditable("gridView1", false);
      closeEfDialog();
    };
    const closeEfDialog = () => {
      const data = {
        close: true,
      };
      emit("getChildInfo", data);
    };

    const butClickMat = async (e: any) => {
      if (e.itemCode == "BUTTON") {
        const eiInfo = new EI.EIInfo();
        const eiBlock =
          erFormHelper.getAllControlValueAsEiBlock("LayoutGroupFilter");
        eiInfo.addBlock(eiBlock, "Table0");
        erFormHelper
          .callService("tk0001_inq", eiInfo, true, true, true)
          .then((res) => {
            const mainData = res.blocks["Table0"].data;
            nextTick(() => {
              erFormHelper.mergeDataToGrid(mainData, gridView1);
            });
          });
      }
    };

    return {
      erFormHelper,
      initializeFlag,
      efFormReady,
      erGrid1Ready,
      closeEfDialog,
      efFormInitialized,
      butClickMat,
      F3_DO,
      F3_PRE_DO,
      F3_CANCEL,
    };
  },
});
