import { getProviderId } from "./unipile/queries";

const toastKeyMap: { [key: string]: string[] } = {
  status: ["status", "status_description"],
  error: ["error", "error_description"],
};
const getToastRedirect = (
  path: string,
  toastType: string,
  toastName: string,
  toastDescription: string = "",
  disableButton: boolean = false,
  arbitraryParams: string = ""
): string => {
  const [nameKey, descriptionKey] = toastKeyMap[toastType];

  let redirectPath = `${path}?${nameKey}=${encodeURIComponent(toastName)}`;

  if (toastDescription) {
    redirectPath += `&${descriptionKey}=${encodeURIComponent(
      toastDescription
    )}`;
  }

  if (disableButton) {
    redirectPath += `&disable_button=true`;
  }

  if (arbitraryParams) {
    redirectPath += `&${arbitraryParams}`;
  }

  return redirectPath;
};

export const getStatusRedirect = (
  path: string,
  statusName: string,
  statusDescription: string = "",
  disableButton: boolean = false,
  arbitraryParams: string = ""
) =>
  getToastRedirect(
    path,
    "status",
    statusName,
    statusDescription,
    disableButton,
    arbitraryParams
  );

export const getErrorRedirect = (
  path: string,
  errorName: string,
  errorDescription: string = "",
  disableButton: boolean = false,
  arbitraryParams: string = ""
) =>
  getToastRedirect(
    path,
    "error",
    errorName,
    errorDescription,
    disableButton,
    arbitraryParams
  );

