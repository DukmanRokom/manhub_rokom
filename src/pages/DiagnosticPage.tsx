import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  TextField,
  Divider,
  Alert,
  CircularProgress,
  Avatar,
} from '@mui/material';
import { convertDriveLink } from '../services/googleSheets';

export default function DiagnosticPage() {
  const [url, setUrl] = useState('https://script.google.com/macros/s/AKfycbwfCmI6l5iNIYGew6VkzLwRDUDvPdVBQuY7zebXr8h_xsMSeRTupK7kRC-kuWY0mUixQg/exec');
  const [testImgUrl, setTestImgUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async (action: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const fullUrl = `${url}?action=${action}`;
      const response = await fetch(fullUrl);
      const text = await response.text();
      
      try {
        const json = JSON.parse(text);
        setResult({
          type: 'JSON',
          data: json,
          raw: text
        });
      } catch (e) {
        setResult({
          type: 'TEXT/HTML',
          raw: text
        });
        if (text.includes('<!DOCTYPE html>')) {
          setError('Response is HTML. This usually means the Google Script is asking for login or the URL is wrong.');
        }
      }
    } catch (err: any) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 800 }}>
        Google Sheets Diagnostic Tool
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <TextField
          fullWidth
          label="Apps Script URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            onClick={() => testConnection('getEotm')}
            disabled={loading}
          >
            Test Get EOTM
          </Button>
          <Button 
            variant="contained" 
            onClick={() => testConnection('getBudget')}
            disabled={loading}
          >
            Test Get Budget
          </Button>
          <Button 
            variant="contained" 
            onClick={() => testConnection('getSpj')}
            disabled={loading}
            color="success"
          >
            Test Get SPJ
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => testConnection('listSheets')}
            disabled={loading}
            color="secondary"
          >
            Check Script Version & Sheets
          </Button>
        </Box>
      </Paper>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Result Type: {result.type}
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          {result.data && Array.isArray(result.data) && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Items Found ({result.data.length}):</Typography>
              {result.data.map((item: any, idx: number) => {
                const name = item.nama || item.Nama || 'N/A';
                const url = item.fotoUrl || item.fotourl || '';
                return (
                  <Box key={idx} sx={{ p: 1, borderBottom: '1px solid #eee' }}>
                    <Typography variant="body2"><strong>Nama:</strong> {name}</Typography>
                    <Typography variant="body2"><strong>Raw URL:</strong> <code style={{ fontSize: '0.7rem' }}>{url}</code></Typography>
                    <Typography variant="body2" color="primary"><strong>Converted:</strong> <code style={{ fontSize: '0.7rem' }}>{convertDriveLink(url)}</code></Typography>
                  </Box>
                );
              })}
            </Box>
          )}

          <Typography variant="subtitle2">Raw JSON/Text:</Typography>
          <Box 
            component="pre" 
            sx={{ 
              p: 2, 
              bgcolor: '#f5f5f5', 
              borderRadius: 1, 
              overflow: 'auto', 
              maxHeight: 200,
              fontSize: '0.7rem'
            }}
          >
            {result.raw}
          </Box>
        </Paper>
      )}

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Image Link Converter Test
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Paste your Google Drive link here to see if it converts correctly.
        </Typography>
        <TextField
          fullWidth
          label="Google Drive / Image URL"
          placeholder="https://drive.google.com/file/d/..."
          value={testImgUrl}
          onChange={(e) => setTestImgUrl(e.target.value)}
          sx={{ mb: 2 }}
        />
        {testImgUrl && (
          <Box sx={{ mt: 2, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
            <Typography variant="subtitle2">Converted URL:</Typography>
            <code style={{ fontSize: '0.8rem', wordBreak: 'break-all', display: 'block', marginBottom: '8px' }}>{convertDriveLink(testImgUrl)}</code>
            <Button 
              size="small" 
              href={convertDriveLink(testImgUrl)} 
              target="_blank" 
              variant="outlined"
              sx={{ mb: 2 }}
            >
              Open Image in New Tab
            </Button>
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ mb: 1 }}>Live Preview:</Typography>
              <Avatar 
                src={convertDriveLink(testImgUrl)} 
                variant="rounded"
                sx={{ width: 200, height: 260, border: '1px solid #ddd', bgcolor: '#f5f5f5' }}
              >
                Failed to Load
              </Avatar>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
