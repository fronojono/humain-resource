export default [
  'message',
  'job',
  'loginTitle',
  'loginUserName',
  'loginPassword',
  'loginBtn',
  'loginInvalid',
  'email'
].reduce((r, i) => {
  r[i] = i
  return r
}, {})