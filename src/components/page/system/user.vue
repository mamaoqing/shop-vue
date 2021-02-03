<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 用户管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <template>
                    <el-input v-model="query.name" placeholder="角色名称" style="width: 160px;"></el-input>
                </template>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-lx-add" @click="addUser">新增</el-button>
            </div>

            <el-table
                    height="616"
                    :data="userList"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column type="selection" width="55" align="center" v-if="false"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" v-if="false" align="center"></el-table-column>
                <el-table-column prop="name" label="角色名" align="center"></el-table-column>
                <el-table-column prop="userName" label="登录名" align="center"></el-table-column>
                <el-table-column prop="tel" label="电话" align="center"></el-table-column>
                <el-table-column prop="orgName" label="部门" align="center"></el-table-column>
                <el-table-column prop="type" label="角色类型" align="center"></el-table-column>
                <el-table-column label="操作" width="380" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.id !== 1"
                                   type="warning"
                                   icon="el-icon-edit"
                                   @click.stop
                                   @click="editUser(scope.$index, scope.row)"
                        >编辑
                        </el-button>
                        <el-button v-if="scope.row.id !== 1"
                                   type="primary"
                                   icon="el-icon-lx-addressbook"
                                   class="green"
                                   @click.stop
                                   @click="setROleUser(scope.$index,scope.row)"
                        >角色
                        </el-button>
                        <el-button v-if="scope.row.id !== 1"
                                   type="danger"
                                   icon="el-icon-delete"
                                   class="red"
                                   @click.stop
                                   @click="deleteUser(scope.row.id)"
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
                        <el-form-item v-if="title !== '编辑用户'" label="部门" label-width="100px" prop="orgId"
                                      :rules="[{ required: true, message: '请选择部门名称', trigger: 'blur' },]">
                            <el-cascader
                                    :model="form.orgId"
                                    :options="orgop"
                                    :props="{ emitPath:false,children:'childList',label: 'name',value:'id',checkStrictly:true }"
                                    :clearable="true"
                                    :show-all-levels="false"
                                    @change="changeProvinceCity1"
                            ></el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="用户姓名" label-width="100px" prop="name"
                                      :rules="[{ required: true, message: '请输入用户姓名', trigger: 'blur' },]">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="登录名" label-width="100px" prop="userName"
                                      :rules="[{ required: true, message: '请输入登录名', trigger: 'blur' },]">
                            <el-input v-model="form.userName"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item v-if="title !== '编辑用户'" label="密码" label-width="100px" prop="password"
                                      :rules="pasdrole">
                            <el-input v-model="form.password" show-password></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item v-if="title !== '编辑用户'" label="确认密码" label-width="100px" prop="password_confirm"
                                      :rules="pasdrole">
                            <el-input v-model="repassword" show-password></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="电话" label-width="100px">
                            <el-input v-model="form.tel"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item label="角色类型" label-width="100px" prop="type"
                                  :rules="[{ required: true, message: '请输入类型', trigger: 'blur' },]">
                        <dist-util @child1="checkIn" :distId="dist.usePropId" :distName="dist.usePropName"
                                   :title="dist.useProp" :change="form.type"></dist-util>
                    </el-form-item>
                </el-row>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="isShow = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog :title="title" :visible.sync="setRole" width="60%" :destroy-on-close="true">
            <el-form ref="form" :model="form" label-width="70px" >
                <template>
                    <el-checkbox-group
                            v-model="roleChecked"
                            @change="checked=>checkRow(checked)"
                    >
                        <el-checkbox v-for="comm in roleChecks" :label="comm.id" :key="comm.id">{{comm.name}}</el-checkbox>
                    </el-checkbox-group>
                </template>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRole = false">取 消</el-button>
                <el-button type="primary" @click="setUserRoles">确 定</el-button>
            </span>
        </el-dialog>


    </div>
</template>

<script>
    import {deleteUser, getUserRole, listUser, saveUser, setUserRole, updateUser} from '../../../api/system/user'
    import {treeorg} from '../../api/treemenu';
    import distUtil from "../../common/shigecomponents/dictutil";

    export default {
        components: {
            distUtil
        },
        name: "user",
        data() {
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.form.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                query: {
                    pageNo: 1,
                    size: 20
                },
                form: {},
                setUserRole: {},
                isShow: false,
                setRole: false,
                userList: [],
                roleChecked: [],
                title: '',
                pageTotal: 0,
                orgop: [],
                roleChecks: [],
                repassword: '',
                dist:{
                    useProp: '请选择角色类型',
                    usePropId: '1',
                    usePropName: 'role',
                },
                pasdrole: {
                    password_confirm: [
                        {required: true, message: "请输入新密码", trigger: "blur"},
                        {min: 6, message: "密码长度不小于6个字符", trigger: "blur"},
                        {validator: validatePass, trigger: "blur"}
                    ],// 自定义校验
                    password: [
                        {required: true, message: "请输入新密码", trigger: "blur"},
                        {min: 6, message: "密码长度不小于6个字符", trigger: "blur"},
                        {validator: validatePass, trigger: "blur"}
                    ]
                },


            }
        },
        created() {
            this.init();
            this.initOrg();
        },
        methods: {
            init() {
                listUser(this.query).then(res => {
                    this.userList = res.data.records;
                    this.pageTotal = res.data.total;
                })
            },
            // 添加用户
            addUser() {
                this.isShow = !this.isShow;
                this.title = "添加用户";
                this.form = {};
                this.form.compId = 1;
            },
            // 编辑用户
            editUser(index, row) {
                this.form = row;
                this.title = "编辑用户";
                this.isShow = !this.isShow;
            },
            // 删除用户
            deleteUser(id) {
                this.$confirm('确定要删除用户吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    deleteUser(id).then(res => {
                        if (res.code === 200 && res.data) {
                            this.$message.success('删除成功');
                            this.init();
                        } else {
                            this.$message.error('删除失败');
                        }
                    });
                });
            },
            // 设置用户角色
            setROleUser(index,row) {
                    this.setUserRole.userId = row.id;
                    this.setUserRole.compId = row.compId;
                    getUserRole(row).then(res => {
                        console.log(res)
                        var data = res.data;
                        if (res.code === 200) {
                            this.roleChecks = res.data;
                        }
                        this.setUserRole.roleIds = '';
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].flag === 1) {
                                this.roleChecked.push(data[i].id);
                                this.setUserRole.roleIds += data[i].id + ',';
                            }
                        }
                    });
                    this.idx = index;
                    this.form = row;
                    this.setRole = !this.setRole;
                    this.title = "设置角色";
            },
            submit() {
                if (this.title === "编辑用户") {
                    this.$refs['form'].validate(valid => {
                        if (valid) {
                            updateUser(this.form).then(res => {
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
                            saveUser(this.form).then(res => {
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
            checkRow(checked) {
                this.setUserRole.roleIds = `${checked}`;
            },
            // 设置用户角色
            setUserRoles() {
                setUserRole(this.setUserRole).then(res => {
                    if (res.data) {
                        this.$message.success(`设置成功`);
                    } else {
                        this.$message.error(`设置失败`);
                    }
                    this.setRole = !this.setRole;
                });
            },
            checkIn(value,name){
                this.form.type = value;
            },
            changeProvinceCity1(value) {
                this.form.orgId = value;
            },
            initOrg() {
                treeorg({pageNo: 1, size: 100}).then(res => {
                    if (res.code === 200) {
                        this.orgop = res.data.records;
                    }
                });
            },
            handleSearch() {
                this.init();
                this.initOrg();
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