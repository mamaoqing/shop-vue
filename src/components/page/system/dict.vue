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
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-lx-add" @click="addDict">新增</el-button>
            </div>

            <el-table :data="dictList" style="width: 100%;margin-bottom: 20px;"  row-key="id"
                      border :tree-props="{children: 'childList', hasChildren: 'hasChildren'}">
                <el-table-column prop="dictName" label="字典名" sortable width=""></el-table-column>
                <el-table-column prop="parentId" label="父字典id" sortable width=""></el-table-column>
                <el-table-column label="操作" width="340" align="center">
                    <template slot-scope="scope">
                        <el-button   size="mini" type="warning" icon="el-icon-edit" @click.stop  @click="editDict(scope.$index, scope.row)">编辑 </el-button>
                        <el-button v-if="!scope.row.parentId" size="mini"  type="primary" icon="el-icon-lx-addressbook"  @click.stop @click="addDictChild(scope.row.id)">添加下级</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteDict(scope.row.id)">删除 </el-button>
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
                        <el-form-item label="菜单名称" label-width="100px" prop="dictName"
                                      :rules="[{ required: true, message: '请输入字典名称', trigger: 'blur' },]">
                            <el-input v-model="form.dictName"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="menus = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {listDict,saveDict,updateDict,deleteDict} from '../../../api/system/dict'
import {addMenu, deleteMenu, updateMenu} from "../../../api/system/menu";
    export default {
        name: "dict",
        data(){
            return{
                query:{
                    pageNo:1,
                    size:20,
                },
                form:{},
                dictList:[],
                isShow:false,
                title:'',
                pageTotal:0,
            }
        },
        created() {
            this.init();
        },
        methods:{
            init(){
              listDict(this.query).then(res=>{
                  this.pageTotal = res.data.total;
                  this.dictList = res.data.records;
              })
            },
            addDict(){
                this.isShow = !this.isShow;
                this.title = "添加字典";
                this.form = {};
            },
            addDictChild(id){
                this.form = {};
                this.isShow = !this.isShow;
                this.title = "添加字典";
                this.form.parentId = id;

            },
            editDict(index,row){
                this.isShow = !this.isShow;
                this.title = "修改字典";
                this.form = row;

            },
            deleteDict(id){
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    deleteDict(id).then(res => {
                        if (res.code === 200 && res.data) {
                            this.$message.success('删除成功');
                            this.init();
                        }
                    });
                });
            },
            submit(){
                if (this.title === "修改字典") {
                    this.$refs['form'].validate(valid => {
                        if (valid) {
                            updateDict(this.form).then(res => {
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
                            saveDict(this.form).then(res => {
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
            handleSearch(){
                this.init();
            },
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