export type Plan = 'free' | 'scan' | 'solo' | 'pro'
export type Severity = 'low' | 'medium' | 'high' | 'critical'

export interface Profile {
  id: string
  email: string
  plan: Plan
  scan_credits: number
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  created_at: string
  updated_at: string
}

export interface Persona {
  id: string
  user_id: string
  name: string
  handles: string[]
  bios: string[]
  timezone_claim: string | null
  payment_handles: string[]
  email_aliases: string[]
  link_hubs: string[]
  posting_patterns: string | null
  notes: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ScanFinding {
  field: string
  severity: Severity
  evidence: string
  fix: string
}

export interface Scan {
  id: string
  user_id: string
  scan_type: 'overlap' | 'prepost' | 'exif'
  persona_ids: string[]
  input_data: Record<string, unknown>
  risk_score: number
  findings: ScanFinding[]
  raw_content: string | null
  created_at: string
}

export interface IncidentCheckItem {
  action: string
  done: boolean
}

export interface Incident {
  id: string
  user_id: string
  persona_id: string | null
  title: string
  notes: string | null
  checklist: IncidentCheckItem[]
  status: 'active' | 'resolved'
  created_at: string
  updated_at: string
}

export const SEVERITY_COLORS: Record<Severity, string> = {
  low:      'text-blue-400 bg-blue-400/10 border-blue-400/20',
  medium:   'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  high:     'text-orange-400 bg-orange-400/10 border-orange-400/20',
  critical: 'text-red-400 bg-red-400/10 border-red-400/20',
}

export const SEVERITY_LABELS: Record<Severity, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
}
