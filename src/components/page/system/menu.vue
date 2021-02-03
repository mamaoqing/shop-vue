<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 菜单管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-lx-add" @click="addParentMenu">新增</el-button>
            </div>

            <el-table
                    height="656"
                    :data="menuList"
                    style="width: 100%;margin-bottom: 20px;"
                    row-key="id"
                    border
                    :tree-props="{children: 'chirldMenuList', hasChildren: 'hasChildren'}">
                <el-table-column
                        prop="name"
                        label="菜单名"
                        sortable
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="url"
                        label="菜单连接"
                        sortable
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="icon"
                        label="图标">
                </el-table-column>
                <el-table-column label="操作" width="340" align="center">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                type="warning"
                                icon="el-icon-edit"
                                @click.stop
                                @click="editMenu(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button v-if="!scope.row.parentId"
                                   size="mini"
                                   type="primary"
                                   icon="el-icon-lx-addressbook"
                                   @click.stop
                                   @click="addMenu(scope.row)">添加下级
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                icon="el-icon-delete"
                                @click="deleteMenu(scope.row.id)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog :title="title" :visible.sync="isShow" width="60%" :destroy-on-close="true">
            <el-form ref="updateForm" :model="form" label-width="70px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="菜单名称" label-width="100px" prop="name"
                                      :rules="[{ required: true, message: '请输入菜单名称', trigger: 'blur' },]">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="菜单连接" label-width="100px">
                            <el-input v-model="form.url"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="菜单图标" label-width="100px">
                            <el-input v-model="form.icon"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="类型" label-width="100px">
                            <el-input v-model="form.type"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="排序" label-width="100px">
                            <el-input v-model="form.orderNo" type="number"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">

                    </el-col>
                </el-row>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="isShow = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>
    </div>

</template>

<script>
    import {addMenu, updateMenu, getMenuList, deleteMenu} from '../../../api/system/menu'

    export default {
        name: "menu.vue",
        data() {
            return {
                title: '', // 弹出层的标题
                isShow: false, // 添加修改的弹出层
                menuList: [], // 数据集合
                query: { // 查询的对象
                    pageNo: 1,
                    size: 20,
                },
                form: {}, // form表单对象
                pageTotal: 0, // 页面大小
            }
        },
        created() {
            this.init();
        },
        methods: {
            // 初始化加载
            init() {
                getMenuList(this.query).then(res => {
                    this.menuList = res.data;
                    this.pageTotal = res.data.total;
                });
            },
            // 搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageNo', 1);
                this.init();
            },
            // 新增菜单
            addParentMenu() {
                this.isShow = !this.isShow;
                this.title = "添加菜单";
                this.form = {};
            },
            // 店家下一页上一页按钮
            handlePageChange(val) {
                this.$set(this.query, 'pageNo', val);
                this.init();
            },
            // 修改每页显示数量
            handleSizeChange(val) {
                this.query.size = val;
                this.init();
            },
            // 编辑菜单
            editMenu(index, row) {
                this.title = '编辑菜单'
                this.form = row;
                this.isShow = !this.isShow;
            },
            // 添加菜单
            addMenu(row) {
                this.form = {};
                this.form.parentId = row.id;
                if (row.parentIdList) {
                    this.form.parentIdList = row.parentIdList + "," + row.id;
                } else {
                    this.form.parentIdList = row.id + ',';
                }

                this.title = '添加菜单'
                this.isShow = !this.isShow;
            },
            // 删除菜单
            deleteMenu(id) {
                this.$confirm('删除后该菜单下的子菜单也会删除，确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    deleteMenu(id).then(res => {
                        if (res.code === 200 && res.data) {
                            this.$message.success('删除成功');
                            this.init();
                        }
                    });
                });
            },
            // 提交表单信息
            submit() {
                if (this.title === "编辑菜单") {
                    this.$refs['updateForm'].validate(valid => {
                        if (valid) {
                            updateMenu(this.form).then(res => {
                                if (res.code === 200 && res.data) {
                                    this.$message.success('修改成功');
                                    this.init();
                                    this.isShow = !this.isShow;
                                }
                            });
                        }
                    });
                } else {
                    this.$refs['updateForm'].validate(valid => {
                        if (valid) {
                            addMenu(this.form).then(res => {
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
        }

    }
</script>

<style scoped>

</style>