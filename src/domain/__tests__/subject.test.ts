import {
  addSubject,
  isDuplicateSubject,
  normalizeSubjectName,
  parseFirstBimesterGrade,
  validateSubjectInput,
  type Subject,
} from '../subject';

describe('normalizeSubjectName', () => {
  it('trims surrounding whitespace and ignores letter case for comparison', () => {
    expect(normalizeSubjectName('  Matemáticas ')).toBe('matemáticas');
    expect(normalizeSubjectName('Historia')).toBe(normalizeSubjectName('historia'));
  });

  it('returns an empty string for a name containing only whitespace', () => {
    expect(normalizeSubjectName('   ')).toBe('');
  });
});

describe('parseFirstBimesterGrade', () => {
  it.each([
    ['0', 0],
    ['20', 20],
    ['7,5', 7.5],
    ['7.5', 7.5],
  ])('parses %s as %s', (raw, value) => {
    expect(parseFirstBimesterGrade(raw)).toEqual({ ok: true, value });
  });

  it.each([
    ['', 'La nota es obligatoria.'],
    ['abc', 'Ingresa una nota numérica válida.'],
    ['-0.01', 'La nota debe estar entre 0 y 20.'],
    ['20.01', 'La nota debe estar entre 0 y 20.'],
    ['15.123', 'La nota admite hasta dos decimales.'],
  ])('rejects %s', (raw, error) => {
    expect(parseFirstBimesterGrade(raw)).toEqual({ ok: false, error });
  });
});

describe('validateSubjectInput', () => {
  it.each(['', '   '])('rejects a blank subject name (%j)', (name) => {
    expect(validateSubjectInput(name, '10')).toEqual({
      ok: false,
      errors: { name: 'El nombre de la materia es obligatorio.' },
    });
  });

  describe('duplicate subject prevention', () => {
    const existingSubjects: Subject[] = [
      { id: 'history-1', name: 'Historia', firstBimesterGrade: 12.5 },
    ];

    it('detects names that differ only in case and surrounding spaces', () => {
      expect(isDuplicateSubject(existingSubjects, '  historia ')).toBe(true);
    });

    it('does not add a duplicate subject', () => {
      expect(addSubject(existingSubjects, { name: 'historia', grade: '15' }, 'history-2')).toEqual({
        ok: false,
        errors: { name: 'La materia ya existe.' },
      });
      expect(existingSubjects).toHaveLength(1);
    });

    it('adds a valid subject with a trimmed display name', () => {
      expect(addSubject([], { name: '  Biología ', grade: '9,75' }, 'biology-1')).toEqual({
        ok: true,
        subject: {
          id: 'biology-1',
          name: 'Biología',
          firstBimesterGrade: 9.75,
        },
        subjects: [
          {
            id: 'biology-1',
            name: 'Biología',
            firstBimesterGrade: 9.75,
          },
        ],
      });
    });

    it('stores comma and point decimals as the same numeric value', () => {
      const commaDecimal = addSubject([], { name: 'Física', grade: '7,5' }, 'physics-comma');
      const pointDecimal = addSubject([], { name: 'Física', grade: '7.5' }, 'physics-point');

      expect(commaDecimal.ok && commaDecimal.subject.firstBimesterGrade).toBe(7.5);
      expect(pointDecimal.ok && pointDecimal.subject.firstBimesterGrade).toBe(7.5);
    });

    it.each([
      ['  Álgebra ', '0', 'Álgebra', 0],
      ['  Física ', '20', 'Física', 20],
    ])('accepts trimmed name and boundary grade %s / %s', (name, grade, trimmedName, value) => {
      expect(addSubject([], { name, grade }, 'boundary-subject')).toMatchObject({
        ok: true,
        subject: {
          name: trimmedName,
          firstBimesterGrade: value,
        },
      });
    });

    it.each([
      ['   ', '10', { name: 'El nombre de la materia es obligatorio.' }],
      ['Biología', '', { grade: 'La nota es obligatoria.' }],
      ['Biología', '21', { grade: 'La nota debe estar entre 0 y 20.' }],
      ['Biología', '15.123', { grade: 'La nota admite hasta dos decimales.' }],
    ])('rejects invalid flow input %j / %j', (name, grade, errors) => {
      expect(addSubject([], { name, grade }, 'invalid-subject')).toEqual({
        ok: false,
        errors,
      });
    });
  });

  it('accepts a trimmed name and a valid grade', () => {
    expect(validateSubjectInput(' Matemáticas ', '12,25')).toEqual({ ok: true, value: 12.25 });
  });
});
