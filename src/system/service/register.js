import axios from '../../../../../service/http'
const register = params => { return axios.post('/seed/api/staff/saveStaffInfo', params).then(res => res) }
const queryCountry = params => { return axios.get('/bjyydx/querycountry').then(res => res) }
export { register, queryCountry }
