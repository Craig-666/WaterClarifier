<template>
	<view class="form_wrapper">
		<view style="padding: 30rpx 0;" v-for="(item,index) in list" :key='index'>
			<view class="info" @click="phone(item.phone)">
				<view>
					<text>{{item.contact}}</text>
					<text>{{item.phone}}</text>
				</view>
				<view>
					{{item.address}}
				</view>
			</view>
			<u-button type='primary' @click='install(item)'>安装</u-button>
		</view>


		<u-select @confirm='confirm' v-model="show" :list="employees" value-name='objectId' label-name='name'>
		</u-select>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,

				list: [],

			};
		},
		methods: {
			async getTodayTask() {
				const query = this.$Bmob.Query("Customer");
				query.equalTo("installerId", "==", this.$Bmob.User.current().objectId);
				// 查询大于某个日期的数据，示例代码如下
				query.equalTo("dispatchDate", ">", this.dayjs().startOf('day').valueOf());
				query.equalTo("status", "!=", "installed");
				query.equalTo("status", "!=", "unuse");
				const c_list = await query.find()
				this.list = c_list
			},
			phone(ph) {
				uni.makePhoneCall({
					phoneNumber: ph
				})
			},
			install(item){
				uni.navigateTo({
					url:`/pages/install/install?item=${JSON.stringify(item)}`
				})
			}
		},
		onLoad() {
			// this.getTodayTask()
		},
		onShow() {
			this.getTodayTask()
		}
	}
</script>

<style lang="scss">
	@import '../../uni.scss'
</style>
