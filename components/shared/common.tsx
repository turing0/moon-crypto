
const PNLDisplay = ({ pnl, decimalPlaces = 4 }) => {
  // const pnlValue = parseFloat(pnl.toString());
  const pnlValue = parseFloat(pnl ? pnl : 0);
  const pnlColor = pnlValue > 0 ? 'text-green-500' : (pnlValue === 0 ? '' : 'text-red-500');
  const formattedPNL = (pnlValue > 0 ? '+' : '') + pnlValue.toFixed(decimalPlaces);

  return (
    <span className={`${pnlColor}`}>
      {formattedPNL}
    </span>
  );
};

export default PNLDisplay;