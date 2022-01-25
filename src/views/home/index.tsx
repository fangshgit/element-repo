import { defineComponent, ref, reactive } from "vue";
import { ElButton, ElPopover } from "element-plus";
const master = defineComponent({
  name: "master",
  props: {},
  setup() {
    return {};
  },
  render(ctx: any) {
    return (
      <ElPopover width="172" trigger="click" placement="top">
        {{
          default: () => {
            return (
              <div>
                <div class="popover-body flex align-center justify-center">
                  <img
                    class="icon-warning"
                    src="@/assets/icons/warning_icon.png"
                  />
                  <p>是否删除</p>
                </div>
                <div class="popover-button">
                  <ElButton size="small">取消</ElButton>
                  <ElButton size="small" type="primary">
                    确定
                  </ElButton>
                </div>
              </div>
            );
          },
          reference: () => <ElButton type="text">删除</ElButton>,
        }}
      </ElPopover>
    );
  },
});
export default master;
