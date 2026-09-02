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
  name: '',
  components: {
    erGrid,
    erLayout,
    xrEfForm,
    xrEfPanel
  },
  setup: () => {
    // 获取画面的分区信息及设置画面初始化service
    
    const efFormInfo = ref<{ [key: string]: any }>({});
    let formPartition: string;
    const initializeService = 'tk00_be2_iniform';
    const efFormIsReady = ref(false);
    // 变量定义
    const formName = 'TK0000';
    let formName_Now = '';
    const erFormHelper: ER.FormHelper = new ER.FormHelper();
    const initializeFlag = ref(0);
    const gridToolbar: Ref<any[]> = ref([]);
    const c_name = ref();
    const layout = ref();
    const gridview = ref();
    const editable = ref(false);
    const callService_f2 = ref();
    const callService_f3 = ref();
    const callService_f4 = ref();
    const callService_inq = ref();
   

  
   
    //let gridView1!: any;  
    let gridView1: any;
    const efFormReady = (e: any) => {
      efFormInfo.value = e.formInfo;
      efFormIsReady.value = true;
      formPartition = efFormInfo.value.formPartition; // 分区
      formName_Now = efFormInfo.value.formName; // 当前画面名
      c_name.value = efFormInfo.value.formParams.cname; // 当前画面名
      console.log('formName_Now', efFormInfo.value);
      layout.value = 'LayoutGroup_' + String(formName_Now);
      gridview.value = 'GridView_' + String(formName_Now);
      console.log('formName_AA', layout.value, gridview.value, c_name.value);
      callService_f2.value = String(formName_Now).toLowerCase() + '_f2';
      callService_inq.value = String(formName_Now).toLowerCase() + '_inq1';
      callService_f3.value = String(formName_Now).toLowerCase() + '_f3';

      // 初始化低代码工具类
      initializePage();
    };
    //const formPartition = ref('');
   
    
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
        formPartition,
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
          erFormHelper.setGridEditable(gridview.value, false);
        });
      } else {
        erFormHelper.messageError(
          'ErFormHelper initialize faild, error msg is [' + initialResult.msg + ']!'
        );
      }
    };

    const erGrid1Ready = () => {
      gridView1 = erFormHelper.getGrid(gridview.value);
      gridView1.gridOptions.getRowStyle = (params: any) => {
        //console.log('params', params);

      };
      // console.log('gridView1', gridView1);
      erFormHelper.setGridEditable(gridview.value, false);
      erFormHelper.setGridToolbarVisible(gridview.value, {
        addrow: false,
        copyrow: false,
        excel: true
      });
    };

    onMounted(() => {
     // initializePage();
    });

    const F2_DO = async (e: any) => {
      queryRecord();
    };

    // 主表查询
   

    const queryRecord = async () => {
      //获取查询条件
      const Query: EI.EiBlock = erFormHelper.getAllControlValueAsEiBlock(layout.value);
      

      const inInfo = new EI.EIInfo();
      //获取查询条件
      inInfo.addBlock(erFormHelper.getAllControlValueAsEiBlock(layout.value));
      const outInfo = await erFormHelper.callService( callService_f2.value, inInfo, true, false, true);

      //判断调后台是否失败
      if (outInfo.sys.status < 0) {
        erFormHelper.messageError('查询错误:' + outInfo.sys.msg);
      } else {
        //是否弹出查询成功提示
        console.log('outInfo', outInfo);
        erFormHelper.messageInfo('信息查询成功！本次查询返回' + outInfo.getBlock(0).data.length + '条记录！');
        console.log('outInfo', outInfo);
        erFormHelper.mergeDataToGrid(outInfo, gridview.value);
        editable.value = false;
        erFormHelper.setGridEditable(gridview.value, false);
      }


    };
//维护
    const F3_DO = async (e: any) => {

      erFormHelper.setGridToolbarVisible(gridview.value, {
        addrow: false,
        delete: false,
        import: false
      });
      return await saveMainGridData()
        .then((res: any) => {
          queryRecord(); //查询记录
          editable.value = false;
          erFormHelper.setGridEditable(gridview.value, false);
        })
        .catch((error) => {
          erFormHelper.messageError(error);
          return false;
        });
    };

    // 主表保存
    const saveMainGridData = async () => {
      if (erFormHelper.hasDataChange(gridview.value)) {
        const eiinfo = new EI.EIInfo();


        const created = erFormHelper.getGridCreatedRowsAsBlock(gridview.value);
        eiinfo.addBlock(created, 'ADD');

        const updated = erFormHelper.getGridModifyRowsAsBlock(gridview.value);
        eiinfo.addBlock(updated, 'UPD');

        const deleted = erFormHelper.getGridDeletedRowsAsBlock(gridview.value);
        eiinfo.addBlock(deleted, 'DEL');
        if (created.data.length === 0 && updated.data.length === 0 && deleted.data.length === 0) {
          erFormHelper.messageInfo('请选择需操作的记录。');
          return false;
        }
        //const para = erFormHelper.getAllControlValueAsEiBlock(layout.value);
        //eiinfo.addBlock(para, 'PARA');

        console.log('asdfghnm', eiinfo);

        const outInfo = await erFormHelper.callService(callService_f3.value, eiinfo, true, true, true);


        if (outInfo.sys.status < 0) {
          erFormHelper.messageInfo('处理失败[' + outInfo.sys.msg + ']。');
          return false;
        } else {

          erFormHelper.messageInfo('保存成功!');
        }
        queryRecord(); //查询记录
      }
    };
    const F3_PRE_DO = async (e: any) => {

      editable.value = true;
      erFormHelper.setGridToolbarVisible(gridview.value, {
        addrow: true,
        delete: true,
        import: true
      });

      erFormHelper.setGridEditable(gridview.value, true);
    };
    const F3_CANCEL = async (e: any) => {   
      editable.value = false;
      erFormHelper.setGridToolbarVisible(gridview.value, {
        addrow: false,
        delete: false,
        import: false
      });
      erFormHelper.setGridEditable(gridview.value, false);
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
      gridToolbar,
      layout,
      gridview,
      c_name,
      queryRecord,

      
    };
  }
});
