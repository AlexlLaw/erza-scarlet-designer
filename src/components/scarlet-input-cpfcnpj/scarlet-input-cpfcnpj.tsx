import { Component, h, Listen, Prop } from '@stencil/core';

@Component({
  tag: 'scarlet-input-cpfcnpj',
  styleUrl: '../scarlet-input-base/scarlet-input-base.scss',
  shadow: true,
})
export class ScarletInputCpfCnpj {
  @Prop({ mutable: true }) required?: boolean = false;
  @Prop({ mutable: true }) readonly?: boolean = false;
  @Prop({ mutable: true }) disabled?: boolean = false;
  @Prop({ mutable: true }) value?: string;

  @Prop() errormessage?: string;
  @Prop() helpermessage?: string;
  @Prop() name: string;
  @Prop() label?: string;
  @Prop() idprop?: string;

  @Listen('changed')
  eventEmit(event: CustomEvent): void {
    this.value = (event.detail.target as HTMLInputElement).value
  }

  render() {
    return (
      <scarlet-input
      errormessage={this.errormessage}
      helpermessage={this.helpermessage}
      maxlength={18}
      required={this.required}
      readonly={this.readonly}
      disabled={this.disabled}
      label={this.label}
      mask="CPFCNPJ"
      value={this.value}
      name={this.name}
      idprop={this.idprop}
      type="text"
      >

      </scarlet-input>
    )
  }
}
