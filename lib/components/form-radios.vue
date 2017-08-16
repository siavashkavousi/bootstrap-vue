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
        <label v-for="(option, idx) in formOptions"
               :class="buttons ? btnLabelClasses(option, idx) : labelClasses"
               :key="`radio_${idx}`"
               // Since we stor full value, we can check the isChecked stte of input
               // Or do we really need this since screen readers wil see a checkbox, not a button
               :aria-pressed="buttons ? (option.value === localValue ? 'true' : 'false') : null"
        >
            <input :id="id ? (id + '__BV_radio_' + idx) : null"
                   :class="radioClasses"
                   ref="inputs"
                   type="radio"
                   autocomplete="off"
                   v-model="localValue"
                   :value="option.value"
                   :name="name"
                   :required="name && required"
                   :disabled="option.disabled || disabled"
                   @focus="handleFocus"
                   @blur="handleFocus"
                   @change="$emit('change', returnObject ? option : option.value)"
            >
            <span v-if="custom && !buttons" class="custom-control-indicator" aria-hidden="true"></span>
            <span :class="(custom && !buttons) ? 'custom-control-description' : null" v-html="option.text"></span>
        </label>
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
