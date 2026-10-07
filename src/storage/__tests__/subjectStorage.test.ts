import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  loadSubjects,
  saveSubjects,
  SUBJECTS_STORAGE_KEY,
} from '../subjectStorage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

const subjects = [
  { id: 'math-1', name: 'Matemáticas', firstBimesterGrade: 18.5 },
  { id: 'history-1', name: 'Historia', firstBimesterGrade: 14 },
];

describe('subject storage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns an empty list when there are no saved subjects', async () => {
    jest.mocked(AsyncStorage.getItem).mockResolvedValue(null);

    await expect(loadSubjects()).resolves.toEqual([]);
  });

  it('loads all previously saved subjects', async () => {
    jest.mocked(AsyncStorage.getItem).mockResolvedValue(JSON.stringify(subjects));

    await expect(loadSubjects()).resolves.toEqual(subjects);
  });

  it('saves all subjects using the shared storage key', async () => {
    jest.mocked(AsyncStorage.setItem).mockResolvedValue();

    await saveSubjects(subjects);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      SUBJECTS_STORAGE_KEY,
      JSON.stringify(subjects),
    );
  });
});
