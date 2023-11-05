import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';

interface FormData {
  companyName: string;
  users: number;
  products: number;
  percentage: number;
}

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

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    users: 0,
    products: 0,
    percentage: 0,
  });
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = name === 'users' || name === 'products' ? parseInt(value, 10) : value;
    const updatedFormData = {
      ...formData,
      [name]: newValue,
    };

    // Calculate the percentage here
    const updatedPercentage = calculatePercentage(updatedFormData);

    setFormData({
      ...updatedFormData,
      percentage: updatedPercentage,
    });
  };

  const calculatePercentage = (data: FormData) => {
    return data.users > 0 && data.products > 0 ? (data.users / data.products) * 100 : 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${host}/user/add-data`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setApiResponse(response.data);
    } catch (error) {
        if (axios.isAxiosError(error) && (error.response?.status === 403 || error.response?.status === 401)) {
            navigate('/signin');
          } else {
            console.error(error);
          }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      return;
    }

    try {
      const response = await axios.get(`${host}/user/fetch-own-data`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setApiResponse(response.data);
    } catch (error) {
        if (axios.isAxiosError(error) && (error.response?.status === 403 || error.response?.status === 401)) {
            navigate('/signin');
          } else {
            console.error(error);
          }
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/signin');
    } else {
      setLoading(true);
      fetchUserData().finally(() => {
        setLoading(false);
      });
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/signin');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        User Dashboard
      </Typography>
      <Button variant="contained" color="secondary" onClick={handleLogout} style={{ marginBottom: '1rem' }}>
        Logout
      </Button>
      {loading && <CircularProgress />}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Company Name"
          variant="outlined"
          name="companyName"
          value={formData.companyName}
          onChange={handleFormChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Number of Users"
          variant="outlined"
          type="number"
          name="users"
          value={formData.users}
          onChange={handleFormChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Number of Products"
          variant="outlined"
          type="number"
          name="products"
          value={formData.products}
          onChange={handleFormChange}
          fullWidth
          margin="normal"
        />
        <p>Percentage: {formData.percentage}%</p>
        {loading ? (
          <CircularProgress />
        ) : (
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        )}
      </form>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {apiResponse && (
            <div style={{ marginTop: '1rem' }}>
              <Typography variant="h5">Company Name: {apiResponse.companyName}</Typography>
              <TableContainer component={Paper} style={{ marginTop: '1rem' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell>Products</TableCell>
                      <TableCell>Users</TableCell>
                      <TableCell>Percentage</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{apiResponse.email}</TableCell>
                      <TableCell>{apiResponse.products}</TableCell>
                      <TableCell>{apiResponse.users}</TableCell>
                      <TableCell>{apiResponse.percentage}%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              {apiResponse.logo && (
                <img
                  src={apiResponse.logo}
                  alt="Company Logo"
                  style={{ maxWidth: '100%', height: 'auto', marginTop: '1rem' }}
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
