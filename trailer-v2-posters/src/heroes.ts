export type Grade = 'rare' | 'epic' | 'legendary'

/** Card art in public/heroes/<id>.webp — the same hero cards the AAV site uses. */
export const HEROES: { id: string; grade: Grade }[] = [
  { id: 'zoe', grade: 'legendary' },
  { id: 'amadeus', grade: 'legendary' },
  { id: 'helga', grade: 'legendary' },
  { id: 'eric', grade: 'legendary' },
  { id: 'petra', grade: 'legendary' },
  { id: 'jabel', grade: 'legendary' },
  { id: 'hilde', grade: 'legendary' },
  { id: 'marlin', grade: 'legendary' },
  { id: 'saul', grade: 'legendary' },
  { id: 'jaeger', grade: 'legendary' },
  { id: 'howard', grade: 'epic' },
  { id: 'chenko', grade: 'epic' },
  { id: 'gordon', grade: 'epic' },
  { id: 'fahd', grade: 'epic' },
  { id: 'diana', grade: 'epic' },
  { id: 'quinn', grade: 'epic' },
  { id: 'yeonwoo', grade: 'epic' },
  { id: 'amane', grade: 'epic' },
  { id: 'seth', grade: 'rare' },
  { id: 'forrest', grade: 'rare' },
  { id: 'edwin', grade: 'rare' },
  { id: 'olive', grade: 'rare' },
]

export const byGrade = (g: Grade) => HEROES.filter((h) => h.grade === g).map((h) => h.id)
