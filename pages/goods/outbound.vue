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
					{{goodsInfo.count}}
				</u-form-item>
				<u-form-item label="接收人:" prop='employeeId'>
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
		
		<u-select @confirm='confirm' v-model="show" :list="employees" value-name='objectId' label-name='name'></u-select>

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
					type:'outbound',
					employeeId: ''
				},
				rules: {
					count: [{
						required: true,
						message: '请输入入库数量'
					}],
					employeeId: [{
						required: true,
						message: '请选择接收人'
					}],
				},
				show:false,
				employees: [],
				list: [],
				employee: {}
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
				this.employee = e[0] || {}
				this.form.employeeId = this.employee.value
				
			},
			submit() {
				console.log('aaa')
				this.$refs.uForm.validate(async valid => {
					if (valid) {

						try {
							const query = this.$Bmob.Query('Goods');
						
							const goods = await query.get(this.goodsInfo.objectId)
						
							goods.set('count',parseInt(this.goodsInfo.count || '0') - parseInt(this.form.count))
							await goods.save()
							
							const record = this.$Bmob.Query('InboundRecord');
							transformBmobParam(record, {...this.form,count:parseInt(this.form.count),goodsId:this.goodsInfo.objectId})
							await record.save()
							
							const goods_emp = this.$Bmob.Query('Goods_employee');
							goods_emp.equalTo("employeeId", "==", this.form.employeeId);
							goods_emp.equalTo("goodsId", "==", this.goodsInfo.objectId);
							const rec = await goods_emp.find()
							console.log(rec)
							if(rec.length){
								const ite = rec[0]
								const qu = this.$Bmob.Query('Goods_employee');
								qu.set('id',ite.objectId)
								qu.set('count',ite.count + parseInt(this.form.count))
								await qu.save()
							}else{
								const ite_query = this.$Bmob.Query('Goods_employee');
								const par = {
									employeeId: this.form.employeeId,
									goodsId:this.goodsInfo.objectId,
									goodsName:this.goodsInfo.goodsName,
									sku:this.goodsInfo.sku,
									count: parseInt(this.form.count)
								}
								transformBmobParam(ite_query,par)
								await ite_query.save()
							}
							
							
							const record_emp = this.$Bmob.Query('InboundRecord_emp');
							const params = {employeeId:this.form.employeeId,count:parseInt(this.form.count),type:'inbound',goodsId:this.goodsInfo.objectId}
							transformBmobParam(record_emp, params)
							await record_emp.save()
							
							// await record_emp.save()
							
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
			this.getEmployees()
		}
	}
</script>

<style lang="scss" scoped>
	@import '../../uni.scss'
</style>
