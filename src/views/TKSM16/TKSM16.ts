import { EI, EIManager } from "EIX/ei";
import { onMounted, reactive, ref } from "vue";
import { defineComponent } from "vue";
import * as echarts from "echarts";
import { ER } from "ERX/Er";
export default defineComponent({
  name: "TKSM16",
  setup: () => {
    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    //四班加合计
    const grouptan = reactive([
      {
        name: "甲",
        ritanqiangdu: 11.11,
        ritanpailiang: 11.12,
        leijitanqiangdu: 11.13,
        leijitanpailiang: 11.14,
      },
      {
        name: "乙",
        ritanqiangdu: 22.22,
        ritanpailiang: 22.23,
        leijitanqiangdu: 22.24,
        leijitanpailiang: 22.25,
      },
      {
        name: "丙",
        ritanqiangdu: 33.33,
        ritanpailiang: 33.34,
        leijitanqiangdu: 33.35,
        leijitanpailiang: 33.36,
      },
      {
        name: "丁",
        ritanqiangdu: 44.44,
        ritanpailiang: 44.45,
        leijitanqiangdu: 44.46,
        leijitanpailiang: 44.47,
      },
      {
        name: "合计",
        ritanqiangdu: 75.55,
        ritanpailiang: 55.56,
        leijitanqiangdu: 55.57,
        leijitanpailiang: 55.58,
      },
    ]);
    const linetan = reactive([
      {
        name: "日甲",
        date: [] as string[],
        ritanqiangdu: [] as number[],
        zhipaiqiangdu: [] as number[],
      },
      {
        name: "月甲",
        date: [] as string[],
        ritanqiangdu: [] as number[],
        zhipaiqiangdu: [] as number[],
      },
      {
        name: "日乙",
        date: [] as string[],
        ritanqiangdu: [] as number[],
        zhipaiqiangdu: [] as number[],
      },
      {
        name: "月乙",
        date: [] as string[],
        ritanqiangdu: [] as number[],
        zhipaiqiangdu: [] as number[],
      },
      {
        name: "日丙",
        date: [] as string[],
        ritanqiangdu: [] as number[],
        zhipaiqiangdu: [] as number[],
      },
      {
        name: "月丙",
        date: [] as string[],
        ritanqiangdu: [] as number[],
        zhipaiqiangdu: [] as number[],
      },
      {
        name: "日丁",
        date: [] as string[],
        ritanqiangdu: [] as number[],
        zhipaiqiangdu: [] as number[],
      },
      {
        name: "月丁",
        date: [] as string[],
        ritanqiangdu: [] as number[],
        zhipaiqiangdu: [] as number[],
      },
      {
        name: "日合计",
        date: [] as string[],
        ritanqiangdu: [] as number[],
        zhipaiqiangdu: [] as number[],
      },
      {
        name: "月合计",
        date: [] as string[],
        ritanqiangdu: [] as number[],
        zhipaiqiangdu: [] as number[],
      },
    ]);

    let dataRi = "1";
    const dataYue = "";
    const dataRiJia = "";
    const dataYueJia = "";
    const dataRiYi = "";
    const dataYueYi = "";
    const dataRiBing = "";
    const dataYueBing = "";
    const dataRiDing = "";
    const dataYueDing = "";

    const getCirclePath = (num: number): string => {
      const r = 35;
      const deg = Math.PI * 2 * num;
      const x = -Math.sin(deg) * r;
      const y = r - Math.cos(deg) * r;

      return `m50,15 a 35,35 0,${num > 0.5 ? 1 : 0},0 ${x},${y}`;
    };
    const getHalfCirclePath = (num: number): string => {
      const r = 38;
      const width = 100;
      const height = 50;
      const deg = Math.PI * num;
      const x = r - Math.cos(deg) * r;
      const y = -Math.sin(deg) * r;
      return `m${width / 2 - r},50 a${r},${r} 0 0 1 ${x},${y}`;
      //return `m15,50 a 35,35 0 0 1 35,-35`;
    };
    const getHalfCirclePathMin = (num: number): string => {
      const r = 25;
      const width = 100;
      const height = 50;
      const deg = Math.PI * num;
      const x = r - Math.cos(deg) * r;
      const y = -Math.sin(deg) * r;
      return `m${width / 2 - r},50 a${r},${r} 0 0 1 ${x},${y}`;
      //return `m 25 50 a 25 25 0 0 1 25 -25`;
    };
    const getX1 = (num: number): string => {
      const r = 15;
      const deg = Math.PI * num;
      const x = 48 - Math.cos(deg) * r;

      return `${x}`;
    };
    const getY1 = (num: number): string => {
      const r = 15;
      const deg = Math.PI * num;
      const y = 48 - Math.sin(deg) * r;

      return `${y}`;
    };
    const getX2 = (num: number): string => {
      const r = 10;
      const deg = Math.PI * num;
      const x = 48 - Math.cos(deg) * r;

      return `${x}`;
    };
    const getY2 = (num: number): string => {
      const r = 10;
      const deg = Math.PI * num;
      const y = 48 - Math.sin(deg) * r;

      return `${y}`;
    };
    const getLinear = (num: number) => {
      if (num < 0.1) {
        return "grad1";
      } else if (num <= 0.12) {
        return "grad2";
      } else if (num <= 0.15) {
        return "grad3";
      } else if (num <= 0.2) {
        return "grad4";
      } else {
        return "grad5";
      }
    };
    const getData = async () => {
      const eiInfo = new EI.EIInfo();
      const eiBlock1 = eiInfo.addBlock(new EI.EiBlock(), "table0");
      const DEE_CODE = "";
      eiBlock1.pushData(
        {
          DEE_CODE,
        },
        true
      );

      const outInfo = await EIManager.callService(
        "TGT8Z",
        "tksm16_inq",
        eiInfo
      ).then((res: any) => {
        console.log("out", res.blocks);
        const data = res.blocks.Table0.data as { [key: string]: any }[];
        const dataRi = res.blocks.日趋势.data;
        const dataYue = res.blocks.产量趋势.data;
        const dataRiJia = res.blocks.甲日趋势.data;
        const dataYueJia = res.blocks.甲产量趋势.data;
        const dataRiYi = res.blocks.乙日趋势.data;
        const dataYueYi = res.blocks.乙产量趋势.data;
        const dataRiBing = res.blocks.丙日趋势.data;
        const dataYueBing = res.blocks.丙产量趋势.data;
        const dataRiDing = res.blocks.丁日趋势.data;
        const dataYueDing = res.blocks.丁产量趋势.data;
        //合计
        grouptan[4].ritanqiangdu = Number(data[0]["日碳强度"] as string);
        grouptan[4].ritanpailiang = Number(data[0]["日碳排量"] as string);
        grouptan[4].leijitanqiangdu = Number(data[0]["累计碳强度"] as string);
        grouptan[4].leijitanpailiang = Number(data[0]["累计碳排量"] as string);

        //班组
        grouptan[0].ritanqiangdu = Number(data[0]["甲日碳强度"] as string);
        grouptan[0].ritanpailiang = Number(data[0]["甲日碳排量"] as string);
        grouptan[0].leijitanqiangdu = Number(data[0]["甲累计碳强度"] as string);
        grouptan[0].leijitanpailiang = Number(
          data[0]["甲累计碳排量"] as string
        );

        grouptan[1].ritanqiangdu = Number(data[0]["乙日碳强度"] as string);
        grouptan[1].ritanpailiang = Number(data[0]["乙日碳排量"] as string);
        grouptan[1].leijitanqiangdu = Number(data[0]["乙累计碳强度"] as string);
        grouptan[1].leijitanpailiang = Number(
          data[0]["乙累计碳排量"] as string
        );

        grouptan[2].ritanqiangdu = Number(data[0]["丙日碳强度"] as string);
        grouptan[2].ritanpailiang = Number(data[0]["丙日碳排量"] as string);
        grouptan[2].leijitanqiangdu = Number(data[0]["丙累计碳强度"] as string);
        grouptan[2].leijitanpailiang = Number(
          data[0]["丙累计碳排量"] as string
        );

        grouptan[3].ritanqiangdu = Number(data[0]["丁日碳强度"] as string);
        grouptan[3].ritanpailiang = Number(data[0]["丁日碳排量"] as string);
        grouptan[3].leijitanqiangdu = Number(data[0]["丁累计碳强度"] as string);
        grouptan[3].leijitanpailiang = Number(
          data[0]["丁累计碳排量"] as string
        );

        //曲线数据
        //合计
        for (let i = 0; i < dataRi.length; i++) {
          linetan[8].date.push(dataRi[i]["日期"]);
          linetan[8].ritanqiangdu.push(dataRi[i]["碳强度"]);
          linetan[8].zhipaiqiangdu.push(dataRi[i]["直排强度"]);
        }
        for (let i = 0; i < dataYue.length; i++) {
          linetan[9].date.push(dataYue[i]["日期"]);
          linetan[9].ritanqiangdu.push(dataYue[i]["产量"]);
        }
        //甲
        for (let i = 0; i < dataRiJia.length; i++) {
          linetan[0].date.push(dataRiJia[i]["日期"]);
          linetan[0].ritanqiangdu.push(dataRiJia[i]["碳强度"]);
          linetan[0].zhipaiqiangdu.push(dataRiJia[i]["直排强度"]);
        }
        for (let i = 0; i < dataYueJia.length; i++) {
          linetan[1].date.push(dataYueJia[i]["日期"]);
          linetan[1].ritanqiangdu.push(dataYueJia[i]["产量"]);
        }
        //乙
        for (let i = 0; i < dataRiYi.length; i++) {
          linetan[2].date.push(dataRiYi[i]["日期"]);
          linetan[2].ritanqiangdu.push(dataRiYi[i]["碳强度"]);
          linetan[2].zhipaiqiangdu.push(dataRiYi[i]["直排强度"]);
        }
        for (let i = 0; i < dataYueYi.length; i++) {
          linetan[3].date.push(dataYueYi[i]["日期"]);
          linetan[3].ritanqiangdu.push(dataYueYi[i]["产量"]);
        }
        //丙
        for (let i = 0; i < dataRiBing.length; i++) {
          linetan[4].date.push(dataRiYi[i]["日期"]);
          linetan[4].ritanqiangdu.push(dataRiYi[i]["碳强度"]);
          linetan[4].zhipaiqiangdu.push(dataRiYi[i]["直排强度"]);
        }
        for (let i = 0; i < dataYueBing.length; i++) {
          linetan[5].date.push(dataYueBing[i]["日期"]);
          linetan[5].ritanqiangdu.push(dataYueBing[i]["产量"]);
        }
        //丁
        for (let i = 0; i < dataRiDing.length; i++) {
          linetan[6].date.push(dataRiDing[i]["日期"]);
          linetan[6].ritanqiangdu.push(dataRiDing[i]["碳强度"]);
          linetan[6].zhipaiqiangdu.push(dataRiDing[i]["直排强度"]);
        }
        for (let i = 0; i < dataYueDing.length; i++) {
          linetan[7].date.push(dataYueDing[i]["日期"]);
          linetan[7].ritanqiangdu.push(dataYueDing[i]["产量"]);
        }

        console.log("date", linetan[4].date);
        console.log("ritanqiangdu", linetan[4].ritanqiangdu);
        console.log("zhipaiqiangdu", linetan[4].zhipaiqiangdu);

        initChartRi(
          linetan[8].date,
          linetan[8].ritanqiangdu,
          linetan[8].zhipaiqiangdu
        );
        initChartYue(linetan[9].date, linetan[9].ritanqiangdu);

        initChartRiJia(
          linetan[0].date,
          linetan[0].ritanqiangdu,
          linetan[0].zhipaiqiangdu
        );
        initChartYueJia(linetan[1].date, linetan[1].ritanqiangdu);

        initChartRiYi(
          linetan[2].date,
          linetan[2].ritanqiangdu,
          linetan[2].zhipaiqiangdu
        );
        initChartYueYi(linetan[3].date, linetan[3].ritanqiangdu);

        initChartRiBing(
          linetan[4].date,
          linetan[4].ritanqiangdu,
          linetan[4].zhipaiqiangdu
        );
        initChartYueBing(linetan[5].date, linetan[5].ritanqiangdu);

        initChartRiDing(
          linetan[6].date,
          linetan[6].ritanqiangdu,
          linetan[6].zhipaiqiangdu
        );
        initChartYueDing(linetan[7].date, linetan[7].ritanqiangdu);
      });
    };
    const initChartRi = (date: any, riData: any, yueData: any) => {
      const myChart = echarts.init(
        document.getElementById("chart-container-ri")
      );
      // 模拟数据
      const xData = date;
      const dayCarbonIntensityData = riData;
      const dayCarbonCostData = yueData;

      const option = {
        tooltip: {
          trigger: "axis",
        },
        title: {
          text: "日趋势图",
          left: "cer",
          top: 10,
          textStyle: {
            color: "darkgray",
            fontSize: 12,
          },
        },
        legend: {
          data: ["日碳强度", "直排强度"],
          left: "center",
          top: "25%",
          orient: "vertical",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xData,
        },
        yAxis: [
          {
            type: "value",
            name: "",

            position: "left",
          },
          {
            type: "value",
            name: "",

            position: "right",
          },
        ],
        series: [
          {
            name: "日碳强度",
            type: "line",
            yAxisIndex: 0,
            data: dayCarbonIntensityData,
            itemStyle: {
              color: "green",
            },
          },
          {
            name: "直排强度",
            type: "line",
            yAxisIndex: 1,
            data: dayCarbonCostData,
            itemStyle: {
              color: "pink",
            },
          },
        ],
      };

      myChart.setOption(option);
    };
    const initChartYue = (date: any, riData: any) => {
      const myChart = echarts.init(
        document.getElementById("chart-container-yue")
      );
      // 模拟数据
      const xData = date;
      const dayCarbonIntensityData = riData;
      const option = {
        tooltip: {
          trigger: "axis",
        },
        title: {
          text: "产量趋势",
          left: "left",
          top: 10,
          textStyle: {
            color: "darkgray",
            fontSize: 12,
          },
        },
        legend: {
          data: ["产量"],
          left: "center",
          top: "25%",
          orient: "vertical",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xData,
        },
        yAxis: [
          {
            type: "value",
            name: "",
            position: "left",
          },
        ],
        series: [
          {
            name: "产量",
            type: "line",
            yAxisIndex: 0,
            data: dayCarbonIntensityData,
            itemStyle: {
              color: "green",
            },
          },
        ],
      };

      myChart.setOption(option);
    };
    const initChartRiJia = (date: any, riData: any, yueData: any) => {
      const myChart = echarts.init(
        document.getElementById("chart-container-ri-jia")
      );
      // 模拟数据
      const xData = date;
      const dayCarbonIntensityData = riData;
      const dayCarbonCostData = yueData;

      const option = {
        tooltip: {
          trigger: "axis",
        },
        title: {
          text: "日趋势图",
          left: "center",
          top: 10,
          textStyle: {
            color: "darkgray",
            fontSize: 12,
          },
        },
        legend: {
          data: ["日碳强度", "直排强度"],
          left: "center",
          top: "25%",
          orient: "vertical",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xData,
        },
        yAxis: [
          {
            type: "value",
            name: "",

            position: "left",
          },
          {
            type: "value",
            name: "",

            position: "right",
          },
        ],
        series: [
          {
            name: "日碳强度",
            type: "line",
            yAxisIndex: 0,
            data: dayCarbonIntensityData,
            itemStyle: {
              color: "green",
            },
          },
          {
            name: "直排强度",
            type: "line",
            yAxisIndex: 1,
            data: dayCarbonCostData,
            itemStyle: {
              color: "pink",
            },
          },
        ],
      };

      myChart.setOption(option);
    };
    const initChartYueJia = (date: any, riData: any) => {
      const myChart = echarts.init(
        document.getElementById("chart-container-yue-jia")
      );
      // 模拟数据
      const xData = date;
      const dayCarbonIntensityData = riData;

      const option = {
        tooltip: {
          trigger: "axis",
        },
        title: {
          text: "产量趋势",
          left: "center",
          top: 10,
          textStyle: {
            color: "darkgray",
            fontSize: 12,
          },
        },
        legend: {
          data: ["产量"],
          left: "center",
          top: "25%",
          orient: "vertical",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xData,
        },
        yAxis: [
          {
            type: "value",
            name: "",
            position: "left",
          },
        ],
        series: [
          {
            name: "产量",
            type: "line",
            yAxisIndex: 0,
            data: dayCarbonIntensityData,
            itemStyle: {
              color: "green",
            },
          },
        ],
      };

      myChart.setOption(option);
    };
    const initChartRiYi = (date: any, riData: any, yueData: any) => {
      const myChart = echarts.init(
        document.getElementById("chart-container-ri-yi")
      );
      // 模拟数据
      const xData = date;
      const dayCarbonIntensityData = riData;
      const dayCarbonCostData = yueData;

      const option = {
        tooltip: {
          trigger: "axis",
        },
        title: {
          text: "日趋势图",
          left: "center",
          top: 10,
          textStyle: {
            color: "darkgray",
            fontSize: 12,
          },
        },
        legend: {
          data: ["日碳强度", "直排强度"],
          left: "center",
          top: "25%",
          orient: "vertical",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xData,
        },
        yAxis: [
          {
            type: "value",
            name: "",

            position: "left",
          },
          {
            type: "value",
            name: "",

            position: "right",
          },
        ],
        series: [
          {
            name: "日碳强度",
            type: "line",
            yAxisIndex: 0,
            data: dayCarbonIntensityData,
            itemStyle: {
              color: "green",
            },
          },
          {
            name: "直排强度",
            type: "line",
            yAxisIndex: 1,
            data: dayCarbonCostData,
            itemStyle: {
              color: "pink",
            },
          },
        ],
      };

      myChart.setOption(option);
    };
    const initChartYueYi = (date: any, riData: any) => {
      const myChart = echarts.init(
        document.getElementById("chart-container-yue-yi")
      );
      // 模拟数据
      const xData = date;
      const dayCarbonIntensityData = riData;

      const option = {
        tooltip: {
          trigger: "axis",
        },
        title: {
          text: "产量趋势",
          left: "center",
          top: 10,
          textStyle: {
            color: "darkgray",
            fontSize: 12,
          },
        },
        legend: {
          data: ["产量"],
          left: "center",
          top: "25%",
          orient: "vertical",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xData,
        },
        yAxis: [
          {
            type: "value",
            name: "",
            position: "left",
          },
        ],
        series: [
          {
            name: "产量",
            type: "line",
            yAxisIndex: 0,
            data: dayCarbonIntensityData,
            itemStyle: {
              color: "green",
            },
          },
        ],
      };

      myChart.setOption(option);
    };
    const initChartRiBing = (date: any, riData: any, yueData: any) => {
      const myChart = echarts.init(
        document.getElementById("chart-container-ri-bing")
      );
      // 模拟数据
      const xData = date;
      const dayCarbonIntensityData = riData;
      const dayCarbonCostData = yueData;

      const option = {
        tooltip: {
          trigger: "axis",
        },
        title: {
          text: "日趋势图",
          left: "center",
          top: 10,
          textStyle: {
            color: "darkgray",
            fontSize: 12,
          },
        },
        legend: {
          data: ["日碳强度", "直排强度"],
          left: "center",
          top: "25%",
          orient: "vertical",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xData,
        },
        yAxis: [
          {
            type: "value",
            name: "",

            position: "left",
          },
          {
            type: "value",
            name: "",

            position: "right",
          },
        ],
        series: [
          {
            name: "日碳强度",
            type: "line",
            yAxisIndex: 0,
            data: dayCarbonIntensityData,
            itemStyle: {
              color: "green",
            },
          },
          {
            name: "直排强度",
            type: "line",
            yAxisIndex: 1,
            data: dayCarbonCostData,
            itemStyle: {
              color: "pink",
            },
          },
        ],
      };

      myChart.setOption(option);
    };
    const initChartYueBing = (date: any, riData: any) => {
      const myChart = echarts.init(
        document.getElementById("chart-container-yue-bing")
      );
      // 模拟数据
      const xData = date;
      const dayCarbonIntensityData = riData;

      const option = {
        tooltip: {
          trigger: "axis",
        },
        title: {
          text: "产量趋势",
          left: "center",
          top: 10,
          textStyle: {
            color: "darkgray",
            fontSize: 12,
          },
        },
        legend: {
          data: ["产量"],
          left: "center",
          top: "25%",
          orient: "vertical",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xData,
        },
        yAxis: [
          {
            type: "value",
            name: "",
            position: "left",
          },
        ],
        series: [
          {
            name: "产量",
            type: "line",
            yAxisIndex: 0,
            data: dayCarbonIntensityData,
            itemStyle: {
              color: "green",
            },
          },
        ],
      };

      myChart.setOption(option);
    };
    const initChartRiDing = (date: any, riData: any, yueData: any) => {
      const myChart = echarts.init(
        document.getElementById("chart-container-ri-ding")
      );
      // 模拟数据
      const xData = date;
      const dayCarbonIntensityData = riData;
      const dayCarbonCostData = yueData;

      const option = {
        tooltip: {
          trigger: "axis",
        },
        title: {
          text: "日趋势图",
          left: "center",
          top: 10,
          textStyle: {
            color: "darkgray",
            fontSize: 12,
          },
        },
        legend: {
          data: ["日碳强度", "直排强度"],
          left: "center",
          top: "25%",
          orient: "vertical",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xData,
        },
        yAxis: [
          {
            type: "value",
            name: "",

            position: "left",
          },
          {
            type: "value",
            name: "",

            position: "right",
          },
        ],
        series: [
          {
            name: "日碳强度",
            type: "line",
            yAxisIndex: 0,
            data: dayCarbonIntensityData,
            itemStyle: {
              color: "green",
            },
          },
          {
            name: "直排强度",
            type: "line",
            yAxisIndex: 1,
            data: dayCarbonCostData,
            itemStyle: {
              color: "pink",
            },
          },
        ],
      };

      myChart.setOption(option);
    };
    const initChartYueDing = (date: any, riData: any) => {
      const myChart = echarts.init(
        document.getElementById("chart-container-yue-ding")
      );
      // 模拟数据
      const xData = date;
      const dayCarbonIntensityData = riData;

      const option = {
        tooltip: {
          trigger: "axis",
        },
        title: {
          text: "产量趋势",
          left: "center",
          top: 10,
          textStyle: {
            color: "darkgray",
            fontSize: 12,
          },
        },
        legend: {
          data: ["产量"],
          left: "center",
          top: "25%",
          orient: "vertical",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xData,
        },
        yAxis: [
          {
            type: "value",
            name: "",
            position: "left",
          },
        ],
        series: [
          {
            name: "产量",
            type: "line",
            yAxisIndex: 0,
            data: dayCarbonIntensityData,
            itemStyle: {
              color: "green",
            },
          },
        ],
      };

      myChart.setOption(option);
    };
    const devClick = async (dev: any) => {
      const eiInfo = new EI.EIInfo();
      const eiBlock1 = eiInfo.addBlock(new EI.EiBlock(), "table0");
      eiBlock1.pushData(
        {
          DEE_CODE: dev,
        },
        true
      );
      const outInfo = await EIManager.callService(
        "TGT8Z",
        "tksm16_inq",
        eiInfo
      ).then((res: any) => {
        console.log("0221", res.blocks);
        const data = res.blocks.Table0.data as { [key: string]: any }[];
        const dataRi = res.blocks.日趋势.data;
        const dataYue = res.blocks.月趋势.data;
        const dataRiJia = res.blocks.甲日趋势.data;
        const dataYueJia = res.blocks.甲月趋势.data;
        const dataRiYi = res.blocks.乙日趋势.data;
        const dataYueYi = res.blocks.乙月趋势.data;
        const dataRiBing = res.blocks.丙日趋势.data;
        const dataYueBing = res.blocks.丙月趋势.data;
        const dataRiDing = res.blocks.丁日趋势.data;
        const dataYueDing = res.blocks.丁月趋势.data;
        //合计
        grouptan[4].ritanqiangdu = Number(data[0]["日碳强度"] as string);
        grouptan[4].ritanpailiang = Number(data[0]["日碳排量"] as string);
        grouptan[4].leijitanqiangdu = Number(data[0]["累计碳强度"] as string);
        grouptan[4].leijitanpailiang = Number(data[0]["累计碳排量"] as string);

        //班组
        grouptan[0].ritanqiangdu = Number(data[0]["甲日碳强度"] as string);
        grouptan[0].ritanpailiang = Number(data[0]["甲日碳排量"] as string);
        grouptan[0].leijitanqiangdu = Number(data[0]["甲累计碳强度"] as string);
        grouptan[0].leijitanpailiang = Number(
          data[0]["甲累计碳排量"] as string
        );

        grouptan[1].ritanqiangdu = Number(data[0]["乙日碳强度"] as string);
        grouptan[1].ritanpailiang = Number(data[0]["乙日碳排量"] as string);
        grouptan[1].leijitanqiangdu = Number(data[0]["乙累计碳强度"] as string);
        grouptan[1].leijitanpailiang = Number(
          data[0]["乙累计碳排量"] as string
        );

        grouptan[2].ritanqiangdu = Number(data[0]["丙日碳强度"] as string);
        grouptan[2].ritanpailiang = Number(data[0]["丙日碳排量"] as string);
        grouptan[2].leijitanqiangdu = Number(data[0]["丙累计碳强度"] as string);
        grouptan[2].leijitanpailiang = Number(
          data[0]["丙累计碳排量"] as string
        );

        grouptan[3].ritanqiangdu = Number(data[0]["丁日碳强度"] as string);
        grouptan[3].ritanpailiang = Number(data[0]["丁日碳排量"] as string);
        grouptan[3].leijitanqiangdu = Number(data[0]["丁累计碳强度"] as string);
        grouptan[3].leijitanpailiang = Number(
          data[0]["丁累计碳排量"] as string
        );

        //曲线数据
        //合计
        for (let i = 0; i < dataRi.length; i++) {
          linetan[8].date.push(dataRi[i]["日期"]);
          linetan[8].ritanqiangdu.push(dataRi[i]["碳强度"]);
          linetan[8].zhipaiqiangdu.push(dataRi[i]["直排强度"]);
        }
        for (let i = 0; i < dataYue.length; i++) {
          linetan[9].date.push(dataYue[i]["日期"]);
          linetan[9].ritanqiangdu.push(dataYue[i]["碳强度"]);
        }
        //甲
        for (let i = 0; i < dataRiJia.length; i++) {
          linetan[0].date.push(dataRiJia[i]["日期"]);
          linetan[0].ritanqiangdu.push(dataRiJia[i]["碳强度"]);
          linetan[0].zhipaiqiangdu.push(dataRiJia[i]["直排强度"]);
        }
        for (let i = 0; i < dataYueJia.length; i++) {
          linetan[1].date.push(dataYueJia[i]["日期"]);
          linetan[1].ritanqiangdu.push(dataYueJia[i]["碳强度"]);
        }
        //乙
        for (let i = 0; i < dataRiYi.length; i++) {
          linetan[2].date.push(dataRiYi[i]["日期"]);
          linetan[2].ritanqiangdu.push(dataRiYi[i]["碳强度"]);
          linetan[2].zhipaiqiangdu.push(dataRiYi[i]["直排强度"]);
        }
        for (let i = 0; i < dataYueYi.length; i++) {
          linetan[3].date.push(dataYueYi[i]["日期"]);
          linetan[3].ritanqiangdu.push(dataYueYi[i]["碳强度"]);
        }
        //丙
        for (let i = 0; i < dataRiBing.length; i++) {
          linetan[4].date.push(dataRiBing[i]["日期"]);
          linetan[4].ritanqiangdu.push(dataRiBing[i]["碳强度"]);
          linetan[4].zhipaiqiangdu.push(dataRiBing[i]["直排强度"]);
        }
        for (let i = 0; i < dataYueBing.length; i++) {
          linetan[5].date.push(dataYueBing[i]["日期"]);
          linetan[5].ritanqiangdu.push(dataYueBing[i]["碳强度"]);
        }
        //丁
        for (let i = 0; i < dataRiDing.length; i++) {
          linetan[6].date.push(dataRiDing[i]["日期"]);
          linetan[6].ritanqiangdu.push(dataRiDing[i]["碳强度"]);
          linetan[6].zhipaiqiangdu.push(dataRiDing[i]["直排强度"]);
        }
        for (let i = 0; i < dataYueDing.length; i++) {
          linetan[7].date.push(dataYueDing[i]["日期"]);
          linetan[7].ritanqiangdu.push(dataYueDing[i]["碳强度"]);
        }

        console.log("date", linetan[4].date);
        console.log("ritanqiangdu", linetan[4].ritanqiangdu);
        console.log("zhipaiqiangdu", linetan[4].zhipaiqiangdu);

        initChartRi(
          linetan[8].date,
          linetan[8].ritanqiangdu,
          linetan[8].zhipaiqiangdu
        );
        initChartYue(linetan[9].date, linetan[9].ritanqiangdu);

        initChartRiJia(
          linetan[0].date,
          linetan[0].ritanqiangdu,
          linetan[0].zhipaiqiangdu
        );
        initChartYueJia(linetan[1].date, linetan[1].ritanqiangdu);

        initChartRiYi(
          linetan[2].date,
          linetan[2].ritanqiangdu,
          linetan[2].zhipaiqiangdu
        );
        initChartYueYi(linetan[3].date, linetan[3].ritanqiangdu);

        initChartRiBing(
          linetan[4].date,
          linetan[4].ritanqiangdu,
          linetan[4].zhipaiqiangdu
        );
        initChartYueBing(linetan[5].date, linetan[5].ritanqiangdu);

        initChartRiDing(
          linetan[6].date,
          linetan[6].ritanqiangdu,
          linetan[6].zhipaiqiangdu
        );
        initChartYueDing(linetan[7].date, linetan[7].ritanqiangdu);
      });
    };
    onMounted(() => {
      getData();
    });
    return {
      grouptan,
      devClick,
      getData,
      getCirclePath,
      getLinear,
      getHalfCirclePath,
      getHalfCirclePathMin,
      getX1,
      getY1,
      getX2,
      getY2,
    };
  },
});
