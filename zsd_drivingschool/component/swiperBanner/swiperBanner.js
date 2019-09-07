// component/swiperBanner/swiperBanner.js
const app = getApp()

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        isBorder: {
            type: Number,
            value: 0
        },
        mode: {
            type: String,
            value: 'aspectFit'
        },
        imgs: {
            type: Array,
            value: []
        },
        option: {
            type: Object,
            value: {
                indicatorDots: true,
                autoplay: true,
                interval: 5000,
                duration: 500
            }
        },
        height: {
            type: Number,
            value: 180
        },
        width: {
            type: Number,
            value: 100
        },
        padding: {
            type: String,
            value: '0'
        },
        margin: {
            type: String,
            value: "0 0 3px 0"
        },
        indicatorColor: {
            type: Object,
            value: {
                defColor: 'bfbfbf',
                actColor: 'ea5e20'
            }
        }
    },
    /**
     * 组件的初始数据
     */
    data: {
        baseUrl: app.baseUrl

    },

    /**
     * 组件的方法列表
     */
    methods: {
        goUri: app.goUri

    }
})
