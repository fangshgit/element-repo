import './index.scss'
import { defineComponent, ref, reactive } from "vue";
import http from "@/http";
import { ElButton, ElTable, ElTableColumn, ElSwitch,ElPopover } from "element-plus";
import { BuildPropType } from "element-plus/es/utils/props";
interface setup {
    tableData:any;
    handleEdit:any
    delPopoverIndex: boolean,
    handleDel:any
}

const master = defineComponent({
    name: 'master',
    props: {
        tableData: {
            type:Array,
            default:() => [{}]
        }
    },
    setup() {
        let form:any = {}
        let routeId:number|null = null
        let dialogVisible= ref(false)
        let delPopoverIndex=ref(false)
        const handleEdit = (data:any, isAdd:boolean) => {
            if (isAdd) {
				form.parentId = data.menuId
			} else {
				routeId = data.menuId
				form = { ...data }
				delete form.children
			}
			dialogVisible.value = true
        }
        const handleDel = (id:number) => {
            delPopoverIndex.value = false
			// this.$apiHooks({
			// 	api: postDelApplicationRoutes,
			// 	params: [id]
			// }).then(res => {
			// 	this.getData(this.$refs.pagination)
			// })
        }
        return {
            form,
            handleEdit,
            delPopoverIndex,
            handleDel
        }
    },
    methods: {
        handleEdit(data = {}, isAdd = false) {
			// if (isAdd) {
			// 	this.form.parentId = data.menuId
			// } else {
			// 	this.routeId = data.menuId
			// 	this.form = { ...data }
			// 	delete this.form.children
			// }
			// this.dialogVisible = true
		},
    },
    render(ctx: setup) {
        console.log(ctx.tableData, 66, this)
        return (
            <div class="pad-20 bg-white" id="applicationSetting">
                <div class="mar-b-20" style={[{textAlign: 'left'}]}>
                    <ElButton class="button-w-88" type="primary">新增</ElButton>
		        </div>
                <ElTable data={ctx.tableData} class="mar-b-20" row-key="menuId">
                <ElTableColumn label="菜单名称" min-width="216" prop="b"></ElTableColumn>
                    <ElTableColumn label="菜单名称" min-width="216" prop="menuName"></ElTableColumn>
                    <ElTableColumn label="排序" min-width="216" prop="orderNum"></ElTableColumn>
                    <ElTableColumn label="权限标识" min-width="216" prop="perms"></ElTableColumn>
                    <ElTableColumn label="组件路径" min-width="216" prop="component"></ElTableColumn>
                    <ElTableColumn label="状态" min-width="100">
                        {
                            {
                                default:({row}:any) => {
                                    return (<ElSwitch v-model={row} active-value="0" inactive-value="1" ></ElSwitch>)
                                }
                            }
                        }
                        
                    </ElTableColumn>
                    <ElTableColumn label="操作">
                        {
                            {
                                default:({row}:any) => {
                                    return <div>
                                        <ElButton type="text" onClick={ctx.handleEdit(row, false)}>编辑</ElButton>
                                        <ElButton type="text" onClick={ctx.handleEdit(row, true)}>新增</ElButton>
                                        <ElPopover width="172" trigger="click">
                                            
                                            {{
                                                default:() => {
                                                    return (
                                                    <div>
                                                <div class="popover-body flex align-center justify-center">
                                                    <img class="icon-warning" src="@/assets/icons/warning_icon.png" />
                                                    <p>是否删除</p>
                                                </div>
                                                <div class="popover-button">
                                                    <ElButton size="small" onClick={() => {ctx.delPopoverIndex = false}}>
                                                    取消
                                                    </ElButton>
                                                    <ElButton size="small" type="primary" onClick={ctx.handleDel(row.menuId)}>
                                                        确定
                                                    </ElButton>
                                                </div>
                                            </div>
                                                    )
                                                },
                                                reference:() => (<ElButton type="text" onClick={() => {ctx.delPopoverIndex = row.menuId}}>
                                                删除
                                             </ElButton>)
                                            }}
                                            
                                        </ElPopover>
                                        {/* <ElButton type="text" onClick={() => {ctx.delPopoverIndex = row.menuId}}>删除</ElButton> */}
                                    </div>
                                }
                            }
                        }
                        
                    </ElTableColumn>
                </ElTable>
            </div>
        );
    }
})
export default master