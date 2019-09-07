Component({
    externalClasses: ['i-class'],

    properties: {
        title: {
            type: String,
            value: ''
        },
        // 副标题
        subtitle: {
            type: String,
            value: ''
        },
        subtitleColor: {
            type: String,
            value: '#80848f'
        },
        // 标题顶部距离
        hideTop: {
            type: Boolean,
            value: false
        },
        hideBorder: {
            type: Boolean,
            value: false
        }
    }
});
