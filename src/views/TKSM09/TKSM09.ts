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
import { useRouter } from "vue-router";
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
import xrEfDrawer from "@/components/xr-ef-drawer.vue";

import * as echarts from "echarts";

export default defineComponent({
  name: "TKSM09",
  components: {
    erGrid,
    erLayout,
    xrEfForm,
    xrEfPanel,
    xrEfSearchBox,
    xrEfDialog,
  },
  setup: () => {
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
    const formName = "TKSM09";
    const $router = useRouter();
    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    const initializeFlag = ref(0);
    let gridView1!: any;

    // TAB2
    var data_carry1 = [
      { value: 0, name: "铁水" },
      { value: 0, name: "废钢" },
      { value: 0, name: "合金" },
      { value: 0, name: "辅料" },
      { value: 0, name: "电" },
      { value: 0, name: "热力" },
    ];

    var data_carry0 = [
      { value: 0, name: "铁水" },
      { value: 0, name: "废钢" },
      { value: 0, name: "合金" },
      { value: 0, name: "辅料" },
      { value: 0, name: "电" },
      { value: 0, name: "热力" },
    ];
    var data_carry2 = [
      { value: 0, name: "铁水" },
      { value: 0, name: "废钢" },
      { value: 0, name: "合金" },
      { value: 0, name: "辅料" },
      { value: 0, name: "电" },
      { value: 0, name: "热力" },
    ];

    //初始化低代码配置
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

        nextTick(() => {
          erFormHelper.setGridEditable("gridView1", false);
        });
      } else {
        erFormHelper.messageError(
          "ErFormHelper initialize faild, error msg is [" +
            initialResult.msg +
            "]!"
        );
      }
      Cahrlist(data_carry0);
      Cahrlist1(data_carry1);
      Cahrlist2(data_carry2);
    };
    const erGrid1Ready = () => {
      gridView1 = erFormHelper.getGrid("gridView1");
    };

    onMounted(() => {
      // initializePage();
    });
    const F2_DO = () => {
      loadData();
    };

    // 主表查询
    const loadData = async () => {
      //验证必填项
      const checked = erFormHelper.checkRequiredInput(["LayoutGroupFilter"]);
      if (!checked) {
        return;
      }
      const eiInfo = new EI.EIInfo();
      const eiBlock =
        erFormHelper.getAllControlValueAsEiBlock("LayoutGroupFilter");

      eiInfo.addBlock(eiBlock);
      erFormHelper.callService("tksm09_inq", eiInfo).then((res: EI.EIInfo) => {
        erFormHelper.mergeEiBlockToGrid(res.getBlock("Table0"), "gridView1");
      });
    };

    // 焦点行变换事件
    const gridView1FocusChanged = (e: any) => {
      if (e) {
        const params = erFormHelper.getAllControlValue("LayoutGroupFilter");
        const eiBlock = erFormHelper.addJsonToEiBlock(
          JSON.parse(JSON.stringify(e.data))
        );
        const name = {
          BEGIN_TIME: params["BEGIN_TIME"],
          END_TIME: params["END_TIME"],
          ST_NO: eiBlock.data[0]["ST_NO"]?.toString(), //获取焦点行某列的数据
          AC_ROUTE: eiBlock.data[0]["AC_ROUTE"]?.toString(), //获取焦点行某列的数据
        };
        getSubData(name); //获取履历明细和结果明细
      }
    };

    // 查询履历明细和结果明细
    // async:异步变同步
    const getSubData = async (params: any) => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = EI.EiBlock.build("Table0", [
        {
          BEGIN_TIME: params["BEGIN_TIME"],
          END_TIME: params["END_TIME"],
          ST_NO: params["ST_NO"],
          AC_ROUTE: params["AC_ROUTE"],
        },
      ]);

      eiInfo.addBlock(eiBlock);
      const outInfo = await erFormHelper.callService(
        "tksm09_inq2",
        eiInfo,
        true,
        false
      );

      if (outInfo.sys.status < 0) {
        erFormHelper.messageError("查询错误:" + outInfo.sys.msg);
        return;
      }
      var data_carry10 = [];
      for (let i = 0; i < outInfo.getBlock("Table0").data.length; i++) {
        const value_carry = outInfo.getBlock("Table0").data[i].VALUE;
        data_carry10.push({
          value: value_carry,
          name: outInfo.getBlock("Table0").data[i].NAME,
        });
        Cahrlist(data_carry10);
      }
      var data_carry11 = [];
      for (let i = 0; i < outInfo.getBlock("Table1").data.length; i++) {
        const value_carry = outInfo.getBlock("Table1").data[i].VALUE;
        data_carry11.push({
          value: value_carry,
          name: outInfo.getBlock("Table1").data[i].NAME,
        });
        Cahrlist1(data_carry11);
      }
      var data_carry12 = [];
      for (let i = 0; i < outInfo.getBlock("Table2").data.length; i++) {
        const value_carry = outInfo.getBlock("Table2").data[i].VALUE;
        data_carry12.push({
          value: value_carry,
          name: outInfo.getBlock("Table2").data[i].NAME,
        });
        Cahrlist2(data_carry12);
      }
    };

    const Cahrlist = (data_carry: any) => {
      const chartDom = document.getElementById("piechart");
      const myChart = echarts.init(chartDom);
      const option = {
        title: {
          text: "总碳排构成图",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: "50%",
            data: data_carry,
            label: {
              formatter: "{b}: {d}%", // {b}表示数据项名称，{d}表示百分比
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

      option && myChart.setOption(option);
    };

    const Cahrlist1 = (data_carry: any) => {
      const chartDom = document.getElementById("piechart1");
      const myChart = echarts.init(chartDom);
      const option = {
        title: {
          text: "直排构成图",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
          show: false,
        },
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: "50%",
            data: data_carry,
            label: {
              formatter: "{b}: {d}%", // {b}表示数据项名称，{d}表示百分比
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

      option && myChart.setOption(option);
    };

    const Cahrlist2 = (data_carry: any) => {
      const chartDom = document.getElementById("piechart2");
      const myChart = echarts.init(chartDom);
      const option = {
        title: {
          text: "上游构成图",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
          show: false,
        },
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: "50%",
            data: data_carry,
            label: {
              formatter: "{b}: {d}%", // {b}表示数据项名称，{d}表示百分比
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

      option && myChart.setOption(option);
    };

    return {
      initializeFlag,
      erFormHelper,
      efFormReady,
      erGrid1Ready,
      loadData,
      F2_DO,
      gridView1FocusChanged,
    };
  },
});
