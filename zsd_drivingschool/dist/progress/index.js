Component({
    externalClasses: ['i-class'],

    properties: {
        strokeColor: {
            type: String,
            value: '#000'
        },
        progressInfo: {
            type: String,
            value: ''
        },
        percent: {
            type: Number,
            value: 0
        },
        // normal || active || wrong || success
        status: {
            type: String,
            value: 'normal'
        },
        strokeWidth: {
            type: Number,
            value: 12
        },
        hideInfo: {
            type: Boolean,
            value: false
        }
    }
});
