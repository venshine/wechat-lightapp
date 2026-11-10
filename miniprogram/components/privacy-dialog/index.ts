import { listenNeedPrivacy, openContract, queryNeedAuthorization, resolveAgree, resolveDisagree } from '../../utils/privacy'

/**
 * 自定义隐私授权弹窗：
 * 1. 被动：隐私接口被调用且用户未同意时（wx.onNeedPrivacyAuthorization）弹出；
 * 2. 主动：父页面调用 check() 查询（wx.getPrivacySetting），需要时弹出。
 * 同意按钮必须是 <button open-type="agreePrivacyAuthorization">，点击后微信才会记录用户已同意。
 */
Component({
  data: {
    visible: false,
    referrer: '隐私接口',
    contractName: '',
  },
  lifetimes: {
    attached() {
      listenNeedPrivacy((referrer) => {
        this.setData({ visible: true, referrer })
      })
    },
  },
  methods: {
    /** 主动查询授权状态，返回是否已无需授权 */
    async check(): Promise<boolean> {
      const { need, contractName } = await queryNeedAuthorization()
      this.setData({ contractName })
      if (need) this.setData({ visible: true, referrer: '本页功能' })
      return !need
    },
    openContract() {
      openContract()
    },
    onAgree() {
      this.setData({ visible: false })
      resolveAgree('agree-btn')
      this.triggerEvent('agree')
    },
    onDisagree() {
      this.setData({ visible: false })
      resolveDisagree()
      this.triggerEvent('disagree')
    },
  },
})