export const languagesSupported = [
  { value: "aa", label: "Afar" },
  { value: "ab", label: "Abkhazian" },
  { value: "af", label: "Afrikaans" },
  { value: "ak", label: "Akan" },
  { value: "am", label: "Amharic" },
  { value: "ar", label: "Arabic" },
  { value: "as", label: "Assamese" },
  { value: "ay", label: "Aymara" },
  { value: "az", label: "Azerbaijani" },
  { value: "ba", label: "Bashkir" },
  { value: "be", label: "Belarusian" },
  { value: "bg", label: "Bulgarian" },
  { value: "bh", label: "Bihari" },
  { value: "bi", label: "Bislama" },
  { value: "bn", label: "Bengali" },
  { value: "bo", label: "Tibetan" },
  { value: "br", label: "Breton" },
  { value: "bs", label: "Bosnian" },
  { value: "bug", label: "Buginese" },
  { value: "ca", label: "Catalan" },
  { value: "ceb", label: "Cebuano" },
  { value: "chr", label: "Cherokee" },
  { value: "co", label: "Corsican" },
  { value: "crs", label: "Seselwa" },
  { value: "cs", label: "Czech" },
  { value: "cy", label: "Welsh" },
  { value: "da", label: "Danish" },
  { value: "de", label: "German" },
  { value: "dv", label: "Dhivehi" },
  { value: "dz", label: "Dzongkha" },
  { value: "egy", label: "Egyptian" },
  { value: "el", label: "Greek" },
  { value: "en", label: "English" },
  { value: "eo", label: "Esperanto" },
  { value: "es", label: "Spanish" },
  { value: "et", label: "Estonian" },
  { value: "eu", label: "Basque" },
  { value: "fa", label: "Persian" },
  { value: "fi", label: "Finnish" },
  { value: "fj", label: "Fijian" },
  { value: "fo", label: "Faroese" },
  { value: "fr", label: "French" },
  { value: "fy", label: "Frisian" },
  { value: "ga", label: "Irish" },
  { value: "gd", label: "Scots Gaelic" },
  { value: "gl", label: "Galician" },
  { value: "gn", label: "Guarani" },
  { value: "got", label: "Gothic" },
  { value: "gu", label: "Gujarati" },
  { value: "gv", label: "Manx" },
  { value: "ha", label: "Hausa" },
  { value: "haw", label: "Hawaiian" },
  { value: "hi", label: "Hindi" },
  { value: "hmn", label: "Hmong" },
  { value: "hr", label: "Croatian" },
  { value: "ht", label: "Haitian Creole" },
  { value: "hu", label: "Hungarian" },
  { value: "hy", label: "Armenian" },
  { value: "ia", label: "Interlingua" },
  { value: "id", label: "Indonesian" },
  { value: "ie", label: "Interlingue" },
  { value: "ig", label: "Igbo" },
  { value: "ik", label: "Inupiak" },
  { value: "is", label: "Icelandic" },
  { value: "it", label: "Italian" },
  { value: "iu", label: "Inuktitut" },
  { value: "iw", label: "Hebrew" },
  { value: "ja", label: "Japanese" },
  { value: "jw", label: "Javanese" },
  { value: "ka", label: "Georgian" },
  { value: "kha", label: "Khasi" },
  { value: "kk", label: "Kazakh" },
  { value: "kl", label: "Greenlandic" },
  { value: "km", label: "Khmer" },
  { value: "kn", label: "Kannada" },
  { value: "ko", label: "Korean" },
  { value: "ks", label: "Kashmiri" },
  { value: "ku", label: "Kurdish" },
  { value: "ky", label: "Kyrgyz" },
  { value: "la", label: "Latin" },
  { value: "lb", label: "Luxembourgish" },
  { value: "lg", label: "Ganda" },
  { value: "lif", label: "Limbu" },
  { value: "ln", label: "Lingala" },
  { value: "lo", label: "Laothian" },
  { value: "lt", label: "Lithuanian" },
  { value: "lv", label: "Latvian" },
  { value: "mfe", label: "Mauritian Creole" },
  { value: "mg", label: "Malagasy" },
  { value: "mi", label: "Maori" },
  { value: "mk", label: "Macedonian" },
  { value: "ml", label: "Malayalam" },
  { value: "mn", label: "Mongolian" },
  { value: "mr", label: "Marathi" },
  { value: "ms", label: "Malay" },
  { value: "mt", label: "Maltese" },
  { value: "my", label: "Burmese" },
  { value: "na", label: "Nauru" },
  { value: "ne", label: "Nepali" },
  { value: "nl", label: "Dutch" },
  { value: "no", label: "Norwegian" },
  { value: "nr", label: "Ndebele" },
  { value: "nso", label: "Pedi" },
  { value: "ny", label: "Nyanja" },
  { value: "oc", label: "Occitan" },
  { value: "om", label: "Oromo" },
  { value: "or", label: "Oriya" },
  { value: "pa", label: "Punjabi" },
  { value: "pl", label: "Polish" },
  { value: "ps", label: "Pashto" },
  { value: "pt", label: "Portuguese" },
  { value: "qu", label: "Quechua" },
  { value: "rm", label: "Rhaeto Romance" },
  { value: "rn", label: "Rundi" },
  { value: "ro", label: "Romanian" },
  { value: "ru", label: "Russian" },
  { value: "rw", label: "Kinyarwanda" },
  { value: "sa", label: "Sanskrit" },
  { value: "sco", label: "Scots" },
  { value: "sd", label: "Sindhi" },
  { value: "sg", label: "Sango" },
  { value: "si", label: "Sinhalese" },
  { value: "sk", label: "Slovak" },
  { value: "sl", label: "Slovenian" },
  { value: "sm", label: "Samoan" },
  { value: "sn", label: "Shona" },
  { value: "so", label: "Somali" },
  { value: "sq", label: "Albanian" },
  { value: "sr", label: "Serbian" },
  { value: "ss", label: "Siswant" },
  { value: "st", label: "Sesotho" },
  { value: "su", label: "Sundanese" },
  { value: "sv", label: "Swedish" },
  { value: "sw", label: "Swahili" },
  { value: "syr", label: "Syriac" },
  { value: "ta", label: "Tamil" },
  { value: "te", label: "Telugu" },
  { value: "tg", label: "Tajik" },
  { value: "th", label: "Thai" },
  { value: "ti", label: "Tigrinya" },
  { value: "tk", label: "Turkmen" },
  { value: "tl", label: "Tagalog" },
  { value: "tlh", label: "Klingon" },
  { value: "tn", label: "Tswana" },
  { value: "to", label: "Tonga" },
  { value: "tr", label: "Turkish" },
  { value: "ts", label: "Tsonga" },
  { value: "tt", label: "Tatar" },
  { value: "ug", label: "Uighur" },
  { value: "uk", label: "Ukrainian" },
  { value: "ur", label: "Urdu" },
  { value: "uz", label: "Uzbek" },
  { value: "ve", label: "Venda" },
  { value: "vi", label: "Vietnamese" },
  { value: "vo", label: "Volapuk" },
  { value: "war", label: "Waray Philippines" },
  { value: "wo", label: "Wolof" },
  { value: "xh", label: "Xhosa" },
  { value: "yi", label: "Yiddish" },
  { value: "yo", label: "Yoruba" },
  { value: "za", label: "Zhuang" },
  { value: "zh", label: "Chinese Simplified" },
  { value: "zh-Hant", label: "Chinese Traditional" },
  { value: "zu", label: "Zulu" },
];

export const isUnipileAccountConnected = async (unipile_id: string) => {
  const provider_id = await getProviderId(unipile_id);
  if (!provider_id) {
    return false;
  }
  return true;
};


