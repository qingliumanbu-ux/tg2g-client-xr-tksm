import { computed, defineComponent, onMounted, reactive, ref, watch, toRaw, nextTick } from 'vue';
import { EI } from 'EIX/ei';
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
import { useRouter } from 'vue-router';



export default defineComponent({
  name: 'TK0005',
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
    const formName = 'TK0005';
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
      const outInfo = await erFormHelper.callService(
        "tk0005_inq",
        eiInfo,
        true,
        false,
        true
      );

      if (outInfo.sys.status < 0) {
        erFormHelper.messageError("查询错误:" + outInfo.sys.msg);
      } else {  
        erFormHelper.mergeEiBlockToGrid(outInfo.getBlock(0), "gridView1");
      }
    
    };

    const F3_DO = async (e: any) => {
    
      const eiInfo = new EI.EIInfo();
      const filter_condition = erFormHelper.getAllControlValueAsEiBlock('LayoutGroupFilter', {});
      eiInfo.addBlock(filter_condition); 
      const outInfo = await erFormHelper.callService('tk0005_getcb', eiInfo,  true,
        false,
        true);
        if (outInfo.sys.status < 0) erFormHelper.messageError('信息获取失败' + outInfo.sys.msg);
        else {
          erFormHelper.messageInfo(outInfo.sys.msg ? outInfo.sys.msg : '信息获取成功');
          getCodeList(); 
        }
       

    };

    const F4_DO = async (e: any) => {
    
      const eiInfo = new EI.EIInfo();
      const filter_condition = erFormHelper.getAllControlValueAsEiBlock('LayoutGroupFilter', {});
      eiInfo.addBlock(filter_condition); 
      const outInfo = await erFormHelper.callService('tk0005_getsj', eiInfo,  true,
        false,
        true);
        if (outInfo.sys.status < 0) erFormHelper.messageError('信息获取失败' + outInfo.sys.msg);
        else {          
          getCodeList(); 
          erFormHelper.messageInfo(outInfo.sys.msg ? outInfo.sys.msg : '信息获取成功');
        }
        

    };
    const F5_DO = async (e: any) => {
      const eiInfo = new EI.EIInfo();
      const filter_condition = erFormHelper.getAllControlValueAsEiBlock('LayoutGroupFilter', {});
      eiInfo.addBlock(filter_condition);  
      const outInfo = await erFormHelper.callService('tk0005_check', eiInfo,  true,
        false,
        true); 
        if (outInfo.sys.status < 0) {
          erFormHelper.messageError("检索错误:" + outInfo.sys.msg);
        } else {  
          erFormHelper.mergeEiBlockToGrid(outInfo.getBlock(0), "gridView1");
        } 
    };
    

    return {
      erFormHelper,
      initializeFlag,
      efFormReady,
      erGrid1Ready,
      F2_DO,
      F3_DO,
      F4_DO,
      F5_DO,
      getCodeList
    };
  }
});
