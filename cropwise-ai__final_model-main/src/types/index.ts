export type LayerType = 
  | 'Moisture Stress (WSI)'
  | 'Crop Types'
  | 'Crop Health (NDVI)'
  | 'Water Deficit (mm)'
  | 'Irrigation Amount (mm)'
  | 'Irrigation Advisory';

export type SeasonType = 
  | 'Kharif 2023 (Oct-Dec)'
  | 'Rabi 2023 (Jan-Mar)'
  | 'Custom Range';

export interface LegendItem {
  color: string;
  value: string;
  label: string;
}

export interface DataSource {
  badge: string;
  badgeColor: 'green' | 'orange' | 'blue' | 'red';
  name: string;
  description: string;
}

export interface AdvisoryLevel {
  level: number;
  icon: string;
  title: string;
  description: string;
  className: string;
}

export interface FooterCard {
  icon: string;
  label: string;
  name: string;
  description: string;
}
