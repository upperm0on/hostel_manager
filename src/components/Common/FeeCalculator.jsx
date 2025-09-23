import React, { useMemo, useState } from 'react';
import { Copy } from 'lucide-react';

const FeeCalculator = ({
  feeRate = 0.04,
  currencyPrefix = '',
  inputPlaceholder = 'Enter amount',
  initialAmount = '',
  onCopy,
}) => {
  const [amount, setAmount] = useState(String(initialAmount ?? ''));
  const parsed = useMemo(() => {
    const val = Number(amount || 0);
    const fee = Math.round(val * feeRate * 100) / 100;
    const total = Math.round((val + fee) * 100) / 100;
    return { val, fee, total };
  }, [amount, feeRate]);

  const handleCopy = async () => {
    const text = `Amount: ${parsed.val}, Fee (${Math.round(feeRate * 100)}%): ${parsed.fee}, Total: ${parsed.total}`;
    try {
      await navigator.clipboard.writeText(text);
      if (onCopy) onCopy(text);
    } catch (_e) {
      // noop
    }
  };

  return (
    <div className="fee-calculator">
      <label htmlFor="calcAmount">Try it yourself</label>
      <div className="calc-row">
        <input
          id="calcAmount"
          type="number"
          min="0"
          step="0.01"
          placeholder={inputPlaceholder}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div className="calc-summary">
        <div className="calc-item"><span>Amount:</span><strong>{currencyPrefix}{amount || 0}</strong></div>
        <div className="calc-item"><span>Service Fee ({Math.round(feeRate * 100)}%):</span><strong>{currencyPrefix}{parsed.fee}</strong></div>
        <div className="calc-item total"><span>Total Payable:</span><strong>{currencyPrefix}{parsed.total}</strong></div>
      </div>
      <button type="button" className="btn btn-outline small" onClick={handleCopy}>
        <Copy size={16} /> Copy breakdown
      </button>
    </div>
  );
};

export default FeeCalculator;
