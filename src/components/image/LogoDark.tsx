export interface ILogoDarkProps {
  size?: number;
}

const LogoDark: React.FC<ILogoDarkProps> = ({ size = 60 }) => {
  return (
    <div>
      <img
        src="/logo/android-chrome-192x192.png"
        alt="Logo Dark"
        width={size}
        height={size}
        className="filter invert"
      />
    </div>
  );
};

export default LogoDark;
