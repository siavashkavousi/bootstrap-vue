<template>
    <input :id="id || null"
           :class="inputClass"
           :name="name"
           :value="value"
           :type="localType"
           :disabled="disabled"
           :required="required"
           :readonly="readonly || plaintext"
           :placeholder="placeholder"
           :autocomplete="autocomplete || null"
           :aria-required="required ? 'true' : null"
           :aria-invalid="computedAriaInvalid"
           @input="onInput($event.target.value, $event)"
           @change="onChange($event.target.value, $event)"/>
</template>

<script>
    import { formMixin, forSizeMixin, forStateMixin } from '../mixins';
    export default {
        mixins: [formMixin formSizeMixin, formStateMixin],
        props: {
            value: {
                default: null
            },
            type: {
                type: String,
                default: 'text'
            },
            ariaInvalid: {
                type: [Boolean, String],
                default: false
            },
            readonly: {
                type: Boolean,
                default: false
            },
            plaintext: {
                type: Boolean,
                default: false
            },
            autocomplete: {
                type: String,
                default: null
            },
            placeholder: {
                type: String,
                default: null
            },
            formatter: {
                type: Function
            },
            lazyFormatter: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            localType() {
                if (this.type === 'radio' || this.type === 'checkbox') {
                    // This component doesn't support radio or checkbox
                    return 'text';
                }
                return this.type || 'text';
            },
            inputClass() {
                return [
                    this.plaintext ? `form-control-plaintext` : 'form-control',
                    this.sizeClass,
                    this.stateClass
                ];
            },
            computedAriaInvalid() {
                if (!Boolean(this.ariaInvalid) || this.ariaInvalid === 'false') {
                    // this.ariaInvalid is null or false or 'false'
                    return this.stateClass === 'is-invalid' ? 'true' : null ;
                }
                if (this.ariaInvalid === true) {
                   // User wants explicit aria-invalid=true
                    return 'true';
                }
                // Most likely a string value (which could be 'true')
                return this.ariaInvalid;
            }
        },
        watch:{
            value(newVal, oldVal) {
                if (newVal !== oldVal){
                    this.$el.value = newVal;
                }
            }
        },
        methods: {
            format(value, e) {
                if (this.formatter) {
                    const formattedValue = this.formatter(value, e);
                    if (formattedValue !== value) {
                        this.$el.value = formattedValue;
                        return formattedValue;
                    }
                }
                return value;
            },
            onInput(value, e) {
                let formattedValue = value;
                if (!this.lazyFormatter) {
                    formattedValue = this.format(value, e);
                }
                this.$emit('input', formattedValue, e);
            },
            onChange(value, e) {
                const formattedValue = this.format(value, e);
                this.$emit('input', formattedValue, e);
                this.$emit('change', formattedValue, e);
            },
            focus() {
                if(!this.disabled) {
                    this.$el.focus();
                }
            }
        }
    };
</script>
