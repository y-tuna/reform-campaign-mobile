import 'react-native-url-polyfill/auto'
import 'react-native-get-random-values'

import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import { useEffect, useState } from 'react'

// ✅ supabase 클라이언트 불러오기 (경로는 utils에 만든 파일 기준)
import { supabase } from './utils/supabase'

export default function App() {
  const [tasks, setTasks] = useState<any[]>([])

  useEffect(() => {
    async function loadTasks() {
      const { data, error } = await supabase.from('tasks').select('*').limit(5)
      if (error) {
        console.error(error)
      } else {
        setTasks(data)
      }
    }
    loadTasks()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Supabase 연결 테스트</Text>
      {tasks.map((t) => (
        <Text key={t.id}>
          {t.title} ({t.done ? '완료' : '진행중'})
        </Text>
      ))}
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
})
