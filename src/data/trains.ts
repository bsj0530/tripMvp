import type { Train, Bus } from '../types'

export const mockTrains: Train[] = [
  { id: 'T001', time: '13:20', type: '무궁화', destination: '서울 (청량리)', duration: '3시간 10분' },
  { id: 'T002', time: '15:35', type: '무궁화', destination: '서울 (청량리)', duration: '3시간 10분' },
  { id: 'T003', time: '17:50', type: '무궁화', destination: '서울 (청량리)', duration: '3시간 10분' },
  { id: 'T004', time: '19:10', type: '무궁화', destination: '동대구', duration: '1시간 30분' },
  { id: 'T005', time: '20:40', type: '무궁화', destination: '부산', duration: '4시간 20분' },
]

export const mockBuses: Bus[] = [
  { id: 'B001', time: '09:30', destination: '서울 (동서울)', duration: '3시간', company: '경북고속' },
  { id: 'B002', time: '11:00', destination: '대구 (동대구)', duration: '1시간 40분', company: '경북고속' },
  { id: 'B003', time: '13:30', destination: '서울 (동서울)', duration: '3시간', company: '경북고속' },
  { id: 'B004', time: '15:00', destination: '부산', duration: '3시간 30분', company: '경북고속' },
  { id: 'B005', time: '17:00', destination: '서울 (동서울)', duration: '3시간', company: '경북고속' },
]

// 향후 API 연결 시:
// export async function fetchTrains(date: string): Promise<Train[]> {
//   const res = await fetch(`/api/trains?station=영주&date=${date}`)
//   return res.json()
// }
//
// export async function fetchBuses(date: string): Promise<Bus[]> {
//   const res = await fetch(`/api/buses?terminal=영주&date=${date}`)
//   return res.json()
// }
