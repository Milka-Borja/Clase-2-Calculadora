import { fireEvent, render, screen } from '@testing-library/react-native';
import { loadSubjects, saveSubjects } from '@/storage/subjectStorage';
import type { Subject } from '@/domain/subject';

import HomeScreen from '../index';

jest.mock('@/storage/subjectStorage', () => ({
  loadSubjects: jest.fn(),
  saveSubjects: jest.fn(),
}));

const savedSubjects: Subject[] = [
  { id: 'history-1', name: 'Historia', firstBimesterGrade: 12.5 },
];

describe('materia registration screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(loadSubjects).mockResolvedValue(savedSubjects);
    jest.mocked(saveSubjects).mockResolvedValue();
  });

  it('does not save or list a subject whose name already exists ignoring case and edge spaces', async () => {
    await render(<HomeScreen />);

    await fireEvent.changeText(screen.getByPlaceholderText('Ej. Matemáticas'), '  historia ');
    await fireEvent.changeText(screen.getByPlaceholderText('0 a 20'), '15');
    await fireEvent.press(screen.getByRole('button', { name: 'Guardar materia' }));

    expect(await screen.findByText('La materia ya existe.')).toBeTruthy();
    expect(screen.getByText('Materias registradas')).toBeTruthy();
    expect(screen.getByText('1')).toBeTruthy();
    expect(screen.getByText('Historia')).toBeTruthy();
    expect(saveSubjects).not.toHaveBeenCalled();
  });

  it('persists and displays a valid new subject', async () => {
    await render(<HomeScreen />);

    await fireEvent.changeText(screen.getByPlaceholderText('Ej. Matemáticas'), 'Química');
    await fireEvent.changeText(screen.getByPlaceholderText('0 a 20'), '7,5');
    await fireEvent.press(screen.getByRole('button', { name: 'Guardar materia' }));

    expect(await screen.findByText('Química')).toBeTruthy();
    expect(saveSubjects).toHaveBeenCalledWith([
      ...savedSubjects,
      expect.objectContaining({ name: 'Química', firstBimesterGrade: 7.5 }),
    ]);
  });

  it('blocks a repeated registration immediately after adding the first copy', async () => {
    jest.mocked(loadSubjects).mockResolvedValue([]);
    await render(<HomeScreen />);

    await fireEvent.changeText(screen.getByPlaceholderText('Ej. Matemáticas'), 'Historia');
    await fireEvent.changeText(screen.getByPlaceholderText('0 a 20'), '12,5');
    await fireEvent.press(screen.getByRole('button', { name: 'Guardar materia' }));
    expect(await screen.findByText('Historia')).toBeTruthy();

    await fireEvent.changeText(screen.getByPlaceholderText('Ej. Matemáticas'), ' historia ');
    await fireEvent.changeText(screen.getByPlaceholderText('0 a 20'), '15');
    await fireEvent.press(screen.getByRole('button', { name: 'Guardar materia' }));

    expect(await screen.findByText('La materia ya existe.')).toBeTruthy();
    expect(screen.getByText('1')).toBeTruthy();
    expect(saveSubjects).toHaveBeenCalledTimes(1);
  });
});
