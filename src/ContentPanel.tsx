import { useEffect, useRef } from 'react'
import * as widgetSdk from '@mxenabled/web-widget-sdk'
import { Layout, Typography } from 'antd'

const { Content } = Layout
const { Title, Paragraph } = Typography
const STYLES = {
  Primary: '#2D64EF',
  Secondary: '#69A1FA',
  TextDark: '#213547',
  TextLight: '#ffffff',
}

export const ContentPanel = (props: ContentPanelProps) => {
  const { setEvents, widgetState } = props
  const widgetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!widgetState?.url) return

    const widget = new widgetSdk.ConnectWidget({
      container: widgetRef.current,
      url: widgetState.url,
      style: { height: '750px', width: '390px', maxHeight: '100%' },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onMessage: (event: { data: { type: string; metadata: any } }) => {
        const { type, metadata } = event.data

        const newEvent = {
          label: <strong>{type}</strong>,
          children: (
            <div>
              {Object.keys(metadata).map((key) => (
                <p key={key}>
                  <strong>{key}</strong>: <em>{metadata[key]}</em>
                </p>
              ))}
            </div>
          ),
        }

        setEvents((events: object[]) => [newEvent, ...events])
      },
    })

    return () => widget.unmount()
  }, [widgetState.url, setEvents])

  return (
    <Content
      style={{
        padding: 20,
        backgroundColor: STYLES.Primary,
      }}
    >
      <Title level={4} style={{ color: STYLES.TextLight, marginTop: 0 }}>
        {props.widgetState.url
          ? 'Enjoy your customized Connect Widget ↓'
          : '← Load widget using form'}
      </Title>
      {props.widgetState.loading && <Paragraph>Loading...</Paragraph>}
      {props.widgetState.error && (
        <Paragraph>{props.widgetState.error}</Paragraph>
      )}
      <div
        ref={widgetRef}
        style={{
          margin: '20px 0',
          display: 'flex',
          justifyContent: 'center',
        }}
      />
    </Content>
  )
}
