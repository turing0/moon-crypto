
const PNLDisplay = ({ pnl }) => {
  // const pnlValue = parseFloat(pnl.toString());
  const pnlValue = parseFloat(pnl);
  const pnlColor = pnlValue > 0 ? 'text-green-500' : (pnlValue === 0 ? '' : 'text-red-500');
  const formattedPNL = (pnlValue > 0 ? '+' : '') + pnlValue.toFixed(4);

  return (
    <span className={`${pnlColor}`}>
      {formattedPNL}
    </span>
  );
};

export default PNLDisplay;