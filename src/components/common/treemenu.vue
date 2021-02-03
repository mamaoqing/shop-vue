<template>
    <div class="navMenu">
        <el-menu
                class="sidebar-el-menu"
                background-color="#324157"
                text-color="#bfcbd9"
                active-text-color="#20a0ff"
                unique-opened
                router="router"
        >
            <template v-for="navMenu in navMenus">
                <!-- 最后一级菜单 -->
                <el-menu-item v-if="!navMenu.childList" :key="navMenu.id" :index="navMenu.name">
                    <i class="fa fa-car"></i>
                    <span slot="title" @click="parentMenu">{{navMenu.roomNo}}</span>
                </el-menu-item>
                <!-- 此菜单下还有子菜单 -->
                <el-submenu v-if="navMenu.childList" :key="navMenu.id" :index="navMenu.name">
                    <template slot="title">
                        <i :class="navMenu.iconPath"></i>
                        <span @click="parentMenu" :key="navMenu.name">{{navMenu.name}}</span>
                    </template>
                    <!-- 递归 -->
                    <NavMenu :navMenus="navMenu.childList"></NavMenu>
                </el-submenu>
            </template>
        </el-menu>
    </div>
</template>

<script>
    export default {
        name: 'NavMenu',
        props: ['navMenus'],
        data() {
            return {}
        },
        methods: {
            parentMenu: function (event) {
                var currentTarget = event.currentTarget;
                var object = event.valueOf();
                // console.log(currentTarget.innerHTML);
                // console.log(object);
            }
        }
    }
</script>

<style scoped>

</style>