<template>
	<view>
		<view class="item_wrapper" v-for="(item,index) in list" :key='index'>
			<view style="display: flex;justify-content: space-between;line-height: 30rpx;">
				<text>商品名称：{{item.goodsName}}</text>
				<text>型号：{{item.sku}}</text>
				
			</view>
			<view>
				<text>库存：{{item.count}}</text>
			</view>
			<view style="display: flex;">
				<view>
					<u-button @click='inbound(item)' type='primary'>入库</u-button>
				</view>
				<view>
					<u-button @click='outbound(item)' >调拨</u-button>
				</view>
				<view>
					<u-button @click='record(item)' >记录</u-button>
				</view>
				
			</view>
		</view>
		<view class="add_wrapper">
		
			<u-button type='primary' @click='add'>添加商品</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[]
			};
		},
		methods:{
			add(){
				console.log('addd')
				uni.navigateTo({
					url:'/pages/goods/addGoods'
				})
			},
			async getGoodsList(){
				const query = this.$Bmob.Query("Goods");
				query.equalTo("unitId", "==", this.$Bmob.User.current().objectId);
				
				const list = await query.find()
				await list.forEach( async (ele)=>{
					const storage = this.$Bmob.Query("Goods_count");
					storage.equalTo("userId", "==", this.$Bmob.User.current().objectId);
					storage.equalTo("goodsId", "==", ele.objectId);
					const res = await storage.find()
					ele.count = res[0] ? res[0].count : 0,
					ele.freezeCount = res[0] ? res[0].freezeCount : 0
					this.list = [...list]
					this.$forceUpdate()
				})
				
			},
			inbound(item){
				uni.navigateTo({
					url:`/pages/goods/inbound?item=${JSON.stringify(item)}`
				})
			},
			outbound(item){
				uni.navigateTo({
					url:`/pages/goods/outbound?item=${JSON.stringify(item)}`
				})
			},
			record(item){
				uni.navigateTo({
					url:`/pages/goods/record?item=${JSON.stringify(item)}`
				})
			}
		},
		onShow() {
			this.getGoodsList()
		}
	}
</script>

<style lang="scss" scoped>
	
	.item_wrapper{
		padding: 40rpx;
		border-bottom: 1rpx solid #efeff4;
	}
	.add_wrapper {
		background-color: white;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 80rpx;
	}
</style>
