import {
  Typography,
  Layout,
  Form,
  Button,
  Input,
  Divider,
  Select,
  AutoComplete,
  Tooltip,
  Switch,
} from 'antd'
import {
  QuestionCircleOutlined,
  SunOutlined,
  MoonOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'

import { PostMessagesLog } from './PostMessagesLog'

const { Title } = Typography
const { Sider } = Layout
const STYLES = {
  Primary: '#2D64EF',
  Secondary: '#69A1FA',
  TextDark: '#213547',
  TextLight: '#ffffff',
}

export const SidePanel = ({
  events,
  form,
  onFinish,
  widgetState,
  onCloseWidget,
  savedUsers,
  colorScheme,
  setColorScheme,
  memberGuid,
  setMemberGuid,
  microdepositGuid,
  setMicrodepositGuid,
}: SidePanelProps) => {
  const handleAlertInput = (resource: string) => {
    const guid = window.prompt('Enter your ' + resource + ' GUID:')

    if (guid && guid !== '') {
      if (resource === 'member') {
        setMemberGuid(guid)
        setMicrodepositGuid(null)
      } else {
        setMicrodepositGuid(guid)
        setMemberGuid(null)
      }
    }
  }

  return (
    <Sider
      width="33%"
      style={{
        textAlign: 'center',
        padding: 20,
        backgroundColor: STYLES.Secondary,
      }}
    >
      <Title level={4} style={{ margin: '0 0 12px' }}>
        Connect Widget Test
      </Title>
      <Form
        disabled={!!widgetState.url}
        form={form}
        initialValues={{
          mode: 'aggregation',
          environment: 'sand',
          include_transactions: false,
          include_identity: false,
        }}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label={
            <>
              User Guid
              <Tooltip title="Saved users are stored in local storage. When you successfully connect, the user details will be saved on your local machine and can be used for future connections.">
                <QuestionCircleOutlined
                  style={{
                    color: STYLES.TextLight,
                    cursor: 'help',
                    marginLeft: 6,
                  }}
                />
              </Tooltip>
            </>
          }
          name="userGuid"
          style={{ marginBottom: 8 }}
        >
          <AutoComplete
            autoFocus
            options={savedUsers.map((user) => ({
              value: user.userGuid,
              label: user.userGuid,
            }))}
            filterOption={(inputValue, option) =>
              option!.value?.indexOf(inputValue.toUpperCase()) !== -1
            }
            onSelect={(val) => {
              const selectedUser = savedUsers.find(
                (user) => user.userGuid === val
              )

              form.setFieldValue('clientExtGuid', selectedUser?.clientExtGuid)
              form.setFieldValue('apiKey', selectedUser?.apiKey)
              form.setFieldValue('environment', selectedUser?.environment)
              form.setFieldValue('mode', selectedUser?.mode || 'aggregation')
              setColorScheme(selectedUser?.colorScheme)
              if (selectedUser?.includeTransactions) {
                form.setFieldValue(
                  'includeTransactions',
                  selectedUser?.includeTransactions
                )
              }
              if (selectedUser?.includeIdentity) {
                form.setFieldValue(
                  'includeIdentity',
                  selectedUser?.includeIdentity
                )
              }
            }}
          >
            <Input />
          </AutoComplete>
        </Form.Item>
        <Form.Item
          label="Client Ext Guid"
          name="clientExtGuid"
          style={{ marginBottom: 8 }}
        >
          <Input />
        </Form.Item>
        <Form.Item label="API Key" name="apiKey" style={{ marginBottom: 8 }}>
          <Input.Password />
        </Form.Item>
        <Divider style={{ borderColor: STYLES.Primary, margin: '12px 0' }} />

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Form.Item
            label={
              <>
                Environment
                <Tooltip title="Your test user details map to a specific environment. Ensure you are using the correct environment/user details combination.">
                  <QuestionCircleOutlined
                    style={{
                      color: STYLES.TextLight,
                      cursor: 'help',
                      marginLeft: 6,
                    }}
                  />
                </Tooltip>
              </>
            }
            name="environment"
            style={{ width: '48%', marginBottom: 6 }}
          >
            <Select
              options={[
                { value: 'sand', label: 'Sand' },
                { value: 'qa', label: 'QA' },
                { value: 'int', label: 'Int' },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Mode"
            name="mode"
            style={{ marginLeft: '2%', width: '48%', marginBottom: 6 }}
          >
            <Select
              options={[
                { value: 'aggregation', label: 'Agg' },
                { value: 'verification', label: 'Verify' },
              ]}
            />
          </Form.Item>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 6,
            marginBottom: 6,
          }}
        >
          <Form.Item
            label="Color Scheme"
            name="colorScheme"
            style={{ marginBottom: 6, flex: 'none' }}
          >
            <Switch
              disabled={!!widgetState.url}
              checkedChildren={<SunOutlined />}
              unCheckedChildren={<MoonOutlined />}
              checked={colorScheme === 'light'}
              onChange={(checked) => setColorScheme(checked ? 'light' : 'dark')}
              style={{ flex: 'none' }}
            />
          </Form.Item>
          <Form.Item
            label="+ Transactions"
            name="includeTransactions"
            style={{ marginBottom: 6, flex: 'none' }}
          >
            <Switch
              disabled={!!widgetState.url}
              checkedChildren={<CheckCircleOutlined />}
              unCheckedChildren={<CloseCircleOutlined />}
              style={{ flex: 'none' }}
            />
          </Form.Item>
          <Form.Item
            label="+ Identity"
            name="includeIdentity"
            style={{ marginBottom: 6, flex: 'none' }}
          >
            <Switch
              disabled={!!widgetState.url}
              checkedChildren={<CheckCircleOutlined />}
              unCheckedChildren={<CloseCircleOutlined />}
              style={{ flex: 'none' }}
            />
          </Form.Item>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            marginBottom: 12,
          }}
        >
          <Button
            color="default"
            disabled={!!widgetState.url}
            onClick={() =>
              memberGuid ? setMemberGuid(null) : handleAlertInput('member')
            }
            style={{ width: '30%' }}
            variant={memberGuid ? 'dashed' : 'filled'}
          >
            MBR
          </Button>
          <Button
            color="default"
            disabled={!!widgetState.url}
            onClick={() =>
              microdepositGuid
                ? setMicrodepositGuid(null)
                : handleAlertInput('microdeposit')
            }
            style={{ width: '30%' }}
            variant={microdepositGuid ? 'dashed' : 'filled'}
          >
            MIC
          </Button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Form.Item style={{ marginBottom: 12, width: '48%' }}>
            <Button
              block
              disabled={!!widgetState.url}
              htmlType="submit"
              type="primary"
            >
              Connect
            </Button>
          </Form.Item>
          <Form.Item style={{ marginBottom: 12, width: '48%' }}>
            <Button block disabled={!widgetState.url} onClick={onCloseWidget}>
              Close
            </Button>
          </Form.Item>
        </div>
      </Form>

      <PostMessagesLog events={events} />
    </Sider>
  )
}
