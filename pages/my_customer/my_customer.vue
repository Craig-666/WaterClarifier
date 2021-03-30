<template>
	<view class="form_wrapper">
		<u-sticky>
			<!-- 只能有一个根元素 -->
			<u-tabs name="cate_name" :list="tabList" :is-scroll="false" :current="current" @change="change"></u-tabs>
		</u-sticky>

		<view style="border-bottom: 1rpx solid #efeff4; display: flex; align-items: center;"
			v-for="(item,index) in list" :key='index'>
			<view class="info" @click="phone(item)" :class="item.called && current === 0 ? 'called' : ''"
				style="flex: 1;">
				<view>
					<view class="info_wrapper">
						<text>{{item.contact}}</text>
						<text>{{item.phone}}</text>
						
					</view>
					<view>{{item.address}}</view>
				</view>

				<view v-if="item.status === 'installed'">
					安装时间：{{dayjs(item.installDate).format('YYYY-MM-DD HH:mm')}}
				</view>
				<view v-if="item.installRemark">
					备注：{{item.installRemark}}
				</view>
			</view>
			<u-button v-if="item.status != 'installed' && item.status != 'unuse' " type='primary'
				@click='install(item)'>安装</u-button>
			<u-button v-if="item.status == 'installed' " type='primary' @click='refund(item)'>退货</u-button>
		</view>


		<u-select @confirm='confirm' v-model="show" :list="employees" value-name='objectId' label-name='name'>
		</u-select>
	</view>
</template>

<script>
	import {
		getUserId,
		transformBmobParam
	} from '../../utils/utils.js'
	export default {
		data() {
			return {
				show: false,

				list: [],
				tabList: [{
					cate_name: '待安装'
				}, {
					cate_name: '已安装'
				}, {
					cate_name: '已退货',
				}, {
					cate_name: '无效',
				}],
				current: 0,
				today: false,
				getUserId,
				transformBmobParam
			};
		},
		methods: {
			async getCustomerList() {
				const query = this.$Bmob.Query("Customer");
				query.equalTo("installerId", "==", this.$Bmob.User.current().objectId);
				if (this.today) {
					query.equalTo("dispatchDate", ">", this.dayjs().startOf('day').valueOf());
				}
				if (this.current === 0) {
					query.equalTo("status", "!=", 'installed');
					query.equalTo("status", "!=", 'unuse');
					query.equalTo("status", "!=", 'refund');
				}
				if (this.current === 1) {
					query.equalTo("status", "==", 'installed');

				}
				if (this.current === 2) {
					query.equalTo("status", "==", 'refund');
				}
				if (this.current === 3) {
					query.equalTo("status", "==", 'unuse');
				}
				query.order("-dispatchDate");
				const c_list = await query.find()
				this.list = c_list
			},
			phone(item) {
				uni.makePhoneCall({
					phoneNumber: item.phone,
					success: async () => {
						const query = this.$Bmob.Query("Customer");
						const rec = await query.get(item.objectId)
						rec.set('called', true)
						await rec.save()
						this.getCustomerList()
					}
				})
			},
			install(item) {
				uni.navigateTo({
					url: `/pages/install/install?item=${JSON.stringify(item)}`
				})
			},
			refund(item) {
				uni.showModal({
					content: '确定该客户已退货吗',
					success: async (res) => {
						if (res.confirm) {
							const query = this.$Bmob.Query("Customer");
							const rec = await query.get(item.objectId)
							rec.set('status', 'refund')
							await rec.save()

							const query1 = this.$Bmob.Query("Goods_count");
							query1.equalTo("userId", "==", getUserId());
							query1.equalTo("goodsId", "==", item.goodsId);
							const rec1 = await query1.find()
							const q1 = this.$Bmob.Query("Goods_count")
							const rec2 = await q1.get(rec1[0].objectId)
							rec2.set('count',rec2.count + 1)
							await rec2.save()
							
							const query2 = this.$Bmob.Query("InboundRecord");
							const params = {
								goodsInfo: item.goodsInfo,
								customerId: item.objectId,
								customerName: item.contact,
								installerId: getUserId(),
								goodsId: item.goodsId,
								type: 'refund'
							}
							transformBmobParam(query2,params)
							await query2.save()
							
							uni.showToast({
								title:'操作成功'
							})
							this.getCustomerList()
						}
					}
				})

			},
			change(index) {
				this.current = index;
				this.getCustomerList()
			}
		},
		onLoad(options) {
			// this.getTodayTask()
			this.today = options.today ? true : false
			if (this.today) {
				uni.setNavigationBarTitle({
					title: '今日任务'
				})
			}
		},
		onShow() {
			this.getCustomerList()
		}
	}
</script>

<style lang="scss">
	@import '../../uni.scss';

	.info {
		line-height: 60rpx;

		.info_wrapper {
			flex: 1;
			display: flex;
			justify-content: space-between;
		}
	}

	.called {
		color: #4CD964;
	}
</style>
