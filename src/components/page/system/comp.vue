<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 公司管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <template>
                    <el-input v-model="query.name" placeholder="公司名称" style="width: 160px;"></el-input>
                </template>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-lx-add" @click="addComp">新增</el-button>
            </div>
            <el-table :data="compList" border class="table" ref="multipleTable" header-cell-class-name="table-header" height="616">
                <el-table-column type="selection" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" v-if="false" align="center"></el-table-column>
                <el-table-column prop="compName" label="公司名称" align="center"></el-table-column>
                <el-table-column prop="province" label="省" align="center"></el-table-column>
                <el-table-column prop="city" label="市" align="center"></el-table-column>
                <el-table-column prop="district" label="区/县" align="center"></el-table-column>
                <el-table-column prop="compAdd" label="地址" align="center"></el-table-column>
                <el-table-column label="操作" width="380" align="center">
                    <template slot-scope="scope">
                        <el-button type="warning" icon="el-icon-edit" @click.stop
                                   @click="editComp(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button  type="danger" icon="el-icon-delete" class="red" @click.stop
                                   @click="deleteComp(scope.row.id)">删除
                        </el-button>
                        <el-button  type="primary" icon="el-icon-lx-addressbook" class="red" @click.stop
                                   @click="addAdminUser(scope.row.id)">添加管理员用户
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
                        <el-form-item label="公司名称" label-width="100px" prop="compName"
                                      :rules="[{ required: true, message: '请输入公司名称', trigger: 'blur' },]">
                            <el-input v-model="form.compName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col>
                        <el-form-item label="公司地址" label-width="100px" prop="compAdd"
                                      :rules="[{ required: true, message: '请输入公司地址', trigger: 'blur' },]">
                            <el-input v-model="form.compAdd"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShow = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :title="title" :visible.sync="addUser" width="60%" :destroy-on-close="true">
            <el-form ref="userForm" :model="users" label-width="70px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="用户名" label-width="100px" prop="userName"
                                      :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' },]">
                            <el-input v-model="users.userName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="密码" label-width="100px" prop="password"
                                      :rules="[{ required: true, message: '请输入密码', trigger: 'blur' },]">
                            <el-input v-model="users.password"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="重复密码" label-width="100px" prop="repassword"
                                      :rules="[{ required: true, message: '请输入重复密码', trigger: 'blur' },]">
                            <el-input v-model="users.repassword"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShow = false">取 消</el-button>
                <el-button type="primary" @click="addUsers">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {listComp, addComp, updateComp, deleteComp,addAdminUser} from '../../../api/system/comp'

    export default {
        name: "comp",
        data() {
            return {
                query: {
                    pageNo: 1,
                    size: 20
                },
                form: {},
                dist: {},
                isShow: false,
                compList: [],
                title: '',
                pageTotal: 0,
                addUser:false,
                users:{}
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                listComp(this.query).then(res => {
                    console.log(res);
                    this.compList = res.data.records;
                    this.pageTotal = res.data.total;
                })
            },
            addComp() {
                this.title = "添加公司";
                this.form = {};
                this.isShow = !this.isShow
            },
            editComp(index, row) {
                this.form = row;
                this.title = "编辑公司";
                this.isShow = !this.isShow;
            },
            deleteComp(id) {
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    deleteComp(id).then(res=>{
                        if(res.code === 200){
                            this.$message.success('删除成功');
                            this.init();
                        }else{

                            this.$message.error('删除失败');
                        }
                    })
                });
            },
            addAdminUser(id){
                this.addUser = !this.addUser;
                this.users.compId = id;
                this.title = "添加用户";
            },
            submit() {
                if (this.title === "编辑公司") {
                    this.$refs['form'].validate(valid => {
                        if (valid) {
                            updateComp(this.form).then(res => {
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
                            addComp(this.form).then(res => {
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
            addUsers(){
                this.$refs['userForm'].validate(valid => {
                    if (valid) {
                        addAdminUser(this.users).then(res => {
                            if (res.code === 200 && res.data) {
                                this.$message.success('添加成功');
                                this.init();
                                this.isShow = !this.isShow;
                            }

                        });
                    }
                });
            },
        }
    }
</script>

<style scoped>

</style>