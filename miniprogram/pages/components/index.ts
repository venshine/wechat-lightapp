const FRUITS = [
  { value: 'apple', name: '苹果', checked: true },
  { value: 'pear', name: '梨', checked: false },
  { value: 'peach', name: '桃', checked: false },
]

Page({
  data: {
    text: '',
    on: true,
    volume: 40,
    level: 'mid',
    levels: [
      { value: 'low', name: '低' },
      { value: 'mid', name: '中' },
      { value: 'high', name: '高' },
    ],
    fruits: FRUITS,
    picked: 'apple',
    cities: ['北京', '上海', '广州', '深圳'],
    cityIndex: 0,
    date: '2026-01-01',
    banners: ['#07c160', '#3b82f6', '#f59e0b'],
    percent: 30,
    chips: Array.from({ length: 20 }, (_, i) => i + 1),
  },
  onInput(e: WechatMiniprogram.Input) {
    this.setData({ text: e.detail.value })
  },
  onSwitch(e: WechatMiniprogram.SwitchChange) {
    this.setData({ on: e.detail.value })
  },
  onSlider(e: WechatMiniprogram.SliderChange) {
    this.setData({ volume: e.detail.value })
  },
  onRadio(e: WechatMiniprogram.RadioGroupChange) {
    this.setData({ level: e.detail.value })
  },
  onCheck(e: WechatMiniprogram.CheckboxGroupChange) {
    this.setData({ picked: e.detail.value.join(',') || '无' })
  },
  onCity(e: WechatMiniprogram.PickerChange) {
    this.setData({ cityIndex: Number(e.detail.value) })
  },
  onDate(e: WechatMiniprogram.PickerChange) {
    this.setData({ date: String(e.detail.value) })
  },
  onTap() {
    this.setData({ percent: (this.data.percent + 20) % 120 })
  },
})
