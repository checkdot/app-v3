interface StyledAddressProps {
  address: string;
  className?: string;
}

const StyledAddress = ({ address, className }: StyledAddressProps) => {
  return (
    <span
      className={`${className} cursor-pointer`}
      onClick={() => {
        navigator.clipboard.writeText(address);
      }}
    >
      {address.slice(0, 6)}...{address.slice(-4)}
    </span>
  );
};

export default StyledAddress;
