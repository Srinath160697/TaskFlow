import { useState } from 'react';
import { pickCsvFile, loadSampleCsvFile, readFileContents } from '../../data/fileReader';
import { parseCsv } from '../../data/csvParser';
import { runBulkImport } from '../../domain/bulkImportUseCase';
import { taskRepository } from '../../../tasks/data/taskRepository.asyncstorage';
import { useTasksContext } from '../../../tasks/presentation/hooks/TasksContext';

/**
 * Drives the Bulk Upload screen: picking a file, reading + parsing it
 * (data layer), and running the import (domain use-case). The concrete
 * task repository is wired in here, at the presentation layer, the same
 * way the tasks feature wires it into its own use-cases.
 */
export function useBulkUpload() {
  const { refresh } = useTasksContext();
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  async function pickFile() {
    setError(null);
    setSummary(null);
    try {
      console.log('[BulkUpload] opening document picker…');
      const picked = await pickCsvFile();
      if (picked) {
        console.log('[BulkUpload] picked file:', picked);
        setFile(picked);
      } else {
        console.log('[BulkUpload] picker cancelled by user');
      }
    } catch (e) {
      console.error('[BulkUpload] pickFile failed:', e?.message, e?.code, e);
      setError('Could not open the file picker.');
    }
  }

  async function loadSample() {
    setError(null);
    setSummary(null);
    try {
      console.log('[BulkUpload] loading bundled sample CSV…');
      const sample = await loadSampleCsvFile();
      console.log('[BulkUpload] sample file ready:', sample);
      setFile(sample);
    } catch (e) {
      console.error('[BulkUpload] loadSample failed:', e?.message, e?.code, e);
      setError('Could not load the sample CSV file.');
    }
  }

  async function importFile() {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    setSummary(null);
    try {
      console.log('[BulkUpload] reading file contents from uri:', file.uri);
      const text = await readFileContents(file.uri);
      console.log('[BulkUpload] read', text.length, 'characters');

      console.log('[BulkUpload] parsing CSV…');
      const parsed = parseCsv(text);
      console.log('[BulkUpload] parsed headers:', parsed.headers, '| row count:', parsed.rows.length);

      console.log('[BulkUpload] running import…');
      const result = await runBulkImport(taskRepository, parsed);
      console.log('[BulkUpload] import summary:', result);

      await refresh();
      setSummary(result);
    } catch (e) {
      console.error('[BulkUpload] importFile failed:', e?.message, '| code:', e?.code, '| full error:', e);
      setError(e?.message || 'Could not read that file. Make sure it is a valid CSV.');
    } finally {
      setIsProcessing(false);
    }
  }

  function reset() {
    setFile(null);
    setSummary(null);
    setError(null);
  }

  return { file, summary, error, isProcessing, pickFile, loadSample, importFile, reset };
}
