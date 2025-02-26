import React, { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTransaction: (transaction: TransactionData) => void;
}

interface TransactionData {
  type: 'DEBIT' | 'CREDIT';
  amount: string;
  merchant: string;
  date: string;
  account: string;
  category: string;
  notes: string;
  tags: string[];
  adjustBalance: boolean;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ 
  open, 
  onOpenChange, 
  onAddTransaction 
}) => {
  const [transactionData, setTransactionData] = useState<TransactionData>({
    type: 'DEBIT',
    amount: '',
    merchant: '',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    account: '',
    category: '',
    notes: '',
    tags: [],
    adjustBalance: true,
  });

  const handleChange = (field: keyof TransactionData, value: any) => {
    setTransactionData({
      ...transactionData,
      [field]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTransaction(transactionData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800 text-white">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-white">Add transaction</DialogTitle>
          <Button 
            onClick={() => onOpenChange(false)} 
            variant="ghost" 
            className="h-8 w-8 p-0 text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Transaction Type */}
          <div>
            <ToggleGroup 
              type="single" 
              value={transactionData.type} 
              onValueChange={(value) => value && handleChange('type', value)}
              className="w-full grid grid-cols-2 bg-gray-800 rounded-full"
            >
              <ToggleGroupItem 
                value="DEBIT" 
                className={cn(
                  "flex items-center justify-center gap-2 rounded-l-full text-sm h-10",
                  transactionData.type === "DEBIT" 
                    ? "bg-gray-800 text-white" 
                    : "bg-gray-800 bg-opacity-50 text-gray-400"
                )}
              >
                <span className="h-4 w-4 rounded-full border-2 border-current flex items-center justify-center">
                  {transactionData.type === 'DEBIT' && <span className="h-2 w-2 bg-current rounded-full" />}
                </span>
                DEBIT
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="CREDIT" 
                className={cn(
                  "flex items-center justify-center gap-2 rounded-r-full text-sm h-10",
                  transactionData.type === "CREDIT" 
                    ? "bg-gray-800 text-white" 
                    : "bg-gray-800 bg-opacity-50 text-gray-400"
                )}
              >
                <span className="h-4 w-4 rounded-full border-2 border-current flex items-center justify-center">
                  {transactionData.type === 'CREDIT' && <span className="h-2 w-2 bg-current rounded-full" />}
                </span>
                CREDIT
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-gray-300">Amount</Label>
            <Input
              id="amount"
              value={transactionData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              placeholder="$0.00"
              className="bg-gray-800 border-gray-700 text-white focus:ring-orange-500 focus-visible:ring-orange-500"
            />
          </div>

          {/* Merchant */}
          <div className="space-y-2">
            <Label htmlFor="merchant" className="text-gray-300">Merchant</Label>
            <Select 
              onValueChange={(value) => handleChange('merchant', value)}
              value={transactionData.merchant}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:ring-orange-500">
                <SelectValue placeholder="Search merchants..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="amazon">Amazon</SelectItem>
                <SelectItem value="target">Target</SelectItem>
                <SelectItem value="walmart">Walmart</SelectItem>
                <SelectItem value="costco">Costco</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-gray-300">Date</Label>
            <div className="relative">
              <Input
                id="date"
                value={transactionData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="bg-gray-800 border-gray-700 text-white pr-10 focus:ring-orange-500 focus-visible:ring-orange-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Account */}
          <div className="space-y-2">
            <Label htmlFor="account" className="text-gray-300">Account</Label>
            <Select 
              onValueChange={(value) => handleChange('account', value)}
              value={transactionData.account}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:ring-orange-500">
                <SelectValue placeholder="Select an account" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="checking">Checking</SelectItem>
                <SelectItem value="savings">Savings</SelectItem>
                <SelectItem value="credit">Credit Card</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-gray-300">Category</Label>
            <Select 
              onValueChange={(value) => handleChange('category', value)}
              value={transactionData.category}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:ring-orange-500">
                <SelectValue placeholder="Search categories..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="food">Food & Dining</SelectItem>
                <SelectItem value="shopping">Shopping</SelectItem>
                <SelectItem value="transportation">Transportation</SelectItem>
                <SelectItem value="utilities">Bills & Utilities</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-gray-300">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add a note..."
              value={transactionData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="bg-gray-800 border-gray-700 text-white resize-none focus:ring-orange-500 focus-visible:ring-orange-500"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-gray-300">Tags</Label>
            <Select>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:ring-orange-500">
                <SelectValue placeholder="Search tags..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="tax-deductible">Tax Deductible</SelectItem>
                <SelectItem value="recurring">Recurring</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Adjust Balance Toggle */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white">Adjust the account balance by $0</p>
                  <p className="text-gray-400 text-sm">
                    This will update the account&apos;s balance by the transaction amount
                  </p>
                </div>
                <Switch
                  checked={transactionData.adjustBalance}
                  onCheckedChange={(checked) => handleChange('adjustBalance', checked)}
                  className="data-[state=checked]:bg-orange-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <Button 
              type="button" 
              onClick={() => onOpenChange(false)} 
              variant="outline" 
              className="border-gray-600 text-white hover:bg-gray-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-orange-500 text-white hover:bg-orange-600"
            >
              Add transaction
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionForm;