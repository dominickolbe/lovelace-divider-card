/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, html, TemplateResult, css, CSSResultGroup } from "lit";
import { HomeAssistant, fireEvent, LovelaceCardEditor } from "custom-card-helpers";

import { ScopedRegistryHost } from "@lit-labs/scoped-registry-mixin";
import { DividerCardConfig } from "./types";
import { customElement, property, state } from "lit/decorators";
import { formfieldDefinition } from "../elements/formfield";
import { selectDefinition } from "../elements/select";
import { switchDefinition } from "../elements/switch";
import { textfieldDefinition } from "../elements/textfield";

@customElement("divider-card-editor")
export class DividerCardEditor extends ScopedRegistryHost(LitElement) implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: DividerCardConfig;

  @state() private _helpers?: any;

  private _initialized = false;

  static elementDefinitions = {
    ...textfieldDefinition,
    ...selectDefinition,
    ...switchDefinition,
    ...formfieldDefinition,
  };

  public setConfig(config: DividerCardConfig): void {
    this._config = config;

    this.loadCardHelpers();
  }

  protected shouldUpdate(): boolean {
    if (!this._initialized) {
      this._initialize();
    }

    return true;
  }

  get _divider_color(): string {
    return this._config?.divider_color || "";
  }

  get _divider_opacity(): number | null {
    return this._config?.divider_opacity || null;
  }

  get _divider_padding_horizontal(): number | null {
    return this._config?.divider_padding_horizontal || null;
  }

  get _divider_padding_vertical(): number | null {
    return this._config?.divider_padding_vertical || null;
  }

  get _divider_height(): number | null {
    return this._config?.divider_height || null;
  }

  protected render(): TemplateResult | void {
    if (!this.hass || !this._helpers) {
      return html``;
    }

    return html`
      <div class="container grid grid-3">
        <mwc-textfield
          label="Color"
          .value=${this._divider_color}
          .configValue=${"divider_color"}
          @input=${this._valueChanged}
          placeholder="black"
          helper="var(--primary-text-color)"
        ></mwc-textfield>
        <mwc-textfield
          label="Opacity"
          type="number"
          .value=${this._divider_opacity}
          .configValue=${"divider_opacity"}
          @input=${this._valueChanged}
          min="0"
          max="100"
          helper="15%"
          suffix="%"
        ></mwc-textfield>
        <mwc-textfield
          label="Height"
          type="number"
          .value=${this._divider_height}
          .configValue=${"divider_height"}
          @input=${this._valueChanged}
          min="0"
          max="1000"
          helper="1px"
          suffix="px"
        ></mwc-textfield>
      </div>
      <div class="container grid grid-2">
        <mwc-textfield
          label="Padding Horizontal"
          type="number"
          .value=${this._divider_padding_horizontal}
          .configValue=${"divider_padding_horizontal"}
          @input=${this._valueChanged}
          min="0"
          helper="16px"
          suffix="%"
        ></mwc-textfield>
        <mwc-textfield
          label="Padding Vertical"
          type="number"
          .value=${this._divider_padding_vertical}
          .configValue=${"divider_padding_vertical"}
          @input=${this._valueChanged}
          min="0"
          helper="16px"
          suffix="%"
        ></mwc-textfield>
      </div>
    `;
  }

  private _initialize(): void {
    if (this.hass === undefined) return;
    if (this._config === undefined) return;
    if (this._helpers === undefined) return;
    this._initialized = true;
  }

  private async loadCardHelpers(): Promise<void> {
    this._helpers = await (window as any).loadCardHelpers();
  }

  private _valueChanged(ev): void {
    if (!this._config || !this.hass) {
      return;
    }
    const target = ev.target;
    if (this[`_${target.configValue}`] === target.value) {
      return;
    }
    if (target.configValue) {
      if (target.value === "") {
        const tmpConfig = { ...this._config };
        delete tmpConfig[target.configValue];
        this._config = tmpConfig;
      } else {
        this._config = {
          ...this._config,
          [target.configValue]: target.checked !== undefined ? target.checked : target.value,
        };
      }
    }
    fireEvent(this, "config-changed", { config: this._config });
  }

  static styles: CSSResultGroup = css`
    mwc-select,
    mwc-textfield {
      margin-bottom: 16px;
      display: block;
    }
    mwc-formfield {
      padding-bottom: 8px;
    }
    mwc-switch {
      --mdc-theme-secondary: var(--switch-checked-color);
    }
    .container {
      display: grid;
      gap: 0 8px;
    }

    .grid-2 {
      grid-template-columns: 1fr 1fr;
    }

    .grid-3 {
      grid-template-columns: 1fr 1fr 1fr;
    }

    @media (max-width: 849px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }
  `;
}
