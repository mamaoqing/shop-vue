<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 部门管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <template>
                    <el-input v-model="query.name" placeholder="角色名称" style="width: 160px;"></el-input>
                </template>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-lx-add" @click="addOrg">新增</el-button>
            </div>
            <el-table
                    height="616"
                    :data="orgList"
                    border
                    class="table"
                    ref="multipleTable"
                    row-key="id"
                    header-cell-class-name="table-header"
                    :tree-props="{children: 'childList', hasChildren: 'hasChildren'}"
            >
                <el-table-column type="selection" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" v-if="false" align="center"></el-table-column>
                <el-table-column prop="name" label="部门名称" align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                <el-table-column label="操作" width="380" align="center">
                    <template slot-scope="scope">
                        <el-button
                                   type="warning"
                                   icon="el-icon-edit"
                                   @click.stop
                                   @click="editOrg(scope.$index, scope.row)"
                        >编辑
                        </el-button>
                        <el-button
                                   type="primary"
                                   icon="el-icon-lx-addressbook"
                                   class="green"
                                   @click.stop
                                   @click="addChildOrg(scope.row)"
                        >添加下级
                        </el-button>
                        <el-button
                                   type="danger"
                                   icon="el-icon-delete"
                                   class="red"
                                   @click.stop
                                   @click="deleteOrg(scope.row.id)"
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
                        <el-form-item label="部门名称" label-width="100px" prop="name"
                                      :rules="[{ required: true, message: '请输入部门名称', trigger: 'blur' },]">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
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
    import {listOrg, insertOrg, updateOrg, deleteOrg} from '../../../api/system/org'

    export default {
        name: "org",
        data() {
            return {
                orgList: [],
                isShow: false,
                title: '',
                query: {
                    pageNo: 1,
                    size: 20
                },
                form: {},
                pageTotal: 0,
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                listOrg(this.query).then(res => {
                    console.log(res);
                    this.orgList = res.data.records;
                    this.pageTotal = res.data.total;
                })
            },
            editOrg(index,row) {
                this.title = "编辑部门";
                this.isShow = !this.isShow;
                this.form = row;
            },
            addOrg() {
                this.isShow = !this.isShow;
                this.title="添加部门";
                this.form = {};
                this.form.parentIdList='0';
            },
            addChildOrg(row){
                this.form = {};
                this.form.parentId = row.id;
                this.title="添加下级部门";
                this.form.parentIdList = row.parentIdList+","+row.id;
                this.isShow = !this.isShow;
            },
            deleteOrg(id) {
                this.$confirm('确定要删除部门信息吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    deleteOrg(id).then(res=>{
                        if(res.code === 200){
                            this.$message.success('删除成功');
                            this.init();
                        }else{
                            this.$message.error('删除失败');
                            this.init();
                        }
                    })
                })
            },
            submit() {
                if (this.title === "编辑部门") {
                    this.$refs['form'].validate(valid => {
                        if (valid) {
                            updateOrg(this.form).then(res => {
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
                            insertOrg(this.form).then(res => {
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
            handleSearch() {
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

        }
    }
</script>

<style scoped>

</style>