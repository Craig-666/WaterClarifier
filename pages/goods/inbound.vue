<template>
	<view class="form_wrapper">

		<view>
			<u-form :model="form" ref="uForm" label-width='160' label-align='right'>
				<u-form-item label="商品名称:">
					{{goodsInfo.goodsName}}
				</u-form-item>
				<u-form-item label="商品型号:">
					{{goodsInfo.sku}}
				</u-form-item>
				<u-form-item label="入库数量:" prop='count'>
					<u-input type='number' placeholder='请输入数量' v-model="form.count" />
				</u-form-item>

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
				goodsInfo:{},
				form: {
					count: '',
					unitId: this.$Bmob.User.current().objectId,
					type:'inbound'
				},
				rules: {
					count: [{
						required: true,
						message: '请输入入库数量'
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
							console.log(query)
							const goods = await query.get(this.goodsInfo.objectId)
							console.log(goods)
							goods.set('count',parseInt(this.goodsInfo.count || '0') + parseInt(this.form.count))
							await goods.save()
							
							const record = this.$Bmob.Query('InboundRecord');
							transformBmobParam(record, {...this.form,count:parseInt(this.form.count),goodsId:this.goodsInfo.objectId})
							await record.save()
							uni.showToast({
								title: '保存成功'
							})
							this.$refs.uForm.resetFields()
						} catch (e) {
							console.log(e)
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
		},
		onLoad(option) {
			this.goodsInfo = JSON.parse(option.item)
		}
	}
</script>

<style lang="scss" scoped>
	@import '../../uni.scss'
</style>
