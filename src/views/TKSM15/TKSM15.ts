//import { data } from 'jquery';
import { defineComponent, onMounted, ref, reactive, nextTick } from "vue";
import { EI, EIManager } from "EIX/ei";
import xrEfForm from "EFX/xrEfForm";
import xrEfPanel from "EFX/xrEfPanel";

import erLayout from "ERX/ErLayout";
import erGrid from "ERX/ErGrid";
import { ER } from "ERX/Er";
import image from "@/assets/tkly.png";
export default defineComponent({
  name: "TKSM15",
  components:  {
    xrEfForm,
    xrEfPanel,
    erLayout,
    erGrid,
  },
  setup: () => {
    // 获取画面的分区信息及设置画面初始化service
    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    const efFormInfo = ref<{ [key: string]: any }>({});
    const bunker = reactive(new Array());
    let formName: string;
    let formPartition: string;
    const initializeFlag = ref(0);
    let gridView1: any;
    const tktopList = reactive([
      {
        src: image,
        title: "日产量",
        data: 0,
        unit: "吨",
      },
      {
        src: image,
        title: "累计产量",
        data: "0",
        unit: "吨",
      },
      {
        src: image,
        title: "日成本",
        data: "0",
        unit: "元",
      },
      {
        src: image,
        title: "累计成本",
        data: "0",
        unit: "元",
      },
      {
        src: image,
        title: "日碳强度",
        data: "0",
        unit: "吨",
      },
      {
        src: image,
        title: "累计碳强度",
        data: "0",
        unit: "吨",
      },
      {
        src: image,
        title: "日碳成本",
        data: "0",
        unit: "元",
      },
      {
        src: image,
        title: "累计碳成本",
        data: "0",
        unit: "元",
      },
    ]);

    const tktopList2 = reactive([
      {
        src: image,
        title: "日产量",
        data: 0,
        unit: "吨",
      },
      {
        src: image,
        title: "累计产量",
        data: "0",
        unit: "吨",
      },
      {
        src: image,
        title: "日成本",
        data: "0",
        unit: "元",
      },
      {
        src: image,
        title: "累计成本",
        data: "0",
        unit: "元",
      },
      {
        src: image,
        title: "日碳强度",
        data: "0",
        unit: "吨",
      },
      {
        src: image,
        title: "累计碳强度",
        data: "0",
        unit: "吨",
      },
      {
        src: image,
        title: "日碳成本",
        data: "0",
        unit: "元",
      },
      {
        src: image,
        title: "累计碳成本",
        data: "0",
        unit: "元",
      },
    ]);

    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      formPartition = efFormInfo.value.formPartition; // 分区
      formName = efFormInfo.value.formName; // 当前画面名
      initializePage();
    };
    const erGrid1Ready = () => {
      gridView1 = erFormHelper.getGrid("gridView1");
      erFormHelper.setGridEditable("gridView1", false); // 设置grid不可编辑
    };

    // 画面相关数据初始化
    const initializePage = async () => {
      const initialResult = await erFormHelper.Initialize(
        efFormInfo.value.formPartition,
        formName,
        "",
        ""
      );
      if (initialResult.flag >= 0) {
        // 画面工具类初始化成功后将画面渲染条件设置为1
        initializeFlag.value = 1;
        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {
          // 获取画面上的主要控件信息
          QueryData();
        });
      } else {
        erFormHelper.messageError(
          "ErFormHelper initialize faild, error msg is [" +
            initialResult.msg +
            "]!"
        );
      }
    };
    const QueryData = async () => {
      const inInfo = new EI.EIInfo();
      const eiBlock =
        erFormHelper.getAllControlValueAsEiBlock("LayoutGroupFilter");
      inInfo.addBlock(eiBlock);
      EIManager.callService(
        efFormInfo.value.formPartition,
        "tksm15_inq",
        inInfo
      ).then((res: EI.EIInfo) => {
        erFormHelper.mergeEiBlockToGrid(res.getBlock("Table0"), "gridView1");
        const data = res.blocks.Table1.data[0] as { [key: string]: any };
        tktopList[0].data = data["日产量"].toFixed(3);
        tktopList[1].data = data["累计产量"].toFixed(3);
        tktopList[2].data = data["日成本"].toFixed(2);
        tktopList[3].data = data["累计成本"].toFixed(2);
        tktopList[4].data = data["日碳排量"].toFixed(4);
        tktopList[5].data = data["累计碳排量"].toFixed(4);
        tktopList[6].data = data["日碳成本"].toFixed(2);
        tktopList[7].data = data["累计碳成本"].toFixed(2);

        tktopList2[0].data = data["不锈钢日产量"].toFixed(3);
        tktopList2[1].data = data["不锈钢累计产量"].toFixed(3);
        tktopList2[2].data = data["不锈钢日成本"].toFixed(2);
        tktopList2[3].data = data["不锈钢累计成本"].toFixed(2);
        tktopList2[4].data = data["不锈钢日碳排量"].toFixed(4);
        tktopList2[5].data = data["不锈钢累计碳排量"].toFixed(4);
        tktopList2[6].data = data["不锈钢日碳成本"].toFixed(2);
        tktopList2[7].data = data["不锈钢累计碳成本"].toFixed(2);
      });
    };

    onMounted(() => {});

    const F2_DO = async (e: any) => {
      QueryData();
    };

    return {
      erFormHelper,
      initializeFlag,
      efFormReady,
      erGrid1Ready,
      F2_DO,
      gridView1,
      tktopList,
      tktopList2,
    };
  },
});
