import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch,
  toRaw,
  nextTick,
  effect,
  unref,
} from "vue";
import { EI } from "EIX/ei";
import xrEfForm from "EFX/xrEfForm";
import xrEfPanel from "EFX/xrEfPanel";
import xrEfSearchBox from "EFX/xrEfSearchBox";
import xrEfDialog from "EFX/xrEfDialog";
import erLayout from "ERX/ErLayout";
import erGrid from "ERX/ErGrid";
import { ER } from "ERX/Er";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "ZJXT01",
  components: {
    xrEfForm,
    xrEfPanel,
    xrEfSearchBox,
    xrEfDialog,
    erGrid,
    erLayout,
    useRoute,
  },
  setup: () => {
    // 变量定义
    const formPartition = ref("");
    const efFormInfo = ref<{
      [key: string]: any;
    }>({});
    const efFormIsReady = ref(false);
    const tabActiveKey = ref("tab1");
    let tabFlag = 1;
    let gridView1!: any;
    let gridView11!: any;
    let gridView12!: any;
    let gridView13!: any;
    let gridView2!: any;
    let gridView3!: any;

    // xr-ef-form提供了ready事件, 在这里获取画面配置信息
    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      efFormIsReady.value = true;
      formPartition.value = efFormInfo.value.formPartition;
      // 初始化低代码工具类
      initializePage();
    };
    const erGrid1Ready = () => {
      gridView1 = erFormHelper.getGrid("gridView1");
      gridView11 = erFormHelper.getGrid("gridView11");
      gridView12 = erFormHelper.getGrid("gridView12");
      gridView13 = erFormHelper.getGrid("gridView13");
    };
    const erGrid2Ready = () => {
      gridView2 = erFormHelper.getGrid("gridView2");
    };
    const erGrid3Ready = () => {
      gridView3 = erFormHelper.getGrid("gridView3");
    };
    const formName = "ZJXT01";
    const erFormHelper: ER.FormHelper = new ER.FormHelper() as any;
    const initializeFlag = ref(0);
    const initializeService = "";

    // 画面相关数据初始化
    const initializePage = async () => {
      const initialResult = await erFormHelper.Initialize(
        formPartition.value,
        formName,
        "",
        initializeService
      );
      if (initialResult.flag >= 0) {
        // 画面工具类初始化成功后将画面渲染条件设置为1
        initializeFlag.value = 1;

        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {
          // 获取画面上的主要控件信息
        });
      } else {
        erFormHelper.messageError(
          "ErFormHelper initialize faild, error msg is [" +
          initialResult.msg +
          "]!"
        );
      }
    };

    onMounted(() => { });
    const F2_DO = async (e: any) => {
      getData();
    };
    const getData = async () => {
      const eiBlock = erFormHelper.getAllControlValueAsEiBlock(
        "LayoutGroupFilter",
        { tabFlag: tabFlag }
      );
      const eiInfo = new EI.EIInfo();
      eiInfo.addBlock(eiBlock);
      const outInfo = await erFormHelper.callService("zjxt01_inq", eiInfo);
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError("f2查询报错:" + outInfo.sys.msg);
        return false;
      }
      if (tabFlag === 1) {
        erFormHelper.mergeDataToGrid(outInfo.getBlock(0), gridView1);
      } else if (tabFlag === 2) {
        erFormHelper.mergeDataToGrid(outInfo.getBlock(1), gridView2);
      } else if (tabFlag === 3) {
        erFormHelper.mergeDataToGrid(outInfo.getBlock(2), gridView3);
      } else if (tabFlag === 11) {
        erFormHelper.mergeDataToGrid(outInfo.getBlock(0), gridView11);
      } else if (tabFlag === 12) {
        erFormHelper.mergeDataToGrid(outInfo.getBlock(0), gridView12);
      } else if (tabFlag === 13) {
        erFormHelper.mergeDataToGrid(outInfo.getBlock(0), gridView13);
      }
    };
    const handleTabChange = (activeKey: string) => {
      console.log("tab", tabActiveKey);
      if (activeKey === "tab1") {
        tabFlag = 1;
      } else if (activeKey === "tab2") {
        tabFlag = 2;
      } else if (activeKey === "tab3") {
        tabFlag = 3;
      } else if (activeKey === "tab1_1") {
        tabFlag = 11;
      } else if (activeKey === "tab1_2") {
        tabFlag = 12;
      } else if (activeKey === "tab1_3") {
        tabFlag = 13;
      }
      getData();
    };

    return {
      efFormReady,
      erGrid1Ready,
      erGrid2Ready,
      erGrid3Ready,
      handleTabChange,
      tabActiveKey,
      erFormHelper,
      initializeFlag,
      F2_DO,
    };
  },
});
