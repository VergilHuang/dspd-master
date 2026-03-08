const Card = ({ children, className = "" }) => (
  <div
    className={`bg-bg-surface border border-border rounded-2xl p-6 shadow-xl ${className}`}
  >
    {children}
  </div>
);

export default Card;
