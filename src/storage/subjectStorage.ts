import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Subject } from '@/domain/subject';

export const SUBJECTS_STORAGE_KEY = 'subjects:subject-list';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isSubject(value: unknown): value is Subject {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.firstBimesterGrade === 'number' &&
    Number.isFinite(value.firstBimesterGrade)
  );
}

export async function loadSubjects(): Promise<Subject[]> {
  const serialized = await AsyncStorage.getItem(SUBJECTS_STORAGE_KEY);
  if (serialized === null) {
    return [];
  }

  const parsed: unknown = JSON.parse(serialized);
  if (!Array.isArray(parsed) || !parsed.every(isSubject)) {
    throw new Error('Los datos guardados de materias no tienen un formato válido.');
  }

  return parsed;
}

export async function saveSubjects(subjects: Subject[]): Promise<void> {
  await AsyncStorage.setItem(SUBJECTS_STORAGE_KEY, JSON.stringify(subjects));
}
