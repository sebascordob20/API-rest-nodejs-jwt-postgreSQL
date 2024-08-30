
export const validateCharacter =  (idInputUser: string)=>{
     if(idInputUser.includes('*') || idInputUser.includes(',') || idInputUser.includes('-') || idInputUser.includes(':')){
        return true;
     }else{
        return false;
     }    
}

export const validateNumber = (idInputUser: any) => {
  if (typeof idInputUser == "number") {
    return true;
  } else {
    return false;
  }
};