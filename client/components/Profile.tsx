interface ProfileIconProps {
  completeName: string;
  size?: number;
  className?: string;
}

const ProfileIcon = ({ size, completeName, className }: ProfileIconProps) => {
  // Extraer las iniciales del nombre completo
  const result = completeName.split(" ").map((n) => n[0].toUpperCase());

  const initials = result[0] + result[result.length - 2];

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-primary text-white font-bold ${className}`}
      style={{ width: size || 40, height: size || 40 }}
    >
      {initials}
    </div>
  );
};

export default ProfileIcon;
