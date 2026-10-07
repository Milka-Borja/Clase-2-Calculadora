import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  validateSubjectInput,
  type SubjectDraft,
  type SubjectValidationResult,
} from '@/domain/subject';

type SubjectErrors = Extract<SubjectValidationResult, { ok: false }>['errors'];

export type SubjectFormSaveResult =
  | { ok: true }
  | { ok: false; errors?: SubjectErrors; message?: string };

type SubjectFormProps = {
  disabled?: boolean;
  onSave: (draft: SubjectDraft) => Promise<SubjectFormSaveResult>;
};

const colors = {
  border: '#b5bbc8',
  danger: '#d33724',
  muted: '#5a6e82',
  primary: '#357ca5',
  text: '#111111',
  white: '#ffffff',
};

export function SubjectForm({ disabled = false, onSave }: SubjectFormProps) {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [errors, setErrors] = useState<SubjectErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit() {
    const validation = validateSubjectInput(name, grade);
    if (!validation.ok) {
      setErrors(validation.errors);
      setSubmitError('');
      return;
    }

    setIsSaving(true);
    setSubmitError('');
    let result: SubjectFormSaveResult;
    try {
      result = await onSave({ name, grade });
    } finally {
      setIsSaving(false);
    }

    if (!result.ok) {
      setErrors(result.errors ?? {});
      setSubmitError(result.message ?? '');
      return;
    }

    setName('');
    setGrade('');
    setErrors({});
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre de la materia</Text>
      <TextInput
        accessibilityLabel="Nombre de la materia"
        autoCapitalize="words"
        autoCorrect={false}
        editable={!isSaving && !disabled}
        onChangeText={(value) => {
          setName(value);
          setErrors((current) => ({ ...current, name: undefined }));
        }}
        placeholder="Ej. Matemáticas"
        placeholderTextColor={colors.muted}
        style={[styles.input, errors.name ? styles.inputError : undefined]}
        value={name}
        returnKeyType="next"
      />
      {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

      <Text style={styles.label}>Nota del primer bimestre</Text>
      <TextInput
        accessibilityLabel="Nota del primer bimestre"
        editable={!isSaving && !disabled}
        keyboardType="decimal-pad"
        onChangeText={(value) => {
          setGrade(value);
          setErrors((current) => ({ ...current, grade: undefined }));
        }}
        placeholder="0 a 20"
        placeholderTextColor={colors.muted}
        style={[styles.input, errors.grade ? styles.inputError : undefined]}
        value={grade}
      />
      {errors.grade ? <Text style={styles.errorText}>{errors.grade}</Text> : null}

      {submitError ? (
        <Text accessibilityRole="alert" style={styles.errorText}>
          {submitError}
        </Text>
      ) : null}

      <Pressable
        accessibilityLabel="Guardar materia"
        accessibilityRole="button"
        disabled={isSaving || disabled}
        onPress={handleSubmit}
        style={({ pressed }) => [
          styles.button,
          isSaving || disabled
            ? styles.buttonDisabled
            : pressed
              ? styles.buttonPressed
              : undefined,
        ]}>
        <Text
          style={[
            styles.buttonText,
            isSaving || disabled ? styles.buttonTextDisabled : undefined,
          ]}>
          {isSaving ? 'Guardando…' : 'Guardar materia'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    marginTop: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    minHeight: 52,
    paddingHorizontal: 14,
  },
  inputError: {
    borderColor: colors.danger,
    borderWidth: 2,
  },
  errorText: {
    backgroundColor: colors.danger,
    borderRadius: 6,
    color: colors.white,
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    justifyContent: 'center',
    marginTop: 12,
    minHeight: 52,
    paddingHorizontal: 16,
  },
  buttonPressed: {
    backgroundColor: '#001F3F',
  },
  buttonDisabled: {
    backgroundColor: colors.border,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  buttonTextDisabled: {
    color: colors.text,
  },
});
