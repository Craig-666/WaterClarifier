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
				<u-form-item label="库存:">
					{{storageInfo.count}}  调拨待确认:{{storageInfo.freezeCount || 0}}
				</u-form-item>
				<u-form-item label="接收人:" prop='receiverId'>
					<u-input @click="show=true" disabled placeholder='请选择调拨人' v-model="employee.label" />
				</u-form-item>
				<u-form-item label="调拨数量:" prop='count'>
					<u-input type='number' placeholder='请输入数量' v-model="form.count" />
				</u-form-item>

			</u-form>
		</view>
		<view class='submit_btn'>
			<u-button type='primary' @click='submit'>保存</u-button>
		</view>

		<u-select @confirm='confirm' v-model="show" :list="employees" value-name='objectId' label-name='name'>
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
				goodsInfo: {},
				form: {
					count: '',
					unitId: this.$Bmob.User.current().objectId,
					type: 'outbound',
					receiverId: ''
				},
				rules: {
					count: [{
						required: true,
						message: '请输入入库数量'
					}],
					receiverId: [{
						required: true,
						message: '请选择接收人'
					}],
				},
				show: false,
				employees: [],
				list: [],
				employee: {},
				storageInfo:{}
			};
		},
		methods: {
			async getEmployees() {
				const query = this.$Bmob.Query("_User");
				query.equalTo("unitId", "==", this.$Bmob.User.current().objectId);

				const list = await query.find()
				this.employees = list
			},

			async getStorage() {
				const query = this.$Bmob.Query("Goods_count");
				query.equalTo("userId", "==", this.$Bmob.User.current().objectId);
				query.equalTo("goodsId", "==", this.goodsInfo.objectId);
				
				const list = await query.find()
				this.storageInfo = list[0]
			},
			confirm(e) {
				this.employee = e[0] || {}
				this.form.receiverId = this.employee.value

			},
			submit() {
				this.$refs.uForm.validate(async valid => {
					if (valid) {
						try {
							
							if((this.storageInfo.count || 0) - (this.storageInfo.freezeCount || 0) < parseInt(this.form.count)){
								return uni.showToast({
									icon:'fail',
									title:'调拨数量不能大于剩余库存'
								})
							}
							// 添加一条出库记录 待确认
							const record = this.$Bmob.Query('InboundRecord');
							transformBmobParam(record, {
								...this.form,
								count: parseInt(this.form.count),
								goodsId: this.goodsInfo.objectId,

								goodsInfo: `${this.goodsInfo.goodsName} - ${this.goodsInfo.sku}`,
								receiverName: this.employee.label,
								senderId: this.$Bmob.User.current().objectId,
								senderName: '库房',
								status: 'wait'
							})
							await record.save()


							// 冻结数量 + 
							const query = this.$Bmob.Query('Goods_count');
							query.equalTo("userId", "==", this.$Bmob.User.current().objectId);
							query.equalTo("goodsId", "==", this.goodsInfo.objectId);
							const storageRec = await query.find()
							
							const countQ = this.$Bmob.Query('Goods_count');
							countQ.set('id',storageRec[0].objectId)
							countQ.set('freezeCount', parseInt(storageRec[0].freezeCount || '0') + parseInt(this.form
								.count))

							await countQ.save()

							uni.showToast({
								title: '分配成功'
							})
							this.getStorage()
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
			this.getEmployees()
			this.getStorage()
		}
	}
</script>

<style lang="scss" scoped>
	@import '../../uni.scss'
</style>
