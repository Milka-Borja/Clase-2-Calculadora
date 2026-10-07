export type Subject = {
  id: string;
  name: string;
  firstBimesterGrade: number;
};

export type SubjectDraft = {
  name: string;
  grade: string | number | null;
};

export type GradeParseResult =
  | { ok: true; value: number }
  | { ok: false; error: string };

export type SubjectValidationResult =
  | { ok: true; value: number }
  | { ok: false; errors: { name?: string; grade?: string } };

export type AddSubjectResult =
  | { ok: true; subject: Subject; subjects: Subject[] }
  | { ok: false; errors: { name?: string; grade?: string } };

export function normalizeSubjectName(value: string): string {
  return value.trim().toLowerCase();
}

export function parseFirstBimesterGrade(raw: string | number | null): GradeParseResult {
  const input = raw === null ? '' : String(raw).trim();

  if (input === '') {
    return { ok: false, error: 'La nota es obligatoria.' };
  }

  if (!/^-?(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(input)) {
    return { ok: false, error: 'Ingresa una nota numérica válida.' };
  }

  const decimalPart = input.match(/[.,](\d*)$/)?.[1] ?? '';
  if (decimalPart.length > 2) {
    return { ok: false, error: 'La nota admite hasta dos decimales.' };
  }

  const value = Number(input.replace(',', '.'));
  if (value < 0 || value > 20) {
    return { ok: false, error: 'La nota debe estar entre 0 y 20.' };
  }

  return { ok: true, value };
}

export function validateSubjectInput(
  name: SubjectDraft['name'],
  grade: SubjectDraft['grade'],
): SubjectValidationResult {
  const errors: { name?: string; grade?: string } = {};

  if (normalizeSubjectName(name) === '') {
    errors.name = 'El nombre de la materia es obligatorio.';
  }

  const parsedGrade = parseFirstBimesterGrade(grade);
  if (!parsedGrade.ok) {
    errors.grade = parsedGrade.error;
  }

  if (Object.keys(errors).length > 0 || !parsedGrade.ok) {
    return { ok: false, errors };
  }

  return { ok: true, value: parsedGrade.value };
}

export function isDuplicateSubject(existingSubjects: Subject[], candidateName: string): boolean {
  const normalizedCandidate = normalizeSubjectName(candidateName);
  return existingSubjects.some(
    (subject) => normalizeSubjectName(subject.name) === normalizedCandidate,
  );
}

export function addSubject(
  existingSubjects: Subject[],
  draft: SubjectDraft,
  id: string,
): AddSubjectResult {
  const validation = validateSubjectInput(draft.name, draft.grade);
  if (!validation.ok) {
    return validation;
  }

  if (isDuplicateSubject(existingSubjects, draft.name)) {
    return { ok: false, errors: { name: 'La materia ya existe.' } };
  }

  const subject: Subject = {
    id,
    name: draft.name.trim(),
    firstBimesterGrade: validation.value,
  };

  return { ok: true, subject, subjects: [...existingSubjects, subject] };
}
