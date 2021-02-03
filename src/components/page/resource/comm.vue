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
                    <el-input v-model="query.name" placeholder="社区名称" style="width: 160px;"></el-input>
                </template>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-lx-add" @click="addComm">新增</el-button>
            </div>
            <el-table :data="commList" border class="table" ref="multipleTable" header-cell-class-name="table-header" height="616">
                <el-table-column width="55" align="center" v-if="true" type="expand">
                    <template slot-scope="props">
                        <el-table
                                :data="props.row.childList"
                                height="150"
                                border
                                style="width: 100%">
                            <el-table-column
                                    prop="areaName"
                                    label="分区名称"
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    prop="state"
                                    label="状态"
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    prop="latitude"
                                    label="纬度">
                            </el-table-column>
                            <el-table-column
                                    prop="longitude"
                                    label="经度">
                            </el-table-column>
                            <el-table-column label="操作" width="380" align="center">
                                <template slot-scope="scope">
                                    <el-button type="warning" icon="el-icon-edit" @click.stop
                                               @click="editArea(scope.$index, scope.row)">编辑
                                    </el-button>
                                    <el-button  type="danger" icon="el-icon-delete" class="red" @click.stop
                                                @click="deleteArea(scope.row.id)">删除
                                    </el-button>

                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="ID" width="55" v-if="false" align="center"></el-table-column>
                <el-table-column prop="commName" label="社区名称" align="center" >

                </el-table-column>
                <el-table-column prop="province" label="省" align="center"></el-table-column>
                <el-table-column prop="city" label="市" align="center"></el-table-column>
                <el-table-column prop="district" label="区/县" align="center"></el-table-column>
                <el-table-column prop="commAddress" label="地址" align="center"></el-table-column>
                <el-table-column label="操作" width="380" align="center">
                    <template slot-scope="scope">
                        <el-button type="warning" icon="el-icon-edit" @click.stop
                                   @click="editComm(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button  type="danger" icon="el-icon-delete" class="red" @click.stop
                                    @click="deleteComm(scope.row.id)">删除
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


    </div>
</template>

<script>
    import {listComm,insertComm,updateComm,deleteComm} from '../../../api/resource/comm'
    export default {
        name: "comm",
        data(){
            return{
                query: {
                    pageNo: 1,
                    size: 20
                },
                form: {},
                dist: {},
                isShow: false,
                commList: [],
                title: '',
                pageTotal: 0,
                addUser:false,
                users:{}
            }
        },
        created() {
            this.init();
        },
        methods:{
            init(){
                listComm(this.query).then(res=>{
                    console.log(res)
                    this.commList = res.data.records;
                    this.pageTotal = res.data.total;
                })
            },
            addComm(){

            },
            editComm(index,row){

            },
            deleteComm(id){

            },
            editArea(index ,row){
                console.log(row)
            },
            deleteArea(id){
                console.log(id)
            },
            submit() {
                if (this.title === "编辑公司") {
                    this.$refs['form'].validate(valid => {
                        if (valid) {
                            updateComm(this.form).then(res => {
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
                            insertComm(this.form).then(res => {
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