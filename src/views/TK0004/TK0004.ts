import { computed, defineComponent, onMounted, ref, watch, toRaw, nextTick, Ref } from 'vue';
import { EI, EIManager } from "EIX/ei";
import { ER } from "ERX/Er";
import { SiUtils } from "ERX/SiUtils";
import { FiUtils } from "ERX/FiUtils";
import xrEfForm from "EFX/xrEfForm";
import xrEfPanel from "EFX/xrEfPanel";
import erLayout from "ERX/ErLayout";
import erGrid from "ERX/ErGrid";
import { EFDialogFormMessage } from 'EFX/EFDialogForm';
import { log } from 'console';



export default defineComponent({
  name: 'TK0004',
  components: {
    erGrid,
    erLayout,
    xrEfForm,
    xrEfPanel
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
    // 变量定义
    const formName = 'TK0004';
    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    const initializeFlag = ref(0);
    let gridView1!: any;  
     // 自定义工具栏按钮功能
     const InitialToolbar = () => {
      erFormHelper.initialGridToolbar(gridView1.value, {
        excel: { visible: true },
        addrow: { visible: false },
        copyrow: { visible: false },
        delete: { visible: false }
      });     
    };

    // 自定义grid工具栏按钮是否可用
    const setToolbarVisible = (configId: string, visible: boolean) => {
      erFormHelper.setGridToolbarVisible(configId, {
        addrow: visible,
        copyrow: visible,
        delete: visible
      });
    };

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

    onMounted(() => {
     // initializePage();
    });

    const F2_DO = async (e: any) => {
      getCodeList();
    };

    // 主表查询
    const getCodeList = async () => {
      const eiInfo = new EI.EIInfo();
      const eiBlock = erFormHelper.getAllControlValueAsEiBlock(
        "LayoutGroupFilter"
      );
      
      eiInfo.addBlock(eiBlock);
      erFormHelper.callService('tk0004_inq', eiInfo).then((res: EI.EIInfo) => {
        erFormHelper.mergeEiBlockToGrid(res.getBlock('Table0'), 'gridView1');
      });
    };

    const F3_DO = async (e: any) => {
    
      const data = erFormHelper.getGridCheckedRows('gridView1', true, true);
      if (data.length < 1) {
        erFormHelper.messageError('至少选择[一条]信息。');
        return;
      }
      const eiInfo = new EI.EIInfo();

      if (erFormHelper.hasDataChange('gridView1')) {
        const eiInfo = new EI.EIInfo();
        const eiBlock = erFormHelper.getGridRowsAsBlock('gridView1', 'all');
        eiInfo.addBlock(eiBlock);
        const outInfo = await erFormHelper.callService('tk0004_save', eiInfo, false, true);
        if (outInfo.sys.status < 0) erFormHelper.messageError('信息维护失败' + outInfo.sys.msg);
        else {
          erFormHelper.messageInfo(outInfo.sys.msg ? outInfo.sys.msg : '信息维护失败');
        }
        getCodeList();
      }
      erFormHelper.setGridEditable('gridView1', false);
    };
    const F3_PRE_DO = async (e: any) => {
      erFormHelper.setGridEditable('gridView1', true);
    };
    const F3_CANCEL = async (e: any) => {   
      getCodeList();
      erFormHelper.setGridEditable('gridView1', false);
    };

    return {
      erFormHelper,
      initializeFlag,
      efFormReady,
      erGrid1Ready,
      F2_DO,
      F3_DO,
      F3_PRE_DO,
      F3_CANCEL,
      getCodeList
    };
  }
});
