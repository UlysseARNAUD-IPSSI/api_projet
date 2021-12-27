module.exports = {

    folder: undefined,

    /**
     * Get configuration by name
     * Property name should be - for example - a single name like "app" to get the whole app configuration, or a
     * composed name like "app.name" to get only the name.
     * @param name
     * @param _default Optional default value
     */
    get(name, _default = undefined) {
        let parts = name.split('.') ?? [name], value = require(`../../${this.folder}/${parts.shift()}`);

        try {
            value = value[parts.join('.')];
        }
        catch (e) {
            for(let part of parts) {
                try {
                    value = value[part];
                }
                catch (e) {
                    value = _default ?? undefined;
                    break;
                }
            }
        }

        return value;
    }

}