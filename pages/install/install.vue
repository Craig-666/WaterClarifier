<template>
	<view class="form_wrapper">

		<u-form :model="form" ref="uForm" label-width='160' label-align='right'>
			<u-form-item label="安装设备:" prop='device'>
				<u-input @click="show=true" disabled placeholder='请选择device' v-model="deviceInfo.label" />
			</u-form-item>
			<u-form-item label="安装情况:" prop='status'>
				<u-radio-group v-model="form.status">
					<u-radio v-for="(item, index) in radioList" :key="index" :name="item.value">
						{{ item.name }}
					</u-radio>
				</u-radio-group>
			</u-form-item>
			<u-form-item label="安装信息:" prop='installRemark'>
				<u-input type='textarea' placeholder='请安装信息' v-model="form.installRemark" />
			</u-form-item>

		</u-form>
		<view class='submit_btn'>
			<u-button type='primary' @click='submit'>保存</u-button>
		</view>

		<u-select @confirm='confirm' v-model="show" :list="deviceList" value-name='objectId' label-name='name'>
		</u-select>
	</view>
</template>

<script>
	import {
		transformBmobParam
	} from '../../utils/utils.js'
	export default {
		data() {

			return {
				customerInfo: {},
				radioList: [{
						name: '已安装',
						value: 'installed'
					},
					{
						name: '未安装',
						value: 'unInstall'
					},
					{
						name: '无效',
						value: 'unuse'
					}
				],
				form: {
					installRemark: '',
					status: '',
				},

				rules: {
					status: [{
						required: true,
						message: '请选择安装状态'
					}]
				}
			};
		},
		methods: {

			submit() {
				this.$refs.uForm.validate(async valid => {
					if (valid) {
						try {
							const query = this.$Bmob.Query('Customer');
							const cus = await query.get(this.customerInfo.objectId)

							transformBmobParam(cus, {
								...this.form
							})
							await cus.save()
							uni.showToast({
								title: '保存成功'
							})
						} catch (e) {
							console.log(e)
							uni.showToast({
								icon: 'none',
								title: '保存失败，请检查内容是否输入正确'
							})
						}
					} else {
						console.log('验证失败')
					}
				});
			}
		},
		onLoad(options) {
			this.customerInfo = JSON.parse(options.item)
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
