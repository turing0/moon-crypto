
const PNLDisplay = ({ pnl, showUSDT = false, decimalPlaces = 4 }) => {
  // const pnlValue = parseFloat(pnl.toString());
  const pnlValue = parseFloat(pnl ? pnl : 0);
  if (isNaN(pnlValue)) {
    return <span>{pnl}</span>;
  }
  const pnlColor = pnlValue > 0 ? 'text-green-500' : (pnlValue === 0 ? '' : 'text-red-500');
  const formattedPNL = (pnlValue > 0 ? '+' : '') + pnlValue.toFixed(decimalPlaces);
  const usdtLabel = showUSDT ? ' USDT' : '';

  return (
    <span className={`${pnlColor}`}>
      {formattedPNL}{usdtLabel}
    </span>
  );
};

export default PNLDisplay;