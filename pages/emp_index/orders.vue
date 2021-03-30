<template>
	<view class="form_wrapper">
		<u-button @click='task'>今日任务</u-button>
		<u-button @click='cus'>我的客户</u-button>
		<u-button @click='disp'>调拨记录</u-button>
		<u-button @click='storage'>我的库存</u-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods:{
			task(){
				// uni.navigateTo({
				// 	url:'../today/today'
				// })
				uni.navigateTo({
					url:'../my_customer/my_customer?today=true'
				})
			},
			cus(){
				uni.navigateTo({
					url:'../my_customer/my_customer'
				})
			},
			disp(){
				uni.navigateTo({
					url:'../emp_dispatch/emp_dispatch'
				})
			},
			storage(){
				uni.navigateTo({
					url:'../my_storage/my_storage'
				})
			},
		}
	}
</script>

<style lang="scss">
@import '../../uni.scss'
</style>
