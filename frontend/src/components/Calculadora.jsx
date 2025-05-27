import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Alert,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Switch,
  FormControlLabel
} from '@mui/material';

const SureBetCalculator = () => {
  // State for the calculator
  const [activeTab, setActiveTab] = useState(0);
  const [totalStake, setTotalStake] = useState(1000);
  const [odds, setOdds] = useState({
    twoWay: { odd1: 2.10, odd2: 2.10 },
    threeWay: { odd1: 4.00, odd2: 3.50, oddX: 1.80 }
  });
  const [results, setResults] = useState(null);
  const [advancedMode, setAdvancedMode] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setResults(null);
  };

  const handleOddChange = (market, field, value) => {
    setOdds(prev => ({
      ...prev,
      [market]: {
        ...prev[market],
        [field]: parseFloat(value) || 0
      }
    }));
  };

  const calculateSureBet = () => {
    if (activeTab === 0) {
      // Two-way market calculation
      const { odd1, odd2 } = odds.twoWay;
      const sumInverses = (1 / odd1) + (1 / odd2);
      
      if (sumInverses >= 1) {
        setResults({ error: "Não há oportunidade de SureBet (Soma dos inversos ≥ 1)" });
        return;
      }

      const stake1 = (totalStake / odd1) / sumInverses;
      const stake2 = (totalStake / odd2) / sumInverses;
      const payout1 = stake1 * odd1;
      const payout2 = stake2 * odd2;
      const profit = payout1 - totalStake;
      const roi = (profit / totalStake) * 100;

      setResults({
        sumInverses,
        stakes: [
          { outcome: 'Outcome 1', odd: odd1, stake: stake1, payout: payout1 },
          { outcome: 'Outcome 2', odd: odd2, stake: stake2, payout: payout2 }
        ],
        profit,
        roi,
        guaranteed: true
      });
    } else {
      // Three-way market calculation
      const { odd1, oddX, odd2 } = odds.threeWay;
      const sumInverses = (1 / odd1) + (1 / oddX) + (1 / odd2);
      
      if (sumInverses >= 1) {
        setResults({ error: "Não há oportunidade de SureBet (Soma dos inversos ≥ 1)" });
        return;
      }

      const stake1 = (totalStake / odd1) / sumInverses;
      const stakeX = (totalStake / oddX) / sumInverses;
      const stake2 = (totalStake / odd2) / sumInverses;
      const payout1 = stake1 * odd1;
      const payoutX = stakeX * oddX;
      const payout2 = stake2 * odd2;
      const profit = payout1 - totalStake;
      const roi = (profit / totalStake) * 100;

      setResults({
        sumInverses,
        stakes: [
          { outcome: 'Home Win', odd: odd1, stake: stake1, payout: payout1 },
          { outcome: 'Draw', odd: oddX, stake: stakeX, payout: payoutX },
          { outcome: 'Away Win', odd: odd2, stake: stake2, payout: payout2 }
        ],
        profit,
        roi,
        guaranteed: true
      });
    }
  };

  const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
          SureBet Calculator
        </Typography>
        <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
          Calculate guaranteed profits from arbitrage opportunities
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} centered>
            <Tab label="2-Way Market" />
            <Tab label="3-Way Market" />
          </Tabs>
        </Box>

        <FormControlLabel
          control={<Switch checked={advancedMode} onChange={(e) => setAdvancedMode(e.target.checked)} />}
          label="Advanced Mode"
          sx={{ mb: 2 }}
        />

        {activeTab === 0 ? (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Odd for Outcome 1"
                type="number"
                value={odds.twoWay.odd1}
                onChange={(e) => handleOddChange('twoWay', 'odd1', e.target.value)}
                inputProps={{ step: "0.01", min: "1.01" }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Odd for Outcome 2"
                type="number"
                value={odds.twoWay.odd2}
                onChange={(e) => handleOddChange('twoWay', 'odd2', e.target.value)}
                inputProps={{ step: "0.01", min: "1.01" }}
                variant="outlined"
              />
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Home Win Odd"
                type="number"
                value={odds.threeWay.odd1}
                onChange={(e) => handleOddChange('threeWay', 'odd1', e.target.value)}
                inputProps={{ step: "0.01", min: "1.01" }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Draw Odd"
                type="number"
                value={odds.threeWay.oddX}
                onChange={(e) => handleOddChange('threeWay', 'oddX', e.target.value)}
                inputProps={{ step: "0.01", min: "1.01" }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Away Win Odd"
                type="number"
                value={odds.threeWay.odd2}
                onChange={(e) => handleOddChange('threeWay', 'odd2', e.target.value)}
                inputProps={{ step: "0.01", min: "1.01" }}
                variant="outlined"
              />
            </Grid>
          </Grid>
        )}

        {advancedMode && (
          <Box sx={{ mt: 3 }}>
            <Typography gutterBottom>Total Stake</Typography>
            <Slider
              value={totalStake}
              onChange={(e, newValue) => setTotalStake(newValue)}
              min={100}
              max={10000}
              step={100}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => formatCurrency(value)}
              sx={{ maxWidth: 600 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Total Stake"
                  type="number"
                  value={totalStake}
                  onChange={(e) => setTotalStake(parseFloat(e.target.value) || 0)}
                  inputProps={{ step: "100", min: "100" }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    value="BRL"
                    label="Currency"
                    disabled
                  >
                    <MenuItem value="BRL">BRL (R$)</MenuItem>
                    <MenuItem value="USD">USD ($)</MenuItem>
                    <MenuItem value="EUR">EUR (€)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={calculateSureBet}
            sx={{ px: 5 }}
          >
            Calculate SureBet
          </Button>
        </Box>

        {results && (
          <Box sx={{ mt: 4 }}>
            {results.error ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {results.error}
              </Alert>
            ) : (
              <>
                <Alert severity="success" sx={{ mb: 2 }}>
<strong>Oportunidade de Arbitragem Encontrada!</strong> - Soma dos inversos: {results.sumInverses.toFixed(4)} (&lt;1)                </Alert>

                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Bet Distribution
                </Typography>
                <TableContainer component={Paper} sx={{ mb: 3 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Outcome</TableCell>
                        <TableCell align="right">Odd</TableCell>
                        <TableCell align="right">Stake</TableCell>
                        <TableCell align="right">Potential Payout</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {results.stakes.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell component="th" scope="row">
                            {row.outcome}
                          </TableCell>
                          <TableCell align="right">{row.odd.toFixed(2)}</TableCell>
                          <TableCell align="right">{formatCurrency(row.stake)}</TableCell>
                          <TableCell align="right">{formatCurrency(row.payout)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={2}><strong>Total</strong></TableCell>
                        <TableCell align="right">
                          <strong>
                            {formatCurrency(results.stakes.reduce((sum, row) => sum + row.stake, 0))}
                          </strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>
                            {formatCurrency(results.stakes[0].payout)}
                          </strong>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Profit Summary
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography>Total Stake:</Typography>
                        <Typography>{formatCurrency(totalStake)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography>Guaranteed Payout:</Typography>
                        <Typography>{formatCurrency(results.stakes[0].payout)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="body1"><strong>Guaranteed Profit:</strong></Typography>
                        <Typography variant="body1" color="success.main">
                          <strong>{formatCurrency(results.profit)}</strong>
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Return on Investment
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="success.main">
                          {results.roi.toFixed(2)}%
                        </Typography>
                        <Typography variant="body2">ROI</Typography>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </>
            )}
          </Box>
        )}

        <Box sx={{ mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary">
            <strong>How to use:</strong> Enter odds from different bookmakers for all possible outcomes.
            The calculator will determine if there's an arbitrage opportunity and show how to distribute your stake.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default SureBetCalculator;