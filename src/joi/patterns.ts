const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9].*[0-9].*[0-9].*[0-9])(?=.*[!@%$#^&*-_*(])[A-Za-z0-9!@%$#^&*-_*(]{8,}$/;
const phoneRegex = /^((\+972|0)([23489]|5[02468]|77)-?[1-9]\d{6})$/;

export { passwordRegex, phoneRegex };
