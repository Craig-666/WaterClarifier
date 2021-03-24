<template>
	<view>
		<u-button @click='task'>今日任务</u-button>
		<u-button @click='cus'>我的客户</u-button>
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
				uni.navigateTo({
					url:'../today/today'
				})
			},
			cus(){
				uni.navigateTo({
					url:'../my_customer/my_customer'
				})
			},
		}
	}
</script>

<style lang="scss">
@import '../../uni.scss'
</style>
