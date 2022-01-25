import { defineComponent, ref, reactive, watch } from "vue";
import Verify from "@/components/Verify";
import "./index.scss";
import { ElSelect, ElOption } from "element-plus";
import http from "@/http";
interface routeItem {
  id: number;
  label: string;
  children: Array<routeItem>;
  pid: number | null;
}
interface that {
  routeType: number;
  routesList: Array<routeItem>;
}
interface selectItem {
  value: number;
  label: string;
  path: string;
  getRoutePath: string;
  setRoutePath: string;
  delRoutePath: string;
}
interface setup {
  that: that;
  selectList: Array<selectItem>;
  verifyRef: any;
  capctchaCheckSuccess: Function;
}
const postLogin = (url: string, data: any) => {
  return http({
    url,
    method: "post",
    data,
  });
};
const getRoutesList = (url: string) => {
  return http({
    url,
  });
};

const Home = defineComponent({
  created() {
    if (localStorage.getItem("userType")) {
      this.that.routeType = Number(localStorage.getItem("userType"));
      if (localStorage.getItem("token")) {
        this.getRoute();
      }
    } else {
      localStorage.removeItem("token");
    }
  },
  setup(this: any, props) {
    let that: that = reactive({
      routeType: 0,
      routesList: [],
    });
    const verifyRef = ref(null) as any;
    const selectList: Array<selectItem> = [
      {
        value: 0,
        label: "平台路由",
        path: "/auth/system/login",
        getRoutePath: "system/menu/getRouters",
        setRoutePath: "system/menu",
        delRoutePath: "system/menu/treeselect",
      },
      {
        value: 1,
        label: "总控路由",
        path: "/auth/admin/login",
        getRoutePath: "admin/menu/getRouters",
        setRoutePath: "admin/menu",
        delRoutePath: "system/menu/treeselect",
      },
      {
        value: 2,
        label: "商家路由",
        path: "/auth/admin/login",
        getRoutePath: "merchantstore/menu/list/menu/router",
        setRoutePath: "merchantstore/menu/treeselect",
        delRoutePath: "system/menu/treeselect",
      },
    ];
    const login = () => {
      verifyRef.value?.show();
    };
    const capctchaCheckSuccess = (params: { captchaVerification: string }) => {
      verifyRef.value.closeBox();
      let data = {
        username: "admin",
        model: "pwd",
        code: params.captchaVerification,
        password: "123456",
      };
      postLogin(selectList[that.routeType].path, data).then((res) => {
        if (res.code === 200) {
          localStorage.setItem("token", res.data.access_token);
          localStorage.setItem("userType", `${that.routeType}`);
        }
      });
    };
    const getRoute = () => {
      getRoutesList(selectList[that.routeType].getRoutePath).then((res) => {
        if (res.code === 200) {
          that.routesList = res.data;
        }
      });
    };
    watch(
      () => that.routeType,
      () => {
        login();
      }
    );
    return {
      that,
      verifyRef,
      selectList,
      login,
      capctchaCheckSuccess,
      getRoute,
    };
  },
  render(ctx: setup) {
    let { that } = ctx;
    return (
      <div>
        <div class="title">
          <ElSelect v-model={that.routeType} size="large">
            {ctx.selectList.map((item: selectItem) => {
              return (
                <ElOption
                  key={item.value}
                  label={item.label}
                  value={item.value}
                ></ElOption>
              );
            })}
          </ElSelect>
          <p>{ctx.selectList[that.routeType].label}</p>
        </div>
        <Verify
          ref="verifyRef"
          mode="pop"
          imgSize={{ width: "330px", height: "155px" }}
          barSize={{
            width: "310px",
            height: "40px",
          }}
          onSuccess={ctx.capctchaCheckSuccess}
        ></Verify>
      </div>
    );
  },
});

export default Home;
