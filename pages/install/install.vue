<template>
	<view class="form_wrapper">

		<u-form :model="form" ref="uForm" label-width='160' label-align='right'>
			<u-form-item label="安装设备:" prop='goodsId'>
				<u-input @click="show=true" disabled placeholder='请选择安装设备' v-model="goodsInfo.label" />
			</u-form-item>
			<u-form-item label="安装情况:" prop='status'>
				<u-radio-group v-model="form.status">
					<u-radio v-for="(item, index) in radioList" :key="index" :name="item.value">
						{{ item.name }}
					</u-radio>
				</u-radio-group>
			</u-form-item>
			<u-form-item label="安装信息:" prop='installRemark'>
				<u-input type='textarea' placeholder='输入安装信息' v-model="form.installRemark" />
			</u-form-item>

		</u-form>
		<view class='submit_btn'>
			<u-button type='primary' @click='submit'>保存</u-button>
		</view>
		
		<view style="margin-top: 30rpx;">
			<view>备注记录</view>
			<view style="line-height: 60rpx; border-bottom: 1rpx solid #efeffc;" v-for="(item,index) in remarkList" :key="index">
				<view>{{item.remark}}</view>
				<view>{{item.createdAt}}</view>
			</view>
		</view>

		<u-select @confirm='confirm' v-model="show" :list="goodsList" value-name='goodsId' label-name='goodsInfo'>
		</u-select>
	</view>
</template>

<script>
	import {
		transformBmobParam,
		getUserId,
		getUserInfo
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
					goodsId: ''
				},

				rules: {
					status: [{
						required: true,
						message: '请选择安装状态'
					}]
				},
				show: false,
				goodsList: [],
				goodsInfo: {},
				getUserInfo,
				getUserId,
				remarkList: []
			};
		},
		methods: {

			async getStorage() {
				const query = this.$Bmob.Query("Goods_count");
				query.equalTo("userId", "==", getUserId());

				this.goodsList = await query.find()
			},
			
			
			async getCommentRecord() {
				const query = this.$Bmob.Query("Customer_remark");
				query.equalTo("customerId", "==", this.customerInfo.objectId);
				query.equalTo("createdId", "==", getUserId());
				query.order('-createdAt')
				this.remarkList = await query.find()
			},

			confirm(e) {
				this.goodsInfo = e[0] || {}
				this.form.goodsId = this.goodsInfo.value
			},
			submit() {
				this.$refs.uForm.validate(async valid => {
					if (valid) {
						try {
							const goods = this.goodsList.find(ele => ele.goodsId === this.goodsInfo.value)
							if (goods &&  (goods.count - (goods.freezeCount || 0) <= 0)) {
								return uni.showToast({
									title: '设备已无库存'
								})

							}

							const query = this.$Bmob.Query('Customer');
							const cus = await query.get(this.customerInfo.objectId)

							const par = {
								installRemark: this.form.installRemark,
								status: this.form.status,
								installDate: this.dayjs().valueOf(),
								installName: getUserInfo().name,
							}
							if(this.form.status === 'installed'){
								Object.assign(par,{goodsId:this.goodsInfo.value,
								goodsInfo:this.goodsInfo.label,})
							}
							transformBmobParam(cus, par)
							await cus.save()
							
							if(this.form.installRemark){
								const remarkRecord = this.$Bmob.Query('Customer_remark');
								const par = {
									remark : this.form.installRemark,
									customerId : this.customerInfo.objectId,
									createdId : getUserId()
								}
								transformBmobParam(remarkRecord, par)
								await remarkRecord.save()
								
								this.getCommentRecord()
							}

							if (this.form.status === 'installed') {
								const query2 = this.$Bmob.Query('InboundRecord');
								const params = {
									installerId: getUserId(),
									count: 1,
									type: 'install',
									goodsId: this.goodsInfo.value,
									goodsInfo: this.goodsInfo.label,
									customerId: this.customerInfo.objectId,
									customerName: this.customerInfo.contact,
									
								}
								transformBmobParam(query2, params)
								await query2.save()

								const query1 = this.$Bmob.Query('Goods_count');
								
								const res1 = await query1.get(goods.objectId)
								res1.set('count', res1.count - 1)
								await res1.save()

								this.getStorage()
							}

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
			this.getStorage()
			this.getCommentRecord()
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
