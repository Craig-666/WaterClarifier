<template>
	<view class="form_wrapper">

		<u-form :model="form" ref="uForm" label-width='160' label-align='right'>
			<u-form-item label="联系人:" prop='contact'>
				<u-input placeholder='请输入联系人' v-model="form.contact" />
			</u-form-item>
			<u-form-item label="电话:" prop='phone'>
				<u-input placeholder='请输入密码' v-model="form.phone" />
			</u-form-item>
			<u-form-item label="地址:" prop='address'>
				<u-input placeholder='请输入地址' v-model="form.address" />
			</u-form-item>

			<u-form-item label="备注:" prop='remark'>
				<u-input placeholder='请输入备注' v-model="form.remark" />
			</u-form-item>

			<u-form-item label="指派:" prop='employeeId'>
				<view @click="show=true">{{dispatch.label || '选择'}}</view>
			</u-form-item>

		</u-form>
		<u-select @confirm='confirm' placeholder='请选择指派人' v-model="show" :list="employees" value-name='objectId'
			label-name='name'>
		</u-select>
		<view class='submit_btn'>
			<u-button type='primary' @click='submit'>保存</u-button>
		</view>
	</view>
</template>

<script>
	import {
		transformBmobParam
	} from '../../utils/utils.js'
	export default {
		data() {

			return {
				show: false,
				employees: [],
				form: {
					contact: '',
					address: '',
					phone: '',
					unitId: this.$Bmob.User.current().objectId,
					remark: '',
					employeeId: ''
				},
				dispatch: {

				},
				rules: {
					contact: [{
						required: true,
						message: '请输入联系人'
					}],
					phone: [{
						required: true,
						message: '请输入电话'
					}],
					address: [{
						required: true,
						message: '请输入地址'
					}],
					employeeId: [{
						required: true,
						message: '请选择指派人'
					}],
				}
			};
		},
		methods: {
			async getEmployees() {
				const query = this.$Bmob.Query("_User");
				query.equalTo("unitId", "==", this.$Bmob.User.current().objectId);

				const list = await query.find()
				this.employees = list
			},
			confirm(e) {

				const obj = e[0] || {}
				this.dispatch = obj
				this.form.employeeId = obj.value
			},

			submit() {
				this.$refs.uForm.validate(async valid => {
					if (valid) {
						try {
							const query = this.$Bmob.Query('Tasks');
							transformBmobParam(query, this.form)
							console.log(query)
							await query.save()
							uni.showToast({
								title: '保存成功'
							})
							this.$refs.uForm.resetFields()
						} catch (e) {
							console.log(e)
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
		onLoad() {
			this.getEmployees()
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		}
	}
</script>

<style lang="scss">
	@import '../../uni.scss'
</style>
