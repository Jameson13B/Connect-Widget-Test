interface FormValues {
  userGuid: string
  clientExtGuid: string
  apiKey: string
  mode: string
  environment: string
  includeTransactions: boolean
  includeIdentity: boolean
}

interface SidePanelProps {
  events: object[]
  form: FormInstance
  onFinish: (values: FormValues) => void
  onCloseWidget: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  savedUsers: any[]
  widgetState: WidgetState
  colorScheme: string
  setColorScheme: (colorScheme: 'light' | 'dark') => void
  memberGuid: string | null
  setMemberGuid: (memberGuid: string | null) => void
  microdepositGuid: string | null
  setMicrodepositGuid: (microdepositGuid: string | null) => void
}

interface ContentPanelProps {
  setEvents: (events) => void
  widgetState: WidgetState
}

interface WidgetState {
  loading: boolean
  error: string | null
  url: string | null
}

interface PostMessageLogTypes {
  events: object[]
}

interface WidgetUrlBody {
  widget_type: string
  color_scheme: 'light' | 'dark'
  include_transactions?: boolean
  include_identity?: boolean
  current_member_guid?: string
  current_microdeposit_guid?: string
  mode?: string
}

type WidgetAction =
  | { type: 'LOAD_WIDGET'; payload: FormValues }
  | { type: 'WIDGET_LOADED'; payload: string }
  | { type: 'WIDGET_ERROR'; payload: string }
  | { type: 'CLOSE_WIDGET' }
