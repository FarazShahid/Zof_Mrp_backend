import { SizeMeasurement } from "src/size-measurements/entities/size-measurement.entity";


type Section = 'top' | 'bottom' | 'logoTop' | 'logoBottom' | 'hat' | 'bag' | 'cap';

const FIELD_MAP: { key: keyof SizeMeasurement; label: string; section: Section }[] = [
  // Top unit
  { key: 'FrontLengthHPS', label: 'Front Length (HPS)', section: 'top' },
  { key: 'BackLengthHPS', label: 'Back Length (HPS)', section: 'top' },
  { key: 'AcrossShoulders', label: 'Across Shoulders', section: 'top' },
  { key: 'ArmHole', label: 'Arm Hole', section: 'top' },
  { key: 'UpperChest', label: 'Upper Chest', section: 'top' },
  { key: 'LowerChest', label: 'Lower Chest', section: 'top' },
  { key: 'Waist', label: 'Waist', section: 'top' },
  { key: 'BottomWidth', label: 'Bottom Width', section: 'top' },
  { key: 'SleeveLength', label: 'Sleeve Length', section: 'top' },
  { key: 'SleeveOpening', label: 'Sleeve Opening', section: 'top' },
  { key: 'NeckSize', label: 'Neck Size', section: 'top' },
  { key: 'CollarHeight', label: 'Collar Height', section: 'top' },
  { key: 'CollarPointHeight', label: 'Collar Point Height', section: 'top' },
  { key: 'StandHeightBack', label: 'Stand Height Back', section: 'top' },
  { key: 'CollarStandLength', label: 'Collar Stand Length', section: 'top' },
  { key: 'SideVentFront', label: 'Side Vent Front', section: 'top' },
  { key: 'SideVentBack', label: 'Side Vent Back', section: 'top' },
  { key: 'PlacketLength', label: 'Placket Length', section: 'top' },
  { key: 'TwoButtonDistance', label: 'Two Button Distance', section: 'top' },
  { key: 'PlacketWidth', label: 'Placket Width', section: 'top' },
  { key: 'BackNeckDrop', label: 'Back Neck Drop', section: 'top' },
  { key: 'FrontNeckDrop', label: 'Front Neck Drop', section: 'top' },
  { key: 'ShoulderSeam', label: 'Shoulder Seam', section: 'top' },
  { key: 'ShoulderSlope', label: 'Shoulder Slope', section: 'top' },
  { key: 'Hem', label: 'Hem', section: 'top' },
  { key: 'Neckwidth', label: 'Neck Width', section: 'top' },
  { key: 'CollarOpening', label: 'Collar Opening', section: 'top' },
  { key: 'ArmHoleStraight', label: 'Arm Hole Straight', section: 'top' },
  { key: 'BottomRib', label: 'Bottom Rib', section: 'top' },
  { key: 'CuffHeight', label: 'Cuff Height', section: 'top' },
  { key: 'ColllarHeightCenterBack', label: 'Collar Height Center Back', section: 'top' },

  // Bottom unit
  { key: 'BottomHem', label: 'Bottom Hem', section: 'bottom' },
  { key: 'Inseam', label: 'Inseam', section: 'bottom' },
  { key: 'Hip', label: 'Hip', section: 'bottom' },
  { key: 'FrontRise', label: 'Front Rise', section: 'bottom' },
  { key: 'LegOpening', label: 'Leg Opening', section: 'bottom' },
  { key: 'KneeWidth', label: 'Knee Width', section: 'bottom' },
  { key: 'Outseam', label: 'Outseam', section: 'bottom' },
  { key: 'bFrontRise', label: 'bFront Rise', section: 'bottom' },
  { key: 'WasitStretch', label: 'Waist Stretch', section: 'bottom' },
  { key: 'WasitRelax', label: 'Waist Relax', section: 'bottom' },
  { key: 'Thigh', label: 'Thigh', section: 'bottom' },
  { key: 'BackRise', label: 'Back Rise', section: 'bottom' },
  { key: 'TotalLength', label: 'Total Length', section: 'bottom' },
  { key: 'WBHeight', label: 'WB Height', section: 'bottom' },
  { key: 'bBottomWidth', label: 'bBottom Width', section: 'bottom' },
  { key: 'BottomOriginal', label: 'Bottom Original', section: 'bottom' },
  { key: 'BottomElastic', label: 'Bottom Elastic', section: 'bottom' },
  { key: 'BottomCuffZipped', label: 'Bottom Cuff Zipped', section: 'bottom' },
  { key: 'BottomStraightZipped', label: 'Bottom Straight Zipped', section: 'bottom' },
  { key: 'HemBottom', label: 'Hem Bottom', section: 'bottom' },

  // Logo placements (top)
  { key: 't_TopRight', label: 'Top Right', section: 'logoTop' },
  { key: 't_TopLeft', label: 'Top Left', section: 'logoTop' },
  { key: 't_BottomRight', label: 'Bottom Right', section: 'logoTop' },
  { key: 't_BottomLeft', label: 'Bottom Left', section: 'logoTop' },
  { key: 't_Center', label: 'Center', section: 'logoTop' },
  { key: 't_Back', label: 'Back', section: 'logoTop' },
  { key: 't_left_sleeve', label: 'Left Sleeve', section: 'logoTop' },
  { key: 't_right_sleeve', label: 'Right Sleeve', section: 'logoTop' },

  // Logo placements (bottom)
  { key: 'b_TopRight', label: 'Top Right', section: 'logoBottom' },
  { key: 'b_TopLeft', label: 'Top Left', section: 'logoBottom' },
  { key: 'b_BottomRight', label: 'Bottom Right', section: 'logoBottom' },
  { key: 'b_BottomLeft', label: 'Bottom Left', section: 'logoBottom' },

  // Hat / Cap
  { key: 'H_VisorLength', label: 'Visor Length', section: 'hat' },
  { key: 'H_VisorWidth', label: 'Visor Width', section: 'hat' },
  { key: 'H_CrownCircumference', label: 'Crown Circumference', section: 'hat' },
  { key: 'H_FrontSeamLength', label: 'Front Seam Length', section: 'hat' },
  { key: 'H_BackSeamLength', label: 'Back Seam Length', section: 'hat' },
  { key: 'H_RightCenterSeamLength', label: 'Right Center Seam Length', section: 'hat' },
  { key: 'H_LeftCenterSeamLength', label: 'Left Center Seam Length', section: 'hat' },
  { key: 'H_ClosureHeightIncludingStrapWidth', label: 'Closure Height + Strap Width', section: 'hat' },
  { key: 'H_StrapWidth', label: 'Strap Width', section: 'hat' },
  { key: 'H_StrapbackLength', label: 'Strapback Length', section: 'hat' },
  { key: 'H_SweatBandWidth', label: 'Sweat Band Width', section: 'hat' },
  { key: 'H_FusionInside', label: 'Fusion Inside', section: 'hat' },
  { key: 'H_PatchSize', label: 'Patch Size', section: 'hat' },
  { key: 'H_PatchPlacement', label: 'Patch Placement', section: 'hat' },

  // Bag

  { key: 'Bag_Height', label: 'Bag Height', section: 'bag' },
  { key: 'Bag_Length', label: 'Bag Length', section: 'bag' },
  { key: 'Bag_Depth', label: 'Bag Depth', section: 'bag' },
  { key: 'Bag_HandleGrip', label: 'Bag Handle Grip', section: 'bag' },
  { key: 'Bag_ShoulderStrap_Full_Length', label: 'Bag Shoulder Strap Full Length', section: 'bag' },
  { key: 'Bag_FrontPocketLength', label: 'Bag Front Pocket Length', section: 'bag' },
  { key: 'Bag_FrontPocketHeight', label: 'Bag Front Pocket Height', section: 'bag' },
  { key: 'Bag_SidePocketLength', label: 'Bag Side Pocket Length', section: 'bag' },
  { key: 'Bag_SidePocketHeight', label: 'Bag Side Pocket Height', section: 'bag' },


  // Cap

  { key: 'Cap_CrownCircumference', label: 'Cap Crown Circumference', section: 'cap' },
  { key: 'Cap_BrimLength', label: 'Cap Brim Length', section: 'cap' },
  { key: 'Cap_BrimWidth', label: 'Cap Brim Width', section: 'cap' },
  { key: 'Cap_Height', label: 'Cap Height', section: 'cap' },
  { key: 'Cap_Crown_Width', label: 'Cap Crown Width', section: 'cap' },
  { key: 'cap_cuff_height', label: 'Cap Cuff Height', section: 'cap' },
];

export function buildMeasurements(sm: SizeMeasurement) {
  const result: Record<Section, { label: string; value: string | number; unit: string }[]> = {
    top: [],
    bottom: [],
    logoTop: [],
    logoBottom: [],
    hat: [],
    bag: [],
    cap: []
  };

  for (const field of FIELD_MAP) {
    const value = sm[field.key];
    if (value !== null && value !== undefined && value !== '' && value !== '0.00' && !Number.isNaN(value)) {
      result[field.section].push({ label: field.label, value, unit: '' });
    }
  }

  return result;
}


export function mapStatusToChip(status?: string) {
  if (!status) return 'chip-warn';
  const s = status.toLowerCase();
  if (s.includes('cancel') || s.includes('hold') || s.includes('overdue')) return 'chip-bad';
  if (s.includes('complete') || s.includes('delivered')) return 'chip-ok';
  return 'chip-warn';
}

export function formatDate(d?: Date) {
  return d ? new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(d)) : '';
}

export function resolveSizeName(sizeOptionId?: number) {
  // plug in your lookup; for now, just return the id
  return sizeOptionId ?? '';
}

export function buildChartSrc(item: unknown): string | undefined {
  // Optional: return a data URL or hosted image URL to replace the placeholder.
  return undefined;
}
