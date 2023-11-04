import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <Container
      maxWidth="md"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Typography variant="h3" style={{ marginBottom: '2rem' }}>
        Home
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/signin"
      >
        Sign in
      </Button>
    </Container>
  );
}

export default Home;
