<template>
	<view class="form_wrapper">
		<view :class="['cus_wrapper',item.status]" @click="checkboxChange(item)" v-for="(item,index) in list" :key='index'>
			<view class="info">
				<view>
					<text>{{item.contact}}</text>
					<text>{{item.phone}}</text>
				</view>
				<view>
					{{item.address}}
				</view>
			</view>
			<u-checkbox v-if="!item.installerId" v-model="item.checked"></u-checkbox>
		</view>

		<view class="split_wrapper">
			<view>已选{{selectedCount}}个</view>
			<u-button @click='dispatch'>指派</u-button>
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
				console.log(e, this.employee)
				uni.showModal({
					content: `确定要将${this.selectedCount}条客户指派给${this.employee.label}吗？`,
					success: async (res) => {
						if (res.confirm) {

							try {
								const ids = this.list.filter(ele => ele.checked).map(ele => ele.objectId)
								// const query = this.$Bmob.Query("Customer");
								// query.containedIn("objectId", ids);
								// const all = await query.get();
								// console.log(all)
								// all.set('installerId', this.employee.value)
								// all.set('dispatchDate', this.dayjs.valueOf())
								// await all.save()


								ids.forEach(async ele => {
									const query = this.$Bmob.Query("Customer");
									const customer = await query.get(ele)
									customer.set('installerId', this.employee.value)
									customer.set('dispatchDate', this.dayjs().valueOf())
									await customer.save()
								})
								uni.showToast({
									title: '指派成功'
								})
								this.getCustomerList()
							} catch (e) {
								console.log(e)
							}
						}
					}
				})
			},
			async getCustomerList() {
				const query = this.$Bmob.Query("Customer");
				query.equalTo("unitId", "==", this.$Bmob.User.current().objectId);
				query.order("installerId");
				console.log(query)
				const c_list = await query.find()
				this.list = c_list
			},
			checkboxChange(item) {
				if(item.installerId){
					return
				}
				if (item.checked) {
					item.checked = false
				} else {
					item.checked = true
				}
				this.$forceUpdate()
				this.list = [...this.list]
			},
			dispatch() {
				if (this.selectedCount) {
					this.show = true
				}
			}
		},
		onLoad() {
			this.getCustomerList()
			this.getEmployees()
		},
		computed: {
			selectedCount() {
				return this.list.filter(ele => ele.checked).length
			}
		}
	}
</script>

<style lang="scss">
	@import '../../uni.scss';
	.cus_wrapper {
		display: flex;
		line-height: 40rpx;
		padding: 20rpx 0;
		border-bottom: 2rpx solid #efeff4;
	}

	.info {
		flex: 1;
	}

	.split_wrapper {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 80rpx;
		border-top: 2rpx solid #efeff4;
		padding: 0 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	
	.installed{
		background-color: green;
	}
	.uninstall{
		background-color: blue;
	}
	.unuse{
		background-color: gray;
	}
</style>
