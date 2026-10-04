import { Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Asset } from 'expo-asset';
// The new expo-file-system `File` API enforces a sandboxed permission model
// that rejects reads outside its own managed directories — including the
// cache-copied URI handed back by expo-document-picker on Android ("missing
// 'read' permission"). The legacy API has no such restriction and is the
// documented way to read picker-provided URIs, so we use it here.
import * as LegacyFileSystem from 'expo-file-system/legacy';

// Bundled via Metro as an asset (see metro.config.js, which registers the
// '.csv' extension) so it ships inside the app and can be loaded with no
// native file picker involved.
const SAMPLE_CSV_MODULE = require('../../../../sample-data/tasks.csv');

/**
 * @typedef {Object} PickedFile
 * @property {string} uri original content:// (or file://) uri from the picker
 * @property {string} name
 * @property {number} size bytes
 * @property {string} mimeType
 */

/**
 * Opens the native document picker restricted to CSV/text files.
 * @returns {Promise<PickedFile|null>} null if the user cancelled
 */
export async function pickCsvFile() {
  // copyToCacheDirectory: false — on Android, that copy is what was coming back
  // broken/unreadable for some providers. Reading the picker's own content:// uri
  // directly is more reliable; see readFileContents for the fallback copy logic.
  const result = await DocumentPicker.getDocumentAsync({
    type: ['text/csv', 'text/comma-separated-values', 'text/plain', 'application/vnd.ms-excel'],
    copyToCacheDirectory: false,
    multiple: false,
  });
  console.log('[fileReader] DocumentPicker result:', result);

  if (result.canceled || !result.assets || result.assets.length === 0) return null;

  const asset = result.assets[0];
  return {
    uri: asset.uri,
    name: asset.name ?? 'upload.csv',
    size: asset.size ?? 0,
    mimeType: asset.mimeType ?? 'text/csv',
  };
}

/**
 * Loads the CSV file bundled at `sample-data/tasks.csv`, in the same shape
 * `pickCsvFile` returns, so it can flow through the exact same
 * read/parse/import pipeline as a device-picked file.
 * @returns {Promise<PickedFile>}
 */
export async function loadSampleCsvFile() {
  console.log('[fileReader] loading bundled sample CSV…');
  const asset = Asset.fromModule(SAMPLE_CSV_MODULE);
  await asset.downloadAsync();

  const uri = asset.localUri ?? asset.uri;
  let size = 0;
  try {
    if (Platform.OS === 'web') {
      const response = await fetch(uri);
      const blob = await response.blob();
      size = blob.size;
    } else {
      const info = await LegacyFileSystem.getInfoAsync(uri);
      size = info.exists ? info.size : 0;
    }
  } catch (e) {
    console.warn('[fileReader] could not determine sample CSV size:', e?.message);
  }

  console.log('[fileReader] sample CSV asset ready:', { uri, size });
  return { uri, name: 'tasks.csv', size, mimeType: 'text/csv' };
}

/**
 * Reads the full text contents of a picked file. On Android, expo-document-picker's
 * cache-directory copy can come back broken (e.g. the destination filename has no
 * extension and the native copy silently fails, leaving an unreadable cache file —
 * seen as `java.io.IOException: ... isn't readable`) for files picked from certain
 * providers (Drive, Downloads, etc). To be resilient to that, we read the *original*
 * content:// uri first — Android grants a temporary read permission for it as part
 * of the picker intent — and only fall back to the cache-copied uri if that fails.
 * @param {string} uri
 * @returns {Promise<string>}
 */
export async function readFileContents(uri) {
  if (/^https?:\/\//.test(uri)) {
    // Web (and the sample-CSV asset, which is served over http on web) —
    // expo-file-system's legacy API doesn't read remote URLs, fetch does.
    console.log('[fileReader] fetching http(s) uri directly:', uri);
    const response = await fetch(uri);
    return response.text();
  }

  try {
    console.log('[fileReader] attempting read of original uri:', uri);
    const contents = await LegacyFileSystem.readAsStringAsync(uri, {
      encoding: LegacyFileSystem.EncodingType.UTF8,
    });
    console.log('[fileReader] read succeeded,', contents.length, 'characters');
    return contents;
  } catch (originalError) {
    console.warn('[fileReader] reading original uri failed, will retry via a fresh cache copy:', originalError?.message);

    try {
      const info = await LegacyFileSystem.getInfoAsync(uri);
      console.log('[fileReader] file info for', uri, ':', info);
    } catch (infoError) {
      console.warn('[fileReader] getInfoAsync also failed:', infoError?.message);
    }

    try {
      const destination = `${LegacyFileSystem.cacheDirectory}bulk-upload-${Date.now()}.csv`;
      await LegacyFileSystem.copyAsync({ from: uri, to: destination });
      const contents = await LegacyFileSystem.readAsStringAsync(destination, {
        encoding: LegacyFileSystem.EncodingType.UTF8,
      });
      console.log('[fileReader] fallback cache-copy read succeeded,', contents.length, 'characters');
      return contents;
    } catch (fallbackError) {
      console.error('[fileReader] both the original uri and the fallback cache copy failed to read');
      console.error('[fileReader] original error:', originalError?.message, originalError?.code, originalError);
      console.error('[fileReader] fallback error:', fallbackError?.message, fallbackError?.code, fallbackError);
      throw fallbackError;
    }
  }
}
