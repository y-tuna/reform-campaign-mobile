// 공유 헬퍼함수(경로 문자열 규칙 통일)
export function proofPath(userId: string, taskId: string, fileName: string) {
  // Storage 정책과 1:1로 맞춘 경로 규칙
  return `${userId}/${taskId}/${fileName}`;
}
