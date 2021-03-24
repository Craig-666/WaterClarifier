<template>
	<view class="form_wrapper">

		<view>
			<u-form :model="form" ref="uForm" label-width='160' label-align='right'>
				<u-form-item label="员工账号:" prop='username'>
					<u-input placeholder='请输入账号(英文字符)' v-model="form.username" />
				</u-form-item>
				<u-form-item label="密码:" prop='password'>
					<u-input placeholder='请输入密码' v-model="form.password" />
				</u-form-item>
				<u-form-item label="姓名:" prop='name'>
					<u-input placeholder='请输入姓名' v-model="form.name" />
				</u-form-item>

				<u-form-item label="手机号:" prop='phone'>
					<u-input placeholder='请输入手机号' v-model="form.phone" />
				</u-form-item>

			</u-form>
		</view>
		<view class='submit_btn'>
			<u-button type='primary' @click='submit'>保存</u-button>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					username: '',
					password: '',
					name: '',
					phone: '',
					unitId: this.$Bmob.User.current().objectId
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
			submit() {
				console.log('aaa')
				this.$refs.uForm.validate(async valid => {
					if (valid) {

						try {
							await this.$Bmob.User.register(this.form)
							uni.showToast({
								title: '保存成功'
							})
							this.$refs.uForm.resetFields()
						} catch (e) {
							uni.showToast({
								icon: 'none',
								title: '保存失败，请检查账号密码是否正确'
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
		}
	}
</script>

<style lang="scss" scoped>
	@import '../../uni.scss'
</style>
