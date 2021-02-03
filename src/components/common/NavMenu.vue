<template>
    <div class="navMenu">
        <template v-for="navMenu in navMenus">
            <!-- 最后一级菜单 -->
            <el-menu-item v-if="navMenu.chirldMenuList.length==0"
                          :key="navMenu.id" :data="navMenu" :index="navMenu.url"
            >
                <i :class="navMenu.icon"></i>
                <span slot="title">{{navMenu.name}}</span>
            </el-menu-item>

            <!-- 此菜单下还有子菜单 -->
            <el-submenu v-if="navMenu.chirldMenuList.length!=0"
                        :key="navMenu.id" :data="navMenu" :index="navMenu.id.toString()">
                <template slot="title">
                    <i :class="navMenu.icon"></i>
                    <span> {{navMenu.name}}</span>
                </template>
                <!-- 递归 -->
                <NavMenu :navMenus="navMenu.chirldMenuList"></NavMenu>
            </el-submenu>
        </template>
    </div>
</template>

<script>
    export default {
        name: 'NavMenu',
        props: {
            navMenus: Array
        },
        data() {
            return {
                menus:[],
            };
        },
        watch: {
            //监听父组件传值的变化
            navMenus: {
                handler: function(val, oldval) {
                    console.log(val,oldval);
                },
                immediate: true, //关键
                deep: true
            }
        },
        created() {
            console.log(123)
        },
        methods: {}
    };
</script>

<style scoped>
    /* 一级菜单的样式 */
    .el-menu--horizontal>div>.el-menu-item {
        float: left;
        height: 75px;
        line-height: 75px;
        margin: 0;
        color: #909399;
    }
    /* 解决下图1 下拉三角图标 */
    .el-menu--horizontal>div>.el-submenu .el-submenu__icon-arrow {
        position: static;
        vertical-align: middle;
        margin-left: 8px;
        margin-top: -3px;
    }
    /* 解决下图2 无下拉菜单时 不对齐问题 */
    .el-menu--horizontal>div>.el-submenu .el-submenu__title {
        height: 75px;
        line-height: 75px;
        color: #909399;
    }
</style>