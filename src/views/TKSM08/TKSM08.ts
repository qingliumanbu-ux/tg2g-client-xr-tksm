import { computed, defineComponent, onMounted, reactive, ref, watch, toRaw, nextTick } from 'vue';
import { EI } from 'EIX/ei';
import { useRouter } from 'vue-router';
import xrEfForm from 'EFX/xrEfForm';
import xrEfPanel from 'EFX/xrEfPanel';
import xrEfSearchBox from 'EFX/xrEfSearchBox';
import xrEfDialog from 'EFX/xrEfDialog';
import EFUtility from 'EFX/EFUtility';
import eBFR from 'EFX/eBFR';
import erLayout from 'ERX/ErLayout';
import erGrid from 'ERX/ErGrid';
import { ER } from 'ERX/Er';
import { SiUtils } from 'ERX/SiUtils';
import { FiUtils } from 'ERX/FiUtils';

import * as echarts from 'echarts';
//import { data } from 'jquery';

export default defineComponent({
  name: 'TKSM08',
   model: {
    prop: 'color',
    event: 'update'
  },
  props: {
    // 颜色数组
    colorList: {
      type: Array,
      default: () => {
        return ['#FFC0CB', '#DB7093', '#FF1493', '#DC143C'];
      }
    },
    // 父组件绑定的值
    color: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      myColor: undefined
    };
  },
  components: {
    erGrid,
    erLayout,
    xrEfForm,
    xrEfPanel,
    xrEfSearchBox,
    xrEfDialog
  },
  setup: () => {
     let data_carry: any = []; //执行
    let data_column: any = []; //x轴字段
    const label = '';
    const upScatterInstance: echarts.ECharts | null = null;

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
    const formPartition = ref('');
    const initializeService = 'qx00si00_form_get';
    const $router = useRouter();
    // 变量定义
    const formName = 'TKSM08';
    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    const initializeFlag = ref(0);
    let gridView1!: any;
    let gridView2!: any;
    // 画面相关数据初始化
    const initializePage = async () => {
      const initialResult = await erFormHelper.Initialize(
        formPartition.value,
        formName,
        '',
        initializeService
      );
      if (initialResult.flag >= 0) {
        // 画面工具类初始化成功后将画面渲染条件设置为1
        initializeFlag.value = 1;
        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {
          // 获取画面上的主要控件信息
          erFormHelper.setGridEditable('gridView1', false);
          erFormHelper.setGridEditable('gridView2', false);
          Cahrlist('', '', '');
        });
      } else {
        erFormHelper.messageError(
          'ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!'
        );
      }
    };
    const erGrid1Ready = () => {
      gridView1 = erFormHelper.getGrid('gridView1');
    }
    const erGrid2Ready = () => {
      gridView2 = erFormHelper.getGrid('gridView2');
}



    onMounted(() => {
     // initializePage();
      // 初始状态的数据统计
     //
    });

    //#region 自定义方法
    // #region 图渲染（下发总量、执行总量、x轴字段、标题）
    const Cahrlist = (data_carry1: any, data_column1: any, label1: any) => {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById('container'));

      // 指定图表的配置项和数据
      const option = {
        title: {
          text: '路径碳排量'
        },
        legend: {
          data: ['路径']
        },
        xAxis: {
          type: 'category',
          data: data_column1
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '路径',
            type: 'bar',
            data: data_carry1
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    };
    //计划明细查询
    const p_query_detail = async (params: any) => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = EI.EiBlock.build('Table0', [
        {
          BEGIN_TIME: params['BEGIN_TIME'],
          END_TIME: params['END_TIME'],
          ST_NO: params['ST_NO']
        }
      ]);
      eiInfo.addBlock(eiBlock);
      const outInfo = await erFormHelper.callService('tksm08_inq2', eiInfo, true, false);

      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
        return;
      }
      // 根据返回数据加载页面显示数据
      erFormHelper.mergeDataToLayoutOrGrid(outInfo.getBlock('Table0').data, true, 'gridView2');

      data_carry = []; //执行
      data_column = []; //x轴字段
      for (let i = 0; i < outInfo.getBlock('Table0').data.length; i++) {
        const value_carry = outInfo.getBlock('Table0').data[i].C_WT_UNIT;
        data_carry.push(value_carry);
        const value_column = outInfo.getBlock('Table0').data[i].AC_ROUTE;
        data_column.push(value_column);
        //erFormHelper.messageWarning(outInfo.getBlock('Table0').data[i].AC_ROUTE);
      }
      Cahrlist(data_carry, data_column, label);
    };

    // 查询主信息
    const query = async () => {
      /*const checked = erFormHelper.checkRequiredInput('LayoutGroupFilter');
      if (!checked) {
        return;
      }*/
      const inInfo = new EI.EIInfo();
      const model = erFormHelper.getAllControlValue('LayoutGroupFilter');
      const eiInfo1 = new EI.EiBlock('Table0');
      eiInfo1.pushData(
        {
          BEGIN_TIME: model['BEGIN_TIME'],
          END_TIME: model['END_TIME'],
          ST_NO: model['ST_NO']
        },
        true
      );

      inInfo.addBlock(eiInfo1);
       erFormHelper.callService('tksm08_inq', inInfo).then((res: EI.EIInfo) => {
        erFormHelper.mergeEiBlockToGrid(res.getBlock('Table0'), 'gridView1');
      });
    };

    // 焦点行变更(获取变更焦点行数据的计划号)
    const gridView1FocusChanged = async (e: any) => {
      if (e.rowChanged && e.data) {
        const params = erFormHelper.getAllControlValue('LayoutGroupFilter');
        const eiBlock = erFormHelper.addJsonToEiBlock(JSON.parse(JSON.stringify(e.data)));
        const name = {
          BEGIN_TIME: params['BEGIN_TIME'],
          END_TIME: params['END_TIME'],
          ST_NO: eiBlock.data[0]['ST_NO']?.toString() //获取焦点行某列的数据
        };
        p_query_detail(name);
      }
    };

    // #endregion

    const F2_DO = async (e: any) => {
      // 时间不能为空
      /*if (
        erFormHelper.getControlValue('LayoutGroupFilter', 'BEGIN_TIME') === ' ' ||
        erFormHelper.getControlValue('LayoutGroupFilter', 'END_TIME') === ' '
      ) {
        erFormHelper.messageWarning('请选择时间范围');
        return;
      }*/

      // 查询主信息
      query();
    };

    return {
      erFormHelper,
      initializeFlag,
       efFormReady,
      erGrid1Ready,
      erGrid2Ready,
      F2_DO,
      gridView1FocusChanged,
      p_query_detail
    };
  }
});
