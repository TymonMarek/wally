type PluginConfigValue =
  | string
  | number
  | boolean
  | null
  | PluginConfigValue[]
  | { [key: string]: PluginConfigValue };

export interface PluginConfig {
  [key: string]: PluginConfigValue;
}
