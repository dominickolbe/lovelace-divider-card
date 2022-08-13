import { LovelaceCard, LovelaceCardConfig, LovelaceCardEditor } from "custom-card-helpers";

declare global {
  interface HTMLElementTagNameMap {
    "divider-card-editor": LovelaceCardEditor;
    "hui-error-card": LovelaceCard;
  }
}

export interface DividerCardConfig extends LovelaceCardConfig {
  type: string;
  divider_color?: string;
  divider_opacity?: number;
  divider_height?: number;
  divider_padding_horizontal?: number;
  divider_padding_vertical?: number;
}
