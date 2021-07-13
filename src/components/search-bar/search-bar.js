// components/search-bar/search-bar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cancelText: {
      type: String,
      value: "取消",
    },
    placeholder: {
      type: String,
      value: "搜索关键字",
    },
    isShowPopup: {
      type: Boolean,
      value: false,
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    toPage: {
      type: String,
      value: "",
    },
    focus: {
      type: Boolean,
      value: false,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    _showPopup: false, // 是否显示popup
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange({ detail }) {
      const eventDetail = { ...detail };
      this.triggerEvent("change", eventDetail, {});
      this.setData({ _showPopup: true });
    },
    onSearch({ detail }) {
      const eventDetail = { ...detail };
      this.triggerEvent("search", eventDetail, {});
    },
    onCancel() {
      this.setData({ _showPopup: false });
      this.triggerEvent("cancel", {}, {});
    },
    onTap() {
      const { toPage } = this.properties;
      if (toPage) {
        wx.navigateTo({ url: toPage });
      }
    },
  },
});
