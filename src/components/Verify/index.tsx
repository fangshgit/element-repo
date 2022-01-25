import { defineComponent, ref, reactive, computed, onMounted } from "vue";
import "./index.css";

import VerifySlide from "./VerifySlide";
const defaultImg = new URL("../../assets/default.jpg", import.meta.url).href;
// interface props {
//   mode: string;
//   captchaType: string;
//   imgSize: {
//     width: string;
//     height: string;
//   };
// blockSize: Object,
//   barSize: {
//     width: string;
//     height: string;
//   };
// }
interface that {
  defaultImg: any;
  clickShow: boolean;
}
const Verify = defineComponent({
  props: {
    mode: String,
    imgSize: Object,
    barSize: Object,
    onSuccess: Function,
  },
  created() {
    if (!localStorage.getItem("token")) {
      this.that.clickShow = true;
    }
  },
  setup(this: any, props) {
    let that: that = reactive({
      defaultImg,
      clickShow: false,
    });
    const instanceRef = ref(null) as any;
    const showBox = computed(() => {
      if (props.mode == "pop") {
        return that.clickShow;
      } else {
        return true;
      }
    });
    const uuid = () => {
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((Number(s[19]) & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "-";

      var slider = "slider" + "-" + s.join("");
      var point = "point" + "-" + s.join("");
      // 判断下是否存在 slider
      if (!localStorage.getItem("slider")) {
        localStorage.setItem("slider", slider);
      }
      if (!localStorage.getItem("point")) {
        localStorage.setItem("point", point);
      }
    };
    /**
     * refresh
     * @description 刷新
     * */
    const refresh = () => {
      if (instanceRef.value) {
        instanceRef.value.refresh();
      }
    };
    const closeBox = () => {
      that.clickShow = false;
      refresh();
    };
    const show = () => {
      if (props.mode == "pop") {
        that.clickShow = true;
      }
    };
    onMounted(() => {
      uuid();
    });
    return {
      that,
      instanceRef,
      showBox,
      show,
      closeBox,
      refresh,
    };
  },
  render(ctx: any) {
    return (
      <div
        class={ctx.mode == "pop" ? "mask" : ""}
        style={{ display: ctx.showBox ? "" : "none" }}
      >
        <div
          class={ctx.mode == "pop" ? "verifybox" : ""}
          style={{ "max-width": parseInt(ctx.imgSize.width) + 30 + "px" }}
        >
          {ctx.mode == "pop" ? (
            <div class="verifybox-top">
              请完成安全验证
              <span class="verifybox-close" onClick={ctx.closeBox}>
                <i class="iconfont icon-close"></i>
              </span>
            </div>
          ) : null}

          <div
            class="verifybox-bottom"
            style={{ padding: ctx.mode == "pop" ? "15px" : "0" }}
          >
            {/* 验证码容器 */}
            <VerifySlide
              captchaType="blockPuzzle"
              mode="pop"
              imgSize={ctx.imgSize}
              barSize={ctx.barSize}
              defaultImg={ctx.that.defaultImg}
              ref="instanceRef"
            ></VerifySlide>
          </div>
        </div>
      </div>
    );
  },
});

export default Verify;
