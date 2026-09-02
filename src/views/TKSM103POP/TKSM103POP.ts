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
  name: "TKSM103POP",
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
    const formName = "TKSM103POP";
    const initializeFlag = ref(0);

    let dev_code = "";
    const parentInfo = ref(props.parentInfo); // 获取父画面传入参数
    //物料代码
    const proc_div = parentInfo.value?.PROC_DIV;
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
      } else {
        erFormHelper.messageError(
          "ErFormHelper initialize faild, error msg is [" +
            initialResult.msg +
            "]!"
        );
      }
    };
    const efFormInitialized = (formInfo: any) => {};
    const getDev = async () => {
      const paradev = erFormHelper.getAllControlValueAsEiBlock(
        "LayoutGroupFilterPath"
      );

      dev_code = "";
      if (paradev.data[0]["PATHZ"]?.toString() === "1") {
        dev_code += "Z";
      }
      if (paradev.data[0]["PATHE"]?.toString() === "1") {
        dev_code += "E";
      }
      if (paradev.data[0]["PATHB"]?.toString() === "1") {
        dev_code += "B";
      }
      if (paradev.data[0]["PATHA"]?.toString() === "1") {
        dev_code += "A";
      }
      if (paradev.data[0]["PATHS"]?.toString() === "1") {
        dev_code += "S";
      }
      if (paradev.data[0]["PATHF"]?.toString() === "1") {
        dev_code += "F";
      }
      if (paradev.data[0]["PATHR"]?.toString() === "1") {
        dev_code += "R";
      }
      if (paradev.data[0]["PATHV"]?.toString() === "1") {
        dev_code += "V";
      }
      if (paradev.data[0]["PATHC"]?.toString() === "1") {
        dev_code += "C";
      }
    };
    const F3_DO = async (e: any) => {
      const eiInfo = new EI.EIInfo();
      //获取工艺路径
      getDev();
      //获取钢种、工艺路径
      const parastno = erFormHelper.getAllControlValueAsEiBlock(
        "LayoutGroupFilterStno",
        { DEV_CODE: dev_code, PROC_DIV: proc_div }
      );

      if (
        parastno.data[0]["ST_NO"]?.toString().trim() === "" &&
        erFormHelper
          .getControlValue("LayoutGroupFilterStno", "ST_NO_NEW")
          ?.toString()
          .trim() === ""
      ) {
        erFormHelper.messageWarning("钢种不能为空！");
        return;
      }

      if (parastno.data[0]["ST_NO"]?.toString().trim() === "") {
        parastno.data[0]["ST_NO"] = erFormHelper.getControlValue(
          "LayoutGroupFilterStno",
          "ST_NO_NEW"
        );
      }
      eiInfo.addBlock(parastno);

      const outInfo = await erFormHelper.callService(
        "tksm10_save",
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
      closeEfDialog,
      efFormInitialized,
      F3_DO,
    };
  },
});
