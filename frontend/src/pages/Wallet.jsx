import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { ArrowDownUp, CreditCard, Plus, ArrowRight, ArrowUp, ArrowDown, Clock, DollarSign } from "lucide-react";
import { checkAuthAndRedirect } from '../utils/authRedirect';

// Mock transaction data
const transactions = [
  { 
    id: 1, 
    type: 'deposit', 
    amount: 1000, 
    date: '2025-04-07', 
    status: 'completed',
    description: 'Deposit to wallet'
  },
  { 
    id: 2, 
    type: 'withdrawal', 
    amount: 300, 
    date: '2025-04-05', 
    status: 'completed',
    description: 'Withdrawal to bank account'
  },
  { 
    id: 3, 
    type: 'campaign', 
    amount: 500, 
    date: '2025-04-03', 
    status: 'completed',
    description: 'Funding for "Education for All" campaign'
  },
  { 
    id: 4, 
    type: 'campaign', 
    amount: 200, 
    date: '2025-04-01', 
    status: 'pending',
    description: 'Funding for "Tech Innovations" campaign'
  },
];

const Wallet = () => {
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [depositDialog, setDepositDialog] = useState(false);
  const [withdrawDialog, setWithdrawDialog] = useState(false);

  useEffect(() => {
    checkAuthAndRedirect('/login');
  }, []);

  const handleDeposit = () => {
    console.log('Depositing', depositAmount);
    setDepositDialog(false);
    setDepositAmount('');
  };

  const handleWithdraw = () => {
    console.log('Withdrawing', withdrawAmount);
    setWithdrawDialog(false);
    setWithdrawAmount('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Wallet</h1>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Account Summary */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
                <CardDescription>Manage your funds</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-primary/10 p-6 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
                  <p className="text-3xl font-bold">5,000 ETB</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Dialog open={depositDialog} onOpenChange={setDepositDialog}>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <Plus className="h-4 w-4 mr-2" /> 
                        Deposit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Deposit Funds</DialogTitle>
                        <DialogDescription>
                          Add money to your AbrenFund wallet.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Amount (ETB)</label>
                          <Input
                            type="number"
                            placeholder="Enter amount"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Payment Method</label>
                          <div className="border rounded-md p-3 flex items-center space-x-3">
                            <CreditCard className="h-5 w-5 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">Credit/Debit Card</p>
                              <p className="text-xs text-muted-foreground">Visa ending in 4242</p>
                            </div>
                            <input type="radio" checked readOnly />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDepositDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleDeposit} disabled={!depositAmount}>
                          Proceed to Payment
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog open={withdrawDialog} onOpenChange={setWithdrawDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <ArrowDownUp className="h-4 w-4 mr-2" /> 
                        Withdraw
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Withdraw Funds</DialogTitle>
                        <DialogDescription>
                          Transfer money from your wallet to your bank account.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Amount (ETB)</label>
                          <Input
                            type="number"
                            placeholder="Enter amount"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">Available: 5,000 ETB</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Withdraw to</label>
                          <div className="border rounded-md p-3 flex items-center space-x-3">
                            <CreditCard className="h-5 w-5 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">Bank Account</p>
                              <p className="text-xs text-muted-foreground">Commercial Bank of Ethiopia ****5678</p>
                            </div>
                            <input type="radio" checked readOnly />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setWithdrawDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleWithdraw} disabled={!withdrawAmount}>
                          Withdraw Funds
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
            
            {/* Transaction History */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>View your recent transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="deposits">Deposits</TabsTrigger>
                    <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
                    <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                  </TabsList>

                  {/* Tab Contents */}
                  {['all', 'deposits', 'withdrawals', 'campaigns'].map((tabKey) => {
                    const filtered = tabKey === 'all' ? transactions : transactions.filter(t => t.type === tabKey.slice(0, -1));
                    return (
                      <TabsContent value={tabKey} key={tabKey} className="space-y-4">
                        {filtered.length > 0 ? (
                          filtered.map(transaction => (
                            <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${
                                  transaction.type === 'deposit' ? 'bg-green-100' :
                                  transaction.type === 'withdrawal' ? 'bg-red-100' : 'bg-blue-100'
                                }`}>
                                  {transaction.type === 'deposit' ? <ArrowDown className="h-5 w-5 text-green-600" /> :
                                   transaction.type === 'withdrawal' ? <ArrowUp className="h-5 w-5 text-red-600" /> :
                                   <DollarSign className="h-5 w-5 text-blue-600" />}
                                </div>
                                <div>
                                  <p className="font-medium">{transaction.description}</p>
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {new Date(transaction.date).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className={`font-medium ${
                                  transaction.type === 'deposit' ? 'text-green-600' :
                                  transaction.type === 'withdrawal' ? 'text-red-600' : ''
                                }`}>
                                  {transaction.type === 'deposit' ? '+' :
                                   transaction.type === 'withdrawal' ? '-' : ''}{transaction.amount} ETB
                                </p>
                                <p className={`text-xs ${
                                  transaction.status === 'completed' ? 'text-green-600' :
                                  transaction.status === 'pending' ? 'text-amber-600' : 'text-red-600'
                                }`}>
                                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-center py-4 text-muted-foreground">No {tabKey} transactions found</p>
                        )}
                      </TabsContent>
                    );
                  })}
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-center border-t pt-4">
                <Button variant="outline" className="w-full">
                  View All Transactions <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Wallet;
