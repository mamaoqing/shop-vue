<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 角色管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <template >
                    <el-input v-model="query.name" placeholder="角色名称" style="width: 160px;"></el-input>
                </template>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-lx-add" @click="addRole">新增</el-button>
            </div>

            <el-table
                    height="616"
                    :data="roleList"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column type="selection" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" v-if="false" align="center"></el-table-column>
                <el-table-column prop="name" label="角色名" align="center"></el-table-column>
                <el-table-column prop="type" label="角色类型" align="center"></el-table-column>
                <el-table-column label="操作" width="380" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.id !== 1"
                                type="warning"
                                icon="el-icon-edit"
                                @click.stop
                                @click="handleEdit(scope.$index, scope.row)"
                        >编辑
                        </el-button>
                        <el-button v-if="scope.row.id !== 1"
                                type="primary"
                                icon="el-icon-lx-addressbook"
                                class="green"
                                @click.stop
                                @click="menuEdit(scope.row.id)"
                        >菜单权限
                        </el-button>
                        <el-button v-if="scope.row.id !== 1"
                                type="danger"
                                icon="el-icon-delete"
                                class="red"
                                @click.stop
                                @click="handleDelete(scope.row.id)"
                        >删除
                        </el-button>

                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handlePageChange"
                        :current-page="query.pageNo"
                        :page-sizes="[20, 30, 50, 150,500]"
                        :page-size="query.size"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="pageTotal">
                </el-pagination>
            </div>


        </div>
        <el-dialog :title="title" :visible.sync="isShow" width="60%" :destroy-on-close="true">
            <el-form ref="form" :model="form" label-width="70px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="角色名称" label-width="100px" prop="name"
                                      :rules="[{ required: true, message: '请输入角色名称', trigger: 'blur' },]">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item label="角色类型" label-width="100px" prop="type"
                                      :rules="[{ required: true, message: '请输入类型', trigger: 'blur' },]">
                        <dist-util @child1="checkIn" :distId="dist.usePropId" :distName="dist.usePropName"
                                   :title="dist.useProp"  :change="form.type"></dist-util>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShow = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :title="title" :visible.sync="menus" width="60%" :destroy-on-close="true">
            <el-tree
                    ref="tree"
                    :data="menuList"
                    show-checkbox
                    node-key="id"
                    :default-checked-keys="checkMenu"
                    :props="defaultProps"
                    @check="keys"
                    @check-change="checkChange"
            >
            </el-tree>

            <span slot="footer" class="dialog-footer">
                <el-button @click="menus = false">取 消</el-button>
                <el-button type="primary" @click="rolesub">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {
        addRole,
        deleteRole,
        updateRole,
        listRole,
        listMenus, listChangeMenu,setRoleMenu
    } from '../../../api/system/role';
    import distUtil  from "../../common/shigecomponents/dictutil";

    export default {
        components:{
            distUtil
        },
        name: "role",
        data() {

            return {
                roleId:0,
                defaultProps: {
                    children: 'chirldMenuList',
                    label: 'name'
                },
                checkMenu: [],// 该角色已经存在的权限
                menuList: [], // 权限菜单列表
                title: '',// 弹出框的标题
                menus: false, // 控制设置菜单的
                isShow: false, // 控制添加修改的
                roleList: [],// 角色列表
                query: {// 查询条件
                    pageNo: 1,
                    size: 20
                },
                pageTotal: 0,
                form: {},// 添加修改的提交表单信息
                menuIds:'',
                dist:{
                    useProp: '请选择角色类型',
                    usePropId: '1',
                    usePropName: 'role',
                }
            }
        },
        created() {
            this.init()
        },
        methods: {
            init() {
                listRole(this.query).then(res => {
                    this.roleList = res.data.records;
                    this.pageTotal = res.data.total;
                })
            },
            // 编辑菜单
            // 编辑操作
            handleEdit(index, row) {
                this.title = "修改角色";
                this.isShow = !this.isShow;
                this.form = row;
            },
            // 添加菜单
            addRole(row) {
                this.title = '添加角色'
                this.isShow = !this.isShow;
            },
            // 菜单权限
            menuEdit(id) {
                this.roleId = id;
                this.menus = !this.menus;
                this.title = "设置角色菜单";
                // 获取当前角色的所有菜单
                listMenus().then(res => {this.menuList = res.data;});
                // 查询点击角色已经存在的权限
                listChangeMenu(id).then(res => {this.checkMenu = res.data;})
            },
            // 选中的菜单树
            keys(obj, change) {
                var x = change.checkedKeys;
                var s = '';
                for(var i=0;i<x.length;i++){
                    s+=x[i]+",";
                }
                this.menuIds = s;
            },
            checkChange(a, b, c) {
                const anode = this.$refs.tree.getNode(a)
                !anode.checked ? this.findchildren(anode.parent) : ''
            },
            findchildren(current) {
                const fnode = this.$refs.tree.getNode(current)
                if (!fnode.isLeaf) {
                    fnode.indeterminate = true
                    fnode.checked = true
                }
            },
            rolesub(){
                setRoleMenu({roleId:this.roleId,menuId:this.menuIds}).then(res=>{
                    if(res.code === 200){
                        this.$message.success('设置成功');
                        this.init();
                    }
                    this.menus = !this.menus;
                });
            },
            // 删除操作
            handleDelete(id) {
                this.$confirm('删除后该菜单下的子菜单也会删除，确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    deleteRole(id).then(res=>{
                        if (res.code === 200 && res.data) {
                            this.$message.success('删除成功');
                            this.init();
                        }else{
                            this.$message.error('删除失败');
                        }
                    });
                });

            },
            // 搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageNo', 1);
                this.init();
            },
            // 修改每页显示数量
            handleSizeChange(val) {
                this.query.size = val;
                this.init();
            },
            // 点击下一页上一页按钮
            handlePageChange(val) {
                this.$set(this.query, 'pageNo', val);
                this.init();
            },

            // 提交表单信息
            submit() {
                if (this.title === "修改角色") {
                    this.$refs['form'].validate(valid => {
                        if (valid) {
                            updateRole(this.form).then(res => {
                                if (res.code === 200 && res.data) {
                                    this.$message.success('修改成功');
                                    this.init();
                                    this.isShow = !this.isShow;
                                }
                            });
                        }
                    });
                } else {
                    this.$refs['form'].validate(valid => {
                        if (valid) {
                            addRole(this.form).then(res => {
                                if (res.code === 200 && res.data) {
                                    this.$message.success('添加成功');
                                    this.init();
                                    this.isShow = !this.isShow;
                                }

                            });
                        }
                    });
                }
            },
            checkIn(value,name){
                this.form.type = value;
            },
        },
    }
</script>

<style scoped>

</style>