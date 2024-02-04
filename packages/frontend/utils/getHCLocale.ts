export default function getHCLocale(locale: string = "en") {
  const newLocale = locale.replace("_", "-");
  switch (newLocale) {
    case "en":
      return "https://help.ellty.com/hc/en-us";
    case "uk":
      return "https://help.ellty.com/hc/ru";
    case "br":
      return "https://help.ellty.com/hc/pt-br";
    case "mx":
      return "https://help.ellty.com/hc/es";
    default:
      return `https://help.ellty.com/hc/${newLocale}`;
  }
}
