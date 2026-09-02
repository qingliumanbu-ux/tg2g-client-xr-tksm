import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch,
  toRaw,
  nextTick,
} from "vue";
import { EI } from "EIX/ei";
import xrEfForm from "EFX/xrEfForm";
import xrEfPanel from "EFX/xrEfPanel";
import xrEfSearchBox from "EFX/xrEfSearchBox";
import xrEfDialog from "EFX/xrEfDialog";
import EFUtility from "EFX/EFUtility";
import eBFR from "EFX/eBFR";

import erLayout from "ERX/ErLayout";
import erGrid from "ERX/ErGrid";
import { ER } from "ERX/Er";
import { SiUtils } from "ERX/SiUtils";
import { FiUtils } from "ERX/FiUtils";
import { useRouter } from "vue-router";

import * as echarts from "echarts";

export default defineComponent({
  name: "TKSM06",
  components: {
    erGrid,
    erLayout,
    xrEfForm,
    xrEfPanel,
    xrEfSearchBox,
    xrEfDialog,

  },
  setup: () => {
    // 获取画面的分区信息及设置画面初始化service
    const efFormInfo = ref<{ [key: string]: any }>({});
    const efFormIsReady = ref(false);
    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      efFormIsReady.value = true;
      formPartition.value = efFormInfo.value.formPartition;
      // 初始化低代码工具类
      initializePage();
    };
    const formPartition = ref("");
    const initializeService = "tk00_be2_iniform";
    const $router = useRouter();
    // 变量定义
    const formName = "TKSM06";
    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    const initializeFlag = ref(0);
    let gridView1!: any;
    let data_carry1: any = [];
    let data_carry2: any = [];
    let data_column: any = []; //x轴字段
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

        // erFormHelper.setGridToolbarPosition('gridView2', 'bottom');

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

    onMounted(() => {
      //initializePage();
    });

    const F2_DO = async (e: any) => {
      query();
    };

    // 主表查询
    const query = async () => {
      const layoutGroupFilterValue =
        erFormHelper.getAllControlValue("LayoutGroupFilter");
      const eiInfo = new EI.EIInfo();
      const eiBlock =
        erFormHelper.getAllControlValueAsEiBlock("LayoutGroupFilter");

      eiInfo.addBlock(eiBlock);

      const outInfo = await erFormHelper.callService(
        "tksm06_inq",
        eiInfo,
        true,
        false,
        true
      );

      if (outInfo.sys.status < 0) {
        erFormHelper.messageError("查询错误:" + outInfo.sys.msg);
        return;
      }

      data_carry1 = [];
      data_carry2 = [];
      data_column = [];

      for (let i = 0; i < outInfo.getBlock("Table0").data.length; i++) {
        const value_carry = outInfo.getBlock("Table0").data[i].TOTAL_AMT;
        data_carry1.push(value_carry);
        const value_carry2 = outInfo.getBlock("Table0").data[i].prod_wt;
        data_carry2.push(value_carry2);
        const value_column = outInfo.getBlock("Table0").data[i].PROD_DATE;
        data_column.push(value_column);
      }
      const chartDom = document.getElementById("container");
      const myChart = echarts.init(chartDom);
      const option = {
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["碳排", "标准"],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: data_column,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "碳排",
            type: "line",
            data: data_carry1,
          },
          {
            name: "标准",
            type: "line",
            data: data_carry2,
          },
        ],
      };

      option && myChart.setOption(option);
    };

    return {
      erFormHelper,
      initializeFlag,
      efFormReady,
      F2_DO,
      query,
    };
  },
});
