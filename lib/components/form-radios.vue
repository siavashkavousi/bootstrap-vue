<template>
    <div :id="id || null"
         :class="buttons ? btnGroupClasses : radioGroupClasses"
         role="radiogroup"
         tabindex="-1"
         :data-toggle="buttons ? 'buttons' : null"
         :aria-required="required ? 'true' : null"
         :aria-invalid="computedAriaInvalid"
    >
        <slot name="first"></slot>
        <!-- TODO: Change this to use form-radio component -->
        <b-radio v-for="(option, idx) in formOptions"
                 v-model="value"
                 ref="options"
                 :id="id ? `${id}__BV_radio_${idx}_opt_` : null"
                 :name="name"
                 :value="option.value"
                 :required="name && required"
                 :disabled="option.disabled || disabled"
                 :plain="plain"
                 :button="buttons"
                 :key="`radio_${idx}`"
                 @input="emitValue"
                 @change"emitValue" // which event is used for checks?
        ><span v-html="option.text"></span></b-radio>
        <slot></slot>
    </div>
</template>

<script>
    import { formMixin, formOptionsMixin, formSizeMixin, formStateMixin, formCustomMixin, formCheckBoxMixin } from '../mixins';

    export default {
        mixins: [formMixin, formSizeMixin, formStateMixin, formCustomMixin, formCheckBoxMixin, formOptionsMixin],
        data() {
            return {
                localValue: this.value,
                localState: this.state
            };
        },
        props: {
            value: {},
            validated: {
                type: Boolean,
                default: false
            },
            ariaInvalid: {
                type: [Boolean, String],
                default: false
            },
            stacked: {
                type: Boolean,
                default: false
            },
            buttons: {
                // Render as button style
                type: Boolean,
                default: false
            },
            buttonVariant: {
                // Only applicable when rendered with button style
                type: String,
                default: 'secondary'
            }
        },
        computed: {
            radioGroupClasses() {
                return [
                    this.validated ? `was-validated` : '',
                    this.sizeClass,
                    this.stacked ? 'custom-controls-stacked' : ''
               ];
            },
            btnGroupClasses() {
                return [
                    'btn-group',
                    this.validated ? `was-validated` : '',
                    this.sizeClass,
                    this.stacked ? 'btn-group-vertical' : ''
                 ];
            },
            radioClasses() {
                return [
                    (this.custom && !this.buttons) ? 'custom-control-input' : null,
                    this.stateClass
                ];
            },
            labelClasses() {
                return [
                    this.checkboxClass,
                    this.custom ? 'custom-radio' : null
                ];
            },
            computedAriaInvalid() {
                if (this.ariaInvalid === true || this.AriaInvalid === 'true') {
                    return 'true'
                }
                return this.stateClass === 'is-invalid' ? 'true' : null;
            },
            inline() {
                return !this.stacked;
            }
        },
        // TODO:: These will move to radio prop
        methods: {
            // TODO:  Move to form-radio
            btnLabelClasses(option, idx) {
                return [
                    'btn',
                    // Fix staking issue (remove space between buttons)
                    // TODO: Check bootstrap native to see if this is fixed
                    this.stacked ? '' : 'mb-0',
                    // TODO: This should check this.buttonVariant || this.$parent.buttonVariant
                    // Will probably need to nullify the default variant on individual radio
                    // And button mode shopuld oly be settable on parent. maybe child has no variant? 
                    `btn-${this.buttonVariant}`,
                    // TODO: check this.$parent.disabled
                    (option.disabled || this.disabled) ? 'disabled' : '',
                    // TODO:  Need better way to check this... maybe a watcher in the form-radio component
                    // Might be able to look at $el._value for object
                    option.value === this.localValue ? 'active' : null,
                ];
            },
            // TODO: Move to form-radio
            handleFocus(evt) {
                // When in buttons mode, we need to add 'focus' class to label when radio focused
                if (this.buttons && evt.target && evt.target.parentElement) {
                    const label = evt.target.parentElement;
                    if (evt.type ==='focus') {
                        label.classList.add('focus');
                    } else if (evt.type ==='blur') {
                        label.classList.remove('focus');
                    }
                }
            }
        }
    };
</script>
