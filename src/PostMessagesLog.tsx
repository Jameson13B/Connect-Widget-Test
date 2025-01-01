import { Collapse, Typography } from 'antd'

const { Title } = Typography

export const PostMessagesLog = (props: PostMessageLogTypes) => {
  const { events } = props

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: 6,
        marginTop: 8,
        height: '40%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Title level={5} style={{ marginTop: 8 }}>
        PostMessages Log
      </Title>
      <Collapse
        items={events}
        style={{
          paddingTop: 6,
          height: '100%',
          overflow: 'auto',
        }}
      />
    </div>
  )
}
