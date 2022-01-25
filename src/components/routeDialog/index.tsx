import {
  defineComponent,
  PropType,
  reactive,
  watch,
  getCurrentInstance,
  ref,
} from "vue";
import {
  ElDialog,
  ElForm,
  ElFormItem,
  ElCascader,
  ElRadioGroup,
  ElRadio,
  ElInput,
  ElInputNumber,
} from "element-plus";
import { BuildPropType } from "element-plus/es/utils/props";
import { NULL } from "sass";

interface formData {
  parentId: Array<number> | null;
  icon: string;
  menuName: string;
  orderNum: number;
  componentName: string;
  component: string;
  path: string;
  perms: string;
  visible: string;
  status: string;
  menuType: string;
  remark: string;
  isDefault: string;
}

interface setup {
  formData: formData;
  resetForm: () => any;
  modelValue: BuildPropType<BooleanConstructor, unknown, unknown>;
  rules: {
    [propName: string]: {
      required: boolean;
      trigger?: string;
      message?: string;
    };
  };
  tableData: Array<any>;
  handleSumbit: void;
}
const routeDialog = defineComponent({
  props: {
    modelValue: Boolean,
    tableData: Array,
    formData: {
      type: Object as PropType<formData>,
      default: () => {},
    },
  },
  setup(props) {
    const { ctx } = getCurrentInstance() as any;
    const formRef = ref(null) as any;
    let formData: formData = reactive({
      parentId: null,
      icon: "",
      menuName: "",
      orderNum: 1,
      componentName: "",
      component: "",
      path: "",
      perms: "",
      visible: "0",
      status: "0",
      menuType: "M",
      remark: "",
      isDefault: "N",
    });
    const rules = {
      menuName: [
        {
          required: true,
          trigger: "blur",
          message: "请输入菜单名称",
        },
      ],
      orderNum: [
        {
          required: true,
        },
      ],
      path: [
        {
          required: true,
          trigger: "blur",
          message: "请输入路由地址",
        },
      ],
      component: [
        {
          required: true,
          trigger: "blur",
          message: "请输入组件地址",
        },
      ],
      componentName: [
        {
          required: true,
          trigger: "blur",
          message: "请输入路由名称",
        },
      ],
      perms: [
        {
          required: true,
          trigger: "blur",
          message: "请输入权限标识",
        },
      ],
    };
    const resetForm = () => {
      formData = {
        parentId: null,
        icon: "",
        menuName: "",
        orderNum: 1,
        componentName: "",
        component: "",
        path: "",
        perms: "",
        visible: "0",
        status: "0",
        menuType: "M",
        remark: "",
        isDefault: "N",
      };
      ctx.$emit("update:modelValue", false);
    };
    const handleSumbit = () => {
      formRef.value.validate((valid: boolean) => {
        if (valid) {
          let params = { ...formData } as any;
          if (params.parentId && params.parentId.length) {
            params.parentId = params.parentId[params.parentId.length - 1];
          } else {
            params.parentId = 0;
          }
          ctx.$emit("sumbit", params);
          resetForm();
        }
      });
    };
    watch(
      () => props.modelValue,
      () => {
        formData = props.formData;
      }
    );
    return {
      formRef,
      formData,
      resetForm,
      handleSumbit,
    };
  },
  render(ctx: setup) {
    let { formData } = ctx;
    return (
      <ElDialog
        modelValue={ctx.modelValue}
        title="新增/编辑"
        width="587px"
        onClose={ctx.resetForm}
      >
        <ElForm
          ref="formRef"
          model={formData}
          rules={ctx.rules}
          label-width="140px"
        >
          <ElFormItem label="application.上级菜单">
            <ElCascader
              style="width: 360px;"
              v-model={formData.parentId}
              placeholder="请选择上级菜单"
              options={ctx.tableData}
              props={{
                checkStrictly: true,
                value: "menuId",
                label: "menuName",
              }}
              clearable
            ></ElCascader>
          </ElFormItem>
          <ElFormItem label="菜单类型">
            <ElRadioGroup v-model={formData.menuType}>
              <ElRadio label="M">目录</ElRadio>
              <ElRadio label="C">菜单</ElRadio>
              <ElRadio label="F">按钮</ElRadio>
            </ElRadioGroup>
          </ElFormItem>
          <ElFormItem label="菜单图标">
            <ElInput
              v-model={formData.icon}
              style="width: 360px;"
              placeholder="请输入菜单图标"
            ></ElInput>
          </ElFormItem>
          <ElFormItem label="菜单名称" prop="menuName">
            <ElInput
              v-model={formData.menuName}
              style="width: 360px;"
              placeholder="请输入菜单名称"
            ></ElInput>
          </ElFormItem>
          <ElFormItem label="显示排序" prop="orderNum">
            <ElInputNumber
              v-model={formData.orderNum}
              style="width: 360px;"
              controls-position="right"
            ></ElInputNumber>
          </ElFormItem>
          <ElFormItem label="路由名称" prop="componentName">
            <ElInput
              v-model={formData.componentName}
              style="width: 360px;"
              placeholder="请输入路由名称"
            ></ElInput>
          </ElFormItem>
          <ElFormItem label="路由地址" prop="path">
            <ElInput
              v-model={formData.path}
              style="width: 360px;"
              placeholder="请输入路由地址"
            ></ElInput>
          </ElFormItem>
          <ElFormItem label="组件地址" prop="component">
            <ElInput
              v-model={formData.component}
              style="width: 360px;"
              placeholder="请输入组件地址"
            ></ElInput>
          </ElFormItem>
          <ElFormItem label="菜单显示状态">
            <ElRadioGroup v-model={formData.visible}>
              <ElRadio label="0">显示</ElRadio>
              <ElRadio label="1">隐藏</ElRadio>
            </ElRadioGroup>
          </ElFormItem>
          <ElFormItem label="菜单状态">
            <ElRadioGroup v-model={formData.status}>
              <ElRadio label="0">正常</ElRadio>
              <ElRadio label="1">停用</ElRadio>
            </ElRadioGroup>
          </ElFormItem>
          <ElFormItem label="是否内置">
            <ElRadioGroup v-model={formData.isDefault}>
              <ElRadio label="Y">是</ElRadio>
              <ElRadio label="N">否</ElRadio>
            </ElRadioGroup>
          </ElFormItem>
        </ElForm>
        {{
          footer: () => {
            return (
              <div class="dialog-button">
                <el-button onClick={ctx.resetForm}>取消</el-button>
                <el-button type="primary" onClick={ctx.handleSumbit}>
                  确定
                </el-button>
              </div>
            );
          },
        }}
      </ElDialog>
    );
  },
});

export default routeDialog;
