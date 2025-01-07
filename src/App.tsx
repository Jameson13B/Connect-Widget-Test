/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useReducer, useState } from 'react'
import { Layout, Form } from 'antd'
import { Base64 } from 'js-base64'

import { SidePanel } from './SidePanel'
import { ContentPanel } from './ContentPanel'
// import axios from 'axios'

const getUrl = (environment: string, userGuid: string) => {
  const urlMaps = {
    sand: `https://api.sand.internal.mx/users/${userGuid}/widget_urls`,
    qa: `https://api.qa.internal.mx/users/${userGuid}/widget_urls`,
    int: `https://int-api.mx.com/users/${userGuid}/widget_urls`,
  }
  return urlMaps[environment as keyof typeof urlMaps]
}

function App() {
  const [widgetState, dispatch] = useReducer(widgetReducer, initialState)
  const [events, setEvents] = useState<any[]>([])
  const [savedUsers, setSavedUsers] = useState<any[]>([])
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light')
  const [memberGuid, setMemberGuid] = useState<string | null>(null)
  const [microdepositGuid, setMicrodepositGuid] = useState<string | null>(null)
  const [form] = Form.useForm<FormValues>()

  useEffect(() => {
    if (widgetState.loading && !widgetState.url) {
      const body: WidgetUrlBody = {
        widget_type: 'connect_widget',
        color_scheme: colorScheme,
        mode: form.getFieldValue('mode'),
      }
      if (form.getFieldValue('includeTransactions'))
        body.include_transactions = true
      if (form.getFieldValue('includeIdentity')) body.include_identity = true
      if (memberGuid) body.current_member_guid = memberGuid
      if (microdepositGuid) body.current_microdeposit_guid = microdepositGuid

      fetch('/.netlify/functions/getUrl', {
        method: 'POST',
        body: JSON.stringify({
          url: getUrl(
            form.getFieldValue('environment'),
            form.getFieldValue('userGuid')
          ),
          body,
          token: `Basic ${Base64.encode(
            form.getFieldValue('clientExtGuid') +
              ':' +
              form.getFieldValue('apiKey')
          )}`,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          const savedUsers = JSON.parse(
            localStorage.getItem('savedUsers') || '[]'
          )
          const userExists = savedUsers.findIndex(
            (user: any) => user.userGuid === form.getFieldValue('userGuid')
          )
          const tempUser = {
            userGuid: form.getFieldValue('userGuid'),
            clientExtGuid: form.getFieldValue('clientExtGuid'),
            apiKey: form.getFieldValue('apiKey'),
            environment: form.getFieldValue('environment'),
            mode: form.getFieldValue('mode'),
            includeTransactions: form.getFieldValue('includeTransactions'),
            includeIdentity: form.getFieldValue('includeIdentity'),
            colorScheme,
          }

          if (userExists >= 0) {
            savedUsers[userExists] = tempUser
          } else {
            savedUsers.push(tempUser)
          }
          localStorage.setItem('savedUsers', JSON.stringify(savedUsers))

          dispatch({
            type: 'WIDGET_LOADED',
            payload: response.data.widget_url.url,
          })
        })
        .catch((error: any) => {
          dispatch({
            type: 'WIDGET_ERROR',
            payload: error.code + ': ' + error.message,
          })
        })
    }
  }, [
    widgetState.loading,
    widgetState.url,
    form,
    colorScheme,
    memberGuid,
    microdepositGuid,
  ])

  useEffect(() => {
    const savedUsers = localStorage.getItem('savedUsers')
    if (savedUsers) {
      setSavedUsers(JSON.parse(savedUsers))
    }
  }, [widgetState.url])

  const onFinish = (values: FormValues) => {
    const { userGuid, clientExtGuid, apiKey, mode, environment } = values
    return !userGuid || !clientExtGuid || !apiKey || !mode || !environment
      ? alert('Please fill out all fields')
      : dispatch({ type: 'LOAD_WIDGET', payload: values })
  }
  const onCloseWidget = () => {
    dispatch({ type: 'CLOSE_WIDGET' })
    setColorScheme('light')
    setMemberGuid(null)
    setEvents([])
    form.resetFields()
  }

  return (
    <Layout style={{ borderRadius: '16px', height: '100%' }}>
      <SidePanel
        events={events}
        form={form}
        onFinish={onFinish}
        onCloseWidget={onCloseWidget}
        savedUsers={savedUsers}
        widgetState={widgetState}
        colorScheme={colorScheme}
        setColorScheme={setColorScheme}
        memberGuid={memberGuid}
        setMemberGuid={setMemberGuid}
        microdepositGuid={microdepositGuid}
        setMicrodepositGuid={setMicrodepositGuid}
      />
      <ContentPanel setEvents={setEvents} widgetState={widgetState} />
    </Layout>
  )
}

export default App

const initialState: WidgetState = {
  loading: false,
  error: null,
  url: null,
}

const widgetReducer = (state: WidgetState, action: WidgetAction) => {
  switch (action.type) {
    case 'LOAD_WIDGET':
      return { ...state, loading: true }
    case 'WIDGET_LOADED':
      return { ...state, loading: false, url: action.payload, error: null }
    case 'WIDGET_ERROR':
      return { ...state, loading: false, error: action.payload }
    case 'CLOSE_WIDGET':
      return initialState
    default:
      return state
  }
}
