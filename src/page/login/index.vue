<template>
  	<div class="login_page fillcontain">
	  	<transition name="form-fade" mode="in-out">
	  		<section class="form_contianer">
		  		<div class="manage_tip">
		  			<p>Facebook消息管理系统</p>
		  		</div>
		    	<el-form :model="loginForm" ref="loginForm">
					<el-form-item prop="username">
						<el-input v-model="loginForm.username" placeholder="用户名"></el-input>
					</el-form-item>
					<el-form-item prop="password">
						<el-input type="password" placeholder="密码" v-model="loginForm.password" @keyup.enter.native="handleLogin"></el-input>
					</el-form-item>
					<el-form-item>
				    	<el-button type="primary" @click.native.prevent="handleLogin()" class="submit_btn">登录</el-button>
				  	</el-form-item>
				</el-form>
	  		</section>
	  	</transition>
  	</div>
</template>

<script>
	import { setToken,setUser,setUserId,setUserType } from '@/utils/auth'
	import login from '@/api/login';
	export default {
	    data(){
			return {
				loginForm: {
					username: '',
					password: '',
				},
			}
		},
		methods: {
			handleLogin() {
				var req = {
					'name': this.myTrim(this.loginForm.username),
					'pwd': this.myTrim(this.loginForm.password),
				}
				login(JSON.stringify(req)).then(data => {
					if ( data.rtn == 0 ){
						setToken(data.data.token);
						setUserType(data.data.type);
						setUser(this.loginForm.username);
						setUserId(data.data.userid);
						if ( data.data.type == 1 ){
							this.$router.push({ name: 'Home' });
						}else if ( data.data.type == 2 ){
							this.$router.push({ name: 'TaskMgr' });
						}else{
							this.$router.push({ name: 'MessageMgr' });
						}
					}else{
						this.$message({
							message: data.msg,
							center: true,
							type: 'error',
							duration: 3 * 1000
						});
					}
				})
			},
			myTrim(x) {
                return x.replace(/^\s+|\s+$/gm,'');
            }
		},
	}
</script>

<style lang="less" scoped>
	@import '@/style/mixin';
	.login_page{
		background-image: url("../../../public/background.png");
		opacity: .9;
		background-color: #5e5e5e;
	}
	.manage_tip{
		position: absolute;
		width: 100%;
		top: -90px;
		left: 0;
		p{
			font-size: 34px;
			color: #fff;
		}
	}
	.form_contianer{
		.wh(320px, 190px);
		.ctp(320px, 190px);
		padding: 27px;
		top:40%;
		border-radius: 5px;
		text-align: center;
		border-radius: 6px;
		box-shadow: 0 6px 10px -4px rgba(0,0,0,.15);
		background-color: #ffffff;
		.submit_btn{
			margin-top: 10px;
			width: 100%;
			padding: 12px 20px;
			font-size: 16px;
		}
	}
	.tip{
		font-size: 12px;
		color: red;
	}
	.form-fade-enter-active, .form-fade-leave-active {
	  	transition: all 1s;
	}
	.form-fade-enter, .form-fade-leave-active {
	  	transform: translate3d(0, -50px, 0);
	  	opacity: 0;
	}
</style>
