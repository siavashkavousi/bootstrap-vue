/*
 * Client side "safe" ID genration
 *
 * Will not cause client side SSR rehydration bail
 *
 */

export default {
    data() {
        return {
            this.localId: this.id
        }
    },
    props: {
        id: {
            type: String,
            default: null
        }
    }
    mounted() {
        // If no ID provided, create one once we are mounted client side
        if (!this.id && this._uid) {
            this.localId = `__BVID__${this._uid}__`;
        }
    },
    computed:
        safeId() {
            // If ID changes after mounting, return new ID
            this.id || this.localId;
        }
    }
};
