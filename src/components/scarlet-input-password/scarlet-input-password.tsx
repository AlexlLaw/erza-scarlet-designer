import { EventEmitter, Prop, Event, Element, Listen, Watch, Component, h } from "@stencil/core";

@Component({
  tag: 'scarlet-input-password',
  styleUrl: '../scarlet-input-base/scarlet-input-base.scss',
  shadow: false,
})
export class ScarletInputPassword {
  @Prop({ mutable: true }) public required?: boolean = false;
  @Prop({ mutable: true }) public readonly?: boolean = false;
  @Prop({ mutable: true }) public disabled?: boolean = false;
  @Prop({ mutable: true}) public checked: boolean = true;
  @Prop({ mutable: true }) public value?: string;

  @Prop() public errormessage?: string;
  @Prop() public helpermessage?: string;
  @Prop() public name: string;
  @Prop() public label?: string;
  @Prop() public idprop?: string;

  @Event() public chechekChangeTo!: EventEmitter<boolean>;
  @Element() public element: HTMLElement;

  @Listen('click')
  public handleChange(event?: UIEvent): void {
    if ((event.target as HTMLElement).localName == ('svg')) {
      this.checked = !this.checked;
    }
  }

  @Listen('changed')
  public eventEmit(event: CustomEvent): void {
    this.value = (event.detail.target as HTMLInputElement).value;
  }

  @Watch('checked')
  public checkedChanged(): void {
    this.chechekChangeTo.emit(this.checked);
  }

  render() {
    return (
      <div class={{
        ['scarlet-input']: true,
        ['-password']: this.checked,
        ['-disabled']: this.disabled,
        ['-readonly']: this.readonly,
        ['-invalid']: !!this.errormessage && !this.disabled,
      }}>

      <scarlet-input
        iconFilename={this.checked ? 'eyeSlash' : 'eye'}
        iconDescription={'icon de view password'}
        errormessage={this.errormessage}
        helpermessage={this.helpermessage}
        maxlength={18}
        required={this.required}
        readonly={this.readonly}
        disabled={this.disabled}
        label={this.label}
        value={this.value}
        name={this.name}
        idprop={this.idprop}
        type={'tel'}
      >
      </scarlet-input>
      </div>
    )
  }
}
