<template>
  <div id="taigang">
    <div class="form">
      <span>查询炉号</span>
      <input type="text" v-model="inputLuhao">
      <span>查询板坯号</span>
      <input type="text" v-model="inputBanpihao">
      <button class="btn" @click="getData">查询</button>
    </div>
    <div class="middle">
      <template v-for="(item, index) in middleList" :key="item.title">
        <div class="item">
          <span class="title">{{ item.title }}</span>
          <img :src="item.src" alt="" :style="{ height: item.size.height / 270 * 100 + '%' }">
          <div class="context">
            <span>碳排总量</span>
            <span>{{ item.zongliang }}</span>
            <span>碳排强度</span>
            <span>{{ item.qiangdu }}</span>
          </div>
        </div>
        <img v-if="index != 6" src="../../assets/绿箭头.png" alt="" width="10" height="15">
      </template>

    </div>
    <div class="bottom">
      <div class="luhao">
        <div class="title">炉号 {{ luhao }}</div>
        <div class="echarts">
          <div class="ganglubi">
            <div class="title">铁钢比</div>
            <svg viewBox="0 0 100 100">
              <defs>
                <radialGradient id="myRadial" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                  <stop offset="60%" stop-color="#DCF3E1" stop-opacity="1" />
                  <stop offset="100%" stop-color="#209F85" stop-opacity="0" />
                </radialGradient>
              </defs>
              <circle fill="url(#myRadial)" cx="50" cy="50" r="50"></circle>
              <circle fill="white" cx="50" cy="50" r="35"></circle>
              <path :d="getCirclePath(gangtiebi > 1 ? 1 : gangtiebi)" fill="none" stroke="RGBA(32, 159, 133, 1)"
                stroke-width="10" stroke-linecap="round"></path>
              <g>
                <text text-anchor="middle" x="50" y="42" style="" font-size="12">铁钢比</text>
                <text text-anchor="middle" x="50" y="58" style="" font-size="12" font-weight="900">{{ gangtiebi * 100 +
                  '%'
                }}</text>

              </g>

            </svg>
          </div>
          <div class="wendu">
            <div class="title">铁水温度</div>
            <div class="img">
              <img src="../../assets/温度标识.png">
              <div class="text">
                <span>{{ tieshuiwendu }}</span>
                <br>
                <span>℃</span>
              </div>
            </div>
          </div>
          <div class="chengfen">
            <div class="title">铁水成分</div>
            <div class="echarts">
              <div class="item" v-for="item in chengfenList" :key="item.title">
                <svg viewBox="0 0 100 50">
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" style="stop-color:#DCF3E1;stop-opacity:1" />
                      <stop offset="100%" style="stop-color:#209F85;stop-opacity:1" />
                    </linearGradient>
                  </defs>
                  <defs>
                    <linearGradient id="grad2" x1="0%" y1="100%" x2="10%" y2="0%">
                      <stop offset="0%" style="stop-color:#DCF3E1;stop-opacity:1" />
                      <stop offset="100%" style="stop-color:#209F85;stop-opacity:1" />
                    </linearGradient>
                  </defs>
                  <defs>
                    <linearGradient id="grad3" x1="0%" y1="100%" x2="30%" y2="0%">
                      <stop offset="0%" style="stop-color:#DCF3E1;stop-opacity:1" />
                      <stop offset="100%" style="stop-color:#209F85;stop-opacity:1" />
                    </linearGradient>
                  </defs>
                  <defs>
                    <linearGradient id="grad4" x1="0%" y1="100%" x2="50%" y2="0%">
                      <stop offset="0%" style="stop-color:#DCF3E1;stop-opacity:1" />
                      <stop offset="100%" style="stop-color:#209F85;stop-opacity:1" />
                    </linearGradient>
                  </defs>
                  <defs>
                    <linearGradient id="grad5" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" style="stop-color:#DCF3E1;stop-opacity:1" />
                      <stop offset="100%" style="stop-color:#209F85;stop-opacity:1" />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="45" fill="RGBA(205, 252, 235, 1)"></circle>
                  <circle cx="50" cy="50" r="30" fill="white"></circle>
                  <circle cx="50" cy="50" r="45" fill="none" stroke="RGBA(50, 184, 150, 1)" stroke-width="3"></circle>
                  <path :d="getHalfCirclePath(item.num / 100 > 1 ? 1 : item.num / 100)" fill="none"
                    :stroke="`url(#${getLinear(item.num / 100)})`" stroke-width="20"></path>
                  <text x="50" y="45" style="text-anchor: middle;">
                    <tspan>{{ item.title }}</tspan>
                    <tspan font-size="9">({{ item.unit }})</tspan>
                  </text>

                </svg>
                <div class="num">{{ item.num.toFixed(2) }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="jihao">
          <div class="item" v-for="item in jihaolist" :key="item.title">
            <div class="num">{{ item.num }}</div>
            <div class="title">{{ item.title }}</div>
          </div>
        </div>
        <div class="base">
          <div class="left">
            <div class="title">出钢温度</div>
            <div class="wendu">
              <img src="../../assets/温度标识.png" alt="">
              <div class="text">
                <span>{{ chugangwendu.toFixed(2) }}</span>
                <br>
                <span>℃</span>
              </div>
            </div>
            <div class="title">冶炼时长</div>
            <div class="shichang">
              <template v-for="(str, index) in yelianshijian" :key="index">
                <span v-if="str !== ':'" class="num">{{ str }}</span>
                <span v-else class="dian">{{ str }}</span>
              </template>
              <!-- <span class="num">8</span><span class="num">8</span><span class="num">8</span><span class="num">8</span> -->
            </div>
          </div>
          <div class="right">
            <div class="title">碳排总量/碳排强度</div>
            <div class="paifang">
              <div class="item" v-for="item in paifangList" :key="item.name">
                <div class="deep">
                  <div class="box">
                    <div class="block" :style="{ height: item.xishu * 100 + '%' }"></div>
                  </div>
                </div>
                <div class="tip">碳排总量</div>
                <div class="green">{{ item.zongliang }}</div>
                <div class="name">{{ item.name }}</div>
                <div class="tip">碳排强度</div>
                <div class="black">{{ item.qiangdu }}</div>
                <div class="light">
                  <div class="box">
                    <div class="block" :style="{ height: item.xishu * 100 + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="banpihao">
        <div class="title">板坯号 {{ banpihao }}</div>
        <div class="row2">
          <div class="card border">
            <div class="name">预测</div>
            <div class="line">
              <div class="tip">碳排总量</div>
              <div class="num">{{ yuce.zongliang }}</div>
            </div>
            <div class="line">
              <div class="tip">碳排强度</div>
              <div class="num">{{ yuce.qiangdu }}</div>
            </div>
          </div>
          <div class="card border">
            <div class="name">实绩</div>
            <div class="line">
              <div class="tip">碳排总量</div>
              <div class="num">{{ shiji.zongliang }}</div>
            </div>
            <div class="line">
              <div class="tip">碳排强度</div>
              <div class="num">{{ shiji.qiangdu }}</div>
            </div>
          </div>
        </div>
        <div class="gongyilujing">
          <div class="title">工艺路径优选</div>
          <div class="card" :class="{ border: index !== 0 }" v-for="(item, index) in gongyiList" :key="item.name">
            <div class="name">{{ item.name }}</div>
            <div class="path_id">{{ item.path_id }}</div>
            <div class="row">
              <span class="tip">碳排总量</span>
              <span>{{ item.zongliang }}</span>
              <span class="tip">碳排强度</span>
              <span>{{ item.qiangdu }}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>



import { EI, EIManager } from 'EIX/ei';
import { onMounted, reactive, ref } from 'vue';
const inputLuhao = ref('');
const inputBanpihao = ref('');
const luhao = ref('');
const gangtiebi = ref(0);
const tieshuiwendu = ref(0);
const chugangwendu = ref(0);
const yelianshijian = ref<string[]>(['0', ':', '0']);
const banpihao = ref('xx');
const yuce = reactive({
  zongliang: '0.00',
  qiangdu: '0.00'
});
const shiji = reactive({
  zongliang: '0.00',
  qiangdu: '0.00'
})
const gongyiList = reactive([
  {
    name: '工艺一',
    path_id: 'x',
    zongliang: '0',
    qiangdu: '0'
  },
  {
    name: '工艺二',
    path_id: 'x',
    zongliang: '0',
    qiangdu: '0'
  },
  {
    name: '工艺三',
    path_id: 'x',
    zongliang: '0',
    qiangdu: '0'
  },
])



function getAssetsImages(name: string) {

  if (name === 'tuoliu.png') {
    console.log('shaojie');

    return new URL('@/assets/tuoliu.png', import.meta.url).href
  }
  else if (name == 'zhongpinlu.png') {
    console.log('jiaohua');

    return new URL('@/assets/zhongpinlu.png', import.meta.url).href
  }
  else if (name == 'zhuanlu.png') {
    console.log('gaolu');

    return new URL('@/assets/zhuanlu.png', import.meta.url).href
  }
  else if (name == 'dianlu.png') {
    console.log('erliangang');

    return new URL('@/assets/dianlu.png', import.meta.url).href
  }
  else if (name == 'aod.png') {
    console.log('rezha');

    return new URL('@/assets/aod.png', import.meta.url).href
  }
  else if (name == 'jinglian.png') {
    console.log('lengzha');

    return new URL('@/assets/jinglian.png', import.meta.url).href
  }
  else if (name == 'lianzhu.png') {
    console.log('lengzhaguigang');

    return new URL('@/assets/lianzhu.png', import.meta.url).href
  }

}

const middleList = reactive([

  {
    title: '脱硫',
    src: getAssetsImages('tuoliu.png'),
    zongliang: '1',
    qiangdu: '2',
    size: {
      height: 74
    }
  },
  {
    title: '合金熔化炉',
    src: getAssetsImages('zhongpinlu.png'),
    zongliang: '1',
    qiangdu: '2',
    size: {
      height: 73
    }
  },
  {
    title: '转炉',
    src: getAssetsImages('zhuanlu.png'),
    zongliang: '1',
    qiangdu: '2',
    size: {
      height: 112
    }
  },
  {
    title: '电炉',
    src: getAssetsImages('dianlu.png'),
    zongliang: '1',
    qiangdu: '2',
    size: {
      height: 89
    }
  },
  {
    title: 'A0D',
    src: getAssetsImages('aod.png'),
    zongliang: '1',
    qiangdu: '2',
    size: {
      height: 87
    }
  },
  {
    title: '精炼',
    src: getAssetsImages('jinglian.png'),
    zongliang: '1',
    qiangdu: '2',
    size: {
      height: 87
    }
  },
  {
    title: '连铸',
    src: getAssetsImages('lianzhu.png'),
    zongliang: '1',
    qiangdu: '2',
    size: {
      height: 52
    }
  },
]);
const getCirclePath = (num: number): string => {
  const r = 35;

  const deg = Math.PI * 2 * num;
  const x = -Math.sin(deg) * r;
  const y = r - Math.cos(deg) * r;
  return `m50,15 a 35,35 0,${num > 0.5 ? 1 : 0},0 ${x},${y}`
}
const getHalfCirclePath = (num: number): string => {
  const r = 38;
  const width = 100;
  const height = 50;
  const deg = Math.PI * num;
  const x = r - Math.cos(deg) * r;
  const y = -Math.sin(deg) * r;
  return `m${width / 2 - r},50 a${r},${r} 0 0 1 ${x},${y}`
}
const chengfenList = reactive([
  {
    title: '碳',
    unit: 'C',
    num: 10
  },
  {
    title: '硅',
    unit: 'Si',
    num: 20
  },
  {
    title: '磷',
    unit: 'P',
    num: 0
  },
  {
    title: '硫',
    unit: 'S',
    num: 0
  },
]);
const jihaolist = reactive([
  {
    num: '0',
    title: '出钢记号'
  },
  {
    num: '0',
    title: '牌号'
  },
  {
    num: '0',
    title: '中间包连浇炉数'
  },

]);
const paifangList = reactive([
  {
    name: '铁水',
    zongliang: '0',
    qiangdu: '0',
    xishu: 0,
  },
  {
    name: '废钢',
    zongliang: '0',
    qiangdu: '0',
    xishu: 0
  },
  {
    name: '合金',
    zongliang: '0',
    qiangdu: '0',
    xishu: 0
  },
  {
    name: '辅料',
    zongliang: '0',
    qiangdu: '0',
    xishu: 0
  },
  {
    name: '能介',
    zongliang: '0',
    qiangdu: '0',
    xishu: 0
  },
]);
const getLinear = (num: number) => {
  if (num < 0.1) {
    return 'grad1'
  } else if (num <= 0.12) {
    return 'grad2'
  } else if (num <= 0.15) {
    return 'grad3'
  } else if (num <= 0.2) {
    return 'grad4'
  } else {
    return 'grad5'
  }
}
const getData = () => {
  const eiInfo = new EI.EIInfo();
  const eiBlock1 = eiInfo.addBlock(new EI.EiBlock(), 'NEWEPEP04');
  const HEAT_NO = inputLuhao.value.trim() ? inputLuhao.value.trim() : '';
  const MAT_NO = inputBanpihao.value.trim() ? inputBanpihao.value.trim() : '';

  eiBlock1.pushData(
    {
      HEAT_NO,
      MAT_NO
    },
    true
  );
  EIManager.callService('TGT8Z', 'tksm13_inq', eiInfo)
    .then((res: any) => {
      const columns0 = res.blocks.Table0.columns as any[];
      const columns1 = res.blocks.Table1.columns as any[];

      const data0 = res.blocks.Table0.data[0] as { [key: string]: any };
      const data1 = res.blocks.Table1.data as { [key: string]: any }[];
      // 一：中间区域。
      // 1、烧结

      middleList[0].zongliang = data0['脱硫碳排总量'].toFixed(2);
      middleList[0].qiangdu = data0['脱硫碳排强度'].toFixed(2)
      // 2、焦化
      middleList[1].zongliang = data0['中频炉碳排总量'].toFixed(2)
      middleList[1].qiangdu = data0['中频炉碳排强度'].toFixed(2)
      // 3、高炉
      middleList[2].zongliang = data0['转炉碳排总量'].toFixed(2)
      middleList[2].qiangdu = data0['转炉碳排强度'].toFixed(2)
      // 4、二炼钢
      middleList[3].zongliang = data0['电炉碳排总量'].toFixed(2)
      middleList[3].qiangdu = data0['电炉碳排强度'].toFixed(2)
      // 5、热轧
      middleList[4].zongliang = data0['A0D碳排总量'].toFixed(2)
      middleList[4].qiangdu = data0['A0D碳排强度'].toFixed(2)
      // 6、冷轧
      middleList[5].zongliang = data0['精炼碳排总量'].toFixed(2)
      middleList[5].qiangdu = data0['精炼碳排强度'].toFixed(2)
      // 7、冷轧硅钢
      middleList[6].zongliang = data0['连铸碳排总量'].toFixed(2)
      middleList[6].qiangdu = data0['连铸碳排强度'].toFixed(2)
      // 二：左下角区域
      // 1、炉号
      luhao.value = data0['炉号'] as string;
      // 2、铁钢比
      gangtiebi.value = Number((data0['铁钢比'] as string).slice(0, -1));
      // 3、铁水温度
      tieshuiwendu.value = Number(data0['铁水温度']);
      // 4、铁水成分。
      chengfenList[0].num = data0['C成分'];
      chengfenList[1].num = data0['SI成分'];
      chengfenList[2].num = data0['P成分'];
      chengfenList[3].num = data0['S成分'];
      // 出钢记号
      jihaolist[0].num = data0['出钢记号'];
      jihaolist[1].num = data0['牌号'];
      jihaolist[2].num = data0['连浇炉数'];

      // 5、出钢温度
      chugangwendu.value = Number(data0['出钢温度']);
      // 6、冶炼时间
      const hours = Math.floor(data0['冶炼时间'] / 60);
      const minutes = (data0['冶炼时间'] % 60).toFixed(0);
      yelianshijian.value = (`${hours}:${minutes}`).split('')
      // 7、碳排放总量、碳排强度
      paifangList[0].zongliang = Number(data0['铁水碳排总量']).toFixed(2);
      paifangList[0].qiangdu = Number(data0['铁水碳排强度']).toFixed(2);
      paifangList[0].xishu = Number(data0['铁水系数']);

      paifangList[1].zongliang = Number(data0['废钢碳排总量']).toFixed(2);
      paifangList[1].qiangdu = Number(data0['废钢碳排强度']).toFixed(2);
      paifangList[1].xishu = Number(data0['废钢系数']);

      paifangList[2].zongliang = Number(data0['合金碳排总量']).toFixed(2);
      paifangList[2].qiangdu = Number(data0['合金碳排强度']).toFixed(2);
      paifangList[2].xishu = Number(data0['合金系数']);

      paifangList[3].zongliang = Number(data0['辅料碳排总量']).toFixed(2);
      paifangList[3].qiangdu = Number(data0['辅料碳排强度']).toFixed(2);
      paifangList[3].xishu = Number(data0['辅料系数']);

      paifangList[4].zongliang = Number(data0['能介碳排总量']).toFixed(2);
      paifangList[4].qiangdu = Number(data0['能介碳排强度']).toFixed(2);
      paifangList[4].xishu = Number(data0['能介系数']);

      // 三：右下角
      banpihao.value = data0['材料号'] as string;
      yuce.qiangdu = Number(data0['预测碳排强度']).toFixed(2);
      yuce.zongliang = Number(data0['预测碳排总量']).toFixed(2);

      shiji.qiangdu = Number(data0['实绩碳排强度']).toFixed(2);
      shiji.zongliang = Number(data0['实绩碳排总量']).toFixed(2);

      gongyiList[0].path_id = data1[0]['路径'];
      gongyiList[0].zongliang = data1[0]['碳排总量'];
      gongyiList[0].qiangdu = data1[0]['碳排强度'];

      gongyiList[1].path_id = data1[1]['路径'];
      gongyiList[1].zongliang = data1[1]['碳排总量'];
      gongyiList[1].qiangdu = data1[1]['碳排强度'];

      gongyiList[2].path_id = data1[2]['路径'];
      gongyiList[2].zongliang = data1[2]['碳排总量'];
      gongyiList[2].qiangdu = data1[2]['碳排强度'];


    });
}
onMounted(() => {
  getData()
});
</script>
<style lang="scss" scoped>
@function getHeight($num) {
  @return $num * 0.00125 * 100vh;
}

#taigang {
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  font-weight: 900 !important;
  // background-color: black;

  .form {
    height: getHeight(41);
    line-height: getHeight(41);
    // height: 100vh;
    background-color: RGBA(220, 234, 218, 1);
    font-size: getHeight(18);

    span {
      margin: 0 17px 0 55px;
      color: rgba(0, 93, 55, 1);
      font-weight: 800;
    }

    input {
      display: inline-block;
      width: 252px;
      height: getHeight(25);
      border-radius: getHeight(12);
      border: 1px solid rgba($color: #000000, $alpha: 0.2);
      text-indent: 1em;

    }

    .btn {
      font-size: getHeight(18);
      line-height: getHeight(20);
      background-color: white;

      margin-left: 55px;
      border: 1px solid rgba($color: #000000, $alpha: 0.2);
      color: rgba(0, 93, 55, 1);
      font-weight: 800;
      padding: 2px 15px;
      border-radius: getHeight(12);

      &:hover {
        background-color: #ccc;
        cursor: pointer;
      }

    }
  }

  .middle {
    position: relative;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: getHeight(270);
    margin: 0 18px;
    border: 1px solid rgba($color: #000000, $alpha: 0.2);
    border-radius: 8px;
    // background-color: gray;

    .item {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      text-align: center;
      height: 100%;
      overflow: hidden;

      .title {
        font-size: getHeight(14);
        color: rgba(70, 78, 95, 1);
        font-family: SourceHanSansCN-Medium;
        font-weight: 800;
      }

      .context {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        height: getHeight(87);
        font-size: getHeight(13);
        color: rgba(120, 120, 121, 1);
      }
    }

  }

  .bottom {
    display: flex;
    justify-content: space-between;
    height: getHeight(446);
    margin: 0 18px;

    .luhao {
      overflow: hidden;
      width: 59.2%;
      height: 100%;
      border: 1px solid rgba($color: #000000, $alpha: 0.2);
      border-radius: 8px;

      .title {
        color: rgba(120, 120, 121, 1);
        font-size: getHeight(12);
        font-weight: 800;
      }

      >.title {
        font-size: getHeight(14);
        font-weight: 800;
        color: rgba(70, 78, 95, 1)rgba(70, 78, 95, 1);
        padding: getHeight(18) getHeight(26);

      }

      >.echarts {
        display: flex;
        justify-content: space-evenly;
        height: getHeight(110);

        >div {
          height: 100%;
          overflow: hidden;
        }

        .title {
          font-size: getHeight(12);
          color: rgba(120, 120, 121, 1);
        }

        .ganglubi {
          display: flex;
          flex-direction: column;
          width: 18.7%;

          svg {
            flex: 1;
          }
        }

        .wendu {
          height: 100%;
          width: 15%;
          display: flex;
          flex-direction: column;

          .img {
            display: flex;
            align-items: flex-end;
            justify-content: flex-end;
            flex: 1;
            overflow: hidden;

            img {

              height: 100%;
            }

            .text {
              text-align: right;
              line-height: getHeight(20);
              font-size: getHeight(12);
              color: rgba(70, 78, 95, 1);
            }
          }


        }

        .chengfen {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 48.7%;

          .echarts {
            display: flex;
            justify-content: space-evenly;
            flex: 1;
            overflow: hidden;

            .item {
              display: flex;
              flex-direction: column;
              justify-content: center;
              width: 23%;

              svg {
                width: 100%;
                aspect-ratio: 100 / 50;
              }

              .num {
                margin-top: getHeight(10);
                text-align: center;
                font-size: getHeight(14);
                font-weight: 800;
              }

            }
          }
        }
      }

      >.jihao {
        width: 100%;
        height: getHeight(55);
        display: flex;
        justify-content: space-around;
        background: linear-gradient(to left, RGBA(247, 250, 255, 1), white, RGBA(247, 250, 255, 1));

        .item {
          display: flex;
          flex-direction: column;
          justify-content: center;

          .num {
            font-size: getHeight(18);
            margin-bottom: getHeight(3);
            color: rgba(70, 78, 95, 1);
          }

          .title {
            font-size: getHeight(12);
            color: rgba(120, 120, 121, 1);

          }
        }
      }

      >.base {
        display: flex;
        width: 100%;
        height: getHeight(210);

        margin-top: getHeight(10);

        >.left {
          height: 100%;
          width: 32%;
          padding-left: 3%;

          .wendu {
            display: flex;
            align-items: flex-end;
            margin-top: getHeight(5);
            margin-bottom: getHeight(10);

            img {
              height: getHeight(92);

            }

            .text {
              color: rgba(70, 78, 95, 1);
              font-size: getHeight(14);
              text-align: right;
              margin-bottom: getHeight(20);
            }
          }

          .shichang {
            margin-top: getHeight(10);

            .num {
              display: inline-block;
              width: getHeight(29);
              height: getHeight(39);
              margin-right: getHeight(1);
              text-align: center;
              line-height: getHeight(39);
              font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
              font-size: getHeight(25);
              color: white;
              background-image: url('@/assets/时钟背景.png');
              background-size: 100% 100%;
            }

            .dian {
              font-size: getHeight(30);
              font-weight: 900;
              color: green;
            }
          }
        }

        >.right {
          height: 100%;
          width: 66%;

          .paifang {
            display: flex;
            justify-content: space-evenly;
            width: 100%;
            height: getHeight(190);

            .item {
              width: 19%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-between;

              .tip {
                font-size: getHeight(12);
                color: rgba(181, 181, 195, 1);
              }

              .name {
                color: rgba(120, 120, 121, 1);
                font-size: getHeight(13);
              }

              .deep,
              .light {
                display: flex;
                justify-content: center;
                align-items: center;
                height: getHeight(51);
                aspect-ratio: 1 / 1;
                line-height: getHeight(51);

                .box {
                  position: relative;
                  width: 70%;
                  height: 70%;
                  // text-shadow: 10px;
                  box-shadow: 0 0 getHeight(5) #209F85;
                  border-radius: getHeight(5);

                  .block {
                    position: absolute;
                    width: 100%;
                    border-radius: getHeight(5);
                  }
                }
              }

              .deep {
                .block {
                  bottom: 0;
                  background-color: RGBA(32, 159, 133, 1);

                }
              }

              .light {
                .block {
                  top: 0;
                  background-color: RGBA(220, 234, 218, 1);
                }
              }

              .green {
                font-size: getHeight(14);
                color: RGBA(32, 159, 133, 1);
              }

              .black {
                color: rgba(70, 78, 95, 1);
                font-size: getHeight(16);
                font-weight: 800;
              }
            }
          }
        }
      }
    }

    .banpihao {
      width: 38.98%;
      border: 1px solid rgba($color: #000000, $alpha: 0.2);
      border-radius: 8px;

      .border {
        border: 1px solid rgba($color: #000000, $alpha: 0.2);
        border-radius: 8px;
      }

      >.title {
        font-size: getHeight(14);
        font-weight: 800;
        color: rgba(70, 78, 95, 1)rgba(70, 78, 95, 1);
        padding: getHeight(18) getHeight(26) getHeight(9);
        color: rgba(120, 120, 121, 1);
        font-size: getHeight(14);
        font-weight: 800;

      }

      >.row2 {

        display: flex;
        justify-content: space-evenly;
        height: getHeight(103);

        .border {
          border: 1px solid rgba($color: #000000, $alpha: 0.2);
          border-radius: getHeight(5)
        }

        .card {
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          width: 45%;
          height: getHeight(103);
          overflow: hidden;

          .name {
            margin-left: 5%;
            color: rgba(120, 120, 121, 1);
            font-size: getHeight(12);
          }

          .line {
            position: relative;
            height: getHeight(29);
            justify-content: space-between;
            align-items: center;
            width: 90%;
            margin-left: 5%;
            background-color: rgb(226, 230, 230);

            .tip {

              height: getHeight(18);
              padding-left: 5%;
              width: 80%;
              margin-top: getHeight(5);
              line-height: getHeight(18);
              background: linear-gradient(45deg, RGBA(208, 244, 208, 1), RGBA(208, 244, 208, 1) 80%, transparent 80%, transparent);

              // background-color: #209F85;
              font-size: getHeight(12);
              color: rgba(120, 120, 121, 1);
              font-weight: 800;

            }

            .num {
              position: absolute;
              right: 0;

              top: getHeight(5);
              font-size: getHeight(15);
              color: rgba(120, 120, 121, 1);
            }
          }
        }
      }

      >.gongyilujing {
        padding: getHeight(14) getHeight(14) getHeight(7);

        .title {
          color: rgba(120, 120, 121, 1);
          font-size: getHeight(12);
        }

        .card {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          height: getHeight(78);
          width: 90%;
          margin-left: 5%;
          margin-top: getHeight(8);
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-around;

          &:nth-child(2) {
            position: relative;
            background-color: rgb(231, 254, 231);
            border-radius: 0 8px 8px 0;

            &::before {
              content: '';
              display: block;
              position: absolute;
              left: - getHeight(40);
              height: getHeight(78);
              width: getHeight(40);
              border-style: solid;
              border-width: getHeight(39) getHeight(20);
              box-sizing: border-box;
              border-color: transparent rgb(231, 254, 231) transparent transparent;
            }

            // .name {
            //   color: white;
            // }

            // .path_id {
            //   color: white;
            // }

            // .tip {
            //   color: white;

            // }

            // span {
            //   color: #147AA9;
            // }
          }

          span {
            margin-left: getHeight(10);

            &:first-child {
              margin-left: 0;
            }
          }

          .name {
            font-size: getHeight(14);
            color: rgba(120, 120, 121, 1);
            font-weight: 800;
          }

          .path_id {
            font-size: getHeight(12);
            color: rgba(120, 120, 121, 1);
          }

          .tip {
            font-size: getHeight(14);
            color: rgba(120, 120, 121, 1);

            &:not(:first-child) {
              margin-left: getHeight(15);
            }
          }
        }



      }
    }
  }
}
</style>