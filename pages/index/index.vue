<template>
	<view class="content">
		<u-button type='primary' @click="handleClick('emp')">添加员工</u-button>
		<u-button type='dash' @click="handleClick('customer')">添加客户</u-button>
		<u-button type='primary' @click="handleClick('cus_manage')">客户管理</u-button>
		<u-button @click="handleClick('goods')">商品管理</u-button>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {
			handleClick(e) {
				switch(e){
					case 'emp':{
						uni.navigateTo({
							url:'../employee/employee'
						})
					}break
					case 'task':{
						uni.navigateTo({
							url:'../addTask/addTask'
						})
					}break
					case 'customer':{
						uni.navigateTo({
							url:'../customer/customer'
						})
					}break
					case 'cus_manage':{
						uni.navigateTo({
							url:'../customerManage/customerManage'
						})
					}break
					case 'goods':{
						uni.navigateTo({
							url:'../goods/index'
						})
					}break
				}
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
