import Swal from 'sweetalert2'



/**
 * ERROR
 */
const errorPage = (textError: string) => {
    Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: textError,
    });
}


/**
 *  CONFIRM PAGE
 */
const confirmPage = (text: string, nomButton: string) => {
    
    return Swal.fire({
        title: text,
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText:  nomButton,
        denyButtonText: "Annuler",
        allowEscapeKey: false,
        allowOutsideClick: false,
        
        });   
}




/**
 *  REFRESH PAGE
 */
const refreshPage = () => {
    
    return Swal.fire({
        title: "Votre session a été expiré, voulez-vous vous rester connecté?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText:  "Rester connecté",
        denyButtonText: "Deconnexion",
        allowEscapeKey: false,
        allowOutsideClick: false,
        
        });   
}


/**
 * WARNING INFO
 */
const warningInfo = (text: string) => {
  return Swal.fire({
      icon: 'info',
      title: 'Information',
      text: text,
  });
}


/**
 * SUCESS INFO
 */
const sucessInfo = (text: string) => {
    Swal.fire({
        icon: 'success',
        title: 'Sucess',
        text: text,
    });
}




export const SweetAlert = {
    errorPage, confirmPage, sucessInfo, warningInfo, refreshPage
}