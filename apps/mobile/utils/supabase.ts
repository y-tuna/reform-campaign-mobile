
import 'react-native-url-polyfill/auto'
import 'react-native-get-random-values'

/* async-storage는 네이티브 모듈이라, “순정 Expo Go”에서는 동작하지 않아요(커스텀 Dev Client 필요)
그래서 지금 당장 Expo Go로 QR 테스트를 계속하려면, AsyncStorage 의존을 잠시 빼고 메모리 세션으로 돌리는 게 제일 빨라요. 이후에 EAS Dev Client 빌드부터 넣으면 됨.

import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient, processLock } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_KEY!,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      lock: processLock,
    },
  })
*/

// 일단 아래 메모리 세션으로 돌리는 용 코드.
// 이 상태면 “앱 재로드 시 로그인 유지”는 안 되지만, QR로 띄워서 리스트 불러오기 같은 데모는 문제없이 됩니다.
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      // Expo Go에서는 AsyncStorage(네이티브)가 없으니 메모리 세션로 우선 동작
      persistSession: false,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  }
)
// 나중에 async-storage 사용 시 이 부분 지우고 윗 주석화된 코드 쓰면 됨

