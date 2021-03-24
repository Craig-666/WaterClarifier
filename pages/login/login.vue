<template>
	<view class="form_wrapper">

		<view>
			<u-form :model="form" ref="uForm">
				<u-form-item label="账号:" prop='username'>
					<u-input placeholder='请输入账号' v-model="form.username" />
				</u-form-item>
				<u-form-item label="密码:" prop='password'>
					<u-input placeholder='请输入密码' type='password' v-model="form.password" />
				</u-form-item>

			</u-form>
		</view>
		<view class='submit_btn'>
			<u-button type='primary' @click='login'>登录</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					username: '',
					password: ''
				},
				rules: {
					username: [{
						required: true,
						message: '请输入账号'
					}],
					password: [{
						required: true,
						message: '请输入密码'
					}]
				}
			};
		},
		methods: {
			login() {

				this.$refs.uForm.validate(async valid => {
					if (valid) {
						const {
							username,
							password
						} = this.form
						try {
							const info = await this.$Bmob.User.login(username, password)
							if (info.user_type === 'admin') {
								uni.redirectTo({
									url: '/pages/index/index'
								});
							} else {
								uni.redirectTo({
									url: '/pages/emp_index/orders'
								});
							}


						} catch (e) {
							uni.showToast({
								icon: 'none',
								title: '登录失败，请检查账号密码是否正确'
							})
						}
					} else {
						console.log('验证失败')
					}
				});
			}
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		onLoad() {
			
			console.log(this.dayjs().valueOf())
		}
	}
</script>

<style lang="scss" scoped>
@import '../../uni.scss'v
</style>
