export type ScreenName =
  | 'home'
  | 'camera'
  | 'barcode'
  | 'location'
  | 'sensors'
  | 'biometrics';

export interface ToolItem {
  id: ScreenName;
  title: string;
  subtitle: string;
  category: string;
  iconName: string;
  color: string;
  bgGradient: [string, string];
}
