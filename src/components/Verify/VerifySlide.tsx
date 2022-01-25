/**
 * VerifyPoints
 * @description 点选
 * */
import { resetSize } from "../utils/util.js";
import { aesEncrypt } from "../utils/ase";
import {
  defineComponent,
  reactive,
  computed,
  onMounted,
  nextTick,
  getCurrentInstance,
} from "vue";
import http from "@/http";
const reqGet = (data: any) => {
  return http({
    url: "/auth/captcha/get",
    method: "post",
    data,
  });
};
const reqCheck = (data: any) => {
  return http({
    url: "/auth/captcha/check",
    method: "post",
    data,
  });
};
interface props {
  mode: string;
  captchaType: string;
  imgSize: {
    width: string;
    height: string;
  };
  barSize: {
    width: string;
    height: string;
  };
  defaultImg: string;
}
interface that {
  secretKey: string;
  passFlag: string | boolean;
  backImgBase: string | null;
  blockBackImgBase: string | null;
  startMoveTime: string | number;
  endMovetime: string | number;
  tipsBackColor: string;
  tipWords: string;
  finishText: string;
  top: number;
  left: number;
  moveBlockLeft: undefined | string;
  leftBarWidth: undefined | string;
  moveBlockBackgroundColor: undefined | string;
  leftBarBorderColor: string;
  iconColor: undefined | string;
  iconClass: string;
  status: boolean;
  isEnd: boolean;
  showRefresh: boolean;
  transitionLeft: string;
  transitionWidth: string;
  setSize: {
    imgHeight: string;
    imgWidth: string;
    barHeight: string;
    barWidth: string;
  };
  backToken: string;
  text: string;
  startLeft: number;
}

