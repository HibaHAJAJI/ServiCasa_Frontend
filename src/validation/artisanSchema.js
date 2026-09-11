import * as yup from 'yup';

export const artisanSchema = yup.object().shape({
  nom: yup
    .string()
    .required('Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères'),

  prenom: yup
    .string()
    .required('Le prénom est requis')
    .min(2, 'Le prénom doit contenir au moins 2 caractères'),

  telephone: yup
    .string()
    .required('Le numéro de téléphone est requis')
    .matches(
      /^(?:\+212|0)[5-7]\d{8}$/,
      'Numéro de téléphone marocain invalide (ex: +212600000000 ou 0600000000)'
    ),

  ville: yup
    .string()
    .required('La ville est requise'),

  email: yup
    .string()
    .required("L'adresse email est requise")
    .email('Adresse email invalide'),

  password: yup
    .string()
    .required('Le mot de passe est requis')
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),

  specialite: yup
    .string()
    .required('La spécialité principale est requise'),

  anneesExperience: yup
    .number()
    .typeError("Veuillez entrer un nombre d'années valide")
    .required("L'expérience est requise")
    .min(0, "L'expérience ne peut pas être négative")
    .max(50, "Nombre d'années non valide"),

  tarifHoraire: yup
    .number()
    .typeError('Veuillez entrer un montant valide')
    .required('Le tarif horaire est requis')
    .positive('Le tarif doit être supérieur à 0'),

  zoneIntervention: yup
    .string()
    .required("La zone d'intervention est requise"),

  description: yup
    .string()
    .required('La description est requise')
    .min(10, 'La description doit faire au moins 10 caractères')
});