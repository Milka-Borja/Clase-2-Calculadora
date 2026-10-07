import { useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SubjectForm, type SubjectFormSaveResult } from '@/components/SubjectForm';
import { addSubject, type Subject, type SubjectDraft } from '@/domain/subject';
import { loadSubjects, saveSubjects } from '@/storage/subjectStorage';

const colors = {
  background: '#e2e4e9',
  border: '#b5bbc8',
  danger: '#d33724',
  muted: '#5a6e82',
  navy: '#001F3F',
  text: '#111111',
  white: '#ffffff',
};

export default function HomeScreen() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  async function refreshSubjects() {
    setIsLoading(true);
    setLoadError('');
    try {
      setSubjects(await loadSubjects());
    } catch (error) {
      console.error('No se pudieron cargar las materias guardadas.', error);
      setLoadError('No se pudieron cargar las materias. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    loadSubjects()
      .then((storedSubjects) => {
        if (isMounted) {
          setSubjects(storedSubjects);
        }
      })
      .catch((error: unknown) => {
        console.error('No se pudieron cargar las materias guardadas.', error);
        if (isMounted) {
          setLoadError('No se pudieron cargar las materias. Inténtalo de nuevo.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSave(draft: SubjectDraft): Promise<SubjectFormSaveResult> {
    const result = addSubject(
      subjects,
      draft,
      `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`,
    );
    if (!result.ok) {
      return { ok: false, errors: result.errors };
    }

    try {
      await saveSubjects(result.subjects);
      setSubjects(result.subjects);
      return { ok: true };
    } catch (error) {
      console.error('No se pudo guardar la materia.', error);
      return {
        ok: false,
        message: 'No se pudo guardar la materia. Inténtalo de nuevo.',
      };
    }
  }

  const header = (
    <View>
      <View style={styles.header}>
        <Text style={styles.appName}>Calculadora de Supletorio</Text>
        <Text style={styles.title}>Mis materias</Text>
        <Text style={styles.subtitle}>
          Registra la nota de tu primer bimestre.
        </Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>Nueva materia</Text>
        <SubjectForm disabled={isLoading || Boolean(loadError)} onSave={handleSave} />
      </View>

      <View style={styles.listHeading}>
        <Text style={styles.sectionTitle}>Materias registradas</Text>
        <Text style={styles.count}>{subjects.length}</Text>
      </View>

      {loadError ? (
        <View style={styles.loadError}>
          <Text style={styles.loadErrorText}>{loadError}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver a cargar materias"
            onPress={refreshSubjects}
            style={styles.retryButton}>
            <Text style={styles.retryText}>Reintentar</Text>
          </Pressable>
        </View>
      ) : null}

      {isLoading ? <Text style={styles.emptyText}>Cargando materias…</Text> : null}
    </View>
  );

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoiding}>
        <FlatList
          contentContainerStyle={styles.content}
          data={subjects}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          keyExtractor={(subject) => subject.id}
          ListEmptyComponent={
            !isLoading && !loadError ? (
              <Text style={styles.emptyText}>Todavía no tienes materias registradas.</Text>
            ) : null
          }
          ListHeaderComponent={header}
          renderItem={({ item }) => (
            <View style={styles.subjectCard}>
              <Text style={styles.subjectName}>{item.name}</Text>
              <Text style={styles.grade}>
                Primer bimestre: {item.firstBimesterGrade.toFixed(2)} / 20
              </Text>
            </View>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  content: {
    gap: 12,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  header: {
    backgroundColor: colors.navy,
    borderRadius: 14,
    marginBottom: 14,
    marginTop: 10,
    padding: 20,
  },
  appName: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  title: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.white,
    fontSize: 15,
    marginTop: 6,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    marginBottom: 18,
    padding: 16,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  listHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  count: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  subjectCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    padding: 16,
  },
  subjectName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  grade: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 6,
  },
  emptyText: {
    color: colors.text,
    fontSize: 15,
    paddingVertical: 16,
    textAlign: 'center',
  },
  loadError: {
    alignItems: 'stretch',
    backgroundColor: colors.danger,
    borderRadius: 8,
    gap: 8,
    marginBottom: 8,
    padding: 12,
  },
  loadErrorText: {
    color: colors.white,
    fontSize: 14,
  },
  retryButton: {
    alignItems: 'center',
    borderColor: colors.white,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 44,
  },
  retryText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
