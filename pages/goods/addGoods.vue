<template>
	<view class="form_wrapper">

		<view>
			<u-form :model="form" ref="uForm" label-width='160' label-align='right'>
				<u-form-item label="商品名称:" prop='goodsName'>
					<u-input placeholder='请输入商品名称' v-model="form.goodsName" />
				</u-form-item>
				<u-form-item label="商品型号:" prop='sku'>
					<u-input placeholder='请输入商品型号' v-model="form.sku" />
				</u-form-item>
				<!-- <u-form-item label="入库数量:" prop='count'>
					<u-input type='number' placeholder='请输入商品型号' v-model="form.count" />
				</u-form-item> -->

			</u-form>
		</view>
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
				form: {
					goodsName: '',
					sku: '',
					unitId: this.$Bmob.User.current().objectId
				},
				rules: {
					goodsName: [{
						required: true,
						message: '请输入商品名称'
					}],
					sku: [{
						required: true,
						message: '请输商品型号'
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
							const query = this.$Bmob.Query('Goods');
							transformBmobParam(query, this.form)
							await query.save()
							uni.showToast({
								title: '保存成功'
							})
							this.$refs.uForm.resetFields()
						} catch (e) {
							uni.showToast({
								icon: 'none',
								title: '保存失败，请检查输入内容是否正确'
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
