<template>
	<view>
		<view class="item_wrapper" v-for="(item,index) in list" :key='index'>
			<view style="display: flex;justify-content: space-between;line-height: 30rpx;">
				商品信息：{{item.goodsInfo}}
			</view>
			<view>
				<text>库存：{{item.count || 0}}</text>
				<text style="margin-left: 30rpx;">调拨待确认：{{item.freezeCount || 0}}</text>
			</view>
			<view>
				<u-button type='primary' @click='apppy(item)'>
					调拨
				</u-button>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: []
			}
		},
		methods: {
			async getGoodsList(){
				const storage = this.$Bmob.Query("Goods_count");
				storage.equalTo("userId", "==", this.$Bmob.User.current().objectId);
				const res = await storage.find()
				this.list = res
			},
			apppy(item){
				uni.navigateTo({
					url:`/pages/allocation/allocation?item=${JSON.stringify(item)}`
				})
			}
		},
		onLoad() {
			this.getGoodsList()
		}

	}
</script>

<style scoped lang="scss">
	.item_wrapper {
		padding: 40rpx;
		border-bottom: 1rpx solid #efeff4;
	}
	
	.bottom{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0
	}
</style>
