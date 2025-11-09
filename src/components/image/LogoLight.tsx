export interface ILogoLightProps {
  size?: number;
}

const LogoLight: React.FC<ILogoLightProps> = ({ size = 60 }) => {
  return (
    <div>
      <img
        src="/logo/android-chrome-192x192.png"
        alt="Logo Light"
        width={size}
        height={size}
      />
    </div>
  );
};

export default LogoLight;
