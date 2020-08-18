// 使用localStorage给用户一个唯一的标志

const key = 'halo_monitor_uid'

function getUserId(): string {
  let uid = localStorage.getItem(key)
  if (!uid) {
    uid = Number(Math.random().toString().substr(3, 11) + Date.now()).toString(36)
    localStorage.setItem(key, uid)
  }
  return uid
}

export default getUserId()
