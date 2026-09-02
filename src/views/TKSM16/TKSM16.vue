<template>
  <div id="taigang">
    <div class="top">
      <div class="dev">
        <div class="title">机组</div>
        <div class="devcode">
          <div class="list-item" @click="devClick('IF')">
            <img src="../../assets/绿箭头.png" alt="" width="10" height="10" />
            <span class="devtitle">合金熔化炉</span>
          </div>
          <div class="list-item" @click="devClick('BOF')">
            <img src="../../assets/绿箭头.png" alt="" width="10" height="10" />
            <span class="devtitle">转炉</span>
          </div>
          <div class="list-item" @click="devClick('EAF')">
            <img src="../../assets/绿箭头.png" alt="" width="10" height="10" />
            <span class="devtitle">电炉</span>
          </div>
          <div class="list-item" @click="devClick('AOD')">
            <img src="../../assets/绿箭头.png" alt="" width="10" height="10" />
            <span class="devtitle">AOD炉</span>
          </div>
          <div class="list-item" @click="devClick('REF')">
            <img src="../../assets/绿箭头.png" alt="" width="10" height="10" />
            <span class="devtitle">精炼炉</span>
          </div>
          <div class="list-item" @click="devClick('CC')">
            <img src="../../assets/绿箭头.png" alt="" width="10" height="10" />
            <span class="devtitle">连铸</span>
          </div>
        </div>
      </div>
      <div class="sum">
        <span class="title">合计</span>
        <div class="echarts">
          <div class="ritanqiangdu">
            <div class="title">日碳强度</div>
            <svg viewBox="0 0 100 100">
              <defs>
                <radialGradient
                  id="myRadial"
                  cx="50%"
                  cy="50%"
                  r="50%"
                  fx="50%"
                  fy="50%"
                >
                  <stop offset="60%" stop-color="#DCF3E1" stop-opacity="1" />
                  <stop offset="100%" stop-color="#209F85" stop-opacity="0" />
                </radialGradient>
              </defs>
              <circle fill="url(#myRadial)" cx="50" cy="50" r="50"></circle>
              <circle fill="white" cx="50" cy="50" r="35"></circle>
              <path
                :d="
                  getCirclePath(
                    Number((grouptan[4].ritanqiangdu / 10).toFixed(2)) > 1
                      ? 1
                      : Number((grouptan[4].ritanqiangdu / 10).toFixed(2))
                  )
                "
                fill="none"
                stroke="RGBA(32, 159, 133, 1)"
                stroke-width="10"
                stroke-linecap="round"
              ></path>
              <text
                text-anchor="middle"
                x="50"
                y="55"
                style=""
                font-size="15"
                font-weight="900"
              >
                {{ grouptan[4].ritanqiangdu }}
              </text>
            </svg>
            <svg viewBox="0 0 100 50">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop
                    offset="0%"
                    style="stop-color: #dcf3e1; stop-opacity: 1"
                  />
                  <stop
                    offset="100%"
                    style="stop-color: #209f85; stop-opacity: 1"
                  />
                </linearGradient>
              </defs>
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="RGBA(205, 252, 235, 1)"
              ></circle>
              <circle cx="50" cy="50" r="30" fill="white"></circle>
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="RGBA(50, 184, 150, 1)"
                stroke-width="3"
              ></circle>
              <path
                d="m 12 50 a 38 38 0 0 1 76 0"
                fill="none"
                stroke="url(#grad1)"
                stroke-width="10"
              ></path>
              <text
                x="50"
                y="45"
                style="text-anchor: middle"
                font-weight="600"
                color=""
              >
                <tspan style="font-size: 9; fill: darkgray">日碳排量</tspan>
                <tspan style="font-size: 7; fill: darkgray">(吨)</tspan>
              </text>
            </svg>
            <div class="num">
              {{ grouptan[4].ritanpailiang }}
            </div>
          </div>
          <div class="leijitanqiangdu">
            <div class="title">累计碳强度</div>
            <svg viewBox="0 0 100 100">
              <defs>
                <radialGradient
                  id="myRadial"
                  cx="50%"
                  cy="50%"
                  r="50%"
                  fx="50%"
                  fy="50%"
                >
                  <stop offset="60%" stop-color="#DCF3E1" stop-opacity="1" />
                  <stop offset="100%" stop-color="#209F85" stop-opacity="0" />
                </radialGradient>
              </defs>
              <circle fill="url(#myRadial)" cx="50" cy="50" r="50"></circle>
              <circle fill="white" cx="50" cy="50" r="35"></circle>
              <path
                :d="
                  getCirclePath(
                    Number((grouptan[4].leijitanqiangdu / 10).toFixed(2)) > 1
                      ? 1
                      : Number((grouptan[4].leijitanqiangdu / 10).toFixed(2))
                  )
                "
                fill="none"
                stroke="RGBA(32, 159, 133, 1)"
                stroke-width="10"
                stroke-linecap="round"
              ></path>
              <text
                text-anchor="middle"
                x="50"
                y="55"
                style=""
                font-size="17"
                font-weight="900"
              >
                {{ grouptan[4].leijitanqiangdu }}
              </text>
            </svg>
            <svg viewBox="0 0 100 50">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop
                    offset="0%"
                    style="stop-color: #dcf3e1; stop-opacity: 1"
                  />
                  <stop
                    offset="100%"
                    style="stop-color: #209f85; stop-opacity: 1"
                  />
                </linearGradient>
              </defs>
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="RGBA(205, 252, 235, 1)"
              ></circle>
              <circle cx="50" cy="50" r="30" fill="white"></circle>
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="RGBA(50, 184, 150, 1)"
                stroke-width="3"
              ></circle>
              <path
                d="m 12 50 a 38 38 0 0 1 76 0"
                fill="none"
                stroke="url(#grad1)"
                stroke-width="10"
              ></path>
              <text
                x="50"
                y="45"
                style="text-anchor: middle"
                font-weight="600"
                color=""
              >
                <tspan style="font-size: 9; fill: darkgray">累计碳排量</tspan>
                <tspan style="font-size: 7; fill: darkgray">(吨)</tspan>
              </text>
            </svg>
            <div class="num">{{ grouptan[4].leijitanpailiang }}</div>
          </div>
          <div class="riqushi">
            <div id="chart-container-ri"></div>
          </div>
          <div class="yuequshi">
            <div id="chart-container-yue"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="grouptop">
      <div class="jia">
        <div class="groupleft">
          <span class="title">甲班</span>
          <div class="echarts">
            <svg viewBox="0 0 100 50">
              <defs>
                <radialGradient
                  id="myRadial"
                  cx="50%"
                  cy="50%"
                  r="50%"
                  fx="50%"
                  fy="50%"
                >
                  <stop offset="0%" stop-color="#209F85" stop-opacity="1" />
                  <stop offset="100%" stop-color="#209F85" stop-opacity="0" />
                </radialGradient>
              </defs>
              <circle fill="url(#myRadial)" cx="50" cy="50" r="50"></circle>
              <circle cx="50" cy="50" r="30" fill="white"></circle>
              <path
                :d="
                  getHalfCirclePath(
                    Number((grouptan[0].ritanqiangdu / 10).toFixed(2)) > 1
                      ? 1
                      : Number((grouptan[0].ritanqiangdu / 10).toFixed(2))
                  )
                "
                fill="none"
                stroke="RGBA(32, 159, 133, 1)"
                stroke-width="8"
              ></path>
              <line
                x1="50"
                y1="50"
                :x2="
                  getX1(
                    Number((grouptan[0].ritanqiangdu / 10).toFixed(2)) > 1
                      ? 1
                      : Number((grouptan[0].ritanqiangdu / 10).toFixed(2))
                  )
                "
                :y2="
                  getY1(
                    Number((grouptan[0].ritanqiangdu / 10).toFixed(2)) > 1
                      ? 1
                      : Number((grouptan[0].ritanqiangdu / 10).toFixed(2))
                  )
                "
                stroke="RGBA(32, 159, 133, 1)"
                stroke-width="3"
                stroke-linecap="round"
              />
              <path
                :d="
                  getHalfCirclePathMin(
                    Number((grouptan[0].leijitanqiangdu / 10).toFixed(2)) > 1
                      ? 1
                      : Number((grouptan[0].leijitanqiangdu / 10).toFixed(2))
                  )
                "
                fill="none"
                stroke="RGBA(32, 159, 103, 1)"
                stroke-width="8"
              ></path>
              <line
                x1="50"
                y1="50"
                :x2="
                  getX2(
                    Number((grouptan[0].leijitanqiangdu / 10).toFixed(2)) > 1
                      ? 1
                      : Number((grouptan[0].leijitanqiangdu / 10).toFixed(2))
                  )
                "
                :y2="
                  getY2(
                    Number((grouptan[0].leijitanqiangdu / 10).toFixed(2)) > 1
                      ? 1
                      : Number((grouptan[0].leijitanqiangdu / 10).toFixed(2))
                  )
                "
                stroke="RGBA(32, 159, 103, 1)"
                stroke-width="3"
                stroke-linecap="round"
              />
            </svg>
            <div class="des">
              <div class="des1">
                <div class="top">
                  <div class="point"></div>
                  <span class="title">日碳强度</span>
                </div>
                <span class="zhi">{{ grouptan[0].ritanqiangdu }}</span>
              </div>
              <div class="des2">
                <div class="top">
                  <div class="point"></div>
                  <span class="title">累计碳强度</span>
                </div>
                <span class="zhi">{{ grouptan[0].leijitanqiangdu }}</span>
              </div>
            </div>
          </div>
          <div class="groupdata">
            <div class="tip">日碳排量<span class="unit">（吨）</span></div>
            <div class="num">{{ grouptan[0].ritanpailiang }}</div>
          </div>
          <div class="groupdata">
            <div class="tip">累计碳排量<span class="unit">（吨）</span></div>
            <div class="num">{{ grouptan[0].leijitanpailiang }}</div>
          </div>
        </div>
        <div class="groupright">
          <div class="riqushi">
            <div id="chart-container-ri-jia"></div>
          </div>
          <div class="yuequshi">
            <div id="chart-container-yue-jia"></div>
          </div>
        </div>
      </div>
      <div class="yi">
        <div class="groupleft">
          <span class="title">乙班</span>
          <div class="echarts">
            <svg viewBox="0 0 100 50">
              <defs>
                <radialGradient
                  id="myRadial"
                  cx="50%"
                  cy="50%"
                  r="50%"
                  fx="50%"
                  fy="50%"
                >
                  <stop offset="0%" stop-color="#209F85" stop-opacity="1" />
                  <stop offset="100%" stop-color="#209F85" stop-opacity="0" />
                </radialGradient>
              </defs>
              <circle fill="url(#myRadial)" cx="50" cy="50" r="50"></circle>
              <circle cx="50" cy="50" r="30" fill="white"></circle>
              <path
                :d="
                  getHalfCirclePath(
                    Number((grouptan[1].ritanqiangdu / 10).toFixed(2)) > 1
                      ? 1
                      : Number((grouptan[1].ritanqiangdu / 10).toFixed(2))
                  )
                "
                fill="none"
                stroke="RGBA(32, 159, 133, 1)"
                stroke-width="8"
              ></path>
              <line
                x1="50"
                y1="50"
                :x2="
                  getX1(
                    Number((grouptan[1].ritanqiangdu / 10).toFixed(2)) > 1
                      ? 1
                      : Number((grouptan[1].ritanqiangdu / 10).toFixed(2))
                  )
                "
                :y2="
                  getY1(
                    Number((grouptan[1].ritanqiangdu / 10).toFixed(2)) > 1
                      ? 1
                      : Number((grouptan[1].ritanqiangdu / 10).toFixed(2))
                  )
                "
                stroke="RGBA(32, 159, 133, 1)"
                stroke-width="3"
                stroke-linecap="round"
              />
              <path
                :d="
                  getHalfCirclePathMin(
                    Number((grouptan[1].leijitanqiangdu / 10).toFixed(2)) > 1
                      ? 1
                      : Number((grouptan[1].leijitanqiangdu / 10).toFixed(2))
                  )
                "
                fill="none"
                stroke="RGBA(32, 159, 103, 1)"
                stroke-width="8"
              ></path>
              <line
                x1="50"
                y1="50"
                :x2="
                  getX2(
                    Number((grouptan[1].leijitanqiangdu / 10).toFixed(2)) > 1
                      ? 1
                      : Number((grouptan[1].leijitanqiangdu / 10).toFixed(2))
                  )
                "
                :y2="
                  getY2(
                    Number((grouptan[1].leijitanqiangdu / 10).toFixed(2)) > 1
                      ? 1
                      : Number((grouptan[1].leijitanqiangdu / 10).toFixed(2))
                  )
                "
                stroke="RGBA(32, 159, 103, 1)"
                stroke-width="3"
                stroke-linecap="round"
              />
            </svg>
            <div class="des">
              <div class="des1">
                <div class="top">
                  <div class="point"></div>
                  <span class="title">日碳强度</span>
                </div>
                <span class="zhi">{{ grouptan[1].ritanqiangdu }}</span>
              </div>
              <div class="des2">
                <div class="top">
                  <div class="point"></div>
                  <span class="title">累计碳强度</span>
                </div>
                <span class="zhi">{{ grouptan[1].leijitanqiangdu }}</span>
              </div>
            </div>
          </div>
          <div class="groupdata">
            <div class="tip">日碳排量<span class="unit">（吨）</span></div>
            <div class="num">{{ grouptan[1].ritanpailiang }}</div>
          </div>
          <div class="groupdata">
            <div class="tip">累计碳排量<span class="unit">（吨）</span></div>
            <div class="num">{{ grouptan[1].leijitanpailiang }}</div>
          </div>
        </div>
        <div class="groupright">
          <div class="riqushi">
            <div id="chart-container-ri-yi"></div>
          </div>
          <div class="yuequshi">
            <div id="chart-container-yue-yi"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="groupbottom">
      <div class="bing">
        <div class="groupleft">
          <span class="title">丙班</span>
          <div class="echarts">
            <svg viewBox="0 0 100 50">
              <defs>
                <radialGradient
                  id="myRadial"
                  cx="50%"
                  cy="50%"
                  r="50%"
                  fx="50%"
                  fy="50%"
                >
                  <stop offset="0%" stop-color="#209F85" stop-opacity="1" />
                  <stop offset="100%" stop-color="#209F85" stop-opacity="0" />
                </radialGradient>
              </defs>
              <circle fill="url(#myRadial)" cx="50" cy="50" r="50"></circle>
              <circle cx="50" cy="50" r="30" fill="white"></circle>
              <path
                :d="
                  getHalfCirclePath(
                    Number((grouptan[2].ritanqiangdu / 10).toFixed(2)) > 1
                      ? 1
                      : Number((grouptan[2].ritanqiangdu / 10).toFixed(2))
                  )
                "
                fill="none"
                stroke="RGBA(32, 159, 133, 1)"
                stroke-width="8"
              ></path>
              <line
                x1="50"
                y1="50"
                :x2="
                  getX1(
                    Number((grouptan[2].ritanqiangdu / 10).toFixed(2)) > 1
                      ? 1
                      : Number((grouptan[2].ritanqiangdu / 10).toFixed(2))
                  )
                "
                :y2="
                  getY1(
                    Number((grouptan[2].ritanqiangdu / 10).toFixed(2)) > 1
                      ? 1
                      : Number((grouptan[2].ritanqiangdu / 10).toFixed(2))
                  )
                "
                stroke="RGBA(32, 159, 133, 1)"
                stroke-width="3"
                stroke-linecap="round"
              />
              <path
                :d="
                  getHalfCirclePathMin(
                    Number((grouptan[2].leijitanqiangdu / 10).toFixed(2)) > 1
                      ? 1
                      : Number((grouptan[2].leijitanqiangdu / 10).toFixed(2))
                  )
                "
                fill="none"
                stroke="RGBA(32, 159, 103, 1)"
                stroke-width="8"
              ></path>
              <line
                x1="50"
                y1="50"
                :x2="
                  getX2(
                    Number((grouptan[2].leijitanqiangdu / 10).toFixed(2)) > 1
                      ? 1
                      : Number((grouptan[2].leijitanqiangdu / 10).toFixed(2))
                  )
                "
                :y2="
                  getY2(
                    Number((grouptan[2].leijitanqiangdu / 10).toFixed(2)) > 1
                      ? 1
                      : Number((grouptan[2].leijitanqiangdu / 10).toFixed(2))
                  )
                "
                stroke="RGBA(32, 159, 103, 1)"
                stroke-width="3"
                stroke-linecap="round"
              />
            </svg>
            <div class="des">
              <div class="des1">
                <div class="top">
                  <div class="point"></div>
                  <span class="title">日碳强度</span>
                </div>
                <span class="zhi">{{ grouptan[2].ritanqiangdu }}</span>
              </div>
              <div class="des2">
                <div class="top">
                  <div class="point"></div>
                  <span class="title">累计碳强度</span>
                </div>
                <span class="zhi">{{ grouptan[2].leijitanqiangdu }}</span>
              </div>
            </div>
          </div>
          <div class="groupdata">
            <div class="tip">日碳排量<span class="unit">（吨）</span></div>
            <div class="num">{{ grouptan[2].ritanpailiang }}</div>
          </div>
          <div class="groupdata">
            <div class="tip">累计碳排量<span class="unit">（吨）</span></div>
            <div class="num">{{ grouptan[2].leijitanpailiang }}</div>
          </div>
        </div>
        <div class="groupright">
          <div class="riqushi">
            <div id="chart-container-ri-bing"></div>
          </div>
          <div class="yuequshi">
            <div id="chart-container-yue-bing"></div>
          </div>
        </div>
      </div>
      <div class="ding">
        <div class="groupleft">
          <span class="title">丁班</span>
          <div class="echarts">
            <svg viewBox="0 0 100 50">
              <defs>
                <radialGradient
                  id="myRadial"
                  cx="50%"
                  cy="50%"
                  r="50%"
                  fx="50%"
                  fy="50%"
                >
                  <stop offset="0%" stop-color="#209F85" stop-opacity="1" />
                  <stop offset="100%" stop-color="#209F85" stop-opacity="0" />
                </radialGradient>
              </defs>
              <circle fill="url(#myRadial)" cx="50" cy="50" r="50"></circle>
              <circle cx="50" cy="50" r="30" fill="white"></circle>
              <path
                :d="
                  getHalfCirclePath(
                    Number((grouptan[3].ritanqiangdu / 10).toFixed(2)) > 1
                      ? 1
                      : Number((grouptan[3].ritanqiangdu / 10).toFixed(2))
                  )
                "
                fill="none"
                stroke="RGBA(32, 159, 133, 1)"
                stroke-width="8"
              ></path>
              <line
                x1="50"
                y1="50"
                :x2="
                  getX1(
                    Number((grouptan[3].ritanqiangdu / 10).toFixed(2)) > 1
                      ? 1
                      : Number((grouptan[3].ritanqiangdu / 10).toFixed(2))
                  )
                "
                :y2="
                  getY1(
                    Number((grouptan[3].ritanqiangdu / 10).toFixed(2)) > 1
                      ? 1
                      : Number((grouptan[3].ritanqiangdu / 10).toFixed(2))
                  )
                "
                stroke="RGBA(32, 159, 133, 1)"
                stroke-width="3"
                stroke-linecap="round"
              />
              <path
                :d="
                  getHalfCirclePathMin(
                    Number((grouptan[3].leijitanqiangdu / 10).toFixed(2)) > 1
                      ? 1
                      : Number((grouptan[3].leijitanqiangdu / 10).toFixed(2))
                  )
                "
                fill="none"
                stroke="RGBA(32, 159, 103, 1)"
                stroke-width="8"
              ></path>
              <line
                x1="50"
                y1="50"
                :x2="
                  getX2(
                    Number((grouptan[3].leijitanqiangdu / 10).toFixed(2)) > 1
                      ? 1
                      : Number((grouptan[3].leijitanqiangdu / 10).toFixed(2))
                  )
                "
                :y2="
                  getY2(
                    Number((grouptan[3].leijitanqiangdu / 10).toFixed(2)) > 1
                      ? 1
                      : Number((grouptan[3].leijitanqiangdu / 10).toFixed(2))
                  )
                "
                stroke="RGBA(32, 159, 103, 1)"
                stroke-width="3"
                stroke-linecap="round"
              />
            </svg>
            <div class="des">
              <div class="des1">
                <div class="top">
                  <div class="point"></div>
                  <span class="title">日碳强度</span>
                </div>
                <span class="zhi">{{ grouptan[3].ritanqiangdu }}</span>
              </div>
              <div class="des2">
                <div class="top">
                  <div class="point"></div>
                  <span class="title">累计碳强度</span>
                </div>
                <span class="zhi">{{ grouptan[3].leijitanqiangdu }}</span>
              </div>
            </div>
          </div>
          <div class="groupdata">
            <div class="tip">日碳排量<span class="unit">（吨）</span></div>
            <div class="num">{{ grouptan[3].ritanpailiang }}</div>
          </div>
          <div class="groupdata">
            <div class="tip">累计碳排量<span class="unit">（吨）</span></div>
            <div class="num">{{ grouptan[3].leijitanpailiang }}</div>
          </div>
        </div>
        <div class="groupright">
          <div class="riqushi">
            <div id="chart-container-ri-ding"></div>
          </div>
          <div class="yuequshi">
            <div id="chart-container-yue-ding"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./TKSM16.ts"></script>
<style lang="scss" scoped>
@import "./TKSM16.scss";
</style>