const VerifySlide = defineComponent({
  props: {
    mode: String,
    captchaType: String,
    imgSize: Object,
    barSize: Object,
    defaultImg: String,
  },
  setup(this: any, props) {
    const { ctx } = getCurrentInstance() as any;

    let that: that = reactive({
      secretKey: "", //后端返回的ase加密秘钥
      passFlag: "", //是否通过的标识
      backImgBase: "", //验证码背景图片
      blockBackImgBase: "", //验证滑块的背景图片
      backToken: "", //后端返回的唯一token值
      startMoveTime: "", //移动开始的时间
      endMovetime: "", //移动结束的时间
      tipsBackColor: "", //提示词的背景颜色
      tipWords: "",
      text: "向右滑动完成验证",
      finishText: "",
      setSize: {
        imgHeight: "0",
        imgWidth: "0",
        barHeight: "0",
        barWidth: " 0",
      },
      top: 0,
      left: 0,
      moveBlockLeft: undefined,
      leftBarWidth: undefined,
      // 移动中样式
      moveBlockBackgroundColor: undefined,
      leftBarBorderColor: "#ddd",
      iconColor: undefined,
      iconClass: "icon-right",
      status: false, //鼠标状态
      isEnd: false, //是够验证完成
      showRefresh: true,
      transitionLeft: "",
      transitionWidth: "",
      startLeft: 0,
    });
    const barArea = computed(() => {
      return ctx.$el.querySelector(".verify-bar-area");
    });
    onMounted(() => {
      ctx.$el.onselectstart = function () {
        return false;
      };
      init();
    });
    const init = () => {
      getPictrue();
      nextTick(() => {
        let setSize = resetSize(ctx, { ...that, ...props }); //重新设置宽度高度
        that.setSize = setSize;
        ctx.$parent.$emit("ready", ctx);
      });
      window.removeEventListener("touchmove", function (e) {
        move(e);
      });
      window.removeEventListener("mousemove", function (e) {
        move(e);
      });

      //鼠标松开
      window.removeEventListener("touchend", function () {
        end();
      });
      window.removeEventListener("mouseup", function () {
        end();
      });

      window.addEventListener("touchmove", function (e) {
        move(e);
      });
      window.addEventListener("mousemove", function (e) {
        move(e);
      });

      //鼠标松开
      window.addEventListener("touchend", function () {
        end();
      });
      window.addEventListener("mouseup", function () {
        end();
      });
    };
    //鼠标按下
    const start = function (e: any) {
      e = e || window.event;
      if (!e.touches) {
        //兼容PC端
        var x = e.clientX;
      } else {
        //兼容移动端
        var x = e.touches[0].pageX;
      }
      that.startLeft = Math.floor(
        x - barArea.value.getBoundingClientRect().left
      );
      that.startMoveTime = +new Date(); //开始滑动的时间
      if (that.isEnd == false) {
        that.text = "";
        that.moveBlockBackgroundColor = "#337ab7";
        that.leftBarBorderColor = "#337AB7";
        that.iconColor = "#fff";
        e.stopPropagation();
        that.status = true;
      }
    };
    //鼠标移动
    const move = function (e: any) {
      e = e || window.event;
      if (that.status && that.isEnd == false) {
        if (!e.touches) {
          //兼容PC端
          var x = e.clientX;
        } else {
          //兼容移动端
          var x = e.touches[0].pageX;
        }
        var bar_area_left = barArea.value.getBoundingClientRect().left;
        var move_block_left = x - bar_area_left; //小方块相对于父元素的left值
        if (move_block_left >= barArea.value.offsetWidth - 23) {
          move_block_left = barArea.value.offsetWidth - 23;
        }
        if (move_block_left <= 0) {
          move_block_left = 25;
        }
        //拖动后小方块的left值
        that.moveBlockLeft = move_block_left - that.startLeft + "px";
        that.leftBarWidth = move_block_left - that.startLeft + "px";
      }
    };
    //鼠标松开
    const end = () => {
      that.endMovetime = +new Date();
      //判断是否重合
      if (that.status && that.isEnd == false) {
        var moveLeftDistance = parseInt(
          (that.moveBlockLeft || "").replace("px", "")
        );
        moveLeftDistance =
          (moveLeftDistance * 310) / parseInt(that.setSize.imgWidth);
        let data = {
          captchaType: props.captchaType,
          pointJson: that.secretKey
            ? aesEncrypt(
                JSON.stringify({ x: moveLeftDistance, y: 5.0 }),
                that.secretKey
              )
            : JSON.stringify({ x: moveLeftDistance, y: 5.0 }),
          token: that.backToken,
        };
        reqCheck(data).then((res) => {
          if (res.repCode == "0000") {
            that.moveBlockBackgroundColor = "#5cb85c";
            that.leftBarBorderColor = "#5cb85c";
            that.iconColor = "#fff";
            that.iconClass = "icon-check";
            that.showRefresh = false;
            that.isEnd = true;
            that.passFlag = true;
            that.tipWords = `${(
              (Number(that.endMovetime) - Number(that.startMoveTime)) /
              1000
            ).toFixed(2)}s验证成功`;
            var captchaVerification = that.secretKey
              ? aesEncrypt(
                  that.backToken +
                    "---" +
                    JSON.stringify({ x: moveLeftDistance, y: 5.0 }),
                  that.secretKey
                )
              : that.backToken +
                "---" +
                JSON.stringify({ x: moveLeftDistance, y: 5.0 });
            setTimeout(() => {
              that.tipWords = "";
              ctx.$parent.closeBox();
              ctx.$parent.$emit("success", { captchaVerification });
            }, 1000);
          } else {
            that.moveBlockBackgroundColor = "#d9534f";
            that.leftBarBorderColor = "#d9534f";
            that.iconColor = "#fff";
            that.iconClass = "icon-close";
            that.passFlag = false;
            setTimeout(function () {
              refresh();
            }, 1000);
            ctx.$parent.$emit("error", ctx);
            that.tipWords = "验证失败";
            setTimeout(() => {
              that.tipWords = "";
            }, 1000);
          }
        });
        that.status = false;
      }
    };
    const refresh = function () {
      that.showRefresh = true;
      that.finishText = "";

      that.transitionLeft = "left .3s";
      that.moveBlockLeft = "0";

      that.leftBarWidth = undefined;
      that.transitionWidth = "width .3s";

      that.leftBarBorderColor = "#ddd";
      that.moveBlockBackgroundColor = "#fff";
      that.iconColor = "#000";
      that.iconClass = "icon-right";
      that.isEnd = false;

      getPictrue();
      setTimeout(() => {
        that.transitionWidth = "";
        that.transitionLeft = "";
      }, 300);
    };

    // 请求背景图片和验证图片
    const getPictrue = () => {
      let data = {
        captchaType: props.captchaType,
        clientUid: localStorage.getItem("slider"),
        ts: Date.now(), // 现在的时间戳
      };
      reqGet(data).then((res: any) => {
        if (res.repCode == "0000") {
          that.backImgBase = res.repData.originalImageBase64;
          that.blockBackImgBase = res.repData.jigsawImageBase64;
          that.backToken = res.repData.token;
          that.secretKey = res.repData.secretKey;
        } else {
          that.tipWords = res.repMsg;
        }

        // 判断接口请求次数是否失效
        if (res.repCode == "6201") {
          that.backImgBase = null;
          that.blockBackImgBase = null;
        }
      });
    };
    return {
      that,
      start,
      vSpace: 5,
      refresh,
    };
  },
  render(ctx: any) {
    let { that } = ctx;
    return (
      <div style="position: relative">
        <div
          class="verify-img-out"
          style={{
            height: parseInt(that.setSize.imgHeight) + ctx.vSpace + "px",
          }}
        >
          <div
            class="verify-img-panel"
            style={{
              width: that.setSize.imgWidth,
              height: that.setSize.imgHeight,
            }}
          >
            <img
              src={
                that.backImgBase
                  ? "data:image/png;base64," + that.backImgBase
                  : ctx.defaultImg
              }
              style="display: block; width: 100%; height: 100%"
            />
            <div
              class="verify-refresh"
              onClick={ctx.refresh}
              style={{ display: ctx.showRefresh ? "" : "none" }}
            >
              <i class="iconfont icon-refresh"></i>
            </div>
            {/* <transition name="tips">
                <span
                  class="verify-tips"
                  v-if="tipWords"
                  :class="passFlag ? 'suc-bg' : 'err-bg'"
                >
                  {{ ctx.tipWords }}
                </span>
              </transition> */}
            {that.tipWords ? (
              <span
                class={[that.passFlag ? "suc-bg" : "err-bg", "verify-tips"]}
              >
                {that.tipWords}
              </span>
            ) : null}
          </div>
        </div>
        <div
          class="verify-bar-area"
          style={{
            width: that.setSize.imgWidth,
            height: ctx.barSize.height,
            "line-height": ctx.barSize.height,
          }}
        >
          <span class="verify-msg">{that.text}</span>
          <div
            class="verify-left-bar"
            style={{
              width:
                ctx.leftBarWidth !== undefined
                  ? ctx.leftBarWidth
                  : ctx.barSize.height,
              height: ctx.barSize.height,
              "border-color": ctx.leftBarBorderColor,
              transition: ctx.transitionWidth,
            }}
          >
            <span class="verify-msg" v-text={that.finishText}></span>
            <div
              class="verify-move-block"
              onTouchstart={ctx.start}
              onMousedown={ctx.start}
              style={{
                width: ctx.barSize.height,
                height: ctx.barSize.height,
                "background-color": that.moveBlockBackgroundColor,
                left: that.moveBlockLeft,
                transition: that.transitionLeft,
              }}
            >
              <i
                class={["verify-icon iconfont", that.iconClass]}
                style={{ color: that.iconColor }}
              ></i>
              <div
                class="verify-sub-block"
                style={{
                  width:
                    Math.floor((parseInt(that.setSize.imgWidth) * 47) / 310) +
                    "px",
                  height: that.setSize.imgHeight,
                  top:
                    "-" +
                    (parseInt(that.setSize.imgHeight) + ctx.vSpace) +
                    "px",
                  "background-size":
                    that.setSize.imgWidth + " " + that.setSize.imgHeight,
                }}
              >
                <img
                  src={"data:image/png;base64," + that.blockBackImgBase}
                  style="display: block; width: 100%; height: 100%"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
export default VerifySlide;
