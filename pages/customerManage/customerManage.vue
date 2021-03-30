<template>
	<view class="form_wrapper">
		<u-sticky>
			<!-- 只能有一个根元素 -->
			<u-tabs name="cate_name" :list="tabList" :is-scroll="false" :current="current" @change="change"></u-tabs>
			<view style="display: flex;border-bottom: 1rpx solid #efeff4; padding-bottom: 20rpx;">
				<u-input style='flex:1' v-model='searchInput' placeholder='输入查询信息'></u-input>
				<u-input @click='searchShow = true' disabled style='flex:1;text-align: center;' v-model='searchEmployee.label' placeholder='选择员工'>
				</u-input>
				<u-input @click='timeShow = true'  disabled style='flex:1;text-align: center;' v-model='date' placeholder='安装时间'>
				</u-input>
				<u-icon style='width: 60rpx;' @click='getCustomerList' name="search"></u-icon>
				<u-icon @click='clear' name="close"></u-icon>
				<!-- 				<u-button type='primary' @click='getCustomerList'>查询</u-button>
				<u-button @click='getCustomerList'>清空</u-button> -->
			</view>
		</u-sticky>
		<view style="padding-bottom: 80rpx;">
			<view :class="['cus_wrapper']" @click="checkboxChange(item)" v-for="(item,index) in list" :key='index'>
				<view class="info">
					<view style="display: flex;align-items: center; justify-content: space-between;">
						<text>联系人：{{item.contact}}</text>
						<text>电话：{{item.phone}}</text>
					</view>
					<view>
						地址：{{item.address}}
					</view>
					<view v-if="item.status !=='unDispatch'">
						<view>
							负责人：{{item.installName}}
						</view>
					</view>
					<view v-if="item.status==='installed'">
						<view>
							安装时间：{{dayjs(item.installDate).format('YYYY-MM-DD HH:mm')}}
						</view>
					</view>
					<view v-if="item.installRemark">
						<view>
							安装备注：{{item.installRemark}}
						</view>
					</view>
					<view v-if="item.status === 'unDispatch'">
						<u-button type='primary' @click='update(item)'>修改</u-button>
					</view>
				</view>
				<view v-if="item.status === 'unDispatch'"
					style="display: flex; align-items: center; margin-left: 20rpx;">
					<view>
						<u-icon v-if='item.checked' name="checkbox-mark" color='green'></u-icon>
						<view v-else style="width: 30rpx; height: 30rpx; border: 1rpx solid #dbdbdb;"></view>
					</view>

				</view>
			</view>
		</view>

		<view v-if="current === 0" class="split_wrapper">
			<view>已选{{selectedCount}}个</view>
			<u-button @click='dispatch'>指派</u-button>
		</view>
		<u-select @confirm='confirm' v-model="show" :list="employees" value-name='objectId' label-name='name'>
		</u-select>
		<u-select @confirm='searchConfirm' v-model="searchShow" :list="employees" value-name='objectId'
			label-name='name'></u-select>
		<u-picker @confirm='dateChange' mode="time" v-model="timeShow" :params="params"></u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				employees: [],
				searchInput: '',
				list: [],
				employee: {},
				searchEmployee:{},
				date:'',
				tabList: [{
					cate_name: '待指派'
				}, {
					cate_name: '待安装'
				}, {
					cate_name: '已安装'
				}, {
					cate_name: '无效'
				}],
				current: 0,
				params: {
					year: true,
					month: true,
					day: true,
					hour: false,
					minute: false,
					second: false
				},
				timeShow: false,
				searchShow: false
			};
		},
		methods: {
			async getEmployees() {
				const query = this.$Bmob.Query("_User");
				query.equalTo("unitId", "==", this.$Bmob.User.current().objectId);

				const list = await query.find()
				this.employees = list
			},
			clear(){
				this.searchEmployee = {}
				this.date = ''
				this.searchInput = ''
				this.getCustomerList()
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


								ids.forEach(async ele => {
									const query = this.$Bmob.Query("Customer");
									const customer = await query.get(ele)
									customer.set('installerId', this.employee.value)
									customer.set('installerName', this.employee.label)
									customer.set('dispatchDate', this.dayjs().valueOf())
									customer.set('status', 'dispatched')
									await customer.save()
								})
								uni.showToast({
									title: '指派成功'
								})
								setTimeout(() => {
									this.getCustomerList()
								}, 500)
							} catch (e) {
								console.log(e)
							}
						}
					}
				})
			},
			searchConfirm(e){
				this.searchEmployee = e[0] || {}
			},
			dateChange(e){
				this.date = `${e.year}-${e.month}-${e.day}`
			},
			async getCustomerList() {
				const query = this.$Bmob.Query("Customer");
				query.equalTo("unitId", "==", this.$Bmob.User.current().objectId);
				if (this.current === 0) {
					query.equalTo("status", "==", 'unDispatch');
				}
				if (this.current === 1) {
					const q1 = query.equalTo("status", "==", 'dispatched');
					const q2 = query.equalTo("status", "==", 'unInstall');
					// query.equalTo("status", "!=", 'installed');
					// query.equalTo("status", "!=", 'unuse');
					query.or(q1, q2)

				}
				if (this.current === 2) {
					query.equalTo("status", "==", 'installed');
				}
				if (this.current === 3) {
					query.equalTo("status", "==", 'unuse');
				}

				if (this.searchInput) {
					const q1 = query.equalTo("phone", "==", this.searchInput);
					const q2 = query.equalTo("contact", "==", this.searchInput);
					const q3 = query.equalTo("address", "==", this.searchInput);
					query.or(q1, q2, q3)
				}
				
				if (this.searchEmployee.value) {
					query.equalTo("installerId", "==", this.searchEmployee.value);
				}
				if (this.date) {
					query.equalTo("dispatchDate", ">", this.dayjs(this.date).startOf('day').valueOf());
					query.equalTo("dispatchDate", "<", this.dayjs(this.date).endOf('day').valueOf());
				}
				query.order("installerId");
				query.order("-createdAt");

				const list = await query.find()
				this.list = list.map(ele => {
					return {
						...ele,
						checked: false
					}
				})
				this.$forceUpdate()
			},
			checkboxChange(item) {
				if (item.status !== 'unDispatch') {
					return
				}
				if (item.checked) {
					item.checked = false
				} else {
					item.checked = true
				}
				this.$forceUpdate()
				console.log(this.list)
				this.list = [...this.list]
			},
			dispatch() {
				if (this.selectedCount) {
					this.show = true
				}
			},
			change(index) {
				this.current = index;
				this.getCustomerList()
			},
			update(item) {
				uni.navigateTo({
					url: `/pages/customer/customer?item=${JSON.stringify(item)}`
				})
			}
		},
		onLoad() {

			this.getEmployees()
		},

		onShow() {
			this.getCustomerList()
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
		line-height: 60rpx;
	}

	.split_wrapper {
		background-color: white;
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

	.installed {
		background-color: green;
	}

	.uninstall {
		background-color: blue;
	}

	.unuse {
		background-color: gray;
	}
</style>
