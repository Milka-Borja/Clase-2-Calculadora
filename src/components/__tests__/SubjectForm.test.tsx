import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { SubjectForm, type SubjectFormSaveResult } from '../SubjectForm';

const createOnSave = () =>
  jest.fn<Promise<SubjectFormSaveResult>, []>().mockResolvedValue({ ok: true });

describe('SubjectForm', () => {
  it('shows field-specific errors and does not submit an empty form', async () => {
    const onSave = createOnSave();
    const screen = await render(<SubjectForm onSave={onSave} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Guardar materia' }));

    expect(screen.getByText('El nombre de la materia es obligatorio.')).toBeTruthy();
    expect(screen.getByText('La nota es obligatoria.')).toBeTruthy();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('rejects an invalid grade and keeps the entered values', async () => {
    const onSave = createOnSave();
    const screen = await render(<SubjectForm onSave={onSave} />);

    await fireEvent.changeText(screen.getByPlaceholderText('Ej. Matemáticas'), 'Física');
    await fireEvent.changeText(screen.getByPlaceholderText('0 a 20'), '21');
    await fireEvent.press(screen.getByRole('button', { name: 'Guardar materia' }));

    expect(screen.getByText('La nota debe estar entre 0 y 20.')).toBeTruthy();
    expect(screen.getByPlaceholderText('Ej. Matemáticas').props.value).toBe('Física');
    expect(onSave).not.toHaveBeenCalled();
  });

  it('submits a valid draft with a comma decimal', async () => {
    const onSave = createOnSave();
    const screen = await render(<SubjectForm onSave={onSave} />);

    await fireEvent.changeText(screen.getByPlaceholderText('Ej. Matemáticas'), 'Química');
    await fireEvent.changeText(screen.getByPlaceholderText('0 a 20'), '7,5');
    await fireEvent.press(screen.getByRole('button', { name: 'Guardar materia' }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({ name: 'Química', grade: '7,5' });
    });
  });
});
