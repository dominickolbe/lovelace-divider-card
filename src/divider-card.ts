/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, html, TemplateResult, css, PropertyValues, CSSResultGroup } from "lit";
import { customElement, property, state } from "lit/decorators";
import { HomeAssistant, hasConfigOrEntityChanged, LovelaceCardEditor } from "custom-card-helpers";
import { styleMap } from "lit/directives/style-map.js";

import type { DividerCardConfig } from "./types";

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: "divider-card",
  name: "Divider Card",
  description: "Add a customizable divider card",
  preview: true,
});
@customElement("divider-card")
export class BoilerplateCard extends LitElement {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("./editor");
    return document.createElement("divider-card-editor");
  }

  public static getStubConfig(): Record<string, unknown> {
    return {};
  }

  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private config!: DividerCardConfig;

  public setConfig(config: DividerCardConfig): void {
    if (!config) {
      throw new Error("common.invalid_configuration");
    }

    this.config = {
      ...config,
    };
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this.config) {
      return false;
    }

    return hasConfigOrEntityChanged(this, changedProps, false);
  }

  protected render(): TemplateResult | void {
    const dividerStyles = {
      ...(this.config.divider_opacity && {
        opacity: `${this.config.divider_opacity / 100}`,
      }),
      ...(this.config.divider_color && {
        "background-color": this.config.divider_color,
      }),
      ...(this.config.divider_height && {
        height: `${this.config.divider_height}px`,
      }),
    };

    const contentStyles = {
      ...(this.config.divider_padding_horizontal && {
        "padding-inline": `${this.config.divider_padding_horizontal}px`,
      }),
      ...(this.config.divider_padding_vertical && {
        "padding-block": `${this.config.divider_padding_vertical}px`,
      }),
    };

    return html`
      <ha-card>
        <div class="card-content" style=${styleMap(contentStyles)}>
          <div class="divider" style=${styleMap(dividerStyles)} />
        </div>
      </ha-card>
    `;
  }

  static get styles(): CSSResultGroup {
    return css`
      :host {
        --ha-card-background: none;
        --ha-card-box-shadow: none;
      }
      .divider {
        height: var(--divider-card-height, 1px);
        background-color: var(--primary-text-color);
        opacity: var(--divider-card-opacity, 0.15);
        width: 100%;
      }
    `;
  }
}
