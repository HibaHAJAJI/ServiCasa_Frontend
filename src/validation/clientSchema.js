import * as Yup from 'yup';

export const clientSchema = Yup.object().shape({
  nom: Yup.string()
    .required('Le nom est obligatoire'),
  
  prenom: Yup.string()
    .required('Le prénom est obligatoire'),
  
  telephone: Yup.string()
  .matches(/^[0-9+\s-]+$/, 'Numéro de téléphone invalide')
  .min(8, 'Le numéro doit contenir au moins 8 chiffres')
  .required('Le numéro de téléphone est obligatoire'),
  
  ville: Yup.string()
    .required('La ville est obligatoire'),
  
  adresse: Yup.string()
    .required('L\'adresse est obligatoire'),
  
  email: Yup.string()
    .email('Adresse email invalide')
    .required('L\'email est obligatoire'),
  
  password: Yup.string()
    .min(5, 'Le mot de passe doit contenir au moins 5 caractères')
    .required('Le mot de passe est obligatoire')
});