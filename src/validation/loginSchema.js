import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Adresse email invalide")
    .required("L'email est obligatoire"),
  password: yup
    .string()
    .required("Le mot de passe est obligatoire"),
});