import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, screen } from '@testing-library/react-native';
import type { Subject } from '@/domain/subject';

import HomeScreen from '../index';

let mockStoredSubjects: string | null = null;

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(async () => mockStoredSubjects),
    setItem: jest.fn(async (_key: string, value: string) => {
      mockStoredSubjects = value;
    }),
  },
}));

describe('complete materia registration flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStoredSubjects = null;
  });

  it('validates, saves, restores, and rejects a repeated subject', async () => {
    const firstScreen = await render(<HomeScreen />);

    await fireEvent.press(screen.getByRole('button', { name: 'Guardar materia' }));
    expect(await screen.findByText('El nombre de la materia es obligatorio.')).toBeTruthy();
    expect(await screen.findByText('La nota es obligatoria.')).toBeTruthy();
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();

    await fireEvent.changeText(screen.getByPlaceholderText('Ej. Matemáticas'), 'Química');
    await fireEvent.changeText(screen.getByPlaceholderText('0 a 20'), '7,5');
    await fireEvent.press(screen.getByRole('button', { name: 'Guardar materia' }));

    expect(await screen.findByText('Química')).toBeTruthy();
    expect(screen.getByText('Primer bimestre: 7.50 / 20')).toBeTruthy();
    expect(mockStoredSubjects).not.toBeNull();

    if (mockStoredSubjects === null) {
      throw new Error('No se guardó el listado de materias.');
    }
    const persistedSubjects: Subject[] = JSON.parse(mockStoredSubjects);
    expect(persistedSubjects).toHaveLength(1);
    expect(persistedSubjects[0].firstBimesterGrade).toBe(7.5);

    await firstScreen.unmount();
    await render(<HomeScreen />);

    expect(await screen.findByText('Química')).toBeTruthy();
    expect(screen.getByText('Primer bimestre: 7.50 / 20')).toBeTruthy();

    await fireEvent.changeText(screen.getByPlaceholderText('Ej. Matemáticas'), ' química ');
    await fireEvent.changeText(screen.getByPlaceholderText('0 a 20'), '18');
    await fireEvent.press(screen.getByRole('button', { name: 'Guardar materia' }));

    expect(await screen.findByText('La materia ya existe.')).toBeTruthy();
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
    expect(persistedSubjects).toHaveLength(1);
  });
});
