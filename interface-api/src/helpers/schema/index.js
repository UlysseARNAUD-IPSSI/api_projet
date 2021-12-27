
module.exports = {

    _temp: {},

    type(type) {
        this._temp = {type, ...this._temp};
        return this;
    },

    required(required = true) {
        this._temp = {required, ...this._temp};
        return this;
    },

    default(_default = true) {
        this._temp = {default: _default, ...this._temp};
        return this;
    },

    ref(ref = true) {
        this._temp = {ref, ...this._temp};
        return this;
    },

    get() {
        const value = this._temp;
        this._clean();
        return value;
    },

    _clean() {
        this._temp = {};
    }

}