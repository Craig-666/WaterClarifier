export const transformBmobParam = (query, param) =>{
	Object.keys(param).forEach(ele=>{
		query.set(ele,param[ele])
	})
}

export const batchFind = (query, ids) =>{
	const arr =  ids.map(ele=>{
		const qu = query.equalTo("objectId", '==', ele);
		return qu
	})
	
	query.or(...[arr]);
	
}


export const getUserInfo = () =>{
	return JSON.parse(uni.getStorageSync('bmob'))
}
export const getUserId = () =>{
	return getUserInfo().objectId
}