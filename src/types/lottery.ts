export interface LotteryResult {
  id: number
  draw_date: string
  num6: string | null
  num5: string | null
  num4: string | null
  num3_top: string | null
  num2_top: string | null
  num2_bottom: string | null
  animal_name_th: string | null
  animal_name_lo: string | null
  youtube_embed_url: string | null
  created_at: string
}

export interface StatisticsCache {
  id: number
  stat_type: string
  stat_data: Record<string, unknown>
  updated_at: string
}

export interface UserNumber {
  id: number
  session_id: string
  numbers: string
  draw_date: string
  created_at: string
}
