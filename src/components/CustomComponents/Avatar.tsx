export default function CustomAvatar({ src, alt, size }) {
  const avatarStyles = {
    borderRadius: "50%",
    width: size,
    height: size,
    border: "2px solid #886E58",
  };

  return <img src={src} alt={alt} style={avatarStyles as any} />;
}
