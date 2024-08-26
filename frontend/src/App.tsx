import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, Select, MenuItem, TextField } from '@mui/material';
import { backend } from 'declarations/backend';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedChain, setSelectedChain] = useState('');
  const [balance, setBalance] = useState<number | null>(null);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  useEffect(() => {
    backend.initTestData();
  }, []);

  const handleAuthenticate = async () => {
    try {
      const result = await backend.authenticate();
      setIsAuthenticated(result === 'Authentication successful');
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  const handleChainSelect = async (event: React.ChangeEvent<{ value: unknown }>) => {
    const chain = event.target.value as string;
    setSelectedChain(chain);
    try {
      const result = await backend.getBalance(chain);
      setBalance(result ? Number(result) : null);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const handleSendTransaction = async () => {
    if (!selectedChain || !amount || !recipient) {
      alert('Please fill in all fields');
      return;
    }
    try {
      const result = await backend.sendTransaction(selectedChain, parseFloat(amount), recipient);
      if ('ok' in result) {
        alert('Transaction successful');
        // Refresh balance
        const newBalance = await backend.getBalance(selectedChain);
        setBalance(newBalance ? Number(newBalance) : null);
      } else {
        alert(`Transaction failed: ${result.err}`);
      }
    } catch (error) {
      console.error('Transaction error:', error);
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            OISY
          </Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/token-utilities">Token Utilities</Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Routes>
            <Route path="/" element={
              <>
                <Typography variant="h4" component="h1" gutterBottom>
                  Modern Crypto Wallet
                </Typography>
                {!isAuthenticated ? (
                  <Button variant="contained" onClick={handleAuthenticate}>Authenticate</Button>
                ) : (
                  <>
                    <Select
                      value={selectedChain}
                      onChange={handleChainSelect}
                      displayEmpty
                      fullWidth
                      sx={{ mb: 2 }}
                    >
                      <MenuItem value="" disabled>Select Chain</MenuItem>
                      <MenuItem value="ICP">Internet Computer</MenuItem>
                      <MenuItem value="ETH">Ethereum</MenuItem>
                      <MenuItem value="BTC">Bitcoin</MenuItem>
                    </Select>
                    {balance !== null && (
                      <Typography variant="h6" gutterBottom>
                        Balance: {balance} {selectedChain}
                      </Typography>
                    )}
                    <TextField
                      label="Amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      label="Recipient"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                    <Button variant="contained" onClick={handleSendTransaction} fullWidth>
                      Send Transaction
                    </Button>
                  </>
                )}
              </>
            } />
            <Route path="/token-utilities" element={
              <Typography variant="h4" component="h1" gutterBottom>
                Token Utilities
              </Typography>
            } />
          </Routes>
        </Box>
      </Container>
    </div>
  );
};

export default App;
