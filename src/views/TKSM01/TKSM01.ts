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


export default defineComponent({
  name: 'TKSM01',
  components: {
    erGrid,
    erLayout,
    xrEfForm,
    xrEfPanel,
    xrEfSearchBox,
    xrEfDialog
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
    const formPartition = ref('');
    const initializeService = 'tk00_be2_iniform';
    const $router = useRouter();
    // 变量定义
    const formName = 'TKSM01';
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

        // erFormHelper.setGridToolbarPosition('gridView2', 'bottom');

        // 回调函数获取控件信息及设置定义事件等操作
        nextTick(() => {
          // 获取画面上的主要控件信息
          erFormHelper.setGridEditable('gridView1', false);
          erFormHelper.setGridEditable('gridView2', false);
        });
      } else {
        erFormHelper.messageError(
          'ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!'
        );
      }
    };
    const erGrid1Ready = () => {
      gridView1 = erFormHelper.getGrid('gridView1');
      erFormHelper.setGridToolbarVisible('gridView1', {
        addrow: false,
        copyrow: false,
        excel: true
      });

    }
    const erGrid2Ready = () => {
      gridView2 = erFormHelper.getGrid('gridView2');
}



    onMounted(() => {
      //initializePage();
    });

    // 主表查询
    const getCodeList = async () => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = erFormHelper.getAllControlValueAsEiBlock(
        "LayoutGroupFilter"
      );
      
      eiInfo.addBlock(eiBlock);
      erFormHelper.callService('tksm01_inq', eiInfo).then((res: EI.EIInfo) => {
        erFormHelper.mergeEiBlockToGrid(res.getBlock('Table0'), 'gridView1');
      });
    };

    // 焦点行变换事件
    const gridView1FocusChanged = (e: any) => {
      const params = erFormHelper.getAllControlValue('LayoutGroupFilter');
      const eiBlock = erFormHelper.addJsonToEiBlock(JSON.parse(JSON.stringify(e.data)));
      const name = {
        HEAT_NO: eiBlock.data[0]['HEAT_NO']?.toString() //获取焦点行某列的数据
      };
      getSubData(name); //获取明细
    };

    // 查询明细
    // async:异步变同步
    const getSubData = async (params: any) => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = EI.EiBlock.build('Table0', [
        {
          HEAT_NO: params['HEAT_NO']
        }
      ]);

      eiInfo.addBlock(eiBlock);
      const outInfo = await erFormHelper.callService('tksm01_inq2', eiInfo, true, false);

      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
        return;
      }
      // 根据返回数据加载页面显示数据
      erFormHelper.mergeDataToLayoutOrGrid(outInfo.getBlock('Table0').data, true, 'gridView2');
    };

    onMounted(() => {
     // initializePage();
    });

    const F2_DO = async (e: any) => {
      getCodeList();
    };

    return {
      erFormHelper,
      initializeFlag,
      efFormReady,
      erGrid1Ready,
      erGrid2Ready,
      F2_DO,
      gridView1FocusChanged
    };
  }
});
