import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  CircularProgress,
  TextField,
  InputAdornment,
  Button,
} from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import { googleSheetsService, EmployeeData } from '../services/googleSheets';

export default function DataPegawaiPage() {
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await googleSheetsService.getEmployees();
      // Sorting Logic: Kepala Biro (or Kelapa Biro) at the top
      const sorted = [...data].sort((a, b) => {
        const aIsBoss = a.timkerja.toLowerCase().includes('biro');
        const bIsBoss = b.timkerja.toLowerCase().includes('biro');
        
        if (aIsBoss && !bIsBoss) return -1;
        if (!aIsBoss && bIsBoss) return 1;
        return a.nama.localeCompare(b.nama);
      });
      setEmployees(sorted);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(emp => 
    emp.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.jabatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.timkerja.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedEmployees = filteredEmployees.reduce((acc, emp) => {
    const team = emp.timkerja || 'Lainnya';
    if (!acc[team]) acc[team] = [];
    acc[team].push(emp);
    return acc;
  }, {} as Record<string, EmployeeData[]>);

  const sortedTeams = Object.keys(groupedEmployees).sort((a, b) => {
    const aIsBoss = a.toLowerCase().includes('biro');
    const bIsBoss = b.toLowerCase().includes('biro');
    if (aIsBoss && !bIsBoss) return -1;
    if (!aIsBoss && bIsBoss) return 1;
    return a.localeCompare(b);
  });

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
              color: '#fff',
              display: 'flex'
            }}
          >
            <BadgeIcon fontSize="large" />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
              Data Pegawai
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
              Direktori pegawai Biro Komunikasi dan Pelayanan Publik
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexGrow: { xs: 1, md: 0 } }}>
          <TextField
            size="small"
            placeholder="Cari pegawai..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 250, backgroundColor: '#fff', borderRadius: 2 }}
          />
          <Button 
            variant="outlined" 
            startIcon={loading ? <CircularProgress size={16} /> : <RefreshIcon />}
            onClick={fetchEmployees}
            disabled={loading}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10 }}>
          <CircularProgress />
          <Typography sx={{ mt: 2, color: 'text.secondary' }}>Memuat data pegawai...</Typography>
        </Box>
      ) : (
        <Box>
          {Object.keys(groupedEmployees).length === 0 ? (
            <Box sx={{ py: 10, textAlign: 'center' }}>
              <PersonIcon sx={{ fontSize: 60, color: 'action.disabled', mb: 2 }} />
              <Typography sx={{ color: 'text.secondary' }}>
                Tidak ada pegawai yang ditemukan.
              </Typography>
            </Box>
          ) : (
            sortedTeams.map((teamName) => (
              <Box key={teamName} sx={{ mb: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, pb: 1, borderBottom: '2px solid', borderColor: teamName.toLowerCase().includes('biro') ? 'success.main' : 'divider' }}>
                  <BusinessIcon color={teamName.toLowerCase().includes('biro') ? 'success' : 'action'} />
                  <Typography variant="h6" sx={{ fontWeight: 800, color: teamName.toLowerCase().includes('biro') ? 'success.dark' : 'text.primary' }}>
                    {teamName}
                  </Typography>
                  <Chip 
                    label={`${groupedEmployees[teamName].length} Pegawai`} 
                    size="small" 
                    variant="outlined" 
                    sx={{ fontWeight: 700, ml: 1 }} 
                  />
                </Box>
                
                <Grid container spacing={3}>
                  {groupedEmployees[teamName].map((emp, index) => {
                    const isBoss = emp.timkerja.toLowerCase().includes('biro');
                    
                    return (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <Card 
                          sx={{ 
                            height: '100%', 
                            borderRadius: 4, 
                            boxShadow: isBoss ? '0 10px 40px rgba(46, 125, 50, 0.15)' : '0 4px 20px rgba(0,0,0,0.05)',
                            border: isBoss ? '2px solid #2e7d32' : '1px solid #eef2f6',
                            transition: 'transform 0.2s',
                            position: 'relative',
                            '&:hover': { transform: 'translateY(-4px)' }
                          }}
                        >
                          <CardContent sx={{ pt: 4, pb: 2, px: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <Avatar 
                              sx={{ 
                                width: 70, 
                                height: 70, 
                                mb: 2, 
                                bgcolor: isBoss ? 'success.main' : 'primary.light',
                                fontSize: '1.75rem',
                                fontWeight: 700
                              }}
                            >
                              {emp.nama.charAt(0)}
                            </Avatar>
                            
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontWeight: 800, 
                                fontSize: '0.95rem', 
                                mb: 0.5,
                                color: isBoss ? 'success.dark' : 'text.primary',
                                lineHeight: 1.2
                              }}
                            >
                              {emp.nama}
                            </Typography>
                            
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: 'text.secondary', 
                                mb: 2, 
                                fontSize: '0.75rem',
                                fontWeight: 500
                              }}
                            >
                              {emp.jabatan}
                            </Typography>

                            {isBoss && (
                              <Chip 
                                label="Kepala" 
                                size="small" 
                                sx={{ 
                                  position: 'absolute', 
                                  top: 12, 
                                  right: 12, 
                                  bgcolor: '#2e7d32', 
                                  color: '#fff', 
                                  fontWeight: 800,
                                  fontSize: '0.6rem',
                                  height: 18
                                }} 
                              />
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            ))
          )}
        </Box>
      )}
    </Box>
  );
}
