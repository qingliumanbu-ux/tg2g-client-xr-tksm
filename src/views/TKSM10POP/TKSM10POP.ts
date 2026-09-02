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
  name: "TKSM10POP",
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
    const formName = "TKSM10POP";
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
      }
    };
    const erGrid1Ready = () => {
      gridView1 = erFormHelper.getGrid("gridView1");
      erFormHelper.setGridEditable("gridView1", false); // 设置grid不可编辑 getRowStyle
    };
    const efFormInitialized = (formInfo: any) => {};

    onMounted(() => {
      Initialize();
    });
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

      if (dev_code.toString().trim() === "") {
        erFormHelper.messageWarning("工艺路径不能为空！");
        return;
      }
    };
    const F2_DO = async (e: any) => {};
    const F3_DO = async (e: any) => {
      const eiInfo = new EI.EIInfo();
      const paramat = erFormHelper.getAllControlValueAsEiBlock(
        "LayoutGroupFilterMat"
      );
      //获取工艺路径
      getDev();
      //获取钢种、工艺路径
      const parastno = erFormHelper.getAllControlValueAsEiBlock(
        "LayoutGroupFilterStno",
        { DEV_CODE: dev_code }
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

      for (let item1 of erFormHelper.getGridSelectRows("gridView1")) {
        if (item1.DEVO_WT === 0) {
          erFormHelper.messageWarning(item1.MAT_CODE + "重量不能为0！");
          return false;
        }
      }

      //获取物料代码
      eiInfo.addBlock(
        erFormHelper.getGridSelectRowsAsBlock("gridView1"),
        "Table0"
      );

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
    const butClickStno = async (e: any) => {
      if (e.itemCode == "BUTTON") {
        //用于检验
        getDev();
        const eiInfo = new EI.EIInfo();
        const eiBlock = erFormHelper.getAllControlValueAsEiBlock(
          "LayoutGroupFilterStno",
          { DEV_CODE: dev_code }
        );
        eiInfo.addBlock(eiBlock, "Table0");
        console.log("1111", eiInfo);
        erFormHelper
          .callService("tksm10_stno_save", eiInfo, true, true, true)
          .then((res) => {
            const mainData = res.blocks["Table0"].data;
            nextTick(() => {
              erFormHelper.mergeDataToGrid(mainData, gridView1);
            });
          });
        erFormHelper.reloadDropDownDataSource("LayoutGroupFilterStno", "ST_NO");
      }
    };
    const rowSelected = (e: any) => {
      // 常用属性
      // e.data为当前选中行数据
      // e.rowIndex为当前选中行的的行号
      // e.type为当前类型
      // e.node.selected表示是否勾选
      // 在这里写入事件
      console.log(e, "rowSelected");
      if (e.node.selected) {
        mat_codes += e.data["MAT_CODE"] + "\n";
        erFormHelper.setControlValue(
          "LayoutGroupFilterMat",
          "MAT_CODE",
          mat_codes
        );
      }
      if (!e.node.selected) {
        mat_codes = mat_codes.replace(e.data["MAT_CODE"] + "\n", "");
        erFormHelper.setControlValue(
          "LayoutGroupFilterMat",
          "MAT_CODE",
          mat_codes
        );
      }
    };

    return {
      erFormHelper,
      initializeFlag,
      F2_DO,
      efFormReady,
      erGrid1Ready,
      GridView1FocusChanged,
      closeEfDialog,
      efFormInitialized,
      butClickMat,
      butClickStno,
      rowSelected,
      F3_DO,
      F3_PRE_DO,
      F3_CANCEL,
    };
  },
});
