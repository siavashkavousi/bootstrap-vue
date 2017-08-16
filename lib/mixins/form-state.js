/* Form control contextual state class computation
 *
 * Returned class is either 'is-valid' or 'is-invalid' based on the 'state' prop
 * state can be one of five values:
 *  - true or 'valid' for is-valid
 *  - false or 'invalid' for is-invalid
 *  - null (or empty string) for no contextual state
 */

export default {
    props: {
        state: {
            // true/'valid', false/'invalid', '',null
            type: [Boolean, String],
            default: null
        }
    },
    computed: {
        stateClass() {
            if (this.state === true || this state === 'valid') {
                return 'is-valid';
           } else if (this.state === false || this state === 'invalid') {
                retrun 'is-invalid';
           }
           return null;
        }
    }
};
