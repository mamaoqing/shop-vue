<template>
    <div class="sidebar">
        <el-menu
                class="sidebar-el-menu"
                :default-active="onRoutes"
                :collapse="collapse"
                background-color="#324157"
                text-color="#bfcbd9"
                active-text-color="#20a0ff"
                unique-opened
                router
        >
            <el-menu-item  :index="dashboard" :key="dashboard">
                <i :class="ic"></i>
                <span slot="title">概况</span>
            </el-menu-item>
            <template v-for="item in items">
                <template v-if="item.chirldMenuList.length !== 0">
                    <el-submenu :index="item.id+''" :key="item.id">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.name }}</span>
                        </template>
                        <template v-for="subItem in item.chirldMenuList">
                            <el-submenu
                                    v-if="subItem.chirldMenuList.length !== 0"
                                    :index="subItem.id+''"
                                    :key="subItem.id"
                            >
                                <template slot="title">{{ subItem.name }}</template>
                                <el-menu-item
                                        v-for="(threeItem,i) in subItem.chirldMenuList"
                                        :key="i"
                                        :index="threeItem.id+''"
                                >{{ threeItem.name }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                    v-else
                                    :index="subItem.url"
                                    :key="subItem.url"
                            >
                                <i :class="subItem.icon"></i>
                                {{ subItem.name }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.name }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    import NavMenu from "../common/NavMenu";
    import {treemenu} from '../api/treemenu'

    export default {
        data() {
            return {
                ic:'el-icon-s-home',
                dashboard:'/dashboard',
                collapse: false,
                fullscreen: false,
                name: 'linxin',
                message: 2,
                menus: null,
                items: [],
            };
        },
        components: {NavMenu},
        computed: {
            username() {
                let username = localStorage.getItem('ms_username');
                return username ? username : this.name;
            },
            onRoutes() {
                return this.$route.path.replace('/', '');
            }
        },
        created() {
            this.getMenuList();
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
                bus.$emit('collapse-content', msg);
            });
        },
        methods: {
            // 用户名下拉菜单选择事件
            handleCommand(command) {
                if (command == 'loginout') {
                    localStorage.removeItem('ms_username');
                    localStorage.removeItem('token');
                    this.$router.push('/login');
                }
            },
            // 根据角色权限显示不同页面
            getMenuList() {
                treemenu().then(res => {
                    this.items = res.data;
                })
            },
            // 侧边栏折叠
            collapseChage() {
                this.collapse = !this.collapse;
                bus.$emit('collapse', this.collapse);
            },
            // 全屏事件
            handleFullScreen() {
                let element = document.documentElement;
                if (this.fullscreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                } else {
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.msRequestFullscreen) {
                        // IE11
                        element.msRequestFullscreen();
                    }
                }
                this.fullscreen = !this.fullscreen;
            }
        },
        mounted() {
            if (document.body.clientWidth < 1500) {
                this.collapseChage();
            }
        }
    };
</script>

<style scoped>
    .sidebar {
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom: 0;
        overflow-y: scroll;
    }

    .sidebar::-webkit-scrollbar {
        width: 0;
    }

    .sidebar-el-menu:not(.el-menu--collapse) {
        width: 250px;
    }

    .sidebar > ul {
        height: 100%;
    }
</style>
