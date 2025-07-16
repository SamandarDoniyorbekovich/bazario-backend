import bcrypt  from "bcrypt"

export const getHashPasswort = (password:string ) =>{
    const salt = bcrypt.genSaltSync(10)
    const hashedPass = bcrypt.hashSync(password, salt)
    return hashedPass
}

export const compareHashPass = (password: string, hash: string): boolean => {
  if (!password || !hash) return false;
  return bcrypt.compareSync(password, hash);
};