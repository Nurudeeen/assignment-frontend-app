import React, { useState, useEffect, useCallback, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';

interface ApiResponse {
  companyName: string;
  email: string;
  products: number;
  users: number;
  percentage: number;
  _id: string;
  __v: number;
  logo?: string;
}

const host = 'https://assignment-api-0diz.onrender.com'; // Replace with your actual API endpoint

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [apiResponse, setApiResponse] = useState<ApiResponse[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [logo, setLogoFile] = useState<File | null>(null);

  // Function to fetch data from the API endpoint
  const fetchData = useCallback(async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get<ApiResponse[]>(`${host}/user/fetch-all-data`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setApiResponse(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/signin');
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleLogoFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleLogoUpload = async (e: FormEvent) => {
    e.preventDefault();

    const token = sessionStorage.getItem('token');
    if (!token || !email || !logo) {
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('logo', logo);

      const response = await axios.put<ApiResponse>(`${host}/user/upload-logo?email=${email}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Find and update the item in the array based on email
      setApiResponse((prevData) => {
        if (!prevData) return prevData;

        return prevData.map((item) =>
          item.email === email ? { ...item, logo: response.data.logo } : item
        );
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>
      <Button variant="contained" color="secondary" onClick={handleLogout} style={{ marginBottom: '1rem' }}>
        Logout
      </Button>
      <form onSubmit={handleLogoUpload} style={{ marginBottom: '1rem' }}>
        <TextField
          label="Email for Logo Upload"
          variant="outlined"
          value={email}
          onChange={handleEmailChange}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoFileChange}
        />
        <Button variant="contained" color="primary" type="submit">
          Upload Logo
        </Button>
      </form>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {apiResponse && apiResponse.length > 0 ? (
            <div style={{ marginTop: '1rem' }}>
              <TableContainer component={Paper} style={{ marginTop: '1rem' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Company Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Products</TableCell>
                      <TableCell>Users</TableCell>
                      <TableCell>Percentage</TableCell>
                      <TableCell>Logo</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {apiResponse.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>{item.companyName}</TableCell>
                        <TableCell>{item.email}</TableCell>
                        <TableCell>{item.products}</TableCell>
                        <TableCell>{item.users}</TableCell>
                        <TableCell>{item.percentage}%</TableCell>
                        <TableCell>
                          {item.logo ? (
                            <img src={item.logo} alt={`${item.companyName} Logo`} style={{ maxWidth: '100px', height: 'auto' }} />
                          ) : (
                            'N/A'
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          ) : (
            <Typography variant="h5">No data available</Typography>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
